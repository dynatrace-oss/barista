# Button

The button component enhances the native `<button>` and `<a>` elements. A button
holds text, an icon or a combination of both. When using an icon only, it needs
to be self-explanatory and must have an `aria-label` that describes what happens
when it is clicked.

<ba-live-example name="DtExampleButtonDefault"></ba-live-example>

While a `<button>` element should be used whenever some action is performed,
`<a>` elements should be used when the user will navigate to another view. The
button width is based on the text it holds. While being as short as possible,
the text should clearly describe a button's action.

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

The button has a default, hover, active, focus and
[disabled state](/components/button#disabled-state).

## Variants

Compared to the secondary button, the primary button is more dominant and will
attract the users attention with ease. This can be used to guide the user and
help him perform the right actions. The secondary button is used for secondary
actions.

### Primary and secondary

<ba-live-example name="DtExampleButtonVariant"></ba-live-example>

### Primary and secondary with icon

<ba-live-example name="DtExampleButtonIcons"></ba-live-example>

### Icon only

<ba-live-example name="DtExampleButtonIconOnly"></ba-live-example>

#### Nested button

Nested buttons are a variant of icon only buttons and can't be used with text.
These buttons are only used within other components (e.g.
[input fields](/components/input), [tables](/components/table),...)

## Colors

The button component is colored differently in the context of:

- **primary:** Default button, see above.
- **a warning:** Use this kind of button where a user action is needed to get
  something back up and running. E.g. restart processes, update agent,...
- **a call to action:** Use this kind of button to encourage users to buy our
  product. E.g. install an agent, install security gateway, upgrade web
  check,...

<ba-live-example name="DtExampleButtonColor"></ba-live-example>

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

Buttons are used in a variety of contexts, e.g. as secondary or nested buttons
within [tables](/components/table), in
[context menus](/components/context-dialog), or as part of the
[copy to clipboard](/components/copy-to-clipboard) component.

### Placement

A button's margin is always `8px`. Make sure there is a gap of `8px` when
buttons are placed next to or below each other.

It depends on the use case if a button is left- or right-aligned. Have a look at
our [button alignment pattern](/patterns/button-alignment/) for details.

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
