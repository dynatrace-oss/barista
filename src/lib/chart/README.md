---
type: 'component'
---

# Chart

The `dt-chart` component wraps highcharts to be used within angular.

## Imports

You have to import the `DtChartModule` when you want to use the `dt-chart`:

```typescript
@NgModule({
  imports: [DtChartModule]
})
class MyModule {}
```

## Initialization

To use the Dynatrace chart, add the `<dt-chart options="myoptions" series="myseries"></dt-chart>` element to the view.

## Inputs

| Name           | Type                                                                                                  | Default     | Description                                                                                                                                                     |
| -------------- | ----------------------------------------------------------------------------------------------------- | ----------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `options`      | `DtChartOptions | undefined`                                                                          | `undefined` | Sets options for the chart. `DtChartOptions` extends from Highcharts.Options, but removes the series property. The series property is passed as it's own input. |
| `series`       | `Observable<Highcharts.IndividualSeriesOptions[]> | Highcharts.IndividualSeriesOptions[] | undefined` | `undefined` | Sets the series of the chart. The type can either be an observable or a static array.                                                                           |
| `loading-text` | `string`                                                                                              |             | The loading text of the loading distractor.                                                                                                                     |

## Outputs

| Name                | Type                                       | Description                                                |
| ------------------- | ------------------------------------------ | ---------------------------------------------------------- |
| `updated`           | `EventEmitter<void>`                       | Event emitted when the chart options or series are updated |
| `tooltipOpenChange` | `EventEmitter<boolean>`                    | Event emitted when the chart tooltip closes or opens       |
| `tooltipDataChange` | `EventEmitter<DtChartTooltipEvent | null>` | Event emitted when the tooltip data changes                |

## Theming

The chart will take a chart color for the series data if no color is specified for the series. If no theme is set the default color palette is used. For charts within themes with no more than 3 series a theme palette is available.
For charts with more than 3 series, an ordered list of chart colors is used to ensure enough contrast.

```html
<div dtTheme="purple">
  <dt-chart options="myoptions" series="myseries"></dt-chart>
</div>
```

## Reflow

The chart needs the **ViewportResizer** provider. The ViewportResizer notifies the `dt-chart` component about Viewport changes that trigger a reflow of the `dt-chart`.

## Tooltip

The chart supports adding a tooltip that wraps other angular components. The `dt-chart` component takes a `dt-chart-tooltip` component as a content child. The `dt-chart-tooltip` component needs a `ng-template` as a content child. This `ng-template` receives the same object passed to the context as the "normal" highcharts tooltip formatter function would receive. Don't forget to declare the variable for the implicit context on the `ng-template`.

```html
<dt-chart ...>
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
<dt-chart ...>
  <dt-chart-heatfield [start]="start" [end]="end"></dt-chart-heatfield>
</dt-chart>
```

### Inputs

| Name         | Type               | Default   | Description                                               |
| ------------ | ------------------ | --------- | --------------------------------------------------------- |
| `start`      | `number`           |           | The start numerical/date value on the x axis of the chart |
| `end`        | `number`           |           | The end numerical/date value on the x axis of the chart   |
| `active`     | `boolean`          | `false`   | Wether the heatfield is active                            |
| `aria-label` | `string`           |           | The aria label used for the heatfield button              |
| `color`      | `'error' | 'main'` | `'error'` | Sets the color for the heatfield button                   |

### Outputs

| Name           | Type                                         | Description                                    |
| -------------- | -------------------------------------------- | ---------------------------------------------- |
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

### Line chart

<docs-source-example example="ChartLineExample" fullwidth="true"></docs-source-example>

### Line chart with data gaps

<docs-source-example example="ChartLineWithGapsExample" fullwidth="true"></docs-source-example>

### Bar chart

<docs-source-example example="ChartBarExample" fullwidth="true"></docs-source-example>

### Pie chart

<docs-source-example example="ChartPieExample"></docs-source-example>

### Donut chart

<docs-source-example example="ChartDonutExample"></docs-source-example>

### AreaRange chart

<docs-source-example example="ChartAreaRangeExample" fullwidth="true"></docs-source-example>

### Min-Max chart

<docs-source-example example="ChartMinMaxExample" fullwidth="true"></docs-source-example>

### Heatfield & Overload prevention

<docs-source-example example="ChartHeatfieldExample" fullwidth="true"></docs-source-example>

<docs-source-example example="ChartHeatfieldMultipleExample" fullwidth="true"></docs-source-example>

## Chart Selection Area

<docs-source-example example="ChartSelectionAreaDefaultExample" fullwidth="true"></docs-source-example>

