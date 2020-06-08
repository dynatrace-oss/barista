"The ts_library with the angular plugin as macro"

load("@npm_bazel_typescript//:index.bzl", "ts_library")

def ng_ts_library_macro(**kwargs):
    ts_library(
        compiler = "//tools/bazel_rules:tsc_wrapped_with_angular",
        supports_workers = True,
        use_angular_plugin = True,
        **kwargs
    )
