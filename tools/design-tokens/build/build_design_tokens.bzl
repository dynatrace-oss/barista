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

    typescript_output_dir = ctx.actions.declare_directory(ctx.attr.typescript_output_directory_name)
    javascript_output_dir = ctx.actions.declare_directory(ctx.attr.javascript_output_directory_name)
    scss_output_dir = ctx.actions.declare_directory(ctx.attr.scss_output_directory_name)
    css_output_dir = ctx.actions.declare_directory(ctx.attr.css_output_directory_name)
    json_output_dir = ctx.actions.declare_directory(ctx.attr.json_output_directory_name)

    outputs = [typescript_output_dir, javascript_output_dir, scss_output_dir, css_output_dir, json_output_dir]

    args = []
    args.append("--entrypoints")
    args.extend([file.path for file in entrypoint_files])
    args.append("--aliases-entrypoints")
    args.extend([file.path for file in aliases_entrypoint_files])

    args.extend(["--typescript-output-path", typescript_output_dir.path])
    args.extend(["--javascript-output-path", javascript_output_dir.path])
    args.extend(["--scss-output-path", scss_output_dir.path])
    args.extend(["--css-output-path", css_output_dir.path])
    args.extend(["--json-output-path", json_output_dir.path])

    ctx.actions.run(
        mnemonic = "DesignTokensBuild",
        progress_message = "Building Design Tokens",
        executable = executable,
        arguments = args,
        inputs = inputs,
        outputs = outputs,
        tools = [executable]
    )

    return [
        # Factory functions should be used for TS and JS providers
        declaration_info(declarations = depset([typescript_output_dir])),
        js_module_info(sources = depset([javascript_output_dir])),
        SassInfo(transitive_sources = depset([scss_output_dir])),
        DefaultInfo(files = depset([css_output_dir, json_output_dir])),
    ]

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
        "typescript_output_directory_name": attr.string(
            doc = "Target output directory for Typescript files",
        ),
        "javascript_output_directory_name": attr.string(
            doc = "Target output directory for Javascript files",
        ),
        "scss_output_directory_name": attr.string(
            doc = "Target output directory for SCSS files",
        ),
        "css_output_directory_name": attr.string(
            doc = "Target output directory for CSS files",
        ),
        "json_output_directory_name": attr.string(
            doc = "Target output directory for JSON files",
        ),
    },
)

def build_design_tokens_macro(name, **kwargs):
    build_design_tokens(
        name = name,
        typescript_output_directory_name = name + "/ts",
        javascript_output_directory_name = name + "/js",
        scss_output_directory_name = name + "/scss",
        css_output_directory_name = name + "/css",
        json_output_directory_name = name + "/json",
        **kwargs
    )
