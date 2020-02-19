# Chart

<ba-ux-snippet name="chart-intro"></ba-ux-snippet>

<ba-live-example name="DtExampleChartDefault" fullwidth></ba-live-example>

## Imports

You have to import the `DtChartModule` when you want to use the `dt-chart`:

```typescript
@NgModule({
  imports: [DtChartModule],
})
class MyModule {}
```

## Initialization

To use a chart, add the
`<dt-chart options="myoptions" series="myseries"></dt-chart>` element to the
page.

### Reflow

The chart needs the `ViewportResizer` provider, which notifies the `dt-chart`
component about viewport changes that trigger a reflow of the `dt-chart`.

## Inputs

| Name           | Type                                                                                                  | Default     | Description                                                                                                                                                       |
| -------------- | ----------------------------------------------------------------------------------------------------- | ----------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `options`      | `DtChartOptions | undefined`                                                                          | `undefined` | Sets options for the chart. `DtChartOptions` extends from `Highcharts.Options`, but removes the series property. The series property is passed as separate input. |
| `series`       | `Observable<Highcharts.IndividualSeriesOptions[]> | Highcharts.IndividualSeriesOptions[] | undefined` | `undefined` | Sets the series of the chart. The type can either be an observable or a static array.                                                                             |
| `loading-text` | `string`                                                                                              |             | The loading text of the loading distractor.                                                                                                                       |

## Outputs

| Name                     | Type                                               | Description                                                                      |
| ------------------------ | -------------------------------------------------- | -------------------------------------------------------------------------------- |
| `updated`                | `EventEmitter<void>`                               | Event emitted when the chart options or series are updated.                      |
| `tooltipOpenChange`      | `EventEmitter<boolean>`                            | Event emitted when the chart tooltip opens or closes.                            |
| `tooltipDataChange`      | `EventEmitter<DtChartTooltipEvent | null>`         | Event emitted when the tooltip data changes.                                     |
| `seriesVisibilityChange` | `EventEmitter<DtChartSeriesVisibilityChangeEvent>` | Event emitted when a series visibility changes because a legend item was clicked |

## Types

There are different chart types available. It strongly depends on the use case
and the given data which one should be used.

### Area chart

<ba-live-example name="DtExampleChartArea" fullwidth></ba-live-example>

### Area range chart

<ba-live-example name="DtExampleChartAreaRange" fullwidth></ba-live-example>

### Bar chart

<ba-live-example name="DtExampleChartCategorized" fullwidth></ba-live-example>

<ba-live-example name="DtExampleChartStream" fullwidth></ba-live-example>

<ba-live-example name="DtExampleChartBar" fullwidth></ba-live-example>

### Donut or pie chart

<ba-live-example name="DtExampleChartDonut"></ba-live-example>

<ba-live-example name="DtExampleChartPie"></ba-live-example>

### Line chart

<ba-live-example name="DtExampleChartLine" fullwidth></ba-live-example>

### Mixed chart

Mixed charts combine different chart types, e.g. a bar chart and a line chart.

<ba-live-example name="DtExampleChartOrderedColors" fullwidth></ba-live-example>

### Min/Max chart

The min/max chart shows the area between a minimum and a maximum value. The
average or median is represented by a line.

<ba-live-example name="DtExampleChartMinMax" fullwidth></ba-live-example>

## Colors

<ba-ux-snippet name="chart-colors"></ba-ux-snippet>

```html
<div dtTheme="purple">
  <dt-chart options="myoptions" series="myseries"></dt-chart>
</div>
```

<ba-live-example name="DtExampleChartOrderedColors" fullwidth></ba-live-example>

## Legend

<ba-ux-snippet name="chart-legend"></ba-ux-snippet>

## Tooltip

The chart supports adding a [tooltip/overlay](/components/overlay) that wraps
other Angular components to show detailed information about chart metrics. They
appear on hover over specific value points within the chart.