The chart selection area creates the possibility to select a specific time frame or moment in a chart. The **Timestamp** is used therefore to select a specific moment on the xAxis of the chart. The **Range** empowers the user to select a desired time frame between two dates. To apply a valid range on a chart it is important to meet the provided constraints. First of all the selected range has to be larger as 5minutes by default. Furthermore the developer can specify a max constraint as well. Once a range was created the user can resize it by the two handles on the left and right side.

To specify an action inside the overlay that is shown by the selection area you can project a button with the `dtChartSelectionAreaAction` directive inside the `dt-chart-timestamp` or `dt-chart-range`. This empowers the developer to have full control on all actions that should be performed.

The close button that will destroy the selection is mandatory!

```html
<dt-chart ...>
  <dt-chart-range>
    <button dt-button dtChartSelectionAreaAction i18n>Apply</button>
  </dt-chart-range>
</dt-chart>
```

Furthermore it is possible to have both `dt-chart-range` and `dt-chart-timestamp` along side in a chart. This enables the user to either select a moment or a time frame on the x-Axis of the chart.

```html
<dt-chart ...>
  <dt-chart-range></dt-chart-range>
  <dt-chart-timestamp></dt-chart-timestamp>
</dt-chart>
```

### Range

Adding the ability to select a desired time frame between two timestamps in a chart with a `dt-chart-range`.

```html
<dt-chart ...>
  <dt-chart-range></dt-chart-range>
</dt-chart>
```

#### Accessibility

You have to provide meaningful labels to the range via `aria-label-selected-area`, `aria-label-left-handle`, `aria-label-right-handle` and `aria-label-close`, to meet our accessibility standards.

#### Inputs

| Name                       | Type               | Default  | Description                                                                                                            |
| -------------------------- | ------------------ | -------- | ---------------------------------------------------------------------------------------------------------------------- |
| `min`                      | `number`           | `300000` | The minimum range that can be created in milliseconds, by default the minimum range is 5 minutes.                      |
| `max`                      | `number | null`    | `null`   | The maximum range that can be created in a time format, if non is set, the range will cap at the borders of the chart. |
| `value`                    | `[number, number]` | `[0,0]`  | The time frame on the charts xAxis where the range should be placed                                                    |
| `aria-label-selected-area` | `string`           | `''`     | Aria label of the selected area that is created.                                                                       |
| `aria-label-left-handle`   | `string`           | `''`     | Aria label of the left handle of the selected area that can resize the selected frame.                                 |
| `aria-label-right-handle`  | `string`           | `''`     | Aria label of the right handle of the selected area that can resize the selected frame.                                |
| `aria-label-close`         | `string`           | `''`     | Aria label of the close button inside the overlay.                                                                     |

##### Outputs

| Name           | Type                             | Description                                                                                                                          |
| -------------- | -------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------ |
| `valueChanges` | `EventEmitter<[number, number]>` | Event emitted when the values of the selection are have changed. Emits when the drag is complete. _(Not triggered programmatically)_ |
| `valid`        | `BehaviorSubject<boolean>`       | Event emitted when the selection area is valid _(greater than the minimum constraint)_                                               |

##### Methods

| Name    | Type   | Description               |
| ------- | ------ | ------------------------- |
| `focus` | `void` | Focuses the range element |

### Timestamp

Adding the ability to select one specific moment in a chart with a `dt-chart-timestamp`.

```html
<dt-chart ...>
  <dt-chart-timestamp></dt-chart-timestamp>
</dt-chart>
```

#### Accessibility

You have to provide meaningful labels to the range via `aria-label-selected` and `aria-label-close`, to meet our accessibility standards.

#### Inputs

| Name                  | Type     | Default | Description                                                        |
| --------------------- | -------- | ------- | ------------------------------------------------------------------ |
| `value`               | `number` | `0`     | The value on the chart xAxis where the timestamp should be placed. |
| `aria-label-selected` | `string` | `''`    | Aria label for the selected moment.                                |
| `aria-label-close`    | `string` | `''`    | Aria label of the close button inside the overlay.                 |

##### Outputs

| Name           | Type                   | Description                                                                                                                  |
| -------------- | ---------------------- | ---------------------------------------------------------------------------------------------------------------------------- |
| `valueChanges` | `EventEmitter<number>` | Event emitted when the value of the timestamp has changed by user triggered interactions. _(Not triggered programmatically)_ |

##### Methods

| Name    | Type   | Description                   |
| ------- | ------ | ----------------------------- |
| `focus` | `void` | Focuses the timestamp element |
