---
type: "component"
---

# Input & Textarea

<docs-source-example example="DefaultInputExample"></docs-source-example>

`dtInput` is a directive that applies dynatrace styling to native `<input>` and `<textarea>` elements and allows them to work with `<dt-form-field>`.

## Imports

You have to import the `DtInputModule` when you want to use `dtInput`:

```typescript

@NgModule({
  imports: [
    DtInputModule,
  ],
})
class MyModule {}

```

## Initialization

To apply the dynatrace input, add the `dtInput` attribute to the `<input>` and `<textarea>` elements.

## Attributes

All valid `<input>` and `<textarea>` attributes can be used on `dtInput` including `ngModel` and `formControl`.
The only exception ist type where not all values are possible.

**Invalid type values are:**

| Invalid type(s) | Description |
| --- | --- |
| `button`, `image`, `reset`, `submit` | Use the button component instead |
| `checkbox` | Use the checkbox component instead |
| `file` | Is not (yet) supported. Maybe there will be an upload component in the future. |
| `hidden` | Hidden input fields should not be a thing in a client side app. They also do not need styling. |
| `radio` | Use the radio-button component instead |
| `range` | Is not (yet) supported. Maybe there will be a slider/range component in the future. |

## Options & Properties

| Name | Type | Default | Description |
| --- | --- | --- | --- |
| `id` | `string` | `-` | Id of the element. |
| `disabled` | `boolean` | `false` | Whether the element is disabled. |
| `required` | `boolean` | `false` | Whether the input is required. Used for validation. |
| `placeholder` | `string` | `-` | Input placeholder text. |
| `type` | `string` | `text` | Input type of the element. See valid types above. |
| `value` | `string` |   | Input value of the input. |
| `readonly` | `boolean` | `false` | Whether the input is readonly. |
| `errorStateMatcher` | `ErrorStateMatcher` | `DefaultErrorStateMatcher` | A class used to control when error messages are shown. |

## Accessibility

The `dtInput` directive works with native `<input>` and `<textarea>` to provide an accessible experience.
If there's no `<dt-form-field>` used or it does not contain a `<dt-label>`, `aria-label`, `aria-labelledby` or should be added.
Any `dt-error` and `dt-hint` are automatically added to the input's `aria-describedby` list, and `aria-invalid` is automatically updated based on the input's validity state.

## Examples

### Disabled & readonly

<docs-source-example example="DisabledReadonlyInputExample"></docs-source-example>

### NgModel

<docs-source-example example="NgModelInputExample"></docs-source-example>

### Textarea

<docs-source-example example="TextareaInputExample"></docs-source-example>

### Dark

<docs-source-example example="DarkInputExample" themedark="true"></docs-source-example>
