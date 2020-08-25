load("@build_bazel_rules_nodejs//:index.bzl", "nodejs_test")
load("@npm//@bazel/typescript:index.bzl", "ts_config", "ts_library")
load("//tools/bazel_rules:helpers.bzl", "join")

def jest_macro(
        srcs,
        ts_config,
        jest_config = None,
        setup_file = None,
        name = "test",
        deps = [],
        **kwargs):
    compile_srcs = srcs
    test_deps = []

    # Arguments that are passed to our custom jest runner
    args = [
        "--nobazel_patch_module_resolver",
        "--suite %s" % name,
        "--files=\"%s\"" % join(srcs, ","),
    ]

    # if we have a setup file than add it
    if setup_file:
        compile_srcs.append(setup_file)
        test_deps.append(setup_file)
        args.append("--setupFile $(rootpath %s)" % setup_file)

    # if we have a config file than add it
    if jest_config:
        test_deps.append(jest_config)
        args.append("--jestConfig $(rootpath %s)" % jest_config)

    # compile the spec files first
    ts_library(
        name = name + "_compile",
        srcs = compile_srcs,
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
        data = test_deps + deps + [
            ":%s_compile" % name,
            "@npm//jest-preset-angular",
            "@npm//jest-junit",
            "@npm//lodash-es:lodash-es__umd",
            "@npm//lit-html",
            # umd modules for fluid elements
            "//tools/bazel_rules/jest:lit-html",
            "//tools/bazel_rules/jest:lit-element",
            "//tools/bazel_rules/jest:popperjs",

            # needed by the runner and resolver
            "//tools/bazel_rules/jest:jest-runner.js",
            "//tools/bazel_rules/jest:jest-resolver.js",
        ],
        entry_point = "//tools/bazel_rules/jest:jest-runner.js",
        templated_args = args,
    )
