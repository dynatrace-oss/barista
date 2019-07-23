---
type: 'component'
---

# TimelineChart

The timeline chart takes a value, a unit and a number of timing and key-timing
markers and displays them on a horizontal bar.

<docs-source-example example="TimelineChartDefaultExample"></docs-source-example>

## Imports

You have to import the `DtTimelineChartModule` when you want to use the
`<dt-timeline-chart>`:

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
"key-timing" (`DtTimelineChartKeyTimingMarker`) markers. Each marker needs an
identifier which should be a single unique character and a value. The value is
used to position the marker on the horizontal timeline bar. For each timing
marker the chart will also create an item in the legend below the chart.

**Inputs**

| Name         | Type     | Default | Description                                 |
| ------------ | -------- | ------- | ------------------------------------------- |
| `identifier` | `string` | -       | The single character identifier character." |
| `value`      | `number` | `0`     | The actual value of the marker.             |

**Overlay**

For timing markers you can also add additional information that will be
displayed in an overlay when hovering the legend item.

<docs-source-example example="TimelineChartOverlayExample"></docs-source-example>
