# Switch

The switch component is an on/off control that can be toggled via clicking. It
behaves similarly to a checkbox, though it does not support an indeterminate
state.

<ba-live-example name="DtExampleSwitchDefault"></ba-live-example>

`<dt-switch>` is compatible with @angular/forms and supports both `FormsModule`
and `ReactiveFormsModule`.

## Imports

You have to import the `DtSwitchModule` when you want to use the `dt-switch`.

```typescript
@NgModule({
  imports: [DtSwitchModule],
})
class MyModule {}
```

## Inputs

|  Name             | Type      | Description                                                 |
| ----------------- | --------- | ----------------------------------------------------------- |
| `id`              | `string`  | Unique id of the element.                                   |
| `name`            | `string`  | Name value will be applied to the input element if present. |
| `value`           | `<T>`     | The value attribute of the native input element             |
| `checked`         | `boolean` | Whether or not the switch is checked.                       |
| `required`        | `boolean` | Whether the switch is required.                             |
| `disabled`        | `boolean` | Whether the element is disabled.                            |
| `tabIndex`        | `number`  | The elements tab index.                                     |
| `aria-label`      | `string`  | Takes precedence as the element's text alternative.         |
| `aria-labelledby` | `string`  | Is read after the element's label and field type            |
| `<ng-content>`    | `string`  | The text will be set as the label.                          |

## Outputs

|  Name    | Type                | Description                                             |
| -------- | ------------------- | ------------------------------------------------------- |
| `change` | `DtSwitchChange<T>` | Called every time the switch gets checked or unchecked. |

## Dark background

A switch can be placed on dark background.

<ba-live-example name="DtExampleSwitchDark" themedark></ba-live-example>

## Accessibility

The `<dt-switch>` uses an internal `<input type="checkbox">` to provide an
accessible experience. This internal checkbox receives focus and is
automatically labelled by the text content of the `<dt-switch>` element.

Switches without text or labels should be given a meaningful label via
`aria-label` or `aria-labelledby`.

## Switch in use

### Responsive behavior

Once the label next to the switch does not fit into one line anymore, the line
breaks.

<ba-live-example name="DtExampleSwitchResponsive"></ba-live-example>
