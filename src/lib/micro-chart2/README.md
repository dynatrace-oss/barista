---
type: "component"
---

# MicroChart2

<docs-source-example example="MicroChartDefaultExampleComponent" fullwidth="true"></docs-source-example>

This components wraps the chart component, so for theming and reflow see [DtChart](../chart).

## Imports

You have to import the `DtMicroChartModule` when you want to use the `dt-micro-chart`:

```typescript

@NgModule({
  imports: [
    DtMicroChartModule,
  ],
})
class MyModule {}

```

## Initialization

To use the dynatrace chart, add the `<dt-micro-chart options="myoptions" series="myseries" ></dt-micro-chart>` element to the view:

## Options & Properties

| Name | Type | Default | Description |
| --- | --- | --- | --- |
| `@Input() options` | `DtChartOptions | undefined` | `undefined` | Sets options for the chart. DtChartOptions extends from Highcharts.Options, but removes the series property. The series property is passed as it's own input |
| `@Input() series` | `Observable<DtChartSeries> | DtChartSeries | undefined` | `undefined` | Sets the series of the chart. The type can either be a stream of series data for continues updates or a static array. |
| `@Input() labelFormatter` | `(input: number) => string | undefined` | `undefined` | Sets the label formatter function for the min and max data point. |
| `@Output() updated` | `EventEmitter<void>` | | Event emitted when the chart options or series are updated |

## Getter

| Name | Description | Return value |
| --- | --- | --- |
| `seriesId` | Gets the series id of the series currently used in the chart | `string | undefined` |
| `highchartsOptions` | returns highchart options which are used in the chart | `Options` |

## Examples

<!-- ### Columns example

<docs-source-example example="MicroChartColumnsExampleComponent" fullwidth="true"></docs-source-example>

### Streamed values example

<docs-source-example example="MicroChartStreamExampleComponent" fullwidth="true"></docs-source-example> -->
