"Jest macro for running jest tests"

load("@build_bazel_rules_nodejs//:index.bzl", "nodejs_binary", "nodejs_test")
load("@npm//@bazel/typescript:index.bzl", "ts_config", "ts_library")
load("//tools/bazel_rules:helpers.bzl", "join")

def jest_macro(
        srcs,
        jest_config,
        setup_file,
        ts_config,
        name = "test",
        snapshots = [],
        deps = []):
    """Running jest unit tests

    Args:
        srcs:
        jest_config:
        setup_file:
        ts_config:
        name: The name of the test suite
        snapshots: A list of snapshot files `glob(["**/*.snap"])`
        deps: A list of dependencies that are needed for compiling the tests
    """

    # compile the spec files first
    ts_library(
        name = name + "_compile",
        srcs = srcs + [setup_file],
        tsconfig = ts_config,
        deps = deps + [
            "@npm//tslib",
            "@npm//@types/jest",
        ],
    )
    data = deps + snapshots + [
        ":%s_compile" % name,
        jest_config,
        setup_file,
        "@npm//jest-preset-angular",
        "@npm//jest-junit",

        # needed by the runner and resolver
        "//tools/bazel_rules/jest:jest-runner.js",
        "//tools/bazel_rules/jest:jest-resolver.js",
        "//tools/bazel_rules/jest:jest-reporter.js",
        "@npm//lodash",  # used by the module name mapper
    ]

    args = [
        "--nobazel_patch_module_resolver",
        "--suite %s" % name,
        "--jestConfig $(rootpath %s)" % jest_config,
        "--setupFile $(rootpath %s)" % setup_file,
        "--files=\"%s\"" % join(srcs, ","),
    ]

    nodejs_test(
        name = name,
        testonly = True,
        data = data,
        entry_point = "//tools/bazel_rules/jest:jest-runner.js",
        templated_args = args,
    )

    # This rule is used specifically to update snapshots via `bazel run`
    nodejs_binary(
        name = "%s.update" % name,
        data = data,
        entry_point = "//tools/bazel_rules/jest:jest-runner.js",
        templated_args = args + ["--update"],
    )
