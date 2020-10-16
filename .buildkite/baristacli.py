#!/usr/bin/env python3
"""
Script to generate buildkite pipeline and run commands in CI
"""

import argparse
import copy
import json
import os
import tempfile
import subprocess
from shutil import copyfile
import sys
from urllib.request import url2pathname
from urllib.parse import urlparse
import yaml

# path to buildscript (called from root directory of the repository)
SCRIPT = os.path.join(os.path.basename(os.path.dirname(__file__)),
                      os.path.basename(__file__))

# default path of configuration file
CONFIGFILE = os.path.join(os.path.basename(os.path.dirname(__file__)),
                          "baristaPipeline.yml")

# default bazel binary
BAZELBIN = "bazel"

# configuration of allowed buildkite instances
# PLATFORMS = {
#   "default" : {            # BuildKite queue name
#     "name": "AWS Linux 2", # label
#     "platform": "linux"    # specify platform (linux/windows)
#   },
# }
PLATFORMS = {
    "default": {
        "name": ":linux: AWS Linux 2",
        "platform": "linux"
    },
    "windows10": {
        "name": ":windows: Windows 10",
        "platform": "windows"
    }
}

class BuildKiteConfigError(ValueError):
    """ BuildKiteConfigError Exception """

class BazelFailingTests(Exception):
    """ BazelFailingTests Exception"""


def is_windows():
    """
    Return True if we are on windows.
    """
    return os.name == "nt"


# set script extension depending on platform
SCRIPT_EXTENSION = ".sh" if not is_windows() else ".bat"


def eprint(*args, **kwargs):
    """
    Print to stderr and flush (just in case).
    """
    print(*args, flush=True, file=sys.stderr, **kwargs)


def execute_shell_commands(commands):
    """
    Prepare given list of commands and execute it
    :param commands: array if commands
    """
    if not commands:
        return
    if is_windows():
        print_collapsed_group(":cmd: Setup (Windows Commands)")
        for cmd in commands:
            execute_command(cmd, shell=True)
    else:
        print_collapsed_group(":bash: Setup (Shell Commands)")
        shell_command = "\n".join(["set -e"] + commands)
        execute_command([shell_command], shell=True)


def execute_command(args, shell=False, fail_if_nonzero=True, cwd=None,
                    print_output=True):
    """
    Execute command
    """
    if print_output:
        if isinstance(args, str):
            eprint(args)
        else:
            eprint(" ".join(args))
    return subprocess.run(
        args, shell=shell, check=fail_if_nonzero, env=os.environ, cwd=cwd
    ).returncode


def arg_hander_command(args):
    """
    Prepare the given platform and task to be able to call it
    """
    tasks = load_config(args.config)

    if not args.platform in tasks["tasks"].keys():
        raise BuildKiteConfigError(
            "{} is not available. Please specify one of {}".format(args.platform,
                                                                   PLATFORMS.keys()))

    stage = tasks["tasks"].get(args.platform)

    if not args.target in stage:
        raise BuildKiteConfigError(
            "{} is not available. Please specify one of {}".format(args.target,
                                                                   stage.keys()))

    # execute pre commands
    if "pre_cmd" in stage[args.target]:
        execute_shell_commands(stage[args.target]['pre_cmd'])

    # bazel build info file
    build_event_file = "build_event_file.json"
    profile = "profile-{}{}.gz".format(args.target, args.shard if int(args.shard) != 0 else "")

    if args.target == "test" and 'parallel' in stage[args.target] and int(
            args.shard) != 0:
        bazel_flags = stage[args.target]["bazel_flags"] if "bazel_flags" in stage[
            args.target] else []
        # add build event json
        bazel_flags += ["--build_event_json_file={}".format(build_event_file),
                        "--profile={}".format(profile),
                        "--record_full_profiler_data"]
        execute_command(
            [BAZELBIN] + [args.target.split("_")[0]] + test_sharding(
                int(args.shard)), fail_if_nonzero=not in_ci())
    else:
        if 'bazel_cmd' in stage[args.target]:
            bazel_flags = stage[args.target]["bazel_flags"] if "bazel_flags" in stage[
                args.target] else []
            # add build event json
            bazel_flags += ["--build_event_json_file={}".format(build_event_file),
                        "--profile={}".format(profile),
                        "--record_full_profiler_data"]
            execute_command(
                [BAZELBIN] + [args.target] + stage[args.target][
                    'bazel_cmd'] + bazel_flags,
                fail_if_nonzero=not(args.target == "test" and in_ci()))
        if 'cmd' in stage[args.target]:
            execute_shell_commands(stage[args.target]['cmd'])

    # upload profile
    upload_files([profile])

    # analyse Test logs and fail afterwards
    if upload_test_logs_from_bep(build_event_file) > 0:
        raise BazelFailingTests("Tests failed")

    if "post_cmd" in stage[args.target]:
        execute_shell_commands(stage[args.target]['post_cmd'])


