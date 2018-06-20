# ButtonGroup

{{component-demo name="ButtonGroupDefaultExampleComponent"}}

This component create a button group elements with Dynatrace styling.

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

To apply the dynatrace button group, use the `<dt-button-group>` and `<dt-button-group-item>` elements.

*Example:*

| Attribute               | Description                                                                                                                |
| ----------------------- | -------------------------------------------------------------------------------------------------------------------------- |
| `dt-button-group`       | Indicate the outer element of the button group. The group element can contain multiple `<dt-button-group-item>` elements.  |
| `dt-button-group-item`  | The element of an individual button.                                                                                       |

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

{{component-demo name="ButtonGroupDisabledExampleComponent"}}

### Item disabled

{{component-demo name="ButtonGroupItemDisabledExampleComponent"}}

### Error state

{{component-demo name="ButtonGroupErrorExampleComponent"}}

### Interactive example

{{component-demo name="ButtonGroupInteractiveExampleComponent"}}

### Dark example

{{component-demo name="ButtonGroupDarkExampleComponent" themedark="true"}}
