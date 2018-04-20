# Angular components library

Angular module containing common, reusable UI components and helpers.

## Usage

Install library using yarn
```
yarn install @dynatrace/angular-components
```
Or if you are using npm
```
npm install @dynatrace/angular-components
```

## Documentation

Documentation is available by starting a local server at <http://localhost:4300>

##### Using NPM
   1. Meet NodeJS prerequisites (see `Development -> Prerequisites` section)
   1. Install dependencies - `yarn install`
   1. Start documentation server - `yarn start` 

##### Using gradle
   1. Install JDK
   1. Run gradle task - `./gradlew startDocs`

## Development

### Prerequisites

1. NodeJS 7.10.0+
1. Yarn
   ```
   npm install -g yarn
   ```
Alternatively, you can use gradle (see instructions below), which automatically sets up local NodeJS environment,
but on the other hand, requires JVM. 

### Building
1. Install NPM dependencies
   ```
   yarn install
   ```
1. Building the library
   ```
   yarn build
   ```

### Developing
Developing with the docs app
```
yarn docs
```

### Running tests and style lint

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
yarn ui-tests
```

Universal build
```
yarn universal
```

Stylelint
```
yarn lint
```

### Using local version for development

1. Build development version
1. Create an NPM link
   1. In the library output directory `dist/lib`:
      ```
      yarn link
      ```
   1. In the other project directory:
      ```
      yarn link @dynatrace/angular-components
      ```
1. Any further build will be automatically updated in the project referencing the link.

To unlink development version:
```
yarn unlink @dynatrace/angular-components
yarn install
```

### Using CI branch version for development

Each push to git repository triggers a CI build which publishes a development version to Artifactory. 
To use it just install it as a dependency:
```
yarn install @dynatrace/angular-components@<version>
``` 
`<version>` can be retrieved from Jenkins build number (e.g. `1.5.0-feature-mybranch.20180218141635`)

### Using Gradle build

Gradle build is meant for CI servers and does not require NodeJS installed upfront. 
Instead, it downloads NodeJS binaries locally from Arifactory and runs any yarn task with that node version.

Gradle tasks look very similar to the NPM ones, e.g.:
```
./gradlew yarn_install
./gradlew test
./gradlew lint
./gradlew devBuild
./gradlew watch
``` 
To see complete list of gradlew builds, run:
```
./gradlew tasks
```

### Versioning

#### Git repository version

Version in package.json is hardcoded to match x.x.0-dev pattern. 
Specific patch versions are bumped by CI but not commited to the repository.

#### Branch versions

Versions built by the CI from branches have the last suffix set by the following rule:

`x.x.0-<branch-name>.<date-and-time>`

e.g. 

`1.5.0-feature-mybranch.20180218141635`

They are published to NPM repository and installable as normal. 
Athough, wildcard semver syntax will not match them (i.e. `^0.5.0` will match `0.5.1` but not `0.5.0-branch.20180218141635`).

#### Master branch versions

Each CI build from master branch bumps patch version (e.g. `0.1.4 -> 0.1.5`)

#### Incrementing major/minor version

Major and minor versions have to be incremented manually. 
To do it, open `package.json` and bump major/minor number.
Remember to leave patch and suffix section unchanged (e.g. `1.5.0-dev -> 1.6.0-dev`, `1.6.0-dev -> 2.0.0-dev`)
