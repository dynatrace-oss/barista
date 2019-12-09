# Development

## Prerequisites

1. Node.js 12+
2. npm (which should be installed together with Node.js)

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
  - barista: the Barista design system
  - demos: The preview app that includes all examples that get compiled and
    bundled for the Barista design system
  - components-e2e: testapp to run UI/e2e tests
  - dev: local development app to test components
  - universal: app to verify that the components can be used in a serverside
    rendered context
- **components**: the Barista components library source code
- **documentation**: additional documentation files
- **libs**: general libraries, e.g. testing library
- **tools**: everything tooling-related like linting, releasing, schematics,
  etc.

## Developing

Use the dev app (located in `apps/dev`) for development of Barista components.
Start it using one of the following commands

```
npm run dev
```

## Tests and stylelint

Run unit tests for the parts that are affected by your changes

```
npm run test
```

Unit tests with watcher for local testing

```
ng test --watch
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
