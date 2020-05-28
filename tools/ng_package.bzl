load("@build_bazel_rules_nodejs//:providers.bzl", "DeclarationInfo", "JSEcmaScriptModuleInfo", "JSNamedModuleInfo", "node_modules_aspect")
load("@build_bazel_rules_nodejs//internal/linker:link_node_modules.bzl", "module_mappings_aspect")
load(":esm5.bzl", "es5_aspect", "ESM5Info")

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

    bundle_name = _get_bundle_name(ctx.attr.entry_point)
    # outputs = [
    #   ctx.actions.declare_file('bundles/' + bundle_name + ".umd.js"),
    #   ctx.actions.declare_file('fesm2015/' + bundle_name + ".js")
    # ]

    files = []

    for dep in ctx.attr.deps:
        if JSEcmaScriptModuleInfo in dep:
            files.extend(dep[JSEcmaScriptModuleInfo].sources.to_list())

        if DeclarationInfo in dep:
            files.extend(dep[DeclarationInfo].declarations.to_list())

        if JSNamedModuleInfo in dep:
            files.extend(dep[JSNamedModuleInfo].sources.to_list())

        if ESM5Info in dep:
            files.extend(dep[ESM5Info].files)
            

    # outputs.append(dep[JSEcmaScriptModuleInfo])
    # outputs.append(dep[DeclarationInfo])
    # outputs.append(dep[JSNamedModuleInfo])

    print(files)

    return [DefaultInfo(files = depset(files))]
    # if JSEcmaScriptModuleInfo in dep:
    #     deps_depsets.append(dep[JSEcmaScriptModuleInfo].sources)
    # elif hasattr(dep, "files"):
    #     deps_depsets.append(dep.files)

    # if NpmPackageInfo in dep:
    #     deps_depsets.append(dep[NpmPackageInfo].sources)

    # deps_inputs = depset(transitive = deps_depsets).to_list()

    # inputs = _filter_js(ctx.files.entry_point) + deps_inputs

    # Create a rollup config file out of the rollup config template in the
    # tools folder. Then add the config to the inputs that it is available for
    # rollup.
    # config = ctx.actions.declare_file("_%s.rollup_config.js" % ctx.label.name)
    # ctx.actions.expand_template(
    #     template = ctx.file._rollup_config,
    #     output = config,
    #     substitutions = {},
    # )
    # inputs.append(config)

    # out_file = ctx.actions.declare_file("%s.size" % ctx.attr.name)

    # outputs = []

    # print(out_file)

    # args = []

    # args = [
    #     "-i {input}".format(
    #         input = shell.quote(bundle_name + "=" + './bazel-out/darwin-fastbuild/bin/libs/barista-components/core/index.mjs'),
    #     ),
    # ]

    # args.append("--preserveSymlinks")
    # args = ["--input"]

    # args.extend(["--config", config.path])

    # run_node(
    #     ctx = ctx,
    #     inputs = inputs,
    #     executable = "rollup_bin",
    #     outputs = outputs,
    #     arguments = args,
    #     mnemonic = "Rollup",
    #     progress_message = """
    #     --------------------------------------------
    #       Creating Angular Package
    #       %s
    #     --------------------------------------------
    #     """ % ctx.label.name,
    # )

    # Tell Bazel that the files to build for this target includes
    # `out_file`.

    # return [DefaultInfo()]

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
