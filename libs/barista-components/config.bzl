# List of all entry-points of the @dynatrace/barista-components package
BARISTA_COMPONENTS_ENTRYPOINTS = [
    "core",
    "icon",
    "button",
]

# List of all Bazel targets for the compoent entrypoints
BARISTA_COMPONENTS_TARGETS = [
    "//libs/barista-components/%s" % entrpoint
    for entrpoint in BARISTA_COMPONENTS_ENTRYPOINTS
]
