# Select

<ba-ux-snippet name="select-intro"></ba-ux-snippet>

The `<dt-select>` is like the native `<select>` a form control for selecting a
value from a list of options. It is also designed to work with Angular forms. By
using the `<dt-option>` element, which is also provided in the select module,
you can add values to the select.

<ba-live-example name="DtExampleSelectDefault"></ba-live-example>

## Imports

You have to import the `DtSelectModule` when you want to use the `<dt-select>`.
The `<dt-select>` component also requires Angular's `BrowserAnimationsModule`
for animations. For more details on this see
[_Step 2: Animations_](/components/get-started/#step-2-animations) in the
getting started guide.

```typescript
@NgModule({
  imports: [DtSelectModule],
})
class MyModule {}
```

## Initialization

The API of the `<dt-select>` is very similar to the native `<select>` element,
but has some additional useful functions, like a placeholder property. It is
possible to disable the entire select or individual options in the select by
using the disabled property on the `<dt-select>` or `<dt-option>`

The `<dt-select>` also supports all of the form directives from the core
FormsModule (NgModel) and ReactiveFormsModule (FormControl, FormGroup, etc.) As
with native `<select>`, `<dt-select>` also supports a compareWith function.
(Additional information about using a custom compareWith function can be found
in the Angular forms documentation).

<ba-live-example name="DtExampleSelectForms"></ba-live-example>

## DtSelect inputs

| Name                | Type                        | Description                                                                                                                                                                                                       |
| ------------------- | --------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `placeholder`       | `string`                    | Placeholder to be shown if no value has been selected.                                                                                                                                                            |
| `required`          | `boolean`                   | Whether the component is required.                                                                                                                                                                                |
| `compareWith`       | `(v1: T, v2: T) => boolean` | Function to compare the option values with the selected values. The first argument is a value from an option. The second is a value from the selection. A boolean should be returned. Defaults to value equality. |
| `value`             | `T`                         | Value of the select control.                                                                                                                                                                                      |
| `id`                | `string`                    | Unique id of the element.                                                                                                                                                                                         |
| `aria-label`        | `string`                    | Aria label of the select. If not specified, the placeholder will be used as label.                                                                                                                                |
| `aria-labelledby`   | `string`                    | Input that can be used to specify the `aria-labelledby` attribute.                                                                                                                                                |
| `errorStateMatcher` | `ErrorStateMatcher`         | Object used to control when error messages are shown.                                                                                                                                                             |
| `panelClass`        | `string                     | string[]                                                                                                                                                                                                          | Set<string> | { [key: string]: any }` | Classes to be passed to the select panel. Supports the same syntax as `ngClass`. |

## DtSelect outputs

| Name              | Type                              | Description                                                         |
| ----------------- | --------------------------------- | ------------------------------------------------------------------- |
| `openedChange`    | `EventEmitter<boolean>`           | Event emitted when the select panel has been toggled.               |
| `selectionChange` | `EventEmitter<DtSelectChange<T>>` | Event emitted when the selected value has been changed by the user. |
| `valueChange`     | `EventEmitter<T>`                 | Event that emits whenever the raw value of the select changes.      |

## DtOption inputs

| Name       | Type      | Description                     |
| ---------- | --------- | ------------------------------- |
| `value`    | `T`       | The form value of the option.   |
| `disabled` | `boolean` | Whether the option is disabled. |

Getting and setting the select value The `<dt-select>` supports 2-way binding to
the value property without the need for Angular forms.

<ba-live-example name="DtExampleSelectValue"></ba-live-example>

## DtOption outputs

| Name              | Type                                       | Description                                              |
| ----------------- | ------------------------------------------ | -------------------------------------------------------- |
| `selectionChange` | `EventEmitter<DtOptionSelectionChange<T>>` | Event emitted when the option is selected or deselected. |

## Creating groups of options

The `<dt-optgroup>` element can be used to group common options under a
subheading. The name of the group can be set using the label property of
`<dt-optgroup>`. Like individual `<dt-option>` elements, an entire
`<dt-optgroup>` can be disabled or enabled by setting the disabled property on
the group.

<ba-live-example name="DtExampleSelectGroups"></ba-live-example>

## Form field

The select component supports the `<dt-form-field>` and all of its features.
These include error messages, hint text, prefix & suffix. For additional
information about these features, see the
[form field documentation](/components/form-field).

<ba-live-example name="DtExampleSelectFormField"></ba-live-example>

## Disabling the select or individual options

It is possible to disable the entire select or individual options in the select
by using the disabled property on the `<dt-select>` and the `<dt-option>`
components respectively.

<ba-live-example name="DtExampleSelectDisabled"></ba-live-example>

## Non string values

The select component also supports non string, non basic value types.

<ba-live-example name="DtExampleSelectComplexValue"></ba-live-example>

## Select with icons

It is possible to use icons to differentiate between the types of items in a
select.

<ba-live-example name="DtExampleSelectWithIcons"></ba-live-example>

## Custom trigger

It is possible to customize the trigger that is displayed when the select has a
value. By using the property `<dt-select-value-template>` it's possible to
stablish a new template for the selected value.

<ba-live-example name="DtExampleSelectCustomValueTemplate"></ba-live-example>

## Accessibility

The select component without text or label should be given a meaningful label
via `aria-label` or `aria-labelledby`.

The select component has `role="listbox"` and options inside select have
`role="option"`.
