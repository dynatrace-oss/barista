load("//tools/ng_package:ng_package.bzl", _ng_package = "ng_package")
load("//tools/ng_package:ng_sub_package.bzl", _ng_sub_package = "ng_sub_package")
load("//tools:defaults.bzl", _ng_module = "ng_module")

# Re-exports to simplify build file load statements
ng_package = _ng_package
ng_sub_package = _ng_sub_package
ng_module = _ng_module
