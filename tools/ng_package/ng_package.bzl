


def _ng_package_impl(ctx):
    print(ctx.attr.sub_packages)

    deps_files = []

    for sub_package in ctx.attr.sub_packages:
        depset.extends(sub_package.files)



ng_package = rule(
    implementation = _ng_package_impl,
    attrs = {
        "sub_packages": attr.label_list(
            mandatory = True,
            doc = "The list of SubPackages that should be bundled",
        )
    },
)
