# Development

Thank you very much for trying to improve our design system! To get you up on
lightning speed with your contribution, here are some requirements that are
needed for getting started.

## TLDR;

1. install [Node.js](https://nodejs.org/en/)
1. start coding 🚀

## Create a local development setup

### Install Node.js

To start contributing you need [Node.js](https://nodejs.org/en/) installed on
your machine. For macOS users, we recommend doing that with
[nvm](https://github.com/nvm-sh/nvm) a node version manager. While Windows users
should go with the LTS version of Node.js.

**npm** (Node Package Manager) is shipped with Node.js.

### Building

1. Install npm dependencies
   ```
   npm install
   ```
2. Build the Barista components library
   ```
   npm run build
   ```

## Repository structure

The Barista repository has the following structure:

- **apps**:
  - **barista-design-system**: the Barista design system.
  - **components-e2e**: test app to run UI/e2e tests.
  - **demos**: The preview app that includes all examples that get compiled and
    bundled for the Barista design system.
  - **dev**: local development app to test components.
  - **fluid-dev**: local development app to test web-components.
  - **universal**: an app to verify that the components can be used in a
    serverside rendered context.
- **concepts**: describes some of the underlying concepts which are applied or
  will be applied in our Barista design system.
- **documentation**: additional documentation files.
- **libs**:
  - **barista-components**: the Barista components library source code. There's
    a separate library for each component.
  - **examples**: contains all examples of components which are used by the demo
    and the Barista design system app.
  - **fluid-elements**: The new web components.
  - **shared**: various shared libraries.
  - **testing**: helpers for writing tests.
  - **tools**: tooling- and ecosystem-related code like linting, releasing, etc.
  - **workspace**: builders, schematics and scripts needed to build libraries,
    create them and run them in our CI environment.
- **tools**: more tooling- and ecosystem-related code for GitHub actions, style
  linting, etc.

## Developing

Use the dev app (located in `apps/dev`) for development of Barista components.
Start it using one of the following commands

```
npm run dev
```

## Tests and stylelint

Preferrably, let the CI run all of the checks for consistency. If you really
need to run these locally make sure if it needs to be run with nx by
investigating the library package.

Run unit tests for the parts that are affected by your changes

```
# Runs affected test files:
npm run test
```

Unit tests with watcher for local testing

```
npm run nx run alert:test -- --watch
```

UI Tests

```
npm run e2e
```

Universal build

```
npm run universal
```

Lint

```
npm run lint
```

A11y

```
nx run demos:a11y
```

## Barista examples app & Barista

To run the Barista examples app with all examples that will be used inside the
Barista design system run

```
npm run demos
```

which generates all examples and starts the demos app.

If you want to run the design system itself including the demos embedded use

```
npm run barista
```

### Adding new examples

To add a new example for a new or existing component, the
[dt-component-example schematic](https://github.com/dynatrace-oss/barista/tree/master/tools/generators/dt-component-example)
must be executed to generate the boilerplate code and register the example
component:

```
nx workspace-schematic dt-component-example {name of your example} {name of your component}
```

You can also run this schematic from the Nx console.

More information about shipped schematics can be found
[here](https://github.com/dynatrace-oss/barista/tree/master/tools/generators).
