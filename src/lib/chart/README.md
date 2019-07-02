---
type: "component"
---

# Chart

The `dt-chart` component wraps highcharts to be used within angular.

## Imports

You have to import the `DtChartModule` when you want to use the `dt-chart`:

```typescript

@NgModule({
  imports: [
    DtChartModule,
  ],
})
class MyModule {}

```

## Initialization

To use the Dynatrace chart, add the `<dt-chart options="myoptions" series="myseries"></dt-chart>` element to the view.

## Inputs

| Name | Type | Default | Description |
| --- | --- | --- | --- |
| `options` | `DtChartOptions | undefined` | `undefined` | Sets options for the chart. `DtChartOptions` extends from Highcharts.Options, but removes the series property. The series property is passed as it's own input. |
| `series` | `Observable<Highcharts.IndividualSeriesOptions[]> | Highcharts.IndividualSeriesOptions[] | undefined` | `undefined` | Sets the series of the chart. The type can either be an observable or a static array. |
| `loading-text` | `string` |  | The loading text of the loading distractor. |


## Outputs

| Name | Type | Description |
| --- | --- | --- |
| `updated` | `EventEmitter<void>`| Event emitted when the chart options or series are updated |
| `tooltipOpenChange` | `EventEmitter<boolean>` | Event emitted when the chart tooltip closes or opens |
| `tooltipDataChange` | `EventEmitter<DtChartTooltipEvent | null>` | Event emitted when the tooltip data changes |

## Theming

The chart will take a chart color for the series data if no color is specified for the series. If no theme is set the default color palette is used. For charts within themes with no more than 3 series a theme palette is available.
For charts with more than 3 series, an ordered list of chart colors is used to ensure enough contrast.

```html

<div dtTheme="purple">
  <dt-chart options="myoptions" series="myseries" ></dt-chart>
</div>

```

## Reflow

The chart needs the **ViewportResizer** provider. The ViewportResizer notifies the `dt-chart` component about Viewport changes that trigger a reflow of the `dt-chart`.

## Tooltip

The chart supports adding a tooltip that wraps other angular components. The `dt-chart` component takes a `dt-chart-tooltip` component as a content child. The `dt-chart-tooltip` component needs a `ng-template` as a content child. This `ng-template` receives the same object passed to the context as the "normal" highcharts tooltip formatter function would receive. Don't forget to declare the variable for the implicit context on the `ng-template`.

```html
  <dt-chart ... >
    <dt-chart-tooltip>
      <ng-template let-tooltipdata>
        {{tooltipdata.point.y}}
      </ng-template>
    </dt-chart-tooltip>
  </dt-chart>
```

## Heatfield

The chart supports adding heatfields. The `dt-chart` component takes `dt-chart-heatfield` components as content children. The `dt-chart-heatfield` component is themeable. By setting the `color` to `main` you can use the heatfield in theme color (for example for the overload prevention usecase).  

```html
  <dt-chart ... >
    <dt-chart-heatfield [start]="start" [end]="end"></dt-chart-heatfield>
  </dt-chart>
```

### Inputs

| Name | Type | Default | Description |
| --- | --- | --- | --- |
| `start` | `number` |  | The start numerical/date value on the x axis of the chart |
| `end` | `number` | | The end numerical/date value on the x axis of the chart | 
| `active` | `boolean` | `false` | Wether the heatfield is active |
| `aria-label` | `string` |  | The aria label used for the heatfield button |
| `color` | `'error' | 'main'` | `'error'` | Sets the color for the heatfield button |


### Outputs

| Name | Type | Description |
| --- | --- | --- |
| `activeChange` | `Eventemitter<DtChartHeatfieldActiveChange>` | Fires every time when the active state changes |

## Examples

### Default

<docs-source-example example="ChartDefaultExample" fullwidth="true"></docs-source-example>

### Stream example with colors

<docs-source-example example="ChartStreamExample" fullwidth="true"></docs-source-example>

### Chart with more than 3 series example

<docs-source-example example="ChartOrderedColorsExample" fullwidth="true"></docs-source-example>

### Loading example

<docs-source-example example="ChartLoadingExample" fullwidth="true"></docs-source-example>

### Categorized

<docs-source-example example="ChartCategorizedExample" fullwidth="true"></docs-source-example>

### Pie chart

<docs-source-example example="ChartPieExample" fullwidth="true"></docs-source-example>

### AreaRange chart

<docs-source-example example="ChartAreaRangeExample" fullwidth="true"></docs-source-example>

### Heatfield & Overload prevention

<docs-source-example example="ChartHeatfieldExample" fullwidth="true"></docs-source-example>

<docs-source-example example="ChartHeatfieldMultipleExample" fullwidth="true"></docs-source-example>
