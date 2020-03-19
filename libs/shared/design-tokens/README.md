# Shared-design-tokens

This library contains the design token definitions for the barista design
system. The concept and specification definitions can be found in the concepts
folder of the workspace.

Currently, the generated files are being checked into version control to keep
them controlable, while we are iterating over the generation algorithms.

## Running the build command

This library uses nx workspace builders to generate its output.

Run the following command to update the current design tokens.

```sh
ng build workspace && ng run shared-design-tokens:build
```

## Running the package command

```sh
ng build workspace && ng run shared-design-tokens:package
```
