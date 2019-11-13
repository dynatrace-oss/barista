---
title: 'Get started'
description:
  'This guide provides an overview how to get started with the Barista
  components library.'
order: 1
public: false
tags:
  - 'guideline'
  - 'how to'
  - 'tutorial'
  - 'getting started'
  - 'install'
---

# Get started

## Step 1: Install the barista-components and Angular CDK

Install the Barista components library via npm or yarn:

`npm install --save @dynatrace/barista-components @angular/cdk highcharts@6 @types/highcharts @dynatrace/dt-iconpack`  
or  
`yarn add @dynatrace/barista-components @angular/cdk highcharts@6 @types/highcharts @dynatrace/dt-iconpack`

## Step 2: Animations

Some Barista components depend on the Angular animations module. If
you want these animations to work in your app, you have to install the
`@angular/animations` module and include the `BrowserAnimationsModule` in your
app.

`npm install --save @angular/animations`  
or  
`yarn add @angular/animations`

```typescript
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';

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
import {NoopAnimationsModule} from '@dynatrace/barista-components';

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

## Step 3: Import the component modules

Import the NgModule for each component you want to use:

```typescript
import {DtButtonModule, DtSelectModule} from '@dynatrace/barista-components';

@NgModule({
  ...
  imports: [DtButtonModule, DtSelectModule],
  ...
})
export class PizzaPartyAppModule { }
```

Alternatively, you can create a separate NgModule that imports all of the
Barista components that you will use in your application. You can
then include this module wherever you'd like to use the components.

**Note:** Whichever approach you use, be sure to import the barista-components
modules after Angular's BrowserModule, as the import order matters for
NgModules.

## Step 4: Include the styles

The Barista components library ships with two different variants for including styles. You can
either import the core styles that are **required** to use the
barista-components. These core styles are just the bare minimum for the
component and do not change the global styling of your app.

```scss
@import '~@dynatrace/barista-components/style/main';
```

You can also import the second variant, which include in addition to the core
style also general styling for headlines, text-formatting, ...

```scss
@import '~@dynatrace/barista-components/style/index';
```

## Step 5: Optional - add fonts and icon files to your assets

Add this section to the `assets` array in your projects architect in the
angular.json. This will copy all svgs from the iconpack and all fonts shipped
with the barista-components library to your dist package and will make Angular
aware of the file dependencies.

```json
...
{
  "glob": "*.svg",
  "input": "node_modules/@dynatrace/dt-iconpack",
  "output": "/assets/icons"
},
{
  "glob": "**/*",
  "input": "node_modules/@dynatrace/barista-components/assets/fonts",
  "output": "/assets/fonts"
},
...
```

To provide the configuration to the application, you will need to add this to
the providers of your app module.

```typescript
providers: [
  {
    provide: DT_ICON_CONFIGURATION,
    useValue: { svgIconLocation: `/assets/icons/{{name}}.svg` },
  },
],
```
