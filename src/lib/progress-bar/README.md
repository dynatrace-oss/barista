---
type: "component"
---

# Progress bar

<docs-source-example example="DefaultProgressBarExampleComponent"></docs-source-example>

The `<dt-progress-bar>` creates a simple progress bar.
It is possible to set the value for the progress bars as well as setting a min and max value.
The color property can be set to specify the color of the progress. The color depends on the theme the progress bars is in.
The value will be clamped between the min and max values.

The progress bar should be used to display a distinct progress of a process or status, i.e. a download progress or used status of a disk.

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

## Progress bar description

The `<dt-progress-bar-description>` component lets you add a description to the progress-bar. It utilises ng-content selection within the `<dt-progress-bar>` component
to position the description correctly. Use the description to provide more insight into what the progress bar actually indicates.

```html
<dt-progress-bar ...>
  <dt-progress-bar-description>Rich text describing the progress...</dt-progress-bar-description>
<dt-progress-bar>
```

## Progress bar count

The `<dt-progress-bar-count>` component lets you add a count to the progressbar which usually is a textual representation of the progress displayed (i.e. 80/100 days). It utilises ng-content selection within the `<dt-progress-bar>` component to position the count data correctly. Any values passed to the progress-bar-count are not affected by the progress-bar component min/max values. Use the count to display a text representation of the progress.

```html
<dt-progress-bar ...>
  <dt-progress-bar-count>80/100 days</dt-progress-bar-count>
<dt-progress-bar>
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

### Progress bar with description

<docs-source-example example="WithDescriptionProgressBarExampleComponent"></docs-source-example>

### Progress bar with counter

<docs-source-example example="WithCountDescriptionProgressBarComponent"></docs-source-example>

### Progress bar with description and counter

<docs-source-example example="WithCountAndTextDescriptionProgressBarComponent"></docs-source-example>

### Progress bar with description and counter - Uses dt-indicator above 75/100 days

<docs-source-example example="WithCountAndTextDescriptionIndicatorProgressBarComponent"></docs-source-example>

