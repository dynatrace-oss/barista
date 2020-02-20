# Get started

To get started with Barista components you can either use our
[ng-add schematic](#installation-using-ng-add) or install the library
[manually](#manual-installation).

## Installation using ng-add

To install the Barista components use our ng-add schematic with:

<pre><code>ng add @dynatrace/barista-components</pre></code>

This will guide you through our installation process and will ask you some
questions.

1. The path to the NgModule where the imports will be registered.
2. If the Browser Animation Module should be enabled.
3. If you want our typography styles or only the base styles for the components.
4. If you want to install all our peer dependencies.

After everything is installed and set up you can start by importing the needed
module for each component you want to use:

```typescript
import { DtButtonModule } from '@dynatrace/barista-components/button';

@NgModule({
  ...
  imports: [DtButtonModule],
  ...
})
export class PizzaPartyAppModule { }
```

Alternatively, you can create a separate NgModule that imports all of the
Barista components that you will use in your application. You can then include
this module wherever you'd like to use the components.

**Note:** Whichever approach you use, be sure to import the Barista components
modules after Angular's BrowserModule, as the import order matters for
NgModules.

## Manual installation

You can also install the Barista components library manually. Follow these steps
to get everything up and running.

### Step 1: Install the barista-components and Angular CDK

Install the Barista components library via npm or yarn:

`npm install --save @dynatrace/barista-{components,icons,fonts} @angular/cdk d3-scale@^3.0.0 d3-shape@^1.3.5 highcharts@6`

`npm install --save-dev @types/highcharts`

or

`yarn add @dynatrace/barista-{components,icons,fonts} @angular/cdk d3-scale@^3.0.0 d3-shape@^1.3.5 highcharts@6`

`yarn add @types/highcharts --dev`

### Step 2: Animations

Some Barista components depend on the Angular animations module. If you want
these animations to work in your app, you have to install the
`@angular/animations` module and include the `BrowserAnimationsModule` in your
app.

`npm install --save @angular/animations`  
or  
`yarn add @angular/animations`

```typescript
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

@NgModule({
  ...
  imports: [BrowserAnimationsModule],
  ...
})
export class AppModule { }
```

If you don't want to add another dependency to your project, you can use the
NoopAnimationsModule.

```typescript
import { NoopAnimationsModule } from '@angular/platform-browser/animations';

@NgModule({
  ...
  imports: [NoopAnimationsModule],
  ...
})
export class AppModule { }
```

**Note:** @angular/animations uses the WebAnimation API that isn't supported by
all browsers yet. If you want to support animations in these browsers, you'll
have to
[include a polyfill](https://github.com/web-animations/web-animations-js).

### Step 3: Import the component modules

Import the NgModule for each component you want to use:

```typescript
import { DtButtonModule } from '@dynatrace/barista-components/button';
import { DtSelectModule } from '@dynatrace/barista-components/select';

@NgModule({
  ...
  imports: [DtButtonModule, DtSelectModule],
  ...
})
export class PizzaPartyAppModule { }
```

Alternatively, you can create a separate NgModule that imports all of the
Barista components that you will use in your application. You can then include
this module wherever you'd like to use the components.

**Note:** Whichever approach you use, be sure to import the barista-components
modules after Angular's BrowserModule, as the import order matters for
NgModules.

### Step 4: Include the styles

The Barista components library ships with two different variants for including
styles. You can either import the core styles that are **required** to use the
barista-components. These core styles are just the bare minimum for the
component and do not change the global styling of your app.

Add the following line to your project's architect options in the angular.json
file to include core styles:

```json
  "styles": ["node_modules/@dynatrace/barista-components/style/main.scss"],
```

You can also import the second variant, which also includes general styling for
headlines, text-formatting, etc. by including the following line:

```json
  "styles": ["node_modules/@dynatrace/barista-components/style/index.scss"],
```

### Step 5: Optional - add fonts and icon files to your assets

Add this section to the `assets` array in your projects architect in the
angular.json. This will copy all svgs from the iconpack and all fonts shipped
with the barista-components library to your dist package and will make Angular
aware of the file dependencies.

```json
...
{
  "glob": "metadata.json",
  "input": "node_modules/@dynatrace/barista-icons",
  "output": "/assets/icons",
},
{
  "glob": "*.svg",
  "input": "node_modules/@dynatrace/barista-icons",
  "output": "/assets/icons"
},
{
  "glob": "**/*",
  "input": "node_modules/@dynatrace/barista-fonts/fonts",
  "output": "/fonts"
},
...
```

To provide the icon-configuration to the application, you will need to add this
to the your app module.

```typescript
@NgModule({
  declarations: [...],
  imports: [
    ...
    DtIconMoudle.forRoot({ svgIconLocation: `/assets/icons/{{name}}.svg` }),
  ],
  bootstrap: [...],
})
export class AppModule {}
```
