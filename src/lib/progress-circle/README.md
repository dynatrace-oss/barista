# Progress circle

{{component-demo name="DefaultProgressCircleExampleComponent"}}

The `<dt-progress-circle>` creates a container that is hidden inside an overlay.
It is possible to set the value for the progress circle as well as setting a min and max value.
The color property can be set to specify the color of the progress. The color depends on the theme the progress circle is in.
The value will be clamped between the min and max values.
With `ng-content` the content inside the progress-circle can be set.

## Imports

You have to import the `DtProgressCircleModule` when you want to use the `dt-progress-circle`:

```typescript

@NgModule({
  imports: [
    DtProgressCircleModule,
  ],
})
class MyModule {}

```

## Accessibility

Prgoress circles should be given a meaningful label via aria-label or aria-labelledby.

## Options & Properties

| Name | Type | Default | Description |
| --- | --- | --- | --- |
| `@Input() value` | `number` | `0` | Gets and sets the value on the progress-circle. |
| `@Input() min` | `number` | `0` | Gets and sets the minimum value on the progress circle |
| `@Input() max` | `number` | `100` | Gets and sets the maximum value on the progress circle |
| `@Ouput() valueChange` | `EventEmitter<{ oldValue: number, newValue: number }>` |  | Event emitted when the progress circle value changes. |
| `percentage` | `number` |  | Gets the percentage used to render the progress |

## Examples

### Progress circle with text in content

{{component-demo name="WithTextProgressCircleExampleComponent"}}

### Progress circle with icon in content

{{component-demo name="WithIconProgressCircleExampleComponent"}}

### Progress circle with color

{{component-demo name="WithColorProgressCircleExampleComponent"}}

### Progress circle change

{{component-demo name="ChangeProgressCircleExampleComponent"}}