def in_ci():
    """only if we are in CI"""
    if "BUILDKITE" in os.environ:
        return True
    return False

def upload_files(files):
    """ upload to buildkite"""
    if not in_ci():
        return 0
    execute_command(
        ["buildkite-agent", "artifact", "upload", ";".join(files)])

def upload_test_logs_from_bep(bep_file):
    """ gather logs for buildkite"""
    if not in_ci():
        return 0

    tmpdir = tempfile.mkdtemp()
    if os.path.exists(bep_file):
        all_test_logs = analyse_logs(bep_file)

        if all_test_logs:
            files_to_upload = rename_test_logs_for_upload(all_test_logs, tmpdir)
            cwd = os.getcwd()
            try:
                os.chdir(tmpdir)
                test_logs = [os.path.relpath(file, tmpdir) for file in files_to_upload]
                test_logs = sorted(test_logs)
                upload_files(test_logs)
            finally:
                os.chdir(cwd)
        return len(all_test_logs)
    return 0


def rename_test_logs_for_upload(test_logs, tmpdir):
    """ Rename the test.log files to the target that created them
     so that it's easy to associate test.log and target."""
    new_paths = []
    for label, files in test_logs:
        attempt = 0
        if len(files) > 1:
            attempt = 1
        for test_log in files:
            try:
                new_path = test_label_to_path(tmpdir, label, attempt)
                os.makedirs(os.path.dirname(new_path), exist_ok=True)
                copyfile(test_log, new_path)
                new_paths.append(new_path)
                attempt += 1
            except IOError as err:
                # Log error and ignore.
                eprint(err)
    return new_paths


def test_label_to_path(tmpdir, label, attempt):
    """set correct log filepath"""
    # remove leading //
    path = label[2:]
    path = path.replace("/", os.sep)
    path = path.replace(":", os.sep)
    if attempt == 0:
        path = os.path.join(path, "test.log")
    else:
        path = os.path.join(path, "attempt_" + str(attempt) + ".log")
    return os.path.join(tmpdir, path)


def analyse_logs(build_event_file):
    """analyse all generated logs"""
    status=["FAILED", "TIMEOUT", "FLAKY"]
    targets = []
    with open(build_event_file, encoding="utf-8") as f_handle:
        raw_data = f_handle.read()
    decoder = json.JSONDecoder()

    pos = 0
    while pos < len(raw_data):
        try:
            bep_obj, size = decoder.raw_decode(raw_data[pos:])
        except ValueError as ex:
            eprint("JSON decoding error: " + str(ex))
            return targets
        if "testSummary" in bep_obj:
            test_target = bep_obj["id"]["testSummary"]["label"]
            test_status = bep_obj["testSummary"]["overallStatus"]
            if test_status in status:
                outputs = bep_obj["testSummary"]["failed"]
                test_logs = []
                for output in outputs:
                    test_logs.append(url2pathname(urlparse(output["uri"]).path))
                targets.append((test_target, test_logs))
        pos += size + 1

    return targets


def get_command_for_node(_platform, target, shard=0):
    """
    Generate buildkite pipeline config as yaml and print it to stdout
    """
    if not PLATFORMS[_platform]["platform"] == "windows":
        extension = ".sh"
        sourceit = "source"
        path_sep = "/"
        python_bin = "python3"
    else:
        extension = ".bat"
        sourceit = ""
        path_sep = "\\"
        python_bin = "python"
    step = {
        "label": "{}-{}{}".format(PLATFORMS[_platform]["name"], target,
                                  "" if shard == 0 else "-{}".format(shard)),
        "command": "{} .buildkite{}requirement{} && {} {} {} --platform={} --target={} {}".format(
            sourceit, path_sep, extension, python_bin, SCRIPT, 'exec', _platform,
            target, "" if shard == 0 else "--shard={}".format(shard)),
        "agents": {"queue": _platform},
    }

    return step


