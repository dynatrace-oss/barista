---
type: "component"
---

# Progress bar

<docs-source-example example="DefaultProgressBarExampleComponent"></docs-source-example>

The `<dt-progress-progressbar>` creates a simple progress bar.
It is possible to set the value for the progress bars as well as setting a min and max value.
The color property can be set to specify the color of the progress. The color depends on the theme the progress bars is in.
The value will be clamped between the min and max values.

## Imports

You have to import the `DtProgressBarModule` when you want to use the `dt-progress-bar`:

```typescript

@NgModule({
  imports: [
    DtProgressBarModule,
  ],
})
class MyModule {}

```

## Accessibility

Progress bars should be given a meaningful label via aria-label or aria-labelledby.

## Options & Properties

| Name | Type | Default | Description |
| --- | --- | --- | --- |
| `@Input() value` | `number` | `0` | Gets and sets the value on the progress-bar. |
| `@Input() min` | `number` | `0` | Gets and sets the minimum value on the progress bar |
| `@Input() max` | `number` | `100` | Gets and sets the maximum value on the progress bar |
| `@Input() align` | `'start' | 'end'` | `start` | Sets the alignment of the progress element to the star or to the end. |
| `@Ouput() valueChange` | `EventEmitter<{ oldValue: number, newValue: number }>` |  | Event emitted when the progress bar value changes. |
| `percentage` | `number` |  | Gets the percentage used to render the progress |

## Examples

### Progress bars with color

<docs-source-example example="WithColorProgressBarExampleComponent"></docs-source-example>

### Progress bars change

<docs-source-example example="ChangeProgressBarExampleComponent"></docs-source-example>

### Progress bar alignment

<docs-source-example example="RightAlignedProgressBarExampleComponent"></docs-source-example>
