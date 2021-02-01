"Jest testing macro that can compile typescript files for testing as well"

load("@npm//@bazel/typescript:index.bzl", "ts_library")
load("@build_bazel_rules_nodejs//:index.bzl", "nodejs_binary", "nodejs_test")

def jest_test(
        srcs,
        ts_config,
        snapshots = [],
        jest_config = None,
        # jest does not understand only commonjs the default would be umd
        devmode_module = "commonjs",
        setup_file = None,
        name = "test",
        deps = [],
        data = [],
        **kwargs):
    """Jest testing rule that compiles the typescript sources and run jest tests

    Args:
      srcs: The sources passed
      ts_config: The typescript config for compiling typescript files
      snapshots: The snapshots used in tests
      jest_config: The jest configuration file
      devmode_module: The jest compile devmode module
      setup_file: The jest setup file
      name: The name of the test rule
      snapshots: List of snapshot files
      deps: The dependencies that are needed for the test
      data: Additional data for the test_run
      **kwargs: Keyword arguments
    """

    # sources needed for compiling
    compile_srcs = srcs
    dependencies = [
        "//tools/bazel_rules/jest",
        ":%s_compile" % name,
        "@npm//identity-obj-proxy",
        "@npm//lodash-es:lodash-es__umd",
    ] + deps + snapshots + srcs  # Add the srcs as it is needed to resolve the rootpath

    templated_args = ["--files=\"$(rootpath %s)\"" % s for s in srcs]

    # if we have a setup file than add it
    if setup_file:
        compile_srcs.append(setup_file)
        dependencies.append(setup_file)
        templated_args.append("--setupFile $(rootpath %s)" % setup_file)

    # if we have a config file than add it
    if jest_config:
        dependencies.append(jest_config)
        templated_args.append("--config $(rootpath %s)" % jest_config)

    templated_args.extend(["--snapshot-files=\"$(rootpath %s)\"" % s for s in snapshots])
    templated_args.extend(["--suite=\"%s\"" % (name)])

    # compile the spec files first
    ts_library(
        name = name + "_compile",
        srcs = compile_srcs,
        tsconfig = ts_config,
        devmode_module = devmode_module,
        deps = [
            "@npm//tslib",
            "@npm//@types/jest",
            "@npm//jest-junit",
        ] + deps,
    )

    nodejs_test(
        name = name,
        testonly = True,
        data = dependencies + data,
        entry_point = "//tools/bazel_rules/jest:src/jest-runner.ts",
        templated_args = templated_args,
        **kwargs
    )

    nodejs_binary(
        name = "%s.update" % name,
        data = dependencies + data,
        entry_point = "//tools/bazel_rules/jest:src/jest-runner.ts",
        templated_args = templated_args + ["--update"],
        **kwargs
    )