def test_sharding(shard_id):
    """ shard all test to be faster in execution on different nodes"""
    shard_count = int(os.getenv("BUILDKITE_PARALLEL_JOB_COUNT", "-1"))
    test_targets = []

    test_targets += execute_command_and_get_output(
        [
            BAZELBIN,
            "--nomaster_bazelrc",
            "--bazelrc=/dev/null",
            "query",
            "tests(//...)",
        ],
        print_output=False,
    ).strip().split("\n")

    if shard_id > -1 and shard_count > -1:
        print_collapsed_group(
            ":female-detective: Calculating targets for shard {}/{}".format(
                shard_id + 1, shard_count
            )
        )
        expanded_test_targets = expand_test_target_patterns(test_targets)
        test_targets = get_targets_for_shard(expanded_test_targets, shard_id,
                                             shard_count)

    return test_targets


def bubble_sort(array):
    """ do the bubble sort"""
    array_len = len(array)

    for i in range(array_len):
        # Create a flag that will allow the function to
        # terminate early if there's nothing left to sort
        already_sorted = True

        # Start looking at each item of the list one by one,
        # comparing it with its adjacent value. With each
        # iteration, the portion of the array that you look at
        # shrinks because the remaining items have already been
        # sorted.
        for j in range(array_len - i - 1):
            if array[j] > array[j + 1]:
                # If the item you're looking at is greater than its
                # adjacent value, then swap them
                array[j], array[j + 1] = array[j + 1], array[j]

                # Since you had to swap two elements,
                # set the `already_sorted` flag to `False` so the
                # algorithm doesn't finish prematurely
                already_sorted = False

        # If there were no swaps during the last iteration,
        # the array is already sorted, and you can terminate
        if already_sorted:
            break

    return array


def expand_test_target_patterns(test_targets):
    """ expand all test target patterns"""
    included_targets, excluded_targets = partition_targets(test_targets)
    excluded_string = (
        " except tests(set({}))".format(
            " ".join("'{}'".format(t) for t in excluded_targets))
        if excluded_targets
        else ""
    )

    exclude_manual = ' except tests(attr("tags", "manual", set({})))'.format(
        " ".join("'{}'".format(t) for t in included_targets)
    )

    eprint("Resolving test targets via bazel query")
    output = execute_command_and_get_output(
        [BAZELBIN]
        + [
            "--nomaster_bazelrc",
            "--bazelrc=/dev/null",
            "query",
            "tests(set({})){}{}".format(
                " ".join("'{}'".format(t) for t in included_targets),
                excluded_string,
                exclude_manual,
            ),
        ],
        print_output=False,
    )
    return output.strip().split("\n")


def partition_targets(targets):
    """partition all targets"""
    included_targets, excluded_targets = [], []
    for target in targets:
        if target.startswith("-"):
            excluded_targets.append(target[1:])
        else:
            included_targets.append(target)

    return included_targets, excluded_targets


def get_targets_for_shard(targets, shard_id, shard_count):
    """Split the targets in the shards"""
    return bubble_sort(targets)[shard_id::shard_count]


def print_collapsed_group(name):
    """Print collapsed group in buildkite"""
    eprint("\n\n--- {0}\n\n".format(name))

def execute_command_and_get_output(
        args,
        shell=False,
        fail_if_nonzero=True,
        print_output=True
):
    """Executes a command in a subprocess"""
    eprint(" ".join(args))
    process = subprocess.run(
        args,
        shell=shell,
        check=fail_if_nonzero,
        env=os.environ,
        stdout=subprocess.PIPE,
        errors="replace",
        universal_newlines=True,
    )
    if print_output:
        eprint(process.stdout)

    return process.stdout


def load_config(file_config):
    """
    Load configuration file
    """
    file_config = file_config or CONFIGFILE
    with open(file_config, "r") as f_handle:
        config = yaml.safe_load(f_handle)
    return config


def arg_hander_pipeline(args):
    """Handle the pipeline generation for buildkite"""
    tmp_tasks = load_config(args.config)
    tasks = copy.deepcopy(tmp_tasks)

    # clean disabled tasks
    for _task, task_config in tmp_tasks["tasks"].items():
        for command, instructions in task_config.items():
            if 'disable' in instructions and instructions['disable']:
                tasks["tasks"][_task].pop(command)
        if len(tasks["tasks"][_task]) == 0:
            # nothing to build
            tasks["tasks"].pop(_task)

    if not args.multistage:
        pip = Pipeline(args, tasks, targets=["build"])
        print(yaml.dump({"steps": pip.get_pipeline()}))
    else:
        print(yaml.dump(
            {"steps": generate_pipeline(args, tasks=tasks, targets=["build"])}))


