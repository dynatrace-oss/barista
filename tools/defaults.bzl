load("@npm_bazel_typescript//:index.bzl", "ts_library")

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
