load("//tools/bazel_rules:helpers.bzl", "filter_files", "join")
load("@build_bazel_rules_nodejs//:providers.bzl", "JSModuleInfo")

def relative_path(src, base_path):
    """Given a src File and a directory it should be relative to.

    Args:
        src: File(path/to/site/content/docs/example1.md)
        base_path: string("content")
    Returns:
        string
    """

    # Check if the base_path exists inside the file.
    i = src.short_path.find(base_path)
    if i == -1:
        # If the file is located somewhere else return only the basename
        # without folder
        # return src.short_path.replace('libs/fluid-elements/', '')
        return src.short_path
    return src.short_path.replace(base_path, "")

def copy_to_dir(ctx, srcs, base, destination = ""):
    outs = []
    for i in srcs:
        o = ctx.actions.declare_file(join([destination, relative_path(i, base)]))
        copy_file(ctx, i, o)
        outs.append(o)
    return outs

def copy_file(ctx, src, dest):
    ctx.actions.run_shell(
        inputs = [src],
        outputs = [dest],
        command = 'cp "$1" "$2"',
        arguments = [src.path, dest.path],
    )

def _eleventy_impl(ctx):
    # check if the strapi endpoint variable is set.
    if "STRAPI_ENDPOINT" not in ctx.configuration.default_shell_env.keys():
        fail("Please define the `build --action_env=STRAPI_ENDPOINT=xxx` in your .bazelrc.user file!")

    STRAPI_ENDPOINT = ctx.configuration.default_shell_env["STRAPI_ENDPOINT"]

    rule_dir = ctx.build_file_path.replace("BUILD.bazel", "")
    src_dir = join([rule_dir[:-1], ctx.attr.base_dir])
    eleventy = ctx.executable._eleventy
    eleventy_inputs = []
    eleventy_outputdir = ctx.actions.declare_directory(ctx.label.name + "_generated")
    eleventy_outputs = [eleventy_outputdir]
    eleventy_args = ["--quiet"]

    # Copy the config file into place that is used for the 11ty command
    config_file = ctx.actions.declare_file(ctx.file.config.basename)
    copy_file(ctx, ctx.file.config, config_file)
    eleventy_inputs.append(config_file)

    # Collect the data javascript for fetching 11ty data
    data_files = []

    for d in ctx.attr.data:
        if JSModuleInfo in d:
            data_files.extend(filter_files(d[JSModuleInfo].sources, [".js"]))

    # asset_files = copy_to_dir(ctx, ctx.files.assets, rule_dir, "assets")
    layout_files = copy_to_dir(ctx, ctx.files.templates, rule_dir)
    content_files = copy_to_dir(ctx, ctx.files.files, rule_dir)

    eleventy_inputs += data_files + layout_files + content_files

    # eleventy_args.append("--serve")
    eleventy_args += ["--config", config_file.path]

    # Run the 11ty generation
    ctx.actions.run(
        mnemonic = "11ty",
        progress_message = "Generating 11ty site",
        executable = eleventy,
        arguments = eleventy_args,
        inputs = eleventy_inputs,
        outputs = eleventy_outputs,
        tools = [eleventy],
        env = {
            "STRAPI_ENDPOINT": STRAPI_ENDPOINT,
            "ELEVENTY_ROOT_DIR": join([ctx.bin_dir.path, rule_dir]),
            "ELEVENTY_BASE_DIR": join([ctx.bin_dir.path, src_dir]),
            "ELEVENTY_OUTPUT_DIR": eleventy_outputdir.path,
            "ELEVENTY_INCLUDES_DIR": ctx.attr.template_dir,
            "ELEVENTY_DATA_DIR": "data",
        },
    )

    files = depset([eleventy_outputdir])
    runfiles = ctx.runfiles(files = [eleventy_outputdir])

    return [DefaultInfo(
        files = files,
        runfiles = runfiles,
    )]

eleventy = rule(
    implementation = _eleventy_impl,
    attrs = {
        "_eleventy": attr.label(
            default = "@npm//@11ty/eleventy/bin:eleventy",
            allow_files = True,
            executable = True,
            cfg = "host",
        ),
        "config": attr.label(
            doc = "The eleventy configuration file (.eleventy.js)",
            allow_single_file = [".js"],
            mandatory = True,
        ),
        "base_dir": attr.string(
            doc = "The directory where the 11ty files are located (relative path)",
            default = "",
        ),
        "data": attr.label_list(
            doc = "The list of label with the data for 11ty",
            allow_files = True,
        ),
        "files": attr.label_list(
            doc = "A list of content files for 11ty",
            allow_files = True,
        ),
        "templates": attr.label_list(
            allow_files = True,
        ),
        "template_dir": attr.string(
            doc = "The directory where to find the templates for 11ty (relative path)",
            default = "_includes",
        ),
        "assets": attr.label_list(
            allow_files = True,
        ),
        "quiet": attr.bool(
            default = True,
        ),
        # # Emit verbose
        # "verbose": attr.bool(
        #     default = False,
        # ),
    },
)
