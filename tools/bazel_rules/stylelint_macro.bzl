"Stylelint makro to test our scss and css files."

load("@npm//stylelint:index.bzl", "stylelint_test")

def stylelint_macro(
        srcs,
        allow_empty_input = False,
        **kwargs):
    """This makro is running the stylelint tests

    Args:
        srcs: List of files that should be linted
        allow_empty_input: the process exits without throwing an error when glob pattern matches no files.
        **kwargs: remaining args to pass to the stylelint_test rule
    """

    args = [
        # The glob pattern for the files as we pass the files explicitly we can specify all style files
        "**/*.{scss,css}",
        # If the macro is run by `bazel run` produce a pretty output
        "--color",
    ]

    # If no tests are matching the glob the process wont exit if set
    if allow_empty_input:
        args.append("--allow-empty-input")

    stylelint_test(
        data = [
            "@npm//stylelint-config-prettier",
            "@npm//stylelint-prettier",
            "@npm//stylelint-scss",
            "//:.stylelintrc",
            "//:prettier.config.js",
        ] + srcs,
        templated_args = args,
        **kwargs
    )
