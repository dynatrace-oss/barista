---
type: 'component'
---

# Input & Textarea

`dtInput` is a directive that applies Dynatrace styling to native `<input>` and
`<textarea>` elements and allows them to work with `<dt-form-field>`.

<docs-source-example example="InputDefaultExample"></docs-source-example>

## Imports

You have to import the `DtInputModule` when you want to use `dtInput`:

```typescript
@NgModule({
  imports: [DtInputModule],
})
class MyModule {}
```

## Initialization

To apply the Dynatrace input, add the `dtInput` attribute to the `<input>` and
`<textarea>` elements.

## Attributes

All valid `<input>` and `<textarea>` attributes can be used on `dtInput`
including `ngModel` and `formControl`. The only exception ist type where not all
values are possible.

**Invalid input type values are:**

| Invalid type(s)                      | Description                                                                                    |
| ------------------------------------ | ---------------------------------------------------------------------------------------------- |
| `button`, `image`, `reset`, `submit` | Use the [button component](/components/button/) instead.                                       |
| `checkbox`                           | Use the [checkbox component](/components/checkbox/) instead.                                   |
| `file`                               | Is not (yet) supported. Maybe there will be an upload component in the future.                 |
| `hidden`                             | Hidden input fields should not be a thing in a client side app. They also do not need styling. |
| `radio`                              | Use the [radio-button component](/components/radio-buttons/) instead                           |
| `range`                              | Is not (yet) supported. Maybe there will be a slider/range component in the future.            |

## Options & Properties

| Name                         | Type                | Default                    | Description                                            |
| ---------------------------- | ------------------- | -------------------------- | ------------------------------------------------------ |
| `@Input() id`                | `string`            | `-`                        | Id of the element.                                     |
| `@Input() disabled`          | `boolean`           | `false`                    | Whether the element is disabled.                       |
| `@Input() required`          | `boolean`           | `false`                    | Whether the input is required. Used for validation.    |
| `@Input() placeholder`       | `string`            | `-`                        | Input placeholder text.                                |
| `@Input() type`              | `string`            | `text`                     | Input type of the element. See valid types above.      |
| `@Input() value`             | `string`            | `-`                        | Input value of the input.                              |
| `@Input() readonly`          | `boolean`           | `false`                    | Whether the input is readonly.                         |
| `@Input() errorStateMatcher` | `ErrorStateMatcher` | `DefaultErrorStateMatcher` | A class used to control when error messages are shown. |
| `empty()`                    | `boolean`           | `-`                        | Whether the input is empty.                            |

## Accessibility

The `dtInput` directive works with native `<input>` and `<textarea>` to provide
an accessible experience. If there's no `<dt-form-field>` used and the input
does not contain a `<dt-label>`, `aria-label` or `aria-labelledby` attribute, it
should be added. Any `dt-error` and `dt-hint` are automatically added to the
input's `aria-describedby` list, and `aria-invalid` is automatically updated
based on the input's validity state.

## Examples

### Disabled & readonly

<docs-source-example example="InputDisabledReadonlyExample"></docs-source-example>

### NgModel

<docs-source-example example="InputNgModelExample"></docs-source-example>

### Textarea

<docs-source-example example="InputTextareaExample"></docs-source-example>

### Dark

<docs-source-example example="InputDarkExample" themedark="true"></docs-source-example>
