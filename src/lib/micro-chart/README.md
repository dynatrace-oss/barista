---
type: 'component'
---

# Microchart

The microchart components wraps the chart component. Find more details about theming and reflow on the [chart page](/components/charts/).

## Imports

You have to import the `DtMicroChartModule` when you want to use the `dt-micro-chart`:

```typescript
@NgModule({
  imports: [DtMicroChartModule],
})
class MyModule {}
```

## Initialization

To use a Dynatrace microchart, add the `<dt-micro-chart>` element to the view and set `options` and `series` data using the appropriate attributes.

## Options & Properties

| Name                      | Type                                                    | Default     | Description                                                                                                                                                      |
| ------------------------- | ------------------------------------------------------- | ----------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `@Input() options`        | `DtChartOptions | undefined`                            | `undefined` | Sets options for the chart. `DtChartOptions` extends from `Highcharts.Options`, but removes the series property. The series property is passed as its own input. |
| `@Input() series`         | `Observable<DtChartSeries> | DtChartSeries | undefined` | `undefined` | Sets the series of the chart. The type can either be a stream of series data for continuous updates or a static array.                                           |
| `@Input() labelFormatter` | `(input: number) => string | undefined`                 | `undefined` | Sets the label formatter function for the min and max data point.                                                                                                |
| `@Output() updated`       | `EventEmitter<void>`                                    | -           | Event emitted when the chart options or series are updated.                                                                                                      |

## Getter

| Name                | Return value         | Description                                                   |
| ------------------- | -------------------- | ------------------------------------------------------------- |
| `seriesId`          | `string | undefined` | Gets the series id of the series currently used in the chart. |
| `highchartsOptions` | `Options`            | Returns highchart options which are used in the chart.        |

## Content children

As the microchart component is a wrapper for charts, the same content children – e.g. a `dt-chart-tooltip` – can be used. Find details on the [chart page](/components/charts/).

## Examples

### Default

<docs-source-example example="MicroChartDefaultExample" fullwidth="true"></docs-source-example>

### Columns example

<docs-source-example example="MicroChartColumnsExample" fullwidth="true"></docs-source-example>

### Streamed values example

<docs-source-example example="MicroChartStreamExample" fullwidth="true"></docs-source-example>

### Interpolated values example

<docs-source-example example="MicroChartInterpolatedExample" fullwidth="true"></docs-source-example>

### Columns interpolated values example

<docs-source-example example="MicroChartColumnsInterpolatedExample" fullwidth="true"></docs-source-example>
