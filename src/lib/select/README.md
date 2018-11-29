---
type: "component"
---

# Select

<docs-source-example example="DefaultSelectExampleComponent"></docs-source-example>

`<dt-select>` is like the native `<select>` a form control for selecting a value from a list of options. It is also designed to work with Angular Forms. By using the `<dt-option>` element, which is also provided in the select module, you can add values to the select. The API of the `<dt-select>` is very similar to the native `<select>` element, but has some additional useful functions, like a placeholder property. It is possible to disable the entire select or individual options in the select by using the disabled property on the `<dt-select>` or `<dt-option>`

## Imports

You have to import the `DtSelectModule` when you want to use the `<dt-select>`.
The `<dt-select>` component also requires Angular's `BrowserAnimationsModule` for animations. For more details on this see *Step 2: Animations* in the Getting started Guide.

```typescript
@NgModule({
  imports: [
    DtSelectModule,
  ],
})
class MyModule {}
```

## Initialization


## Options & Properties

### DtSelect (`<dt-select>`)
| Name | Type | Description |
| --- | --- | --- |
| `@Input() placeholder` | `string` | Placeholder to be shown if no value has been selected. |
| `@Input() required` | `boolean` | Whether the component is required. |
| `@Input() compareWith` | `(v1: T, v2: T) => boolean` | Function to compare the option values with the selected values. The first argument is a value from an option. The second is a value from the selection. A boolean should be returned. Defaults to value equality. |
| `@Input() value` | `T` | Value of the select control. |
| `@Input() id` | `string` | Unique id of the element. |
| `@Input() aria-label` | `string` | Aria label of the select. If not specified, the placeholder will be used as label. |
| `@Input() aria-labelledby` | `string` | Input that can be used to specify the `aria-labelledby` attribute. |
| `@Input() errorStateMatcher` | `ErrorStateMatcher` | Object used to control when error messages are shown. |
| `@Input() panelClass` | `string | string[] | Set<string> | { [key: string]: any }` | Classes to be passed to the select panel. Supports the same syntax as `ngClass`. |
| `@Output() openedChange` | `EventEmitter<boolean>` | Event emitted when the select panel has been toggled. |
| `@Output() selectionChange` | `EventEmitter<DtSelectChange<T>>` | Event emitted when the selected value has been changed by the user. |
| `@Output() valueChange` | `EventEmitter<T>` | Event that emits whenever the raw value of the select changes. |

### DtOption (`<dt-option>`)
| Name | Type | Description |
| --- | --- | --- |
| `@Input() value` | `T` | The form value of the option. |
| `@Input() disabled` | `boolean` | Whether the option is disabled. |
| `@Output() selectionChange` | `EventEmitter<DtOptionSelectionChange<T>>` | Event emitted when the option is selected or deselected. |

Getting and setting the select value
The `<dt-select>` supports 2-way binding to the value property without the need for Angular forms.

*Example:*
<docs-source-example example="ValueSelectExampleComponent"></docs-source-example>

The `<dt-select>` also supports all of the form directives from the core FormsModule (NgModel) and ReactiveFormsModule (FormControl, FormGroup, etc.) As with native `<select>`, `<dt-select>` also supports a compareWith function. (Additional information about using a custom compareWith function can be found in the Angular forms documentation).

*Example:*
<docs-source-example example="FormsSelectExampleComponent"></docs-source-example>

## Creating groups of options
The `<dt-optgroup>` element can be used to group common options under a subheading. The name of the group can be set using the label property of `<dt-optgroup>`. Like individual `<dt-option>` elements, an entire `<dt-optgroup>` can be disabled or enabled by setting the disabled property on the group.

*Example:*
<docs-source-example example="GroupsSelectExampleComponent"></docs-source-example>

## Form field
The select component supports the `<dt-form-field>` and all of its features. These include error messages, hint text, prefix & suffix. For additional information about these features, see the form field documentation.

*Example:*
<docs-source-example example="FormFieldSelectExampleComponent"></docs-source-example>

## Disabling the select or individual options
It is possible to disable the entire select or individual options in the select by using the disabled property on the `<dt-select>` and the `<dt-option>` components respectively.

*Example:*
<docs-source-example example="DisabledSelectExampleComponent"></docs-source-example>

## Non string values
The select component also supports non string, non basic value types.

*Example:*
<docs-source-example example="ComplexValueSelectExampleComponent"></docs-source-example>

## Accessibility
The select component without text or label should be given a meaningful label via `aria-label` or `aria-labelledby`.

The select component has `role="listbox"` and options inside select have `role="option"`.
