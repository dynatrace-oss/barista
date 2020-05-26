# Design tokens dependency graph

This builder lets you generate a depedency graph for the design tokens in json
and dot file format. To run the dependency graph generation you will first need
to build the workspace (this should have happend automatically after an
`npm install`) but you can make sure that it is at its latest state by running
`ng build workspace`.

To generate the json and dot files afterwards, you can run the builder with
`ng run shared-design-tokens:dependency-tree`. This should generate the output
files in `dist/libs/shared/design-tokens/design-tokens-dependency-graph/`.

To visualize the dot file, you will need an external dependency from graphViz
for your system from https://www.graphviz.org/download/. When you installed
graphVIz, you should be able to run a command like this, to generate a
rasterized image of the dependency-graph.
`dot -Tsvg -odependencytree.svg dist/libs/shared/design-tokens-dependency-graph/dependencytree.dot`
