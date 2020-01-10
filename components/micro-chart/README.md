# Micro chart

Micro charts are smaller versions of charts. The amount of information shown is
reduced to the bare minimum. They use little screen estate and are used to
indicate a trend.

<ba-live-example name="DtExampleMicroChartDefault" fullwidth></ba-live-example>

The microchart components wraps the chart component. Find more details about
theming and reflow on the [chart page](/components/charts/).

## Imports

You have to import the `DtMicroChartModule` when you want to use the
`dt-micro-chart`:

```typescript
@NgModule({
  imports: [DtMicroChartModule],
})
class MyModule {}
```

## Initialization

To use a micro chart, add the `<dt-micro-chart>` element to the view and set
`options` and `series` data using the appropriate attributes.

## Inputs

| Name             | Type                                                    | Default     | Description                                                                                                                                                      |
| ---------------- | ------------------------------------------------------- | ----------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `options`        | `DtChartOptions | undefined`                            | `undefined` | Sets options for the chart. `DtChartOptions` extends from `Highcharts.Options`, but removes the series property. The series property is passed as its own input. |
| `series`         | `Observable<DtChartSeries> | DtChartSeries | undefined` | `undefined` | Sets the series of the chart. The type can either be a stream of series data for continuous updates or a static array.                                           |
| `labelFormatter` | `(input: number) => string | undefined`                 | `undefined` | Sets the label formatter function for the min and max data point.                                                                                                |

## Outputs

| Name      | Type                 | Description                                                 |
| --------- | -------------------- | ----------------------------------------------------------- |
| `updated` | `EventEmitter<void>` | Event emitted when the chart options or series are updated. |

## Getter

| Name                | Return value         | Description                                                   |
| ------------------- | -------------------- | ------------------------------------------------------------- |
| `seriesId`          | `string | undefined` | Gets the series ID of the series currently used in the chart. |
| `highchartsOptions` | `Options`            | Returns highchart options which are used in the chart.        |

## Content children

As the microchart component is a wrapper for charts, the same content children –
e.g. a `dt-chart-tooltip` – can be used. Find details on the
[chart page](/components/charts/).

## Variants

There are two main categories for micro charts, the ones that are showing data
of a single timestamp (datapoint charts) and those which are showing data of a
timeframe (timeseries-charts).

### Datapoint charts

Datapoint micro charts are not yet implemented in Angular. If you are interested
in the implementation progress, reach out to the DesignOps team.

#### Bar chart

![microchart-bar](https://d24pvdz4mvzd04.cloudfront.net/test/microchart-bar-206-e3d25d75c8.png)

#### Stacked bar chart

![microchart-stacked-bar](https://d24pvdz4mvzd04.cloudfront.net/test/microchart-stacked-739-57f0371110.png)

#### Pie or donut chart

![microchart-donut](https://d24pvdz4mvzd04.cloudfront.net/test/microchart-donut-339-9edbe58d0f.png)

Datapoint micro charts show one or multiple metrics. A legend is not necessary
if the key is mentioned somewhere else (e.g. headline, label, etc.)

If datapoint micro charts are grouped they will share a legend component
together.

![microchart-grouped-bars](https://d24pvdz4mvzd04.cloudfront.net/test/microchart-grouped-bars-1604-03903594b1.png)

### Timeseries charts

It is possible to show maximum or minimum values in timeseries micro charts. The
values are displayed as labels which are attached to specific data points or
bars. They are highlighted in a darker contrast color of the same color palette.

#### Line chart

<ba-live-example name="DtExampleMicroChartDefault" fullwidth></ba-live-example>

#### Column chart

<ba-live-example name="DtExampleMicroChartColumns" fullwidth></ba-live-example>

<ba-live-example name="DtExampleMicroChartStream" fullwidth></ba-live-example>

## Colors

The entire micro chart is themable and follows the usual
[theming](/patterns/theming) conventions for charts.

## Value interpolation

Empty data points are calculated by interpolating the previous and the next data
point. If missing data occurs at the beginning or end of a series the next or
the previous value will be repeated to avoid having gaps.

### Line chart

<ba-live-example name="DtExampleMicroChartInterpolated" fullwidth></ba-live-example>

### Bar chart

<ba-live-example name="DtExampleMicroChartColumnsInterpolated" fullwidth></ba-live-example>

## Do's and dont's

You can't click or navigate inside a micro chart. Use a
[chart](/components/chart) if needed.
