"""Public API surface is re-exported here.

This file should be the package where all rules are imported from

The rules should be located in folders inside this package and re-exported
with this kind of barrel file.

Users should not load files under "/tools/bazel_rules/..."
"""

load("//tools/bazel_rules/rollup:rollup.bzl", _rollup = "rollup_macro")
load("//tools/bazel_rules:architect_macro.bzl", _architect = "architect_macro")
load("//tools/bazel_rules/stylelint:stylelint_macro.bzl", _stylelint = "stylelint_macro")
load("//tools/bazel_rules/jest:jest_macro.bzl", _jest = "jest_macro")
load("//tools/bazel_rules/eleventy:eleventy_macro.bzl", _eleventy = "eleventy_macro")
load("//tools/bazel_rules:ng_module_macro.bzl", _ng_module = "ng_module", _ng_module_view_engine = "ng_module_view_engine")

rollup = _rollup
architect = _architect
stylelint = _stylelint
jest = _jest
eleventy = _eleventy
ng_module = _ng_module
ng_module_view_engine = _ng_module_view_engine
