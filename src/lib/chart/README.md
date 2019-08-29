---
title: 'Chart'
description:
  'The chart component visualizes series of data to easily analyze and compare
  metrics.'
postid: chart
identifier: 'Ch'
category: 'components'
public: true
toc: true
contributors:
  dev:
    - fabian.friedl
    - lukas.holzer
  ux:
    - kathrin.aigner
related:
  - 'micro-chart'
  - 'selection-area'
  - 'colors-chart'
tags:
  - 'angular'
  - 'component'
  - 'chart'
  - 'heatfield'
  - 'selection area'
---

# Chart

The chart component represents one or more metrics. It depends on the given data
which of the available chart types should be used to visualize them. The
`dt-chart` component wraps Highcharts to be used within Angular.

<docs-source-example example="ChartDefaultExample" fullwidth="true"></docs-source-example>

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

| Name                | Type                                       | Description                                                 |
| ------------------- | ------------------------------------------ | ----------------------------------------------------------- |
| `updated`           | `EventEmitter<void>`                       | Event emitted when the chart options or series are updated. |
| `tooltipOpenChange` | `EventEmitter<boolean>`                    | Event emitted when the chart tooltip opens or closes.       |
| `tooltipDataChange` | `EventEmitter<DtChartTooltipEvent | null>` | Event emitted when the tooltip data changes.                |

## Types

There are different chart types available. It strongly depends on the use case
and the given data which one should be used.

### Area chart

<!-- TODO: component demo -->

