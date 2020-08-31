#!/usr/bin/env python3

import subprocess
import os
import sys

bazel_binary = "bazel"

shard_id =  int(os.getenv("BUILDKITE_PARALLEL_JOB", "-1"))
shard_count = int(os.getenv("BUILDKITE_PARALLEL_JOB_COUNT", "-1"))


def main():
  test_targets = []

  test_targets += execute_command_and_get_output(
    [
      bazel_binary,
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
      expanded_test_targets = expand_test_target_patterns(bazel_binary, test_targets)
      test_targets = get_targets_for_shard(expanded_test_targets, shard_id, shard_count)

  print("SHARDED: ", test_targets)


def bubble_sort(array):
    n = len(array)

    for i in range(n):
        # Create a flag that will allow the function to
        # terminate early if there's nothing left to sort
        already_sorted = True

        # Start looking at each item of the list one by one,
        # comparing it with its adjacent value. With each
        # iteration, the portion of the array that you look at
        # shrinks because the remaining items have already been
        # sorted.
        for j in range(n - i - 1):
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

def expand_test_target_patterns(bazel_binary, test_targets):
    included_targets, excluded_targets = partition_targets(test_targets)
    excluded_string = (
        " except tests(set({}))".format(" ".join("'{}'".format(t) for t in excluded_targets))
        if excluded_targets
        else ""
    )

    exclude_manual = ' except tests(attr("tags", "manual", set({})))'.format(
        " ".join("'{}'".format(t) for t in included_targets)
    )

    eprint("Resolving test targets via bazel query")
    output = execute_command_and_get_output(
        [bazel_binary]
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
    included_targets, excluded_targets = [], []
    for target in targets:
        if target.startswith("-"):
            excluded_targets.append(target[1:])
        else:
            included_targets.append(target)

    return included_targets, excluded_targets

def get_targets_for_shard(targets, shard_id, shard_count):
  "Split the targets in the shards"
  return bubble_sort(targets)[shard_id::shard_count]


def print_collapsed_group(name):
    eprint("\n\n--- {0}\n\n".format(name))

def eprint(*args, **kwargs):
    """
    Print to stderr and flush (just in case).
    """
    print(*args, flush=True, file=sys.stderr, **kwargs)

def execute_command_and_get_output(
  args,
  shell=False,
  fail_if_nonzero=True,
  print_output=True
):
  "Executes a command in a subprocess"
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

main()
