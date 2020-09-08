"Stylelint makro to test our scss and css files."

load("@build_bazel_rules_nodejs//:index.bzl", "nodejs_test")

def stylelint_macro(
        name = "stylelint",
        srcs = [],
        allow_empty_input = False,
        config = None,
        **kwargs):
    """This makro is running the stylelint tests

    Args:
        name: The name of the rule
        srcs: List of files that should be linted
        allow_empty_input: the process exits without throwing an error when glob pattern matches no files.
        config: Additional configuration file if no provided will fallback to the //:.stylelintrc
        **kwargs: remaining args to pass to the stylelint_test rule
    """

    args = ["--files=\"$(rootpath %s)\"" % s for s in srcs]

    if config:
        srcs.append(config)
    else:
        config = "//:.stylelintrc"

    # append the config file
    args.append("--config $(rootpath %s)" % config)

    # # If no tests are matching the glob the process wont exit if set
    if allow_empty_input:
        args.append("--allow-empty")

    nodejs_test(
        name = name,
        testonly = True,
        data = srcs + [
            "@npm//stylelint-config-prettier",
            "@npm//stylelint-prettier",
            "@npm//stylelint-scss",
            "//:.stylelintrc",
            "//:prettier.config.js",
            "//tools/bazel_rules/stylelint",
        ],
        entry_point = "//tools/bazel_rules/stylelint:run-stylelint.ts",
        templated_args = args,
    )
