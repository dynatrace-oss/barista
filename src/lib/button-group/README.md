# ButtonGroup

<docs-source-example example="ButtonGroupDefaultExampleComponent"></docs-source-example>

This component creates a button group element with Dynatrace styling.

## Imports

You have to import the `DtButtonGroupModule` when you want to use the `dt-button-group`

```typescript

@NgModule({
  imports: [
    DtButtonGroupModule,
  ],
}
class MyModule {}

```

## Initialization

To apply the Dynatrace button group, use the `<dt-button-group>` and `<dt-button-group-item>` elements.

*Example:*

| Attribute | Description |
| --- | --- |
| `dt-button-group` | Indicate the outer element of the button group. The group element can contain multiple `<dt-button-group-item>` elements. |
| `dt-button-group-item` | The element of an individual button. |

## Options & Properties

### Button group

| Name | Type | Default | Description |
| --- | --- | --- | --- |
| `[value]` | `T | undefined` | `undefined` | Gets sets the current value |
| `[disabled]` | `boolean | undefined` | `undefined` | Sets disable state if property is set and the value is truthy or undefined |
| `[tabIndex]` | `number` | `0` | Sets and gets the tabIndex property |
| `(valueChange)` | `event<T>` |   | Emits an event when the user selects an other button. |

#### Button group item

| Name | Type | Default | Description |
| --- | --- | --- | --- |
| `<ng-content>` |   |   | The content/text which is displayed inside of the item |
| `[value]` | `T | undefined` | `undefined` | The associated value of this item |
| `[disabled]` | `boolean | undefined` | `undefined` | Sets disable state if property is set and the value is truthy or undefined |
| `[tabIndex]` | `number` | `0` | Sets and gets the tabIndex property |
| `[selected]` | `boolean` | `false` | Sets or gets the selected state of this item |
| `[color]` | `string | undefined` | `undefined` | Sets color. Possible options: <ul><li><code>main</code> (default)</li><li><code>error</code></li></ul> |

## Examples

### Group disabled

<docs-source-example example="ButtonGroupDisabledExampleComponent"></docs-source-example>

### Item disabled

<docs-source-example example="ButtonGroupItemDisabledExampleComponent"></docs-source-example>

### Error state

<docs-source-example example="ButtonGroupErrorExampleComponent"></docs-source-example>

### Interactive example

<docs-source-example example="ButtonGroupInteractiveExampleComponent"></docs-source-example>