The `dt-chart` component takes a `dt-chart-tooltip` component as a content
child. The `dt-chart-tooltip` component needs an `ng-template` as a content
child. This `ng-template` receives the same object passed to the context as the
"normal" highcharts tooltip formatter function would receive. Don't forget to
declare the variable for the implicit context on the `ng-template`.

```html
<dt-chart ...>
  <dt-chart-tooltip>
    <ng-template let-tooltipdata>
      {{tooltipdata.point.y}}
    </ng-template>
  </dt-chart-tooltip>
</dt-chart>
```

## Selection area

Within a chart you can add a `dt-chart-range` to select a timeframe or a
`dt-chart-timestamp` to select a specific value on the x-axis (point in time) to
analyze one or more metrics of the chart in detail.

<ba-live-example name="DtExampleChartSelectionAreaDefault" fullwidth></ba-live-example>

It is possible to have both, a `dt-chart-range` and a `dt-chart-timestamp`,
alongside in a chart.

```html
<dt-chart ...>
  <dt-chart-range></dt-chart-range>
  <dt-chart-timestamp></dt-chart-timestamp>
</dt-chart>
```

### Selection area action

When the user creates a range or timestamp also an overlay is shown. To specify
a primary action within the overlay a button with a `dtChartSelectionAreaAction`
directive can be added inside the `dt-chart-timestamp` or `dt-chart-range`.

```html
<dt-chart ...>
  <dt-chart-range>
    <button dt-button dtChartSelectionAreaAction i18n>Apply</button>
  </dt-chart-range>
</dt-chart>
```

### Range

The `dt-chart-range` adds the ability to select a desired time frame between two
timestamps in a chart.

```html
<dt-chart ...>
  <dt-chart-range></dt-chart-range>
</dt-chart>
```

The selected range has to be larger than 5 minutes and can also be limited by a
max value. Once a range has been created the user can resize it by the two
handles on the left and right side of the range.

#### Accessibility

You have to provide meaningful labels to the range via `ariaLabelSelectedArea`,
`ariaLabelLeftHandle`, `ariaLabelRightHandle` and `ariaLabelClose`, to meet our
accessibility standards.

#### Inputs

| Name                    | Type               | Default  | Description                                                                                                               |
| ----------------------- | ------------------ | -------- | ------------------------------------------------------------------------------------------------------------------------- |
| `min`                   | `number`           | `300000` | The minimum range that can be created in milliseconds, by default the minimum range is 5 minutes.                         |
| `max`                   | `number | null`    | `null`   | The maximum range that can be created in a time format. If not set, the range will be capped at the borders of the chart. |
| `value`                 | `[number, number]` | `[0,0]`  | The time frame on the chart's x-axis where the range should be placed.                                                    |
| `ariaLabelSelectedArea` | `string`           | `''`     | Aria label of the selected area that is created.                                                                          |
| `ariaLabelLeftHandle`   | `string`           | `''`     | Aria label of the left handle of the selected area that can resize the selected frame.                                    |
| `ariaLabelRightHandle`  | `string`           | `''`     | Aria label of the right handle of the selected area that can resize the selected frame.                                   |
| `ariaLabelClose`        | `string`           | `''`     | Aria label of the close button inside the overlay.                                                                        |

#### Outputs

| Name           | Type                             | Description                                                                                                                            |
| -------------- | -------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------- |
| `valueChanges` | `EventEmitter<[number, number]>` | Event emitted when the values of the selected range have changed. Emits when the drag is complete. _(Not triggered programmatically.)_ |
| `valid`        | `BehaviorSubject<boolean>`       | Event emitted when the selection area is valid, i.e. greater than the minimum constraint.                                              |
| `closed`       | `EventEmitter<void>`             | Event emitted when the range has been closed.                                                                                          |

#### Methods

| Name    | Type   | Description                               |
| ------- | ------ | ----------------------------------------- |
| `focus` | `void` | Focuses the range element.                |
| `close` | `void` | Closes the range element and the overlay. |

