# Button

<ba-ux-snippet name="button-intro"></ba-ux-snippet>

<ba-live-example name="DtExampleButtonDefault"></ba-live-example>

## Imports

You have to import the `DtButtonModule` when you want to use the `dt-button` or
the `dt-icon-button`:

```typescript
@NgModule({
  imports: [DtButtonModule],
})
class MyModule {}
```

## Initialization

To use the button component, add one of the following attributes to the
`<button>` and `<a>` elements:

| Attribute        | Description                                     |
| ---------------- | ----------------------------------------------- |
| `dt-button`      | Regular button, with text and an optional icon. |
| `dt-icon-button` | Icon only button, no text allowed.              |

## Inputs

| Name       | Type                  | Default     | Description                                                                                                                                                                                              |
| ---------- | --------------------- | ----------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `disabled` | `boolean | undefined` | `undefined` | Whether the button is disabled.                                                                                                                                                                          |
| `color`    | `string`              | `main`      | Sets the button color. Possible options: <ul><li><code>main</code> (default)</li><li><code>warning</code></li><li><code>cta</code></li></ul>                                                             |
| `variant`  | `string`              | `primary`   | Sets the button variant. Possible options: <ul><li><code>primary</code> (default)</li><li><code>secondary</code></li><li><code>nested</code> (Only available for <code>dt-icon-button</code>.)</li></ul> |

## States

<ba-ux-snippet name="button-states"></ba-ux-snippet>

## Variants

<ba-ux-snippet name="button-variants"></ba-ux-snippet>

### Primary and secondary

<ba-live-example name="DtExampleButtonVariant"></ba-live-example>

### Primary and secondary with icon

<ba-live-example name="DtExampleButtonIcons"></ba-live-example>

### Icon only

<ba-live-example name="DtExampleButtonIconOnly"></ba-live-example>

#### Nested button

<ba-ux-snippet name="button-nested"></ba-ux-snippet>

## Colors

<ba-ux-snippet name="button-colors"></ba-ux-snippet>

## Dark theme

All button variants can also be put on a dark background. You can set a (dark)
theme on an area of the app by using the `dtTheme` directive.

<ba-live-example name="DtExampleButtonDark" themedark></ba-live-example>

## Accessibility

By using native `<button>` or `<a>` elements, accessibility is ensured per
default. Buttons or links containing only icons (`dt-icon-button`) should be
given a meaningful label via `aria-label` or `aria-labelledby`, that describes
the action that is performed when the button is clicked.

## Buttons in use

<ba-ux-snippet name="button-in-use"></ba-ux-snippet>

### Placement

<ba-ux-snippet name="button-placement"></ba-ux-snippet>

### Interaction

Use the click event binding to perform any action when the button is clicked.

<ba-live-example name="DtExampleButtonInteraction"></ba-live-example>

### Disabled state

When it's not possible to perform the action that is triggered by clicking the
button, it must be disabled.

<ba-live-example name="DtExampleButtonDisabled"></ba-live-example>

When the button is clicked and the triggered action takes some time to complete,
the button is disabled (so that it cannot be clicked again) and a loading
spinner is shown within the disabled button.

<ba-live-example name="DtExampleButtonLoadingSpinner"></ba-live-example>
