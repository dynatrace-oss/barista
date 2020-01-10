# Radio button

The `<dt-radio-button>` provides the same functionality as a native
`<input type="radio">` element, enhanced with styling and animations. Radio
elements are generally used within radio-groups to describe a set of related
options. Only one radio element can be selected at the same time.

<ba-live-example name="DtExampleRadioDefault"></ba-live-example>

## Imports

You have to import the `DtRadioModule` when you want to use the
`dt-radio-button` or `dt-radio-button-group`.

```typescript
@NgModule({
  imports: [DtRadioModule],
})
class MyModule {}
```

## Inputs

| Name               | Type      | Description                                                                                                                        |
| ------------------ | --------- | ---------------------------------------------------------------------------------------------------------------------------------- |
| `id`               | `string`  | The unique ID for the radio button. Default is `dt-radio-{consecutiveNumber}`.                                                     |
| `name`             | `string`  | Analog to HTML 'name' attribute used to group radios for unique selection. Will be inherited from the `dt-radio-group` if not set. |
| `value`            | `T`       | The value of this radio button.                                                                                                    |
| `checked`          | `boolean` | Whether this radio button is checked.                                                                                              |
| `required`         | `boolean` | Whether the radio button is required.                                                                                              |
| `disabled`         | `boolean` | Whether the radio button is disabled.                                                                                              |
| `tabIndex`         | `number`  | The element's tab index.                                                                                                           |
| `aria-label`       | `string`  | Used to set the 'aria-label' attribute on the underlying input element.                                                            |
| `aria-labelledby`  | `string`  | The 'aria-labelledby' attribute takes precedence as the element's text alternative.                                                |
| `aria-describedby` | `string`  | The 'aria-describedby' attribute is read after the element's label and field type.                                                 |
| `<ng-content>`     | `string`  | The text will be set as the label.                                                                                                 |

## Outputs

| Name     | Type                             | Description                                               |
| -------- | -------------------------------- | --------------------------------------------------------- |
| `change` | `EventEmitter<DtRadioChange<T>>` | Emits a `DtRadioChange` event when the selection changes. |

## Methods

| Name      | Description                                    | Return value |
| --------- | ---------------------------------------------- | ------------ |
| `focus()` | Let's you set the focus on this radio element. | `void`       |

## Radio groups

Radio-buttons should typically be placed inside of a `<dt-radio-group>`
component unless the DOM structure would make that impossible. The radio-group
has a value property that reflects the currently selected radio-button inside of
the group. Individual radio-buttons inside of a radio-group will inherit the
name of the group.

`<dt-radio-group>` is compatible with @angular/forms and supports both
`FormsModule` and `ReactiveFormsModule`.

### Inputs

| Name       | Type                      | Default                              | Description                                       |
| ---------- | ------------------------- | ------------------------------------ | ------------------------------------------------- |
| `name`     | `string`                  | `dt-radio-group-{consecutiveNumber}` | The unique ID for the radio group button.         |
| `value`    | `T | null`                |                                      | Currently selected value of the radio group.      |
| `selected` | `DtRadioButton<T> | null` |                                      | Currently selected radio button within the group. |
| `disabled` | `boolean`                 | `false`                              | Whether the radio group is disabled.              |
| `required` | `boolean`                 | `false`                              | Whether the radio group is required.              |

### Outputs

| Name     | Type                             | Description                                                                  |
| -------- | -------------------------------- | ---------------------------------------------------------------------------- |
| `change` | `EventEmitter<DtRadioChange<T>>` | Emits a `DtRadioChange` event when the selection on the radio-group changes. |

### Grouping by name

If it's not possible to use a `<dt-radio-group>` add the same name to all radio
buttons within a group.

<ba-live-example name="DtExampleRadioNameGrouping"></ba-live-example>

## Dark background

A radio button can be placed on dark background.

<ba-live-example name="DtExampleRadioDark" themedark></ba-live-example>

## Accessibility

The `<dt-radio-button>` uses an internal `<input type="radio">` to provide an
accessible experience. This internal radio button receives focus and is
automatically labelled by the text content of the `<dt-radio-button>` element.

Radio button groups should be given a meaningful label via `aria-label` or
`aria-labelledby`.

## Radio buttons in use

When radio buttons are placed below each other, the distance between two radio
button components must be `20px`.

### Responsive behavior

Once the label next to the radio button does not fit into one line anymore, the
line breaks.

<ba-live-example name="DtExampleRadioResponsive"></ba-live-example>
