# Development

## Prerequisites

1. NodeJS 7.10.0+
2. Yarn
   ```
   npm install -g yarn
   ```

##### Using Yarn

1. Meet NodeJS prerequisites
2. Install dependencies - `yarn install`
3. Start dev app - `yarn dev`

### Building

1. Install NPM dependencies
   ```
   yarn install
   ```
2. Building the library
   ```
   yarn build
   ```

## Structure

The angular components library has the following structure:

- barista-examples: The preview app that includes all examples that get compiled
  and bundled for the Barista design system.
- dev-app: local development app to test components
- lib: The library's source code
- linting: Contains custom TSLint rules to support usage of components within
  templates.
- schematics: Includes schematics to speed up creation of new
  components/examples
- testing: Contains util classes/methods for testing
- ui-test-app: A testapp used to run ui-tests
- universal-app A testapp to verify that the components can be used in a
  serverside rendered context

## Developing

Developing with the dev-app

```
yarn dev
```

Developing examples for Barista

```
yarn barista-examples
```

## Running tests and style lint

Unit tests:

```
yarn test
```

Unit tests with watcher for local testing:

```
yarn test:watch
```

UI Tests

```
yarn ui-test
```

Universal build

```
yarn universal
```

Stylelint

```
yarn lint
```

## Running the Barista examples app

To run the Barista examples app with all examples that will be used inside the
Barista design system run

```
yarn barista-examples
```

When creating new examples or modifying existing ones, make sure that the
example code passes our custom TSLint rules by running

```
gulp tslint:barista-examples
```

## Custom TSLint rules

Run the following command to build the custom TSLint rules

```
yarn tslint:build
```

To test the rules run

```
yarn tslint:test
```

## Using local version for development

1. Build development version
2. Create an NPM link
   1. In the library output directory `dist/lib`:
      ```
      yarn link
      ```
   2. In the other project directory:
      ```
      yarn link @dynatrace/angular-components
      ```
3. Any further build will be automatically updated in the project referencing
   the link.

To unlink development version:

```
yarn unlink @dynatrace/angular-components
yarn install
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
