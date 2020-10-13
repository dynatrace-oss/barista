load("@build_bazel_rules_nodejs//internal/linker:link_node_modules.bzl", "module_mappings_aspect")
load("@build_bazel_rules_nodejs//:providers.bzl", "JSEcmaScriptModuleInfo", "NpmPackageInfo", "run_node")
load("//tools/bazel_rules:helpers.bzl", "filter_files", "join")
load("@build_bazel_rules_nodejs//:index.bzl", "copy_to_bin")

# Provider with the transitive npm dependencies
NpmDepsInfo = provider(fields = ["transitive_dependencies"])

# Aspect for gathering the dependencies of the ts_library that we can declare them
# as rollup globals for the commonjs version. They don't need to be bundled into.
def _npm_deps_aspect(target, ctx):
    deps = []

    if (target.label.workspace_root == "external/npm"):
        return []

    # If the target is not from the external npm repository it is a target
    # like the ts_library with dependencies
    if hasattr(ctx.rule.attr, 'deps'):
        for dep in ctx.rule.attr.deps:
            deps.append(dep.label.package)

    return [NpmDepsInfo(
        transitive_dependencies = deps,
    )]

npm_deps_aspect = aspect(
    implementation = _npm_deps_aspect,
    attr_aspects = ["deps"],
)

def _write_rollup_config(ctx, substitutions = {}):
    config = ctx.actions.declare_file("_%s.rollup_config.js" % ctx.label.name)
    ctx.actions.expand_template(
        template = ctx.file._rollup_config,
        output = config,
        substitutions = substitutions,
    )
    return config

def _get_entry_point(files, entry_point, root):
    if (len(entry_point.items()) > 1):
        fail("entry_point can have only one item currently!")

    ep = entry_point.items()[0]
    src = ep[0].files.to_list()[0]
    name = ep[1]

    return (join([root, src.path.rpartition(".")[0] + ".mjs"]), name)

def _rollup_impl(ctx):
    bundle_name = "builder"

    # the Rule outputs
    outputs = []

    # the node module dependencies for rollup like node-resolve
    node_modules_files = []

    # list of source files to bundle
    files = []

    # rollup globals (npm dependencies that should not be bundled into)
    rollup_globals = ["fs", "child_process", "path", "os", "tslib", "rxjs/operators"]

    for dep in ctx.attr.deps:
        # Get the rollup globals with the custom NpmDepsInfo aspect
        if NpmDepsInfo in dep:
            rollup_globals.extend(dep[NpmDepsInfo].transitive_dependencies)

        # For the node_modules and dependencies that are needed by rollup
        if NpmPackageInfo in dep:
            node_modules_files.extend(filter_files(dep[NpmPackageInfo].sources, [".js", ".json"]))

        if JSEcmaScriptModuleInfo in dep:
            files.extend(filter_files(dep[JSEcmaScriptModuleInfo].sources, [".mjs"]))

    # Copy the static data to the output location
    for data in ctx.attr.data:
        outputs.extend(data.files.to_list())

    entry = _get_entry_point(files, ctx.attr.entry_point, ctx.bin_dir.path)

    rollup_inputs = files + node_modules_files
    rollup_output = ctx.actions.declare_file(entry[1])
    outputs.append(rollup_output)
    rollup_config = _write_rollup_config(ctx)

    rollup_inputs.append(rollup_config)

    # use rollup cli flags https://github.com/rollup/rollup/blob/master/docs/999-big-list-of-options.md
    rollup_args = [] + ctx.attr.args

    rollup_args.extend(["--config", rollup_config.path])
    rollup_args.extend(["--input", entry[0]])
    rollup_args.extend(["--output.file", rollup_output.path])
    rollup_args.extend(["--format", "cjs"])
    rollup_args.extend(["--external", join(rollup_globals, ",")])

    # Prevent rollup's module resolver from hopping outside Bazel's sandbox
    # When set to false, symbolic links are followed when resolving a file.
    # When set to true, instead of being followed, symbolic links are treated as if the file is
    # where the link is.
    rollup_args.append("--preserveSymlinks")

    run_node(
        ctx = ctx,
        inputs = rollup_inputs,
        executable = "_rollup_bin",
        outputs = [rollup_output],
        arguments = rollup_args,
        mnemonic = "Rollup",
        progress_message = "Creating Rollup bundle",
    )

    return [DefaultInfo(files = depset(outputs))]

rollup = rule(
    implementation = _rollup_impl,
    attrs = {
        "_rollup_bin": attr.label(
            doc = "Target that executes the rollup binary",
            executable = True,
            cfg = "host",
            default = "@npm//rollup/bin:rollup",
        ),
        "_rollup_config": attr.label(
            default = Label("//tools/bazel_rules/rollup:rollup.config.js"),
            allow_single_file = True,
        ),
        "args": attr.string_list(
            doc = "Command line arguments for Rollup",
            default = [],
        ),
        "data": attr.label_list(
            allow_files = True,
            default = [],
            doc = "Static data",
        ),
        "entry_point": attr.label_keyed_string_dict(
            allow_files = True,
            mandatory = True,
        ),
        "deps": attr.label_list(
            aspects = [npm_deps_aspect, module_mappings_aspect],
            mandatory = True,
            doc = "The list of SubPackages that should be bundled",
        ),
    },
)

def rollup_macro(
        name = "bundle",
        assets = [],
        deps = [],
        **kwargs):
    # Copy assets
    copy_to_bin(
        name = "copy_%s_assets" % name,
        srcs = assets,
    )

    extra_deps = [
        "@npm//@rollup/plugin-node-resolve",
        "@npm//@rollup/plugin-commonjs",
    ]

    rollup(
        name = name,
        deps = deps + extra_deps,
        data = [":copy_%s_assets" % name],
        **kwargs
    )
