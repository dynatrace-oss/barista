"""
Build rule for color palette design tokens.
"""
def _generate_color_palette_impl(ctx):
    """
    Generates color design tokens from a YAML file that describes base colors and contrast ratios.

    The output is another YAML file containing the calculated color shades
    that can be used with the design tokens builder.
    """
    executable = ctx.executable._generator_bin
    palette_aliases_file = ctx.attr.palette_aliases.files.to_list()[0]

    inputs = [palette_aliases_file]
    
    output_file_name = ctx.attr.output_file
    output_file = ctx.actions.declare_file(output_file_name)
    outputs = [output_file]

    args = [
        "--color-file", palette_aliases_file.path,
        "--out", output_file.path
    ]

    ctx.actions.run(
        mnemonic = "DesignTokensColorPaletteGen",
        progress_message = "Generating design tokens color palette",
        executable = executable,
        arguments = args,
        inputs = inputs,
        outputs = outputs,
        tools = [executable]
    )

    return [DefaultInfo(files = depset(outputs))]

generate_color_palette = rule(
    implementation = _generate_color_palette_impl,
    attrs = {
        "_generator_bin": attr.label(
            doc = "Target that executes the palette generator binary",
            executable = True,
            cfg = "host",
            default = "//tools/design-tokens/generate-color-palette",
        ),
        "palette_aliases": attr.label(
            allow_single_file = True,
            doc = "Palette aliases .yml file",
        ),
        "output_file": attr.string(
            default = "palette.alias.yml",
        ),
    },
)
