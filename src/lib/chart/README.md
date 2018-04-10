Styleguide: ***REMOVED***

The {{DtChart}} component wraps highcharts inside the Angular context.
The consumer of the {{DtChart}} can specify the {{options}} and the {{data}} (series) separately.
The basic chart does not set any formater, axis or other highcharts properties. It exposes those options as an Input.

_Example:_
{code:javascript}
...
lineOptions: Highcharts.Options = {
  chart: {
    type: 'line',
  },
  xAxis: {
      type: 'datetime',
  },
  yAxis: {
    min: 100,
    max: 200,
  },
};
...
localDataStatic: DtSeriesOptions = [{
  color: '#C396E0',
  name: 'Actions/min',
  metricId: 'SomeMetricId',
  data: [
    [
      1370304000000,
      140,
    ],
    [
      1370390400000,
      120,
    ],
  ],
}];
{code}
{code:html}
<dt-chart [options]="lineOptions" [data]="localDataStatic"></dt-chart>
{code}

For the options the normal Highcharts namespace interfaces will be used.
For the data the {{Highcharts.IndividualSeriesOptions}} interface is extended by a {{metricId}} property that identifies the type of metric.

The {{data}} Input can be a static array of type {{DtSeriesOptions[]}} or an observable that contains the series data. 
If the data is an observable the {{DtChart}} component takes care of updating the chart whenever the observable fires.
This can be used with a service that polls a rest endpoint for data and emits a value on every update.

*Reflow*
The chart needs to reflow as soon as the container resizes.
There are two cases when the container resizes.
1. The window resizes
2. A component(e.g. SideNav) expands and takes screenspace

The {{DtChart}} component injects a provider of type {{ViewportResizer}}. The {{ViewportResizer}} is an abstract class that has two methods {{emit}} and {{change}}.
{{change}} returns an observable that emits {{ViewportSize}} objects everytime the window resizes or some component calls the {{emit}} function.
The component library provides a default implementation for the {{ViewportResizer}} abstract class as the {{DefaultViewportResizer}}. 
The {{ViewportResizer}} classes and providers will be shipped with the {{core}} module. As discussed with Maciej this might change in the future depending on the outcome of the container responsiveness issue.

*Theming/Coloring*
The chart colorizes the series depending on the color property specified within the {{DtSeriesOptions}}.
Chart colors: ***REMOVED***
If emited it will apply the chart colors per series starting by the darkest shade from the current theme and continuing with one shade lighter per series.

_Example:_
{code:javascript}
...
localDataStatic: DtSeriesOptions = [{
  name: 'Actions/min', // first series
  metricId: 'SomeMetricId',
  data: [
    [
      1370304000000,
      140,
    ],
    [
      1370390400000,
      120,
    ],
  ],
},
{
  name: 'Failure rate', // second series
  metricId: 'SomeOtherMetricId',
  data: [
    [
      1370304000000,
      90,
    ],
    [
      1370390400000,
      80,
    ],
  ],
}];
{code}
{code:html}
<div dtTheme="purple">
  <dt-chart [options]="localOptions" [data]="localDataStatic"></dt-chart>
</div>
{code}

The example above would then automatically set the color for the first series as {{$purple-700}} and the color for the second series as {{$purple-600}} since the theme for the container is the purple theme.

*MetricId* 
The {{DtChart}} class has a getter {{metricIds}} that returns an array containing all {{metricId}} values for all series used in the chart.

*TimeseriesChart/AvailabilityChart*
One idea during the discussions was to have a simple highcharts wrapping component and for special types of charts than can be put into categories, like TimeseriesChart or an AvailabilityChart - there should be a component that wraps the basic chart and provides for example axis unit formatters or axis types as hardcoded values within. 