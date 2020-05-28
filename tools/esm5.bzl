ESM5Info = provider(
    doc = "Typescript compilation outputs in ES5 syntax with ES Modules",
    fields = {
        "files": """The ES5 files""",
    },
)

def _map_closure_path(file):
    result = file.short_path[:-len(".mjs")]

    # short_path is meant to be used when accessing runfiles in a binary, where
    # the CWD is inside the current repo. Therefore files in external repo have a
    # short_path of ../external/wkspc/path/to/package
    # We want to strip the first two segments from such paths.
    if (result.startswith("../")):
        result = "/".join(result.split("/")[2:])
    return result + ".js"

def _join(array):
    return "/".join([p for p in array if p])


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
        progress_message =  "Modify tsconfig to generate esm5 output for %s" % target.label,
        arguments = [
            target.typescript.replay_params.tsconfig.path,
            tsconfig.path,
            _join([target.label.package, ctx.label.name + ".esm5"]),
            ctx.bin_dir.path,
        ],
    )

    inputs = [tsconfig]
    out_dir = ctx.label.name + ".esm5"
    outputs = [
        ctx.actions.declare_file(_join([out_dir, _map_closure_path(f)]))
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
          # "--help"
          tsconfig.path,
        #   "--target='ES5'",
        #   "--project=" + tsconfig.path,
        ],
        executable = compiler,
        # execution_requirements = {
        #     "supports-workers": "0",
        # },
        mnemonic = "ESM5",
    )

    return [ESM5Info(
        files = outputs,
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
