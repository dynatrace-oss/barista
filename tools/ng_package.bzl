load("@build_bazel_rules_nodejs//:providers.bzl", "DeclarationInfo", "JSEcmaScriptModuleInfo", "JSNamedModuleInfo", "node_modules_aspect", "run_node")
load("@build_bazel_rules_nodejs//internal/linker:link_node_modules.bzl", "module_mappings_aspect")
load(":esm5.bzl", "es5_aspect", "flatten_esm5", "esm5_root_dir")
load(":defaults.bzl", "copy_file", "join")

_ROLLUP_CONFIG = "//tools:rollup.config.js"

def _filter_js(files):
    return [f for f in files if f.extension == "js" or f.extension == "mjs"]

def _get_bundle_name(input):
    input_file = input.files.to_list()[0]

    if len(input_file.extension) > 0:
        return input_file.basename.replace("." + input_file.extension, "")

    return input_file.basename


def _ng_package_impl(ctx):
    print("RUN PACKAGE IMPLEMENTATION")
    # The directory of the package
    build_dir = ctx.build_file_path.replace("BUILD.bazel", "")

    bundle_name = _get_bundle_name(ctx.attr.entry_point)

    rollup_outputs = [
      ctx.actions.declare_file('bundles/' + bundle_name + ".umd.js"),
      ctx.actions.declare_file('fesm2015/' + bundle_name + ".js"),
      ctx.actions.declare_file('fesm5/' + bundle_name + ".js"),
    ]

    files = []

    for dep in ctx.attr.deps:
        if JSEcmaScriptModuleInfo in dep:
            files.extend(dep[JSEcmaScriptModuleInfo].sources.to_list())

        if DeclarationInfo in dep:
            files.extend(dep[DeclarationInfo].declarations.to_list())

        if JSNamedModuleInfo in dep:
            files.extend(dep[JSNamedModuleInfo].sources.to_list())


    for file in flatten_esm5(ctx).to_list():
        # correct the destination path to be inside an esm5 folder
        dest_file_path = file.short_path.replace(build_dir + esm5_root_dir(ctx) + "/" + build_dir, "esm5/")
        dest_file = ctx.actions.declare_file(dest_file_path)
        copy_file(ctx, file, dest_file)
        files.append(dest_file)



    rollup_inputs = _filter_js(ctx.files.entry_point) + files

    # Create a rollup config file out of the rollup config template in the
    # tools folder. Then add the config to the inputs that it is available for
    # rollup.
    config = ctx.actions.declare_file("_%s.rollup_config.js" % ctx.label.name)
    ctx.actions.expand_template(
        template = ctx.file._rollup_config,
        output = config,
        substitutions = {
            "{base_path}": join([ctx.bin_dir.path,build_dir]),
            "{entry_point_name}": "index"
        },
    )
    
    rollup_inputs.append(config)

    rollup_args = ["--config", config.path]

    run_node(
        ctx = ctx,
        inputs = rollup_inputs,
        executable = "rollup_bin",
        outputs = rollup_outputs,
        arguments = rollup_args,
        mnemonic = "Rollup",
        progress_message = """
--------------------------------------------
    Creating Angular Package:
    - %s
--------------------------------------------
        """ % build_dir[:-1],
    )

    return [DefaultInfo(files = depset(rollup_outputs))]

ng_package = rule(
    implementation = _ng_package_impl,
    attrs = {
        "rollup_bin": attr.label(
            doc = "Target that executes the rollup binary",
            executable = True,
            cfg = "host",
            default = "@npm//rollup/bin:rollup",
        ),
        "entry_point": attr.label(
            allow_single_file = True,
            mandatory = True,
        ),
        "deps": attr.label_list(
            aspects = [es5_aspect, module_mappings_aspect, node_modules_aspect],
            mandatory = True,
            doc = "The list of SubPackages that should be bundled",
        ),
        "_rollup_config": attr.label(
            default = Label(_ROLLUP_CONFIG),
            allow_single_file = True,
        ),
    },
)