class Pipeline:
    """Class to generate all needed Pipeline steps in one node"""
    def __init__(self, args, tasks, targets="build"):
        self.tasks = tasks
        self.targets = targets
        self.args = args

    def analyse_platform(self, platform, task_config, targets):
        """analyse all given platforms"""
        def get_command(_platform, target):
            """
            Generate buildkite pipeline config as yaml and print it to stdout
            """
            if not PLATFORMS[_platform]["platform"] == "windows":
                extension = ".sh"
                sourceit = "source"
                path_sep = "/"
                python_bin = "python3"
            else:
                extension = ".bat"
                sourceit = ""
                path_sep = "\\"
                python_bin = "python"

            return "{} .buildkite{}requirement{} && {} {} {} --platform={} --target={}".format(
                sourceit, path_sep, extension, python_bin, SCRIPT, 'exec', _platform,
                target)

        commands = []
        for target in targets:
            if target not in task_config:
                continue
            commands.append(get_command(platform, target))
            if 'trigger' in task_config[target]:
                commands.extend(self.analyse_platform(platform, task_config,
                                                     task_config[target]['trigger']))

        return commands

    def get_pipeline(self):
        """ return pipeline steps for buildkite"""
        steps = []
        for platform, task_config in self.tasks["tasks"].items():
            commands = []
            commands = self.analyse_platform(platform, task_config, self.targets)
            step = {"label": "{}".format(PLATFORMS[platform]["name"]),
                    "agents": {"queue": platform},
                    "command": commands}
            steps.append(step)

        return steps


def generate_pipeline(args, tasks=None, targets=None):
    """ generate pipeline for buildkite (running build/test on different nodes)"""
    pipeline_steps = []
    trigger_stages = []
    for target in targets:
        for _task, task_config in tasks["tasks"].items():
            if target in task_config:
                if 'parallel' in task_config[target]:
                    for shard in range(1, task_config[target]['parallel'] + 1):
                        pipeline_steps.append(get_command_for_node(_task, target, shard=shard))
                    trigger_stages.extend(
                        task_config[target]['trigger'] if 'trigger' in task_config[
                            target] else [])
                else:
                    pipeline_steps.append(get_command_for_node(_task, target))
                    trigger_stages.extend(
                        task_config[target]['trigger'] if 'trigger' in task_config[
                            target] else [])
        if len(trigger_stages) > 0:
            pipeline_steps.append({"wait": None})

    if len(trigger_stages) > 0:
        pipeline_steps.extend(generate_pipeline(args, tasks=tasks, targets=list(
            dict.fromkeys(trigger_stages))))
    return pipeline_steps


def main():
    """main function to to the stuff"""
    parser = argparse.ArgumentParser(
        description='commandline interface for building barista with bazel on buildkite', )

    parser.set_defaults()

    sub_parsers = parser.add_subparsers()
    sub_parsers.required = True
    sub_parsers.dest = 'SUBCOMMAND'

    sub_parser_buildkite_pipeline = sub_parsers.add_parser('pipeline',
              help='configure buildkite pipeline while printing to stdout')
    sub_parser_buildkite_pipeline.add_argument('--config',
                                               help="specify config file",
                                               required=False)
    sub_parser_buildkite_pipeline.add_argument('--multistage',
                                               help="run build and test one different hosts",
                                               required=False,
                                               action='store_true',
                                               default=False)

    sub_parser_buildkite_pipeline.set_defaults(handler=arg_hander_pipeline)

    sub_parser_command = sub_parsers.add_parser('exec',
                                                help='exec specified target on given platform')
    sub_parser_command.add_argument('--config', help="specify config file",
                                    required=False)
    sub_parser_command.add_argument('--platform', help="specify platform",
                                    required=True)
    sub_parser_command.add_argument('--target', help="specify target",
                                    required=True)
    sub_parser_command.add_argument('--shard', help="specify shard",
                                    required=False,
                                    default="0")
    sub_parser_command.set_defaults(handler=arg_hander_command)

    args = parser.parse_args(sys.argv[1:])

    return args.handler(args)


if __name__ == "__main__":
    sys.exit(main())
