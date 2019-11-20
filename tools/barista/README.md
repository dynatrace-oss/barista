# Barista page builder

This tool generates all pages for the
[Barista design system](https://barista.dynatrace.com) website.

## Content source

All Markdown files (readmes, documentation) that are part of this repository
(and have a JSON-file with Barista metadata next to it), are consumed by the
components-page-builder.

All other content is fetched from a CMS hosted internally.

## Bulid & run

Use the following command to build the page builder:

```
ng build barista-components/barista-tools
```

Use the following command to run the page builder:

```
node dist/tools/barista/main.js
```

### Environment variables

- PUBLIC_BUILD (optional): whether the build should only output public pages
- STRAPI_ENDPOINT: the CMS endpoint

### Using Docker

To run the page builder from a Docker container, build the container using the
following command. Run this command in the root-folder of this repository.

```
docker build -t barista-pagebuilder . -f ./tools/barista/Dockerfile
```

Run the container using the following command:

```
docker run --rm -v `pwd`/components:/components -v `pwd`/pagebuilderdist:/apps/barista -e STRAPI_ENDPOINT=<insert-endpoint> barista-pagebuilder
```

You can find all generated pages in the `pagebuilderdist` folder.
