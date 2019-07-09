---
type: 'component'
---

# Radio

`<dt-radio-button>` provides the same functionality as a native `<input type="radio">` element, enhanced with styling and animations.
Radio elements are generally used within radio-groups to describe a set of related options. Only one radio element can be selected at the same time.

## Imports

You have to import the `DtRadioModule` when you want to use the `dt-radio-button` or `dt-radio-button-group`.

```typescript
@NgModule({
  imports: [DtRadioModule],
})
class MyModule {}
```

## Options & Properties

| Name                        | Type                             | Default                        | Description                                                                                                                        |
| --------------------------- | -------------------------------- | ------------------------------ | ---------------------------------------------------------------------------------------------------------------------------------- |
| `@Input() id`               | `string`                         | `dt-radio-{consecutiveNumber}` | The unique ID for the radio button.                                                                                                |
| `@Input() Input`            | `boolean`                        |                                | Sets whether the radio button is disabled.                                                                                         |
| `@Input() checked`          | `boolean`                        |                                | Whether this radio button is checked.                                                                                              |
| `@Input() value`            | `T`                              |                                | The value of this radio button.                                                                                                    |
| `@Input() name`             | `string`                         |                                | Analog to HTML 'name' attribute used to group radios for unique selection. Will be inherited from the `dt-radio-group` if not set. |
| `@Input() aria-label`       | `string`                         |                                | Used to set the 'aria-label' attribute on the underlying input element.                                                            |
| `@Input() aria-labelledby`  | `string`                         |                                | The 'aria-labelledby' attribute takes precedence as the element's text alternative.                                                |
| `@Input() aria-describedby` | `string`                         |                                | The 'aria-describedby' attribute is read after the element's label and field type.                                                 |
| `@Output() change`          | `EventEmitter<DtRadioChange<T>>` |                                | Emits a `DtRadioChange` event when the selection changes.                                                                          |
| `focus`                     | `function`                       |                                | Let's you set the focus on this radio element.                                                                                     |

## Imports

You have to import the `DtRadioModule` when you want to use the `dt-radio-group` and `dt-radio-button`:

```typescript
@NgModule({
  imports: [DtRadioModule],
})
class MyModule {}
```

## Grouping

### Radio groups

Radio-buttons should typically be placed inside of a `<dt-radio-group>` component unless the DOM structure would make that impossible.
The radio-group has a value property that reflects the currently selected radio-button inside of the group.
Individual radio-buttons inside of a radio-group will inherit the name of the group.

| Name                | Type                             | Default                              | Description                                                                  |
| ------------------- | -------------------------------- | ------------------------------------ | ---------------------------------------------------------------------------- |
| `@Input() name`     | `string`                         | `dt-radio-group-{consecutiveNumber}` | The unique ID for the radio group button.                                    |
| `@Input() value`    | `T | null`                       |                                      | Currently selected value of the radio group.                                 |
| `@Input() selected` | `DtRadioButton<T> | null`        |                                      | Currently selected radio button within the group.                            |
| `@Input() disabled` | `boolean`                        | `false`                              | Whether the radio group is disabled.                                         |
| `@Input() required` | `boolean`                        | `false`                              | Whether the radio group is required.                                         |
| `@Output() change`  | `EventEmitter<DtRadioChange<T>>` |                                      | Emits a `DtRadioChange` event when the selection on the radio-group changes. |

### Grouping by name

All radio-buttons with the same name comprise a set from which only one may be selected at a time.

<docs-source-example example="RadioNameGroupingExample"></docs-source-example>

## Angular forms

`<dt-radio-group>` is compatible with @angular/forms and supports both FormsModule and ReactiveFormsModule.

## Accessibility

The `<dt-radio-button>` uses an internal `<input type="radio">` to provide an accessible experience.
This internal radio button receives focus and is automatically labelled by the text content of the `<dt-radio-button>` element.

Radio button groups should be given a meaningful label via `aria-label` or `aria-labelledby`.

## Examples

### Default

<docs-source-example example="RadioDefaultExample"></docs-source-example>

### Responsive

<docs-source-example example="RadioResponsiveExample"></docs-source-example>

## Dark theme

<docs-source-example example="RadioDarkExample" themedark="true"></docs-source-example>
