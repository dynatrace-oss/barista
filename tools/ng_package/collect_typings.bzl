
load("@build_bazel_rules_nodejs//:providers.bzl", "DeclarationInfo")
load("//tools:defaults.bzl", "filter_files")


def collect_typings(ctx):
    "Collect all typescript type definitions from the rule context"

    # Collect all typescript definition files that are added via the sources,
    # typically through the files or typeRoots field to the typescript compilation.
    typings = filter_files(
        [file for file in ctx.files.deps if file.is_source],
        ".d.ts"
    )

    # In case source files have been explicitly specified in the attributes, just collect
    # them and filter for definition files.
    if hasattr(ctx.attr, "srcs"):
        typings += filter_files(ctx.files.srcs, ".d.ts")


    # Collect all TypeScript definition files from the specified dependencies.
    for dep in ctx.attr.deps:
        if DeclarationInfo in dep:
            typings += dep[DeclarationInfo].transitive_declarations.to_list()

    return typings
