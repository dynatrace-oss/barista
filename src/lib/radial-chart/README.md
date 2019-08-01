---
type: 'component'
---

# Radial chart

The radial chart component is used to display one or more data series either as
pie chart or donut chart.

<docs-source-example example="RadialChartDefaultExample"></docs-source-example>

## Imports

You have to import the `DtRadialChartModule` when you want to use the
`<dt-radial-chart>`:

```typescript
@NgModule({
  imports: [DtRadialChartModule],
})
class MyModule {}
```

## Initialization

## DtRadialChart inputs

| Name       | Type              | Default | Description                                                                                                                        |
| ---------- | ----------------- | ------- | ---------------------------------------------------------------------------------------------------------------------------------- |
| `type`     | `'pie' | 'donut'` | `'pie'` | The chart type; can be either a pie chart or a donut chart.                                                                        |
| `maxValue` | `number`          | `null`  | The maximum chart value that defines the full circle. If not set the maximum value is equal to the sum of all chart series values. |
| `start`    | `number`          | `0`     | **Not yet implemented.** Where the series should start, default is 0 which is on top.                                              |

## DtRadialChartSeries inputs

| Name    | Type     | Default                             | Description                                                                                       |
| ------- | -------- | ----------------------------------- | ------------------------------------------------------------------------------------------------- |
| `value` | `number` | -                                   | The series value (required).                                                                      |
| `name`  | `string` | -                                   | The series name.                                                                                  |
| `color` | `string` | `DT_CHART_COLOR_PALETTE_ORDERED[i]` | The color in which the series is displayed within the chart. Defaults to the chart-color-palette. |

## Examples

<!-- TODO -->
