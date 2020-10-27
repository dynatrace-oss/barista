# Barista page builder

This tool generates all pages for the
[Barista design system](https://barista.dynatrace.com) website.

## Content source

All Markdown files (readmes, documentation) that are part of this repository
(and have a JSON-file with Barista metadata next to it), are consumed by the
components-page-builder.

All other content is fetched from a CMS hosted internally.

## Build & run

First, create a `.env` file in the project root with the following contents:

```
STRAPI_ENDPOINT="[URL to Strapi...]"
PUBLIC_BUILD=[true|false]
```

Now use the following command to run the page builder:

```
bazel build //libs/tools/barista
```

### Environment variables

- `PUBLIC_BUILD` (optional): whether the build should only output public pages;
  must be explicitly set to `false` to build the internal Barista version
- `STRAPI_ENDPOINT`: the CMS endpoint
- `INTERNAL_LINKS`: (parts of) internal links that should be removed from the
  content on public build; separated by `,` (is transformed to the following
  selector or a list of selectors: `a[href*="<internal-link>"]`)

### Configurable directories (optional)

The environment config files located in `tools/environments` are used to
configure input/output directories of the page builder.

### Using Docker

To run the page builder from a Docker container, build the container using the
following command. Run this command in the root-folder of this repository.

```
docker build -t barista-pagebuilder . -f ./libs/tools/barista/Dockerfile
```

Run the container using the following command:

```
docker run --rm -v `pwd`/components:/components -v `pwd`/pagebuilderdist:/apps/barista -e STRAPI_ENDPOINT=<insert-endpoint> -e INTERNAL_LINKS=<insert-links> barista-pagebuilder
```

You can find all generated pages in the `pagebuilderdist` folder.
