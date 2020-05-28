load(":defaults.bzl", "join")

ESM5Info = provider(
    doc = "Typescript compilation outputs in ES5 syntax with ES Modules",
    fields = {
        "transitive_output": """Dict of [rootDir, .js depset] entries.""",
    },
)

def esm5_root_dir(ctx):
    "The root dir where the esm5 files are located"
    return ctx.label.name + ".esm5"

def _map_closure_path(file):
    result = file.short_path[:-len(".mjs")]

    # short_path is meant to be used when accessing runfiles in a binary, where
    # the CWD is inside the current repo. Therefore files in external repo have a
    # short_path of ../external/dynatrace/libs/barista-components/core
    # We want to strip the first two segments from such paths.
    if (result.startswith("../")):
        result = "/".join(result.split("/")[2:])
    return result + ".js"

def _es5_aspect(target, ctx):
    if not hasattr(target, "typescript"):
        return []
    if not hasattr(target.typescript, "replay_params"):
        print("WARNING: no esm5 output from target %s//%s:%s available" % (target.label.workspace_root, target.label.package, target.label.name))
        return []
    elif not target.typescript.replay_params:
        # In case there are "replay_params" specified but the compile action didn't generate any
        # outputs (e.g. only "d.ts" files), we cannot create ESM5 outputs for this target either.
        return []

    compiler = ctx.executable._tsc_wrapped
    out_dir = esm5_root_dir(ctx)

    # -------------------------------------------------------------------------
    # Modify the tsconfig file to generate the ES5 output
    # For modifiying the compiler and bazel options we use the
    # `modify-tsconfig.js` file that is located next to this file.
    # -------------------------------------------------------------------------

    # We create a new tsconfig.json file that will have our compilation settings
    tsconfig = ctx.actions.declare_file("%s_esm5.tsconfig.json" % target.label.name)

    ctx.actions.run(
        executable = ctx.executable._modify_tsconfig,
        inputs = [target.typescript.replay_params.tsconfig],
        outputs = [tsconfig],
        progress_message = "Modify tsconfig to generate esm5 output for %s" % target.label,
        arguments = [
            target.typescript.replay_params.tsconfig.path,
            tsconfig.path,
            join([target.label.package, out_dir]),
            ctx.bin_dir.path,
        ],
    )

    inputs = [tsconfig]
    outputs = [
        ctx.actions.declare_file(join([out_dir, _map_closure_path(f)]))
        for f in target.typescript.replay_params.outputs
        if not f.short_path.endswith(".externs.js")
    ]

    if (type(target.typescript.replay_params.inputs) == type([])):
        inputs.extend(target.typescript.replay_params.inputs)
    else:
        inputs.extend(target.typescript.replay_params.inputs.to_list())

    ctx.actions.run(
        progress_message = "Compiling TypeScript (ES5 with ES Modules) %s" % target.label,
        inputs = inputs,
        outputs = outputs,
        arguments = [
            tsconfig.path,
        ],
        executable = compiler,
        mnemonic = "ESM5",
    )

    root_dir = join([
        ctx.bin_dir.path,
        target.label.package,
        out_dir,
    ])
    transitive_output = {root_dir: depset(outputs)}

    # Gather the transitive ESM5Info from the dependencies
    for dep in ctx.rule.attr.deps:
        if ESM5Info in dep:
            transitive_output.update(dep[ESM5Info].transitive_output)

    return [ESM5Info(
        transitive_output = transitive_output,
    )]

es5_aspect = aspect(
    implementation = _es5_aspect,
    attr_aspects = ["deps"],
    attrs = {
        "_tsc_wrapped": attr.label(
            default = Label("//tools:tsc_wrapped_with_angular"),
            executable = True,
            cfg = "host",
        ),
        "_modify_tsconfig": attr.label(
            default = Label("//tools:modify_tsconfig"),
            executable = True,
            cfg = "host",
        ),
    },
)




def flatten_esm5(ctx):
    """Merge together the .esm5 folders from the dependencies.

    Two different dependencies A and B may have outputs like
    `bazel-bin/path/to/A.esm5/path/to/lib.js`
    `bazel-bin/path/to/B.esm5/path/to/main.js`

    In order to run rollup on this app, in case main.js contains `import from './lib'`
    they need to be together in the same root directory, so if we depend on both A and B
    we need the outputs to be
    `bazel-bin/path/to/my_rule.esm5/path/to/lib.js`
    `bazel-bin/path/to/my_rule.esm5/path/to/main.js`

    Args:
      ctx: the skylark rule execution context

    Returns:
      depset of flattened files
    """
    esm5_sources = []
    result = []
    for dep in ctx.attr.deps:
        if ESM5Info in dep:
            transitive_output = dep[ESM5Info].transitive_output
            esm5_sources.extend(transitive_output.values())
    for f in depset(transitive = esm5_sources).to_list():
        path = f.short_path[f.short_path.find(".esm5") + len(".esm5"):]
        if (path.startswith("../")):
            path = "external/" + path[3:]
        rerooted_file = ctx.actions.declare_file("/".join([esm5_root_dir(ctx), path]))
        result.append(rerooted_file)

        # print("copy", f.short_path, "to", rerooted_file.short_path)
        ctx.actions.expand_template(
            output = rerooted_file,
            template = f,
            substitutions = {},
        )
    return depset(result)
