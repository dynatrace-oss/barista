---
type: "component"
---

# Chart

<docs-source-example example="ChartDefaultExampleComponent" fullwidth="true"></docs-source-example>

This dt-chart component wraps highcharts to be used within angular.

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

To use the dynatrace chart, add the `<dt-chart options="myoptions" series="myseries" ></dt-chart>` element to the view:

## Options & Properties

| Name | Type | Default | Description |
| --- | --- | --- | --- |
| `@Input() options` | `DtChartOptions | undefined` | `undefined` | Sets options for the chart. DtChartOptions extends from Highcharts.Options, but removes the series property. The series property is passed as it's own input |
| `@Input() series` | `Observable<Highcharts.IndividualSeriesOptions[]> | Highcharts.IndividualSeriesOptions[] | undefined` | `undefined` | Sets the series of the chart. The type can either be a stream of series data for continues updates or a static array. |
| `@Output() updated` | `EventEmitter<void>` | | Event emitted when the chart options or series are updated |

## Methods

| Name | Description | Return value |
| --- | --- | --- |
| `getSeries` | Gets the series currently used in the chart | `DtChartSeries` |
| `getAllIds` | returns all series ids used in the chart | `Array<string>` |

## Theming

The chart will take a chart color for the series data if no color is specified for the series. If no theme is set the default color palette is used. For charts within themes with no more than 3 series a theme palette is available.
For charts with more than 3 series, an ordered list of chart colors for good contrast is used.

*Example:*

```html

<div dtTheme="purple">
  <dt-chart options="myoptions" series="myseries" ></dt-chart>
</div>

```

## Reflow

The chart needs the **ViewportResizer** provider.
ViewportResizer notifies the dt-chart component about Viewport changes that trigger a reflow of the dt-chart.

## Tooltip

The chart supports adding a tooltip that works with angular components inside. The `dt-chart` component takes a `dt-chart-tooltip` component as a content child. The `dt-chart-tooltip` component needs a `ng-template` as a content child. This `ng-template` receives the same object passed to the context as the "normal" highcharts tooltip formatter function would receive. Don't forget to declare the variable for the implicit context on the ng-template.

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

The chart supports adding heatfields. The `dt-chart` component takes `dt-chart-heatfield` components as content children. The `dt-chart-heatfield` component is themeable. By setting the `color` to `main` you can use the heatfield for overload prevention usecases.  

```html
  <dt-chart ... >
    <dt-chart-heatfield [start]="start" [end]="end"></dt-chart-heatfield>
  </dt-chart>
```

### Options & Properties

| Name | Type | Default | Description |
| --- | --- | --- | --- |
| `@Input() start` | `number` |  | The start numerical/date value on the x axis of the chart |
| `@Input() end` | `number` | | The end numerical/date value on the x axis of the chart | 
| `@Input() active` | `boolean` | `false` | Wether the heatfield is active |
| `@Input() aria-label` | `string` |  | The aria label used for the heatfield button |
| `@Input() loading-text` | `string` |  | The loading text of the loading distractor |
| `@Input() color` | `'error' | 'main'` | `'error'` | The aria label used for the heatfield button |
| `@Output() activeChange` | `Eventemitter<DtChartHeatfieldActiveChange>` |  | Fires every time when the active state changes |

## Examples

### Stream example with colors

<docs-source-example example="ChartStreamExampleComponent" fullwidth="true"></docs-source-example>

### Chart with more than 3 series example

<docs-source-example example="ChartOrderdColorsExampleComponent" fullwidth="true"></docs-source-example>

### Loading example

<docs-source-example example="ChartLoadingExampleComponent" fullwidth="true"></docs-source-example>

### Categorized

<docs-source-example example="ChartCategorizedExampleComponent" fullwidth="true"></docs-source-example>

### Pie chart

<docs-source-example example="ChartPieExampleComponent" fullwidth="true"></docs-source-example>

### AreaRange chart

<docs-source-example example="ChartAreaRangeExampleComponent" fullwidth="true"></docs-source-example>

### Tooltip example

<docs-source-example example="ChartTooltipExampleComponent" fullwidth="true"></docs-source-example>

### Heatfield & Overload prevention

<docs-source-example example="ChartHeatfieldExampleComponent" fullwidth="true"></docs-source-example>

<docs-source-example example="ChartHeatfieldMultipleExampleComponent" fullwidth="true"></docs-source-example>
