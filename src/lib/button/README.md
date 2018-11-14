# Button

<docs-source-example example="DefaultButtonExampleComponent"></docs-source-example>

This Angular button enhances native `<button>` and `<a>` elements with Dynatrace styling.
Make sure to always use `<button>` or `<a>` tags to provide the accessible experience for the user.
A `<button>` element should be used whenever some action is performed.
An `<a>` element should be used whenever the user will navigate to another view.

## Imports

You have to import the `DtButtonModule` when you want to use the `dt-button`:

```typescript

@NgModule({
  imports: [
    DtButtonModule,
  ],
})
class MyModule {}

```

## Initialization

To apply the dynatrace button, add one of the following attributes to the `<button>` and `<a>` elements:

| Attribute         | Description                                     |
| ----------------- | ----------------------------------------------- |
| `dt-button`       | Regular button, with text and an optional icon  |
| `dt-icon-button`  | Icon only button, no text allowed               |

## Options & Properties

| Name | Type | Default | Description |
| --- | --- | --- | --- |
| `disabled` | `boolean | undefined` | `undefined` | Sets disable state if property is set and the value is truthy or undefined |
| `color` | `string | undefined` | `main` | Sets color. Possible options: <ul><li><code>main</code> (default)</li><li><code>warning</code></li><li><code>cta</code></li></ul> |
| `variant` | `string | undefined` | `primary` | Sets variant. Possible options: <ul><li><code>primary</code> (default)</li><li><code>secondary</code></li><li><code>nested</code> Only available for <code>dt-icon-button</code></li></ul> |

## Theming

The button styling depends on the theme the component is in. You can set a theme on an area of the app by using the `dtTheme` directive.

*Example:*

```html

<div dtTheme="purple:dark">
  <button dt-button>My themed button</button>
</div>

```

**NOTE:**
Right now only setting the light or dark mode is available.
Full theming functionality will be added in a later stage.

## Accessibility

By using native `<button>` or `<a>` elements accessibility is ensured per default.
Buttons or links containing only icons (`dt-icon-button`) should be given a meaningful label via `aria-label` or `aria-labelledby`.

## Examples

### Interaction

<docs-source-example example="InteractionButtonExampleComponent"></docs-source-example>

### Variants

<docs-source-example example="VariantButtonExampleComponent"></docs-source-example>

### Colors

<docs-source-example example="ColorButtonExampleComponent"></docs-source-example>

### With Icons

<docs-source-example example="IconsButtonExampleComponent" fullwidth="true"></docs-source-example>

### With loading spinner

The loading spinner button can only be used within a disabled button.

<docs-source-example example="LoadingSpinnerButtonExampleComponent"></docs-source-example>

### Icon only

<docs-source-example example="IconOnlyButtonExampleComponent"></docs-source-example>

### Disabled example

<docs-source-example example="DisabledButtonExampleComponent" fullwidth="true"></docs-source-example>

### Dark

<docs-source-example example="DarkButtonExampleComponent" themedark="true" fullwidth="true"></docs-source-example>
