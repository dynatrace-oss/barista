# Input fields

`dtInput` is a directive that applies styling to native `<input>` and
`<textarea>` elements and allows them to work with `<dt-form-field>`.

<ba-live-example name="DtExampleInputDefault"></ba-live-example>

<ba-live-example name="DtExampleInputTextarea"></ba-live-example>

## Imports

You have to import the `DtInputModule` when you want to use `dtInput`.

```typescript
@NgModule({
  imports: [DtInputModule],
})
class MyModule {}
```

## Initialization

The `dtInput` directive can be added to `<input>` and `<textarea>` elements.

All valid `<input>` and `<textarea>` attributes can be used on `dtInput`
including `ngModel` and `formControl`. The only exception is the type attribute
where not all values are possible.

### Invalid input types

| Invalid type(s)                      | Description                                                                                    |
| ------------------------------------ | ---------------------------------------------------------------------------------------------- |
| `button`, `image`, `reset`, `submit` | Use the [button component](/components/button/) instead.                                       |
| `checkbox`                           | Use the [checkbox component](/components/checkbox/) instead.                                   |
| `file`                               | Is not (yet) supported. Maybe there will be an upload component in the future.                 |
| `hidden`                             | Hidden input fields should not be a thing in a client side app. They also do not need styling. |
| `radio`                              | Use the [radio-button component](/components/radio-buttons/) instead.                          |
| `range`                              | Is not (yet) supported. Maybe there will be a slider/range component in the future.            |

## Inputs

| Name                | Type                | Default                    | Description                                            |
| ------------------- | ------------------- | -------------------------- | ------------------------------------------------------ |
| `id`                | `string`            | `-`                        | Id of the element.                                     |
| `disabled`          | `boolean`           | `false`                    | Whether the element is disabled.                       |
| `required`          | `boolean`           | `false`                    | Whether the input is required. Used for validation.    |
| `placeholder`       | `string`            | `-`                        | Input placeholder text.                                |
| `type`              | `string`            | `text`                     | Input type of the element. See valid types above.      |
| `value`             | `string`            | `-`                        | Input value of the input.                              |
| `readonly`          | `boolean`           | `false`                    | Whether the input is readonly.                         |
| `errorStateMatcher` | `ErrorStateMatcher` | `DefaultErrorStateMatcher` | A class used to control when error messages are shown. |

## Properties

| Name    | Type      | Description                 |
| ------- | --------- | --------------------------- |
| `empty` | `boolean` | Whether the input is empty. |

## Input and ngModel

The `dtInput` works with `ngModel` as shown in the following example.

<ba-live-example name="DtExampleInputNgModel"></ba-live-example>

## Dark background

Input fields can be placed on dark background.

<ba-live-example name="DtExampleInputDark" themedark></ba-live-example>

## Accessibility

The `dtInput` directive works with native `<input>` and `<textarea>` to provide
an accessible experience. If there's no `<dt-form-field>` used and the input
does not contain a `<dt-label>`, `aria-label` or `aria-labelledby` attribute, it
should be added. Any `dt-error` and `dt-hint` are automatically added to the
input's `aria-describedby` list, and `aria-invalid` is automatically updated
based on the input's validity state.

## Input validation

<ba-ux-snippet name="input-validation"></ba-ux-snippet>

## Input fields in use

<ba-ux-snippet name="input-in-use"></ba-ux-snippet>
