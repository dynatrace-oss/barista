load("@build_bazel_rules_nodejs//:index.bzl", "nodejs_test")
load("@npm//@bazel/typescript:index.bzl", "ts_config", "ts_library")
load("//tools/bazel_rules:helpers.bzl", "join")

def jest_macro(
        srcs,
        jest_config,
        setup_file,
        ts_config,
        name = "test",
        deps = [],
        **kwargs):
    # compile the spec files first
    ts_library(
        name = name + "_compile",
        srcs = srcs + [setup_file],
        tsconfig = ts_config,
        testonly = True,
        deps = deps + [
            "@npm//tslib",
            "@npm//@types/jest",
        ],
    )

    nodejs_test(
        name = name,
        testonly = True,
        data = deps + [
            ":%s_compile" % name,
            jest_config,
            setup_file,
            "@npm//jest-preset-angular",
            "@npm//jest-junit",

            # needed by the runner and resolver
            "//tools/bazel_rules/jest:jest-runner.js",
            "//tools/bazel_rules/jest:jest-resolver.js",
            "@npm//lodash", # used by the module name mapper
        ],
        entry_point = "//tools/bazel_rules/jest:jest-runner.js",
        templated_args = [
            "--nobazel_patch_module_resolver",
            "--suite %s" % name,
            "--jestConfig $(rootpath %s)" % jest_config,
            "--setupFile $(rootpath %s)" % setup_file,
            "--files=\"%s\"" % join(srcs, ","),
        ],
    )
