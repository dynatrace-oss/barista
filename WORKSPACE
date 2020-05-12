workspace(
  name = "dynatrace",
  managed_directories = {"@npm": ["node_modules"]},
)

# These rules are built-into Bazel but we need to load them first to download more rules
load("@bazel_tools//tools/build_defs/repo:http.bzl", "http_archive")

# Add NodeJS rules
http_archive(
  name = "build_bazel_rules_nodejs",
  sha256 = "d14076339deb08e5460c221fae5c5e9605d2ef4848eee1f0c81c9ffdc1ab31c1",
  urls = ["https://github.com/bazelbuild/rules_nodejs/releases/download/1.6.1/rules_nodejs-1.6.1.tar.gz"],
)

# Install all dependencies with npm
load("@build_bazel_rules_nodejs//:index.bzl", "npm_install", "check_bazel_version")
# The minimum bazel version to use with this repo is v3.1.0.
check_bazel_version("3.1.0")

npm_install(
  name = "npm",
  args = ["--ignore-scripts"],
  package_json = "//:package.json",
  package_lock_json = "//:package-lock.json",
)

# Install all bazel dependencies of our npm packages
load("@npm//:install_bazel_dependencies.bzl", "install_bazel_dependencies")
install_bazel_dependencies()

# Set up TypeScript toolchain
load("@npm_bazel_typescript//:index.bzl", "ts_setup_workspace")
ts_setup_workspace()
