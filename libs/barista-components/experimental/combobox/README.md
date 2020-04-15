# Combobox (experimental)

The `<dt-combobox>` is similar to the `<dt-select>` component in the sense that
it is a form control for selecting a value from a list of options. The major
differences between the two components is that the `<dt-combobox>` allows the
user to freely filter for options before selecting one. This makes it much more
suitable for large amounts of data that couldn't be handled well by the
`<dt-select>` component. It is also designed to work with Angular forms. By
using the `<dt-option>` element, which is also provided in the select module,
you can add values to the select. Also, the use of `<dt-optgroup>` is supported
for grouping options.

<ba-live-example name="DtExampleComboboxSimple"></ba-live-example>

## Imports

You have to import the `DtComboboxModule` when you want to use the
`<dt-combobox>`. The `<dt-combobox>` component also requires Angular's
`BrowserAnimationsModule` for animations. For more details on this see
[_Step 2: Animations_](/components/get-started/#step-2-animations) in the
getting started guide.

```typescript
@NgModule({
  imports: [DtComboboxModule],
})
class MyModule {}
```

## Initialization

The API of the `<dt-combobox>` is very similar to the native `<select>` element,
but has some additional useful functions, like a placeholder property. It is
possible to disable the entire select or individual options in the select by
using the disabled property on the `<dt-combobox>` or `<dt-option>`

The `<dt-combobox>` also supports all of the form directives from the core
FormsModule (NgModel) and ReactiveFormsModule (FormControl, FormGroup, etc.).

## DtCombobox Inputs

| Name              | Type                   | Default Value            | Description                                                                                                      |
| ----------------- | ---------------------- | ------------------------ | ---------------------------------------------------------------------------------------------------------------- |
| `id`              | `string`               | `''`                     | The ID for the combobox.                                                                                         |
| `value`           | `T | null`             | `null`                   | The currently selected value in the combobox.                                                                    |
| `loading`         | `boolean`              | `false`                  | When set to true, a loading indicator is shown to show to the user that data is currently being loaded/filtered. |
| `required`        | `boolean`              | `false`                  | Whether the control is required.                                                                                 |
| `panelClass`      | `string`               | `''`                     | An arbitrary class name that is added to the combobox dropdown.                                                  |
| `placeholder`     | `string | undefined`   | `undefined`              | A placeholder text for the input field.                                                                          |
| `displayWith`     | `(value: T) => string` | (value: T) =>`\${value}` | A function returning a display name for a given object that represents an option from the combobox.              |
| `aria-label`      | `string`               | `undefined`              | Aria label of the select.                                                                                        |
| `aria-labelledby` | `string`               | `undefined`              | Input that can be used to specify the `aria-labelledby` attribute.                                               |
| `focused`         | `boolean`              | `false`                  | Whether the control is focused.                                                                                  |

## DtOption inputs

| Name       | Type      | Description                     |
| ---------- | --------- | ------------------------------- |
| `value`    | `T`       | The form value of the option.   |
| `disabled` | `boolean` | Whether the option is disabled. |

## DtCombobox Outputs

| Name         | Type                    | Description                                           |
| ------------ | ----------------------- | ----------------------------------------------------- |
| valueChange  | `EventEmitter<T>`       | Event emitted when a new value has been selected.     |
| filterChange | `EventEmitter<string>`  | Event emitted when the filter changes.                |
| openedChange | `EventEmitter<boolean>` | Event emitted when the select panel has been toggled. |
