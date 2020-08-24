"""Public design token build API.

Users should not load files under "/tools/design-tokens/..."
"""

load("//tools/design-tokens/build:build_design_tokens.bzl", _build_design_tokens = "build_design_tokens_macro")
load("//tools/design-tokens/generate-color-palette:generate_color_palette.bzl", _generate_color_palette = "generate_color_palette")

build_design_tokens = _build_design_tokens
generate_color_palette = _generate_color_palette
