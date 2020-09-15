# Micro chart

<ba-ux-snippet name="micro-chart-intro"></ba-ux-snippet>

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

## Variants

<ba-ux-snippet name="micro-chart-variants"></ba-ux-snippet>

## Colors

The entire micro chart is themable and follows the usual
[theming](/patterns/theming) conventions for charts.

## Value interpolation

<ba-ux-snippet name="micro-chart-value-interpolation"></ba-ux-snippet>

## Do's and don'ts

<ba-ux-snippet name="micro-chart-dos-donts"></ba-ux-snippet>
