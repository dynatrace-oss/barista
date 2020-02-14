# Timeline chart

<ba-ux-snippet name="timeline-chart-intro"></ba-ux-snippet>

<ba-live-example name="DtExampleTimelineChartDefault"></ba-live-example>

## Imports

You have to import the `DtTimelineChartModule` when you want to use the
`<dt-timeline-chart>`.

```typescript
@NgModule({
  imports: [DtTimelineChartModule],
})
class MyModule {}
```

## Inputs

| Name    | Type     | Default | Description                                                                                             |
| ------- | -------- | ------- | ------------------------------------------------------------------------------------------------------- |
| `unit`  | `string` | -       | The unit of the provided values. Needs to be a time-unit like "s".                                      |
| `value` | `number` | `0`     | The value (length) of the timeline chart. In most cases it is the same value as the last timing marker. |

## Markers

The chart takes "timing" (`DtTimelineChartTimingMarker`) markers and
"key-timing" (`DtTimelineChartKeyTimingMarker`) markers, which are used to show
key performance metrics. Each marker needs an identifier which should be a
single unique character and a value. The value is used to position the marker on
the horizontal timeline bar. For each timing marker the chart will also create
an item in the legend below the chart.

### Marker inputs

| Name         | Type     | Default | Description                                 |
| ------------ | -------- | ------- | ------------------------------------------- |
| `identifier` | `string` | -       | The single character identifier character." |
| `value`      | `number` | `0`     | The actual value of the marker.             |

### Overlay

For timing markers you can also add additional information that will be
displayed in an overlay when hovering the legend item.

<ba-live-example name="DtExampleTimelineChartOverlay"></ba-live-example>

### Showing thresholds

**Note:** Threshold markers are not yet implemented in Angular.

It is possible to show a threshold marker in the timeline chart. For each
threshold marker a color needs to be defined. If the duration exceeds the
threshold the bar's color changes to the threshold-color.

![Timeline chart threshold](https://dt-cdn.net/images/timeline-chart-threshold-618-68e05c6ece.png)

If the overall duration is exceeding 70% of a configured threshold (i.e. it's
close to hit the threshold), the timeframe of the chart expands to show the
threshold marker in order to see how close the duration is in respect to the
threshold.

![Timeline chart threshold marker](https://dt-cdn.net/images/timeline-chart-threshold-marker-618-08731581c2.jpg)

The timeframe shown in the chart is expanded to accommodate space for threshold
markers, so that they can be displayed without wrapping or cutting off their
text label.

### Responsive behavior

**Note:** Overlaying markers are not yet implemented in Angular.

If multiple markers are displayed on the same position, they are overlaying each
other (last marker to be added is on top). Hovering a timing marker in the
legend moves the corresponding marker in the chart temporarily to the top in
order to see where the marker is hidden otherwise. Markers overlap as soon as
they get closer together than the radius of one marker.

![timeline chart marker overlap](https://dt-cdn.net/images/timeline-chart-marker-overlap-160-22f3d859c7.jpg)

## Timeline chart in use

A timeline chart is used as a preview for a detailed timing analysis of a user
action. Most of the time it is accompanied with a link (button) to drill-down to
a detailed analysis.

![Timeline chart in use](https://dt-cdn.net/images/timeline-chart-in-use-726-3af8a337f4.jpg)
