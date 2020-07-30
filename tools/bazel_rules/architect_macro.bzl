load("@npm//@angular-devkit/architect-cli:index.bzl", "architect")

def architect_macro(
        name,
        target,
        data,
        **kwargs):
    # additional data that is needed for the architect to run
    additional_data = [
        "//:angular.json",
        "//:tsconfig.base.json",
        "@npm//@angular-devkit/build-angular",
        "@npm//@angular-devkit/architect-cli",
        "@npm//@angular/cli",
    ]

    architect(
        name = name,
        args = [
            target,
            "--outputPath=$(@D)",
        ],
        configuration_env_vars = ["NG_BUILD_CACHE"],
        data = data + additional_data,
        output_dir = True,
        **kwargs
    )