### Timestamp

The `dt-chart-timestamp` adds the ability to select one specific point in time
in a chart.

```html
<dt-chart ...>
  <dt-chart-timestamp></dt-chart-timestamp>
</dt-chart>
```

#### Accessibility

You have to provide meaningful labels to the timestamp via `ariaLabelSelected`
and `ariaLabelClose`, to meet our accessibility standards.

#### Inputs

| Name                | Type     | Default | Description                                                           |
| ------------------- | -------- | ------- | --------------------------------------------------------------------- |
| `value`             | `number` | `0`     | The value on the chart's x-axis where the timestamp should be placed. |
| `ariaLabelSelected` | `string` | `''`    | Aria label for the selected point in time.                            |
| `ariaLabelClose`    | `string` | `''`    | Aria label of the close button inside the overlay.                    |

#### Outputs

| Name           | Type                   | Description                                                                                                                   |
| -------------- | ---------------------- | ----------------------------------------------------------------------------------------------------------------------------- |
| `valueChanges` | `EventEmitter<number>` | Event emitted when the value of the timestamp has changed by user triggered interactions. _(Not triggered programmatically.)_ |
| `closed`       | `EventEmitter<void>`   | Event emitted when the timestamp has been closed.                                                                             |

#### Methods

| Name    | Type   | Description                                   |
| ------- | ------ | --------------------------------------------- |
| `focus` | `void` | Focuses the timestamp element.                |
| `close` | `void` | Closes the timestamp element and the overlay. |

## Heatfield

Problems and events in charts can be displayed as heatfields. The `dt-chart`
component takes `dt-chart-heatfield` components as content children.

```html
<dt-chart ...>
  <dt-chart-heatfield [start]="start" [end]="end"></dt-chart-heatfield>
</dt-chart>
```

When clicking on the heatfield button above the chart, further information is
displayed by an [overlay](/components/overlay/) containing a short description
and a link.

<ba-live-example name="DtExampleChartHeatfield" fullwidth></ba-live-example>

By default the color of the heatfield button is red to indicate a problem. By
setting the `color` to `main` you can use the heatfield in theme color, for
example for the overload prevention use case.

### Overload prevention

Dynatrace only shows a maximum amount of data to protect the system and prevent
an overload. To indicate this use case, add a heatfield with `color` set to
`main` to the chart.

<ba-live-example name="DtExampleChartHeatfieldMultiple" fullwidth></ba-live-example>

### Inputs

| Name              | Type               | Default     | Description                                                                 |
| ----------------- | ------------------ | ----------- | --------------------------------------------------------------------------- |
| `start`           | `number`           |             | The start numerical/date value on the x-axis of the chart.                  |
| `end`             | `number`           |             | The end numerical/date value on the x-axis of the chart.                    |
| `active`          | `boolean`          | `false`     | Whether the heatfield is active.                                            |
| `aria-label`      | `string`           | `undefined` | The aria label used for the heatfield button.                               |
| `aria-labelledby` | `string`           | `undefined` | ARIA reference to a label describing the icon in the consumption component. |
| `color`           | `'error' | 'main'` | `'error'`   | Sets the color of the heatfield.                                            |

To make our components accessible it is obligatory to provide either an
`aria-label` or `aria-labelledby`.

### Outputs

| Name           | Type                                         | Description                                     |
| -------------- | -------------------------------------------- | ----------------------------------------------- |
| `activeChange` | `EventEmitter<DtChartHeatfieldActiveChange>` | Fires every time when the active state changes. |

## States

<ba-ux-snippet name="chart-states"></ba-ux-snippet>

## Value 0 vs. no data

<ba-ux-snippet name="chart-value-zero-no-data"></ba-ux-snippet>

## Switching metrics

<ba-ux-snippet name="chart-switching-metrics"></ba-ux-snippet>
