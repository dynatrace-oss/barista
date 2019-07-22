---
type: 'component'
---

# Progress bar

The `<dt-progress-bar>` creates a simple progress bar. It is possible to set the
value for the progress bars as well as setting a min and max value. The color
property can be set to specify the color of the progress. The color depends on
the theme the progress bars is in. The value will be clamped between the min and
max values.

The progress bar should be used to display a distinct progress of a process or
status, i.e. a download progress or used status of a disk.

<docs-source-example example="ProgressBarDefaultExample"></docs-source-example>

## Imports

You have to import the `DtProgressBarModule` when you want to use the
`dt-progress-bar`:

```typescript
@NgModule({
  imports: [DtProgressBarModule],
})
class MyModule {}
```

## Progress bar description

The `<dt-progress-bar-description>` component lets you add a description to the
progress-bar. It utilises ng-content selection within the `<dt-progress-bar>`
component to position the description correctly. Use the description to provide
more insight into what the progress bar actually indicates.

```html
<dt-progress-bar ...>
  <dt-progress-bar-description>
    Rich text describing the progress...
  </dt-progress-bar-description>
  <dt-progress-bar></dt-progress-bar>
</dt-progress-bar>
```

<docs-source-example example="ProgressBarWithDescriptionExample"></docs-source-example>

## Progress bar count

The `<dt-progress-bar-count>` component lets you add a count to the progressbar
which usually is a textual representation of the progress displayed (i.e. 80/100
days). It utilises ng-content selection within the `<dt-progress-bar>` component
to position the count data correctly. Any values passed to the
progress-bar-count are not affected by the progress-bar component min/max
values. Use the count to display a text representation of the progress.

```html
<dt-progress-bar ...>
  <dt-progress-bar-count>80/100 days</dt-progress-bar-count>
  <dt-progress-bar></dt-progress-bar>
</dt-progress-bar>
```

<docs-source-example example="ProgressBarWithCountAndDescriptionExample"></docs-source-example>

## Accessibility

Progress bars should be given a meaningful label via aria-label or
aria-labelledby.

## Inputs

| Name    | Type              | Default | Description                                                           |
| ------- | ----------------- | ------- | --------------------------------------------------------------------- |
| `value` | `number`          | `0`     | Gets and sets the value on the progress-bar.                          |
| `min`   | `number`          | `0`     | Gets and sets the minimum value on the progress bar                   |
| `max`   | `number`          | `100`   | Gets and sets the maximum value on the progress bar                   |
| `align` | `'start' | 'end'` | `start` | Sets the alignment of the progress element to the star or to the end. |

## Outputs

| Name          | Type                                                   | Description                                        |
| ------------- | ------------------------------------------------------ | -------------------------------------------------- |
| `valueChange` | `EventEmitter<{ oldValue: number, newValue: number }>` | Event emitted when the progress bar value changes. |

## Properties

| Name         | Type     | Description                                     |
| ------------ | -------- | ----------------------------------------------- |
| `percentage` | `number` | Gets the percentage used to render the progress |

## Examples

### Progress bars with color

<docs-source-example example="ProgressBarWithColorExample"></docs-source-example>

### Progress bars change

<docs-source-example example="ProgressBarChangeExample"></docs-source-example>

### Progress bar alignment

<docs-source-example example="ProgressBarRightAlignedExample"></docs-source-example>

### Progress bar with description

<docs-source-example example="ProgressBarWithDescriptionExample"></docs-source-example>

### Progress bar with counter

<docs-source-example example="ProgressBarWithCountExample"></docs-source-example>

### Progress bar with description and counter

<docs-source-example example="ProgressBarWithCountAndDescriptionExample"></docs-source-example>

### Progress bar with description and counter - Uses dt-indicator above 75/100 days

<docs-source-example example="ProgressBarWithCountAndDescriptionIndicatorExample"></docs-source-example>

### Progress bar on dark background

<docs-source-example example="ProgressBarDarkExample" themedark="true"></docs-source-example>
