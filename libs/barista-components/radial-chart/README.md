# Radial chart

<ba-ux-snippet name="radial-chart-intro"></ba-ux-snippet>

<ba-ux-snippet name="radial-chart-pie"></ba-ux-snippet>

<ba-live-example name="DtExampleRadialChartDefaultPie"></docs-source-example>

<ba-ux-snippet name="radial-chart-donut"></ba-ux-snippet>

<ba-live-example name="DtExampleRadialChartDefaultDonut"></docs-source-example>

## Imports

You have to import the `DtRadialChartModule` when you want to use the
`<dt-radial-chart>`:

```typescript
@NgModule({
  imports: [DtRadialChartModule],
})
class MyModule {}
```

## DtRadialChart inputs

| Name             | Type                 | Default | Description                                                                                                                        |
| ---------------- | -------------------- | ------- | ---------------------------------------------------------------------------------------------------------------------------------- |
| `type`           | `'pie' | 'donut'`    | `'pie'` | The chart type; can be either a pie chart or a donut chart.                                                                        |
| `maxValue`       | `number`             | `null`  | The maximum chart value that defines the full circle. If not set the maximum value is equal to the sum of all chart series values. |
| `legendPosition` | `'right' | 'bottom'` | `right` | Defines where the chart's legend is placed.                                                                                        |

### Max value

When no maximum value is given, all series data add up to 100%, i.e. a full
circle. It's optional to define a maximum value. If the sum of all series values
is below this value, the missing part of the circle is filled with a background
color. If the sum of all series values is above the defined maxium value, this
value is ignored.

<ba-live-example name="DtExampleRadialChartMaxValue"></docs-source-example>

### Legend

A radial chart always needs a legend. It uses the legend component internally.
You can specify the position of the radial chart by adjusting the value of the
`legendPosition` input.

<ba-live-example name="DtExampleRadialChartLegend"></docs-source-example>

## DtRadialChartSeries inputs

| Name    | Type     | Default                             | Description                                                  |
| ------- | -------- | ----------------------------------- | ------------------------------------------------------------ |
| `value` | `number` | -                                   | The series value (required).                                 |
| `name`  | `string` | -                                   | The series name (required).                                  |
| `color` | `string` | `DT_CHART_COLOR_PALETTE_ORDERED[i]` | The color in which the series is displayed within the chart. |

### Series color

Each series can have a custom color. When no color is given for a series, the
predefined chart colors are used.

<ba-live-example name="DtExampleRadialChartCustomColors"></docs-source-example>

## Overlay

A radial chart can have an overlay to display detailed information about the
series.

<ba-live-example name="DtExampleRadialChartOverlay"></docs-source-example>
