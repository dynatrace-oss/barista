"Macro for generating an HTML file with all JavaScript and CSS for Figma plugins"
def figma_bundle_macro(
        name,
        srcs = [],
        output = "worker.html"):
    """Creates an HTML bundle for Figma plugins where the specified files are inlined.

    Args:
        name: The name of the rule
        srcs: List of files that should be included in the generated HTML
        output: Name of the output file
    """

    binary = "//tools/bazel_rules/figma_bundle:figma_bundle_binary"

    file_arg = "--srcs=" + "".join(["\"$(location %s)\" " % s for s in srcs])

    native.genrule(
        name = name,
        srcs = srcs,
        outs = [output],
        cmd = "$(location %s) --out=$(OUTS) %s" % (binary, file_arg),
        tools = [binary]
    )
