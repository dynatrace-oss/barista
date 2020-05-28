
def _ng_package_impl(ctx):
  print(ctx.attr.sub_packages)
  

ng_package = rule(
    implementation = _ng_package_impl,
    attrs = {
        "sub_packages": attr.label_list(
            mandatory = True,
            doc = "The list of SubPackages that should be bundled",
        )
    },
)
