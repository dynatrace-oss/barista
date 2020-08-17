"Macro for generating an HTML file with all JavaScript and CSS for Figma plugins"
def figma_plugin_macro(
        name,
        manifest_json,
        code_js,
        worker_html,
        ):
    """Creates a Figma plugin from the required files

    Args:
        name: The name of the rule
        manifest_json: Path of the manifest.json
        code_js: Path of the code.js
        worker_html: Path of the worker.html
    """

    binary = "//tools/bazel_rules/figma_plugin:figma_plugin_binary"

    args = " ".join([
        "--manifest-json=$(location %s)" % manifest_json,
        "--code-js=$(location %s)" % code_js,
        "--worker-html=$(location %s)" % worker_html,
        "--out-path=$(@D)"
    ])

    native.genrule(
        name = name,
        srcs = [manifest_json, code_js, worker_html],
        outs = ["plugin/manifest.json", "plugin/code.js", "plugin/worker.html"],
        cmd = "$(location %s) %s" % (binary, args),
        tools = [binary]
    )
