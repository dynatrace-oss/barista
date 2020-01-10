# Checkbox

The `<dt-checkbox>` provides the same functionality as a native checkbox
enhanced with styling and animations. You can set the label as the `ng-content`
of the `<dt-checkbox>` component.

<ba-live-example name="DtExampleCheckboxDefault"></ba-live-example>

The `<dt-checkbox>` is compatible with @angular/forms and supports both
`FormsModule` and `ReactiveFormsModule`.

## Imports

You have to import the `DtCheckboxModule` when you want to use the
`dt-checkbox`.

```typescript
@NgModule({
  imports: [DtCheckboxModule],
})
class MyModule {}
```

## Inputs

| Name              | Type      | Description                                                             |
| ----------------- | --------- | ----------------------------------------------------------------------- |
| `id`              | `string`  | Unique id of the element.                                               |
| `name`            | `string`  | The element's name.                                                     |
| `value`           | `<T>`     | The value attribute of the native input element.                        |
| `checked`         | `boolean` | Whether or not the checkbox is checked.                                 |
| `required`        | `boolean` | Whether the checkbox is required.                                       |
| `disabled`        | `boolean` | Whether the element is disabled.                                        |
| `indeterminate`   | `boolean` | Whether the element is in indeterminate state also known as mixed mode. |
| `tabIndex`        | `number`  | The element's tab index.                                                |
| `aria-label`      | `string`  | Takes precedence as the element's text alternative.                     |
| `aria-labelledby` | `string`  | Is read after the element's label and field type.                       |
| `<ng-content>`    | `string`  | The text will be set as the label.                                      |

## Outputs

| Name     | Type                  | Description                                              |
| -------- | --------------------- | -------------------------------------------------------- |
| `change` | `DtCheckboxChange<T>` | Called everytime the checkbox gets checked or unchecked. |

## Methods

| Name       | Description                                                                  | Return value |
| ---------- | ---------------------------------------------------------------------------- | ------------ |
| `focus()`  | Focuses the checkbox.                                                        | `void`       |
| `toggle()` | Toggles the checkbox's state between checked and unchecked programmatically. | `void`       |

## Dark background

A checkbox can be placed on dark background.

<ba-live-example name="DtExampleCheckboxDark" themedark></ba-live-example>

## Accessibility

The `<dt-checkbox>` uses an internal `<input type="checkbox">` to provide an
accessible experience. This internal checkbox receives focus and is
automatically labelled by the text content of the `<dt-checkbox>` element.

Checkboxes without text or labels should be given a meaningful label via
`aria-label` or `aria-labelledby`.

## Checkbox in use

When checkboxes are placed below each other, the distance between two checkbox
components must be `20px`.

### Indeterminate state

The `<dt-checkbox>` supports an indeterminate state, similar to the native
`<input type="checkbox">`. While the indeterminate property of the checkbox is
true, it will render as indeterminate regardless of the checked value. Any
interaction with the checkbox by a user (i.e., clicking) will remove the
indeterminate state.

<ba-live-example name="DtExampleCheckboxIndeterminate"></ba-live-example>

### Responsive behavior

Once the label next to the checkbox does not fit into one line anymore, the line
breaks.

<ba-live-example name="DtExampleCheckboxResponsive"></ba-live-example>
