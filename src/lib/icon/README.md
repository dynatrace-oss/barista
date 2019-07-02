---
type: "component"
---

# Icon

`<dt-icon>` provides an easy way to use SVG (not font or bitmap) icons in your app.
It does so by directly inlining the SVG content into the page as a child of the component (rather than using a tag or a div background image).
This makes it easier to apply CSS styles to SVG icons.

<docs-source-example example="IconDefaultExample"></docs-source-example>

## Imports

You have to import the `DtIconModule` in your `AppModule`.
**Note:** It needs a bit of configuration to work. Read more in the [configuration section below](#configuration).

```typescript

@NgModule({
  imports: [
    DtIconModule.forRoot({ svgIconLocation: `/path/to/your/icons/{{name}}.svg` })
  ],
})
class MyModule {}

```

## Options & Properties

| Name | Type | Default | Description |
| --- | --- | --- | --- |
| `name` | `string` | `-` | The name of the icon. 

## Configuration

DtIcons uses a service called `DtIconRegistry` under the hood.
This service loades, parses and stores the icons you want to use in your template.
To work properly `DtIconRegistry` needs a bit of configuration.
To provide this configuration please use the static `forRoot` method on the module class in your AppModule imports.
Just pass in the configuration object to the `forRoot` method:

```typescript

@NgModule({
  imports: [
    DtIconModule.forRoot({ svgIconLocation: `/path/to/your/icons/{{name}}.svg` })
  ],
})
class MyModule {}

```

**Configuration options**
| Name | Type | Example | Description |
| --- | --- | --- | --- |
| `svgIconLocation` | `string` | `/assets/icons/{{name}}.svg` | Location where the icons will be loaded. Use the `{{name}}` placeholder for the icon name. |

If you don't want to use the `forRoot` method, you can also provide the configuration via the `DT_ICON_CONFIGURATION` injection token in the DI.

## Dt-Iconpack

All Dynatrace icons are shipped with the `@dynatrace/dt-iconpack` npm package. This npm package is a peerDependency for the angular-components. And can be installed using the command:

```bash

// yarn
yarn add @dynatrace/dt-iconpack
// npm
npm install @dynatrace/dt-iconpack

```

After installation you can import the `dt-iconpack` in your typescript files if you need to set a type for a property or want to use the enumeration

```typescript

  import { DtIconType, Icons } from '@dynatrace/dt-iconpack';

```

**Exports**

| Name | Description |
| --- | --- |
| `DtIconType` | `Typescript Type with all icon names as possible values` |
| `Icons` | `Enumeration with all icon names` |

## Accessibility

Similar to an `<img>` element, an icon alone does not convey any useful information for a screen-reader user.
The user of `<dt-icon>` must provide additional information on to how the icon is used.
Based on this, `<dt-icon>` is marked as `aria-hidden="true"` by default, but this can be overriden by adding `aria-hidden="false"` to the element.

## All Icons

Below you can see all icons that are currently shipped within the `@dynatrace/dt-iconpack` package. You can use these names as the name property for the dt-icon component

<docs-source-example example="IconAllExample" fullwidth="true"></docs-source-example>
