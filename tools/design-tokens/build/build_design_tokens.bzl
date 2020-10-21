load("@build_bazel_rules_nodejs//:providers.bzl", "declaration_info", "js_module_info")
load("@io_bazel_rules_sass//:defs.bzl", "SassInfo")

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

    args = []
    args.append("--entrypoints")
    args.extend([file.path for file in entrypoint_files])
    args.append("--aliases-entrypoints")
    args.extend([file.path for file in aliases_entrypoint_files])

    output_dir = ctx.attr.output_dir
    output_types = ctx.attr.output_types
    outputs = []
    file_infos = []
    default_files = []

    typescript_output_dir = None
    javascript_output_dir = None
    scss_output_dir = None
    css_output_dir = None
    json_output_dir = None

    if 'ts' in output_types:
        typescript_output_dir = ctx.actions.declare_directory(output_dir + '/ts')
        outputs.append(typescript_output_dir)
        args.extend(["--typescript-output-path", typescript_output_dir.path])
         # Factory functions should be used for TS and JS providers
        default_files.append(typescript_output_dir)

    if 'js' in output_types:
        javascript_output_dir = ctx.actions.declare_directory(output_dir + '/js')
        outputs.append(javascript_output_dir)
        args.extend(["--javascript-output-path", javascript_output_dir.path])
        file_infos.append(js_module_info(sources = depset([javascript_output_dir])))

    if 'scss' in output_types:
        scss_output_dir = ctx.actions.declare_directory(output_dir + '/scss')
        outputs.append(scss_output_dir)
        args.extend(["--scss-output-path", scss_output_dir.path])
        file_infos.append(SassInfo(transitive_sources = depset([css_output_dir])))

    if 'css' in output_types:
        css_output_dir = ctx.actions.declare_directory(output_dir + '/css')
        outputs.append(css_output_dir)
        args.extend(["--css-output-path", css_output_dir.path])
        default_files.append(scss_output_dir)

    if 'json' in output_types:
        json_output_dir = ctx.actions.declare_directory(output_dir + '/json')
        outputs.append(json_output_dir)
        args.extend(["--json-output-path", json_output_dir.path])
        default_files.append(json_output_dir)

    if len(default_files) > 0:
        file_infos.append(DefaultInfo(files = depset(default_files)))

    ctx.actions.run(
        mnemonic = "DesignTokensBuild",
        progress_message = "Building Design Tokens",
        executable = executable,
        arguments = args,
        inputs = inputs,
        outputs = outputs,
        tools = [executable]
    )

    return file_infos

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
        "output_dir": attr.string(
            doc = "Directory where the output files should be generated",
        ),
        "output_types": attr.string_list(
            default = [],
            doc = "Output types that should be generated. 'ts', 'js', 'scss', 'css' and 'json' are supported.",
        ),
    },
)

def build_design_tokens_macro(name, **kwargs):
    build_design_tokens(
        name = name,
        output_dir = name,
        **kwargs
    )
