# Development

Thank you very much for trying to improve our design system! To get you up on
lightning speed with your contribution, here are some requirements that are
needed for getting started.

## TLDR;

1. install [Node.js](https://nodejs.org/en/)
2. install [Bazel](https://docs.bazel.build/versions/3.5.0/install.html)
3. start coding 🚀

## Create a local development setup

### Install Node.js

To start contributing you need [Node.js](https://nodejs.org/en/) installed on
your machine. For macOS users, we recommend doing that with
[nvm](https://github.com/nvm-sh/nvm) a node version manager. While Windows users
should go with the LTS version of Node.js.

**npm** (Node Package Manager) is shipped with Node.js.

### Install Bazel

[Bazel](https://www.bazel.build/) is a build tool for incremental and hermetic
builds. We use it to build our Monorepository. Currently, we are in a transition
from the AngularCli to Bazel so it is currently not fully migrated.

To install Bazel you can perform a global `npm install -g @bazel/bazelisk`. This
will install a version manager for bazel that downloads always the needed Bazel
version.

#### Windows

For Windows users, it is very important to follow the
[instruction](https://docs.bazel.build/versions/3.5.0/install-windows.html#installing-compilers-and-language-runtimes)
on the official website to install additional compilers and runtimes.

##### You need additionally to perform those steps

- Install
  [MSYS2](http://repo.msys2.org/distrib/x86_64/msys2-x86_64-20200629.exe)
- Run the MSYS2 prompt, update its package manager and install these packages:

  ```bash
  pacman -Syu

  # You might need to restart the terminal at this point
  pacman -S zip unzip patch diffutils git
  ```

- Add `C:\msys64\usr\bin` (or your custom installation path) to your `PATH`. Pay
  attention that this might overlap with other shells you have!

- Install
  [Visual Studio Build C++ tools](https://visualstudio.microsoft.com/de/thank-you-downloading-visual-studio/?sku=BuildTools)

Furthermore you have to add a `.bazelrc.user` file where the following option
must be specified, to avoid the
[Maximum Path Length Limitation](https://docs.bazel.build/versions/3.5.0/windows.html#avoid-long-path-issues)
on Windows.

```
startup --output_user_root=C:/tmp
```

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

### Adding new examples

To add a new example for an existing or new component, a particular schematic
must be executed for generating the boilerplate code and registering the example
components:

```
ng build workspace
ng g ./dist/libs/workspace:dt-example --name={example-name} --component={component}
```

More information about shipped schematics can be found
[here](./libs/workspace/src/schematics/dt-component-example/README.md).
