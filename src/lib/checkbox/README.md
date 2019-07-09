---
type: 'component'
---

# Checkbox

The `<dt-checkbox>` provides the same functionality as a native checkbox enhanced with styling and animations. You can set the label as the `ng-content` of the `<dt-checkbox>` component.

## Imports

You have to import the `DtCheckboxModule` when you want to use the `dt-checkbox`:

```typescript
@NgModule({
  imports: [DtCheckboxModule],
})
class MyModule {}
```

## Inputs

| Name              | Type      | Description                                                             |
| ----------------- | --------- | ----------------------------------------------------------------------- |
| `checked`         | `boolean` | Whether or not the checkbox is checked.                                 |
| `id`              | `string`  | Unique id of the element.                                               |
| `required`        | `boolean` | Whether the checkbox is required.                                       |
| `indeterminate`   | `boolean` | Whether the element is in indeterminate state also known as mixed mode. |
| `disabled`        | `boolean` | Whether the element is disabled.                                        |
| `tabIndex`        | `number`  | The elements tab index.                                                 |
| `name`            | `string`  | The elements tab index.                                                 |
| `value`           | `<T>`     | The value attribute of the native input element.                        |
| `aria-label`      | `string`  | Takes precedence as the element's text alternative.                     |
| `aria-labelledby` | `string`  | Is read after the element's label and field type.                       |

## Outputs

| Name     | Type                  | Description                                              |
| -------- | --------------------- | -------------------------------------------------------- |
| `change` | `DtCheckboxChange<T>` | Called everytime the checkbox gets checked or unchecked. |

## Methods

| Name       | Description                                                                  | Return value |
| ---------- | ---------------------------------------------------------------------------- | ------------ |
| `focus()`  | Focuses the checkbox.                                                        | `void`       |
| `toggle()` | Toggles the checkbox's state between checked and unchecked programmatically. | `void`       |

## Indeterminate state

`<dt-checkbox>` supports an indeterminate state, similar to the native `<input type="checkbox">`.
While the indeterminate property of the checkbox is true, it will render as indeterminate regardless of the checked value.
Any interaction with the checkbox by a user (i.e., clicking) will remove the indeterminate state.

<docs-source-example example="CheckboxIndeterminateExample"></docs-source-example>

The `<dt-checkbox>` is compatible with @angular/forms and supports both FormsModule and ReactiveFormsModule.

## Accessibility

The `<dt-checkbox>` uses an internal `<input type="checkbox">` to provide an accessible experience.
This internal checkbox receives focus and is automatically labelled by the text content of the `<dt-checkbox>` element.

Checkboxes without text or labels should be given a meaningful label via `aria-label` or `aria-labelledby`.

## Examples

### Default

<docs-source-example example="CheckboxDefaultExample"></docs-source-example>

### Responsive

<docs-source-example example="CheckboxResponsiveExample"></docs-source-example>

### Dark theme

<docs-source-example example="CheckboxDarkExample" themedark="true"></docs-source-example>
