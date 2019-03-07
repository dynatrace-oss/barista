---
type: "component"
---

# Checkbox

<docs-source-example example="DefaultCheckboxExampleComponent"></docs-source-example>

`<dt-checkbox>` provides the same functionality as a native enhanced with styling and animations.

## Imports

You have to import the `DtCheckboxModule` when you want to use the `dt-checkbox`:

```typescript
@NgModule({
  imports: [
    DtCheckboxModule,
  ],
})
class MyModule {}
```

## Options & Properties

| Name | Type | Description |
| --- | --- | --- |
| `ng-content` | `string` | Text will be set as the label. |
| `@Input() checked` | `boolean` | Whether or not the checkbox is checked. |
| `@Input() id` | `string` | Unique id of the element. |
| `@Input() required` | `boolean` | Whether the checkbox is required. |
| `@Input() indeterminate` | `boolean` | Whether the element is in indeterminate state also known as mixed mode. |
| `@Input() disabled` | `boolean` | Whether the element is disabled. |
| `@Input() tabIndex` | `number` | The elements tab index. |
| `@Input() name` | `string` | The elements tab index. |
| `@Input() value` | `<T>` | The value attribute of the native input element |
| `@Input() aria-label` | `string` | Takes precedence as the element's text alternative. |
| `@Input() aria-labelledby` | `string` | Is read after the element's label and field type |
| `@Output() change` | `DtCheckboxChange<T>` | Callen everytime the checkbox gets checked or uncheced |

## Indeterminate state

`<dt-checkbox>` supports an indeterminate state, similar to the native `<input type="checkbox">`.
While the indeterminate property of the checkbox is true, it will render as indeterminate regardless of the checked value.
Any interaction with the checkbox by a user (i.e., clicking) will remove the indeterminate state.

<docs-source-example example="IndeterminateCheckboxExampleComponent"></docs-source-example>

Angular forms `<dt-checkbox>` is compatible with @angular/forms and supports both FormsModule and ReactiveFormsModule.

## Accessibility

The `<dt-checkbox>` uses an internal `<input type="checkbox">` to provide an accessible experience.
This internal checkbox receives focus and is automatically labelled by the text content of the `<dt-checkbox>` element.

Checkboxes without text or labels should be given a meaningful label via `aria-label` or `aria-labelledby`.

### Dark

<docs-source-example example="DarkCheckboxExample" themedark="true"></docs-source-example>
