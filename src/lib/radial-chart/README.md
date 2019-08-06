---
type: 'component'
---

# Radial chart

The radial chart component is used to display one or more data series either as
pie chart or donut chart.

<!-- TODO: A pie chart is commonly used to ... -->

<docs-source-example example="RadialChartDefaultPieExample"></docs-source-example>

<!-- TODO: Use a donut chart when you want to display ... -->

<docs-source-example example="RadialChartDefaultDonutExample"></docs-source-example>

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

| Name       | Type              | Default | Description                                                                                                                        |
| ---------- | ----------------- | ------- | ---------------------------------------------------------------------------------------------------------------------------------- |
| `type`     | `'pie' | 'donut'` | `'pie'` | The chart type; can be either a pie chart or a donut chart.                                                                        |
| `maxValue` | `number`          | `null`  | The maximum chart value that defines the full circle. If not set the maximum value is equal to the sum of all chart series values. |
| `start`    | `number`          | `0`     | **Not yet implemented.** Where the series should start, default is 0 which is on top.                                              |

### Max value

When no maximum value is given, all series data add up to 100%, i.e. a full
circle. It's optional to define a maximum value. If the sum of all series values
is below this value, the missing part of the circle is filled with a background
color. If the sum of all series values is above the defined maxium value, this
value is ignored.

<docs-source-example example="RadialChartMaxvalueExample"></docs-source-example>

## DtRadialChartSeries inputs

| Name    | Type     | Default                             | Description                                                  |
| ------- | -------- | ----------------------------------- | ------------------------------------------------------------ |
| `value` | `number` | -                                   | The series value (required).                                 |
| `name`  | `string` | -                                   | The series name (required).                                  |
| `color` | `string` | `DT_CHART_COLOR_PALETTE_ORDERED[i]` | The color in which the series is displayed within the chart. |

### Series color

Each series can have a custom color. When no color is given for a series, the
predefined chart colors are used.

<docs-source-example example="RadialChartCustomColorsExample"></docs-source-example>
