# Progress bar

The `<dt-progress-bar>` creates a simple progress bar. It is possible to set the
value for the progress bars as well as setting a min and max value. The color
property can be set to specify the color of the progress. The color depends on
the theme the progress bars is in. The value will be clamped between the min and
max values.

<ba-live-example name="DtExampleProgressBarDefault"></ba-live-example>

## Imports

You have to import the `DtProgressBarModule` when you want to use the
`dt-progress-bar`.

```typescript
@NgModule({
  imports: [DtProgressBarModule],
})
class MyModule {}
```

## Inputs

| Name    | Type              | Default | Description                                                           |
| ------- | ----------------- | ------- | --------------------------------------------------------------------- |
| `value` | `number`          | `0`     | Gets and sets the value on the progress-bar.                          |
| `min`   | `number`          | `0`     | Gets and sets the minimum value on the progress bar                   |
| `max`   | `number`          | `100`   | Gets and sets the maximum value on the progress bar                   |
| `align` | `'start' | 'end'` | `start` | Sets the alignment of the progress element to the star or to the end. |

Using the `align` input the alignment of the progress bar can be changed to
`end`.

<ba-live-example name="DtExampleProgressBarRightAligned"></ba-live-example>

## Outputs

| Name          | Type                                                   | Description                                        |
| ------------- | ------------------------------------------------------ | -------------------------------------------------- |
| `valueChange` | `EventEmitter<{ oldValue: number, newValue: number }>` | Event emitted when the progress bar value changes. |

<ba-live-example name="DtExampleProgressBarChange"></ba-live-example>

## Properties

| Name         | Type     | Description                                     |
| ------------ | -------- | ----------------------------------------------- |
| `percentage` | `number` | Gets the percentage used to render the progress |

## Progress bar description

The `<dt-progress-bar-description>` component lets you add a description to the
progress-bar. It utilises `ng-content` selection within the `<dt-progress-bar>`
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

<ba-live-example name="DtExampleProgressBarWithDescription"></ba-live-example>

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

<ba-live-example name="DtExampleProgressBarWithCount"></ba-live-example>

<ba-live-example name="DtExampleProgressBarWithCountAndDescription"></ba-live-example>

## Colors

The progress bar can be colored based on its color theme palette.

<ba-live-example name="DtExampleProgressBarWithColor"></ba-live-example>

## Dark background

Progress bars can be placed on dark background.

<ba-live-example name="DtExampleProgressBarDark" themedark></ba-live-example>

## Accessibility

Progress bars should be given a meaningful label via aria-label or
aria-labelledby.

## Progress bar in use

While the [loading distractor](/components/loading-distractor) does not indicate
how long something will take, the progress bar displays how far along the
process is.

The progress bar should be used to display a distinct progress of a process or
status, i.e. a download progress or used status of a disk.

### Animation

Once the bar has finished loading, it will fade out after 1s and the loaded
content will move up to fill the space where the progress bar used to be. The
fade out transition takes 500ms.

![Progress bar animation](https://d24pvdz4mvzd04.cloudfront.net/test/progress-animation-e086f3c372.gif)

### Progress bar with indicator

When the progress value reaches a defined threshold an indicator can be used to
highlight the number as shown in the following example.

<ba-live-example name="DtExampleProgressBarWithCountAndDescriptionIndicator"></ba-live-example>
