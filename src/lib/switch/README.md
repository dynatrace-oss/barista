---
type: 'component'
---

# Switch

`<dt-switch>` is an on/off control that can be toggled via clicking. The switch
behaves similarly to a checkbox, though it does not support an indeterminate
state.

## Imports

You have to import the `DtSwitchModule` when you want to use the `dt-switch`:

```typescript
@NgModule({
  imports: [DtSwitchModule],
})
class MyModule {}
```

## Options & Properties

|  Name                      | Type                | Description                                                 |
| -------------------------- | ------------------- | ----------------------------------------------------------- |
| `ng-content`               | `string`            | Text will be set as the label.                              |
| `@Input() checked`         | `boolean`           | Whether or not the switch is checked.                       |
| `@Input() id`              | `string`            | Unique id of the element.                                   |
| `@Input() required`        | `boolean`           | Whether the switch is required.                             |
| `@Input() disabled`        | `boolean`           | Whether the element is disabled.                            |
| `@Input() tabIndex`        | `number`            | The elements tab index.                                     |
| `@Input() name`            | `string`            | Name value will be applied to the input element if present. |
| `@Input() value`           | `<T>`               | The value attribute of the native input element             |
| `@Input() aria-label`      | `string`            | Takes precedence as the element's text alternative.         |
| `@Input() aria-labelledby` | `string`            | Is read after the element's label and field type            |
| `@Output() change`         | `DtSwitchChange<T>` | Called every time the switch gets checked or unchecked      |

## Angular forms

`<dt-switch>` is compatible with @angular/forms and supports both FormsModule
and ReactiveFormsModule.

## Accessibility

The `<dt-switch>` uses an internal `<input type="checkbox">` to provide an
accessible experience. This internal checkbox receives focus and is
automatically labelled by the text content of the `<dt-switch>` element.

Switches without text or labels should be given a meaningful label via
`aria-label` or `aria-labelledby`.

## Examples

### Default

<docs-source-example example="SwitchDefaultExample"></docs-source-example>

### Responsive

<docs-source-example example="SwitchResponsiveExample"></docs-source-example>

### Dark theme

<docs-source-example example="SwitchDarkExample" themedark="true"></docs-source-example>
