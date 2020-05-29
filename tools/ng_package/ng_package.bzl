


def _ng_package_impl(ctx):
    print(ctx.attr.sub_packages)

    deps_files = depset()

    for sub_package in ctx.attr.sub_packages:
        deps_files.extends(sub_package.files)

    print(deps_files)


ng_package = rule(
    implementation = _ng_package_impl,
    attrs = {
        "sub_packages": attr.label_list(
            mandatory = True,
            doc = "The list of SubPackages that should be bundled",
        )
    },
)