{{#figure imagebox='true'}}
![Area chart](https://d24pvdz4mvzd04.cloudfront.net/test/chart-type-area-580-13c29cc33a.png)
{{/figure}}

### Area range chart

<docs-source-example example="ChartAreaRangeExample" fullwidth="true"></docs-source-example>

### Bar chart

<docs-source-example example="ChartCategorizedExample" fullwidth="true"></docs-source-example>

<docs-source-example example="ChartStreamExample" fullwidth="true"></docs-source-example>

<docs-source-example example="ChartBarExample" fullwidth="true"></docs-source-example>

### Donut or pie chart

<docs-source-example example="ChartDonutExample"></docs-source-example>

<docs-source-example example="ChartPieExample"></docs-source-example>

### Line chart

<docs-source-example example="ChartLineExample" fullwidth="true"></docs-source-example>

### Mixed chart

Mixed charts combine different chart types, e.g. a bar chart and a line chart.

<docs-source-example example="ChartOrderedColorsExample" fullwidth="true"></docs-source-example>

### Min/Max chart

The min/max chart shows the area between a minimum and a maximum value. The
average or median is represented by a line.

<docs-source-example example="ChartMinMaxExample" fullwidth="true"></docs-source-example>

## Colors

The chart will take a color from a specified chart color palette for the series
data if no color is specified. It depends on the current page theme and the
number of shown metrics which
[chart color palette](/resources/colors/chartcolors/) is used.

```html
<div dtTheme="purple">
  <dt-chart options="myoptions" series="myseries"></dt-chart>
</div>
```

<docs-source-example example="ChartOrderedColorsExample" fullwidth="true"></docs-source-example>

## Legend

The chart legend is always placed below the chart, except for the
[donut or pie chart]({/components/charts#donut-or-pie-chart) where the placement
of the legend can vary.

### Legend icons

The icon size in the chart legend is always 16x16px. The following icons are
used as legends:

- [Bar chart]({{link_to_id id='chart-bar-icon' }})
- [Line chart]({{link_to_id id='chart-legend-line-icon' }})
- [Area chart]({{link_to_id id='chart-legend-area-icon' }})
- [Pie chart]({{link_to_id id='chart-legend-pie-icon' }})
- [Meter chart]({{link_to_id id='chart-legend-meter-icon' }})
- [Percentile chart]({{link_to_id id='chart-legend-percentile-icon' }})
- [Business transaction chart]({{link_to_id id='chart-legend-bt-icon' }})

### Toggle metrics

If there is more than one metric visualized in a chart, clicking a chart legend
toggles the visibility of the according metric. Clicking a chart legend disables
the metric, to make it possible to focus on individual metrics in a chart.
Clicking the legend a second time re-enables the metric.

## Tooltip

The chart supports adding a [tooltip/overlay]({{link_to_id id='overlay' }}) that
wraps other Angular components to show detailed information about chart metrics.
They appear on hover over specific value points within the chart.

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

<docs-source-example example="ChartSelectionAreaDefaultExample" fullwidth="true"></docs-source-example>

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

You have to provide meaningful labels to the range via
`aria-label-selected-area`, `aria-label-left-handle`, `aria-label-right-handle`
and `aria-label-close`, to meet our accessibility standards.

#### Inputs

| Name                       | Type               | Default  | Description                                                                                                               |
| -------------------------- | ------------------ | -------- | ------------------------------------------------------------------------------------------------------------------------- |
| `min`                      | `number`           | `300000` | The minimum range that can be created in milliseconds, by default the minimum range is 5 minutes.                         |
| `max`                      | `number | null`    | `null`   | The maximum range that can be created in a time format. If not set, the range will be capped at the borders of the chart. |
| `value`                    | `[number, number]` | `[0,0]`  | The time frame on the chart's x-axis where the range should be placed.                                                    |
| `aria-label-selected-area` | `string`           | `''`     | Aria label of the selected area that is created.                                                                          |
| `aria-label-left-handle`   | `string`           | `''`     | Aria label of the left handle of the selected area that can resize the selected frame.                                    |
| `aria-label-right-handle`  | `string`           | `''`     | Aria label of the right handle of the selected area that can resize the selected frame.                                   |
| `aria-label-close`         | `string`           | `''`     | Aria label of the close button inside the overlay.                                                                        |

#### Outputs

| Name           | Type                             | Description                                                                                                                            |
| -------------- | -------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------- |
| `valueChanges` | `EventEmitter<[number, number]>` | Event emitted when the values of the selected range have changed. Emits when the drag is complete. _(Not triggered programmatically.)_ |
| `valid`        | `BehaviorSubject<boolean>`       | Event emitted when the selection area is valid, i.e. greater than the minimum constraint.                                              |

#### Methods

| Name    | Type   | Description                |
| ------- | ------ | -------------------------- |
| `focus` | `void` | Focuses the range element. |

### Timestamp

The `dt-chart-timestamp` adds the ability to select one specific point in time
in a chart.

```html
<dt-chart ...>
  <dt-chart-timestamp></dt-chart-timestamp>
</dt-chart>
```

#### Accessibility

You have to provide meaningful labels to the timestamp via `aria-label-selected`
and `aria-label-close`, to meet our accessibility standards.

#### Inputs

| Name                  | Type     | Default | Description                                                           |
| --------------------- | -------- | ------- | --------------------------------------------------------------------- |
| `value`               | `number` | `0`     | The value on the chart's x-axis where the timestamp should be placed. |
| `aria-label-selected` | `string` | `''`    | Aria label for the selected point in time.                            |
| `aria-label-close`    | `string` | `''`    | Aria label of the close button inside the overlay.                    |

#### Outputs

| Name           | Type                   | Description                                                                                                                   |
| -------------- | ---------------------- | ----------------------------------------------------------------------------------------------------------------------------- |
| `valueChanges` | `EventEmitter<number>` | Event emitted when the value of the timestamp has changed by user triggered interactions. _(Not triggered programmatically.)_ |

#### Methods

| Name    | Type   | Description                    |
| ------- | ------ | ------------------------------ |
| `focus` | `void` | Focuses the timestamp element. |

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

<docs-source-example example="ChartHeatfieldExample" fullwidth="true"></docs-source-example>

By default the color of the heatfield button is red to indicate a problem. By
setting the `color` to `main` you can use the heatfield in theme color, for
example for the overload prevention use case.

### Overload prevention

Dynatrace only shows a maximum amount of data to protect the system and prevent
an overload. To indicate this use case, add a heatfield with `color` set to
`main` to the chart.

<docs-source-example example="ChartHeatfieldMultipleExample" fullwidth="true"></docs-source-example>

### Inputs

| Name         | Type               | Default   | Description                                                |
| ------------ | ------------------ | --------- | ---------------------------------------------------------- |
| `start`      | `number`           |           | The start numerical/date value on the x-axis of the chart. |
| `end`        | `number`           |           | The end numerical/date value on the x-axis of the chart.   |
| `active`     | `boolean`          | `false`   | Whether the heatfield is active.                           |
| `aria-label` | `string`           |           | The aria label used for the heatfield button.              |
| `color`      | `'error' | 'main'` | `'error'` | Sets the color of the heatfield.                           |

### Outputs

| Name           | Type                                         | Description                                     |
| -------------- | -------------------------------------------- | ----------------------------------------------- |
| `activeChange` | `EventEmitter<DtChartHeatfieldActiveChange>` | Fires every time when the active state changes. |

## States

### Empty state

It can happen that data can't be displayed at all or only small parts of a chart
can be loaded. With empty states we can provide basic information and help users
to understand why the content isn't shown.

<!-- TODO: empty state chart example -->

{{#figure imagebox='true' fullwidth="true"}}
![Too much data to render](https://d24pvdz4mvzd04.cloudfront.net/test/empty-state-example-custom-charting-1280-aa7bef666c.png)
{{/figure}}

Please keep in mind to use the correct empty state according to the use case.
Check our [empty states pattern]({{link_to_id id='empty-states'}}) for
guidelines and other examples.

### Loading state

When chart values are not yet available a loading indicator is shown until all
data has been loaded and can be displayed. Set the chart's `loading-text` input
to add a text next to the loading spinner.

<docs-source-example example="ChartLoadingExample" fullwidth="true"></docs-source-example>

## Value 0 vs. no data

Since our charts are intended to show complex data, it is important to
distinguish between "0" as value and "no data" (a.k.a. "null").

### Value 0

If the chart type is a contiguous linear chart type (e.g. line chart, bar chart,
area chart), 0 values are displayed to maintain continuity.

If the chart type is a non linear chart type (stacked bar chart, pie chart/donut
chart etc.), 0 values will only be visible in legends or in overlays to avoid
manipulating the data visualization.

### No data

If data points are missing the highcharts default should be used to display
gaps.

<docs-source-example example="ChartLineWithGapsExample" fullwidth="true"></docs-source-example>

It may happen that existing data points are displayed as gaps (e.g. timeseries,
area charts where no data is retrieved before and after an existing data point).
In order to avoid this, we recommend using single data points to make the data
visible.

<!-- TODO: example -->

{{#figure imagebox='true'}}
![Data points in charts](https://d24pvdz4mvzd04.cloudfront.net/test/single-data-points-1034-aad3d399da.png)
{{/figure}}

## Switching metrics

The metrics displayed in a chart can be switched by [button
groups]({{link_to_id id='button-group' }}#chart-tabs) that are placed above the
chart.

<!-- TODO: example -->

![Switch metrics](https://d24pvdz4mvzd04.cloudfront.net/test/chart-behavior-switch-580-265f6c83b4.png)
