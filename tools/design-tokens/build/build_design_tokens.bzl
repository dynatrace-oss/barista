"""
Build rule for generating design token outputs
"""
def _build_design_tokens_impl(ctx):
    """
    Creates consumable design tokens output from the given sources.
    """
    executable = ctx.executable._builder_bin

    entrypoint_files = []
    for entrypoint_label in ctx.attr.entrypoints:
      entrypoint_files.extend(entrypoint_label.files.to_list())

    aliases_entrypoint_files = []
    for entrypoint_label in ctx.attr.aliases_entrypoints:
      aliases_entrypoint_files.extend(entrypoint_label.files.to_list())

    inputs = []
    inputs.extend(entrypoint_files)
    inputs.extend(aliases_entrypoint_files)

    output_directory_name = ctx.attr.output_directory_name
    output_dir = ctx.actions.declare_directory(output_directory_name)
    
    outputs = [output_dir]

    args = []
    args.append("--entrypoints")
    args.extend([file.path for file in entrypoint_files])
    args.append("--aliases-entrypoints")
    args.extend([file.path for file in aliases_entrypoint_files])
    args.append("--output-path")
    args.append(output_dir.path)

    ctx.actions.run(
        mnemonic = "DesignTokensBuild",
        progress_message = "Building Design Tokens",
        executable = executable,
        arguments = args,
        inputs = inputs,
        outputs = outputs,
        tools = [executable]
    )

    return [DefaultInfo(files = depset(outputs))]

build_design_tokens = rule(
    implementation = _build_design_tokens_impl,
    attrs = {
        "_builder_bin": attr.label(
            doc = "Target that executes the design tokens builder binary",
            executable = True,
            cfg = "host",
            default = "//tools/design-tokens/build",
        ),
        "entrypoints": attr.label_list(
            allow_files = True,
            default = [],
            doc = "Entry point tokens .yml files",
        ),
        "aliases_entrypoints": attr.label_list(
            allow_files = True,
            default = [],
            doc = "Alias entry point tokens .yml files",
        ),
        "output_directory_name": attr.string(
            doc = "Target output directory",
        )
    },
)

def build_design_tokens_macro(name, **kwargs):
    build_design_tokens(
        name = name,
        output_directory_name = name,
        **kwargs
    )
