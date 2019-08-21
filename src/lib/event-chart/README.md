---
type: 'component'
---

# EventChart (experimental)

<docs-source-example example="EventChartDefaultExample"></docs-source-example>

## Imports

You have to import the `DtEventChartModule` when you want to use the
`<dt-event-chart>`:

```typescript
@NgModule({
  imports: [DtEventChartModule],
})
class MyModule {}
```

## Example markup (until full docs are available):

```html
<dt-event-chart>
  <dt-event-chart-event
    *ngFor="let event of _events"
    [value]="event.value"
    [duration]="event.duration"
    [lane]="event.lane"
  >
    <ng-template dtEventChartOverlay>overlay content</ng-template>
  </dt-event-chart-event>

  <dt-event-chart-lane
    *ngFor="let lane of _lanes"
    [name]="lane.name"
    [label]="lane.label"
    [color]="lane.color"
  ></dt-event-chart-lane>

  <dt-event-chart-legend-item
    *ngFor="let item of _legendItems"
    [lanes]="item.lanes"
    >{{ item.label }}</dt-event-chart-legend-item
  >
</dt-event-chart>
```

## Initialization

TODO

## Options & Properties

TODO

| Name | Type | Default | Description |
| ---- | ---- | ------- | ----------- |


## Examples
