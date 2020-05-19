load("@npm_bazel_rollup//:index.bzl", "rollup_bundle")

# All dependencies form the workspace library that are needed by rollup
# as external dependency and by the ts_library rule as deps.
NPM_DEPENDENCIES = [
    "@angular-devkit/architect",
    "@angular-devkit/build-ng-packagr",
    "@angular-devkit/core",
    "@angular/cli",
    "@nrwl/workspace",
    "@octokit/rest",
    "@types/node",
    "axios",
    "chalk",
    "d3-array",
    "d3-cam02",
    "d3-color",
    "d3-hsluv",
    "d3-scale",
    "glob",
    "lodash-es",
    "lodash",
    "memfs",
    "rxjs",
    "sass-graph",
    "stylelint",
    "theo",
    "tslib",
    "typescript",
    "xml2js",
    "xmlbuilder",
    "yargs",
    "yaml",
]
