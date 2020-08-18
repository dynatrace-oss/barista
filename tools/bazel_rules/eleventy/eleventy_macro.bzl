"Stylelint makro to test our scss and css files."

# load("@build_bazel_rules_nodejs//:index.bzl", "copy_to_bin")
load(":eleventy.bzl", "eleventy")

def eleventy_macro(
        name = "eleventy",
        base_dir = "src",
        template_dir = "templates",
        assets = [],
        data = [],
        files = [],
        templates = [],
        config = "//tools/bazel_rules/eleventy:.eleventy.js"):
    """This makro is running the 11ty static site generator

    Args:
        name: The name of the rule
        assets: Assets that are going to be copied by 11ty
        files: The list of files
        data:
        config:
        templates: List of template files
    # """

    eleventy(
        name = name,
        config = config,
        assets = assets,
        data = data,
        files = files,
        base_dir = base_dir,
        template_dir = template_dir,
        templates = templates,
    )

# pkg_web(
#     name = "design-system",
#     additional_root_paths = ["dist"],
#     srcs = [":build"]
# )
