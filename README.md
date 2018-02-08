# Angular components library

Angular module containing common, reusable UI components and helpers.

## Usage

Install library using NPM
```
npm install @dynatrace/angular-components
```

## Development

### Building
1. Install NPM dependencies
   ```
   npm install
   ```
1. Build dev version of the library
   ```
   npm run dev-build
   ```
   Alternatively, run the build in watch mode, so every change made will be automatically built.
   ```
   npm run watch
   ```

### Running unit tests and style lint

Unit tests:
```
npm run test
```

Code style check:
```
npm run lint
```

### Using local version for development

1. Build development version
1. Create a NPM link
   1. In the library directory:
      ```
      sudo npm link
      ```
   1. In the other project directory:
      ```
      npm link @dynatrace/angular-components
      ```
1. Any further build will be automatically updated in the project referencing the link.

To unlink development version:
```
npm unlink @dynatrace/angular-components
npm install
```

### Using CI branch version for development

Each push to git repository triggers a CI build which publishes a development version to Artifactory. 
To use it just install it as dependency:
```
npm install @dynatrace/angular-components@<version>
``` 
`<version>` can be retrieved from Jenkins build number (e.g. `0.0.1-feature-mybranch.20180218141635`)

### Using Gradle build

Gradle build is meant for CI servers and does not require NodeJS installed upfront. 
Instead, it downloads NodeJS binaries locally from Arifactory and runs any npm task with that node version.

Gradle tasks look very similar to the NPM ones, e.g.:
```
./gradlew npmInstall
./gradlew test
./gradlew lint
./gradlew devBuild
./gradlew watch
``` 
To see complete list of gradlew builds, run:
```
./gradlew tasks
```