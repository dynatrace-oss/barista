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

or

```
ng serve dev-app
```

## Tests and stylelint

Unit tests

```
npm run test
```

Unit tests with watcher for local testing

```
npm run test:watch
```

UI Tests

```
npm run ui-test
```

Universal build

```
npm run universal
```

Stylelint

```
npm run lint
```

## Barista examples app

To run the Barista examples app with all examples that will be used inside the
Barista design system run

```
npm run demos
```

which generates all examples and starts the demos app.

## Custom TSLint rules

Run the following command to build the custom TSLint rules

```
npm run tslint:build
```

To test the rules run

```
npm run tslint:test
```

### Using Gradle build

Gradle build is meant for CI servers and does not require NodeJS installed
upfront. Instead, it downloads NodeJS binaries locally from Arifactory and runs
any yarn task with that node version.

Gradle tasks look very similar to the NPM ones, e.g.:

```
./gradlew yarn_install
./gradlew test
./gradlew lint
./gradlew compile
```

To see complete list of gradlew builds, run:

```
./gradlew tasks
```
