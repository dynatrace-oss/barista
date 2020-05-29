load("@npm_bazel_typescript//:index.bzl", "ts_library")

# Convert from some-kebab-case to someKebabCase
def convert_kebab_case_to_camel_case(s):
    "Convert a string from kebab-case to camelCase"
    parts = s.split("-")

    # First letter in the result is always unchanged
    return s[0] + "".join([p.capitalize() for p in parts])[1:]

def join(array):
    "Joins a string by its seperator used for path merging"
    return  "/".join([p for p in array if p])


def debug(vars, *args):
    """Debug function that prints verbose output with a debug flag.

    Prints a debug message if "--define=VERBOSE_LOGS=true" is specified.

    Args:
      vars: The vars from the context `ctx.vars`
      *args: The Arguments that should be printed

    """
    scope = "Barista Components"

    if "VERBOSE_LOGS" in vars.keys():
        print("[" + scope + "]", args)

def copy_file(ctx, src_file, dest_file):
    """Copies a file to the destination path

    Args:
        ctx: The rule context
        src_file: The file that should be copied
        dest_file: The destination filename where it should be copied to
    """
    debug(ctx.var, "copy ", src_file.short_path, " to ", dest_file)
    ctx.actions.expand_template(
        output = dest_file,
        template = src_file,
        substitutions = {},
    )

def ng_module(deps = [], **kwargs):
    """Used for building Angular Modules

    We use our own ng_module rule instead of the one that is shipped
    from `@angular/bazel` `load("@npm_angular_bazel//:index.bzl", "ng_module")`
    as the strict dependency reporting is not part of the Angular compiler.

    Of this reason the wrapped typescript compile by the node_js rules of bazel
    which is used by the `ts_library` is checking strict dependencies.

    Therefore the `use_angular_plugin` was added to the tsc.


    Args:
      deps: List of lobels for depdendencies
      **kwargs: remaining args to pass to the ts_library rule
    """

    ts_library(
        compiler = "//tools:tsc_wrapped_with_angular",
        supports_workers = True,
        use_angular_plugin = True,
        deps = ["@npm//@angular/compiler-cli"] + deps,
        **kwargs
    )
