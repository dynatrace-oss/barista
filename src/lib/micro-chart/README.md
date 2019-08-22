---
title: 'Micro chart'
description:
  'The micro chart component is a smaller version of a chart where the amount of
  displayed information is reduced.'
postid: micro-chart
category: 'components'
public: true
toc: true
themable: true
properties:
  - 'work in progress'
contributors:
  dev:
    - fabian.friedl
    - david.laubreiter
  ux:
    - kathrin.aigner
related:
  - 'chart'
tags:
  - 'chart'
  - 'data'
  - 'angular'
  - 'component'
---

# Microchart

Micro charts are smaller versions of charts. The amount of information shown is
reduced to the bare minimum. They use little screen estate and are used to
indicate a trend.

<docs-source-example example="MicroChartDefaultExample" fullwidth="true"></docs-source-example>

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

_Datapoint micro charts are not yet implemented in Angular. If you are
interested in the implementation progress,
[reach out to the DesignOps team](https://dynatrace.slack.com/messages/CJUCU3J6T)._

#### Bar chart

{{#figure imagebox='true'}}
![microchart-bar](https://d24pvdz4mvzd04.cloudfront.net/test/microchart-bar-206-e3d25d75c8.png)
{{/figure}}

#### Stacked bar chart

{{#figure imagebox='true'}}
![microchart-stacked-bar](https://d24pvdz4mvzd04.cloudfront.net/test/microchart-stacked-739-57f0371110.png)
{{/figure}}

#### Pie or donut chart

{{#figure imagebox='true'}}
![microchart-donut](https://d24pvdz4mvzd04.cloudfront.net/test/microchart-donut-339-9edbe58d0f.png)
{{/figure}}

Datapoint micro charts show one or multiple metrics. A legend is not necessary
if the key is mentioned somewhere else (e.g. headline, label, etc.)

If datapoint micro charts are grouped they will share a legend component
together.

{{#figure imagebox='true' fullwidth='true'}}
![microchart-grouped-bars](https://d24pvdz4mvzd04.cloudfront.net/test/microchart-grouped-bars-1604-03903594b1.png)
{{/figure}}

### Timeseries charts

It is possible to show maximum or minimum values in timeseries micro charts. The
values are displayed as labels which are attached to specific data points or
bars. They are highlighted in a darker contrast color of the same color palette.

#### Line chart

<docs-source-example example="MicroChartDefaultExample" fullwidth="true"></docs-source-example>

#### Column chart

<docs-source-example example="MicroChartColumnsExample" fullwidth="true"></docs-source-example>

<docs-source-example example="MicroChartStreamExample" fullwidth="true"></docs-source-example>

## Colors

The entire micro chart is themable and follows the usual
[theming]({{link_to_id id='theming'}}) conventions for charts.

## Value interpolation

Empty data points are calculated by interpolating the previous and the next data
point. If missing data occurs at the beginning or end of a series the next or
the previous value will be repeated to avoid having gaps.

### Line chart

<docs-source-example example="MicroChartInterpolatedExample" fullwidth="true"></docs-source-example>

### Bar chart

<docs-source-example example="MicroChartColumnsInterpolatedExample" fullwidth="true"></docs-source-example>

## Do's and dont's

You can't click or navigate inside a micro chart. Use a
[chart]({{link_to_id id='chart'}}) if needed.
