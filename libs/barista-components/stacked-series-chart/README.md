# Stacked bar chart

<ba-ux-snippet name="stacked-series-chart-intro"></ba-ux-snippet>

## Imports

You have to import the `DtStackedSeriesChartModule` when you want to use the
`<dt-stacked-series-chart>`:

```typescript
@NgModule({
  imports: [DtStackedSeriesChartModule],
})
class MyModule {}
```

## Modes

This chart allows 2 different modes: Bar and Column

### Bar

<ba-live-example name="DtExampleStackedSeriesChartGeneric" fullwidth></ba-live-example>

### Column

Please be aware that this mode requires a height to be set

<ba-live-example name="DtExampleStackedSeriesChartColumn" fullwidth></ba-live-example>

## Initialization

To create a `dtStackedSeriesChart` in a minimal configuration, only `series`
attribute is required to create a valid output. For multiple series, slices
follow the same order given by the developer

## Options & Properties

### DtStackedSeriesChart

#### CSS variables

Styling variables with default value. One can be set by doing the following:

```css
dt-stacked-series-chart {
  --dt-stacked-series-chart-grid-gap: 32px;
  --dt-stacked-series-chart-max-bar-size: 32px;
  --dt-stacked-series-chart-extra-margin: 16px;
}
```

| Name                                     | Default  | Description                                        |
| ---------------------------------------- | -------- | -------------------------------------------------- |
| `--dt-stacked-series-chart-grid-gap`     | `'16px'` | Gap between tracks                                 |
| `--dt-stacked-series-chart-max-bar-size` | `'16px'` | Size of the track                                  |
| `--dt-stacked-series-chart-extra-margin` | `'0px'`  | For column type, extra margin for long tick format |

#### Inputs

| Name                     | Type                                                      | Default  | Description                                                                                                                                                                                                              |
| ------------------------ | --------------------------------------------------------- | -------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| `mode`                   | `DtStackedSeriesChartMode`                                | `'bar'`  | Display mode.                                                                                                                                                                                                            |
| `series`                 | `DtStackedSeriesChartSeries[]`                            | -        | Array of series with their nodes.                                                                                                                                                                                        |
| `heatFields`             | `DtStackedSeriesHeatField[]`                              | -        | Array of heat fields to be shown at the top -for columns- or at the left-side -for bars-.                                                                                                                                |
| `selectable`             | `boolean`                                                 | false    | Allow selections to be made on chart                                                                                                                                                                                     |
| `selected`               | `[DtStackedSeriesChartSeries, DtStackedSeriesChartNode?]` | -        | Current selection [series, node] node will be null if `selectionMode` is `stack`                                                                                                                                         |
| `selectionMode`          | `DtStackedSeriesChartSelectionMode`                       | 'node'   | Whether to make just the nodes selectable or the whole stack.                                                                                                                                                            |
| `max`                    | `number \| undefined`                                     | -        | Max value in the chart. Useful when binding multiple stacked-series-chart.                                                                                                                                               |
| `fillMode`               | `DtStackedSeriesChartFillMode`                            | -        | Whether each bar should be filled completely or should take into account their siblings and max.                                                                                                                         |
| `valueDisplayMode`       | `DtStackedSeriesChartValueDisplayMode`                    | `'none'` | Sets the display mode for the stacked-series-chart values in legend to either 'none' 'percent' or 'absolute'. In single track chart value is displayed also in legend. For axis value 'none' falls back to 'absolute'    |
| `legends`                | `DtStackedSeriesChartLegend[]`                            | true     | Array of legends that can be used to toggle bar nodes. As change detection is on push the changes will only affect when the reference is different.                                                                      |
| `visibleLegend`          | `boolean`                                                 | true     | Visibility of the legend                                                                                                                                                                                                 |
| `visibleTrackBackground` | `boolean`                                                 | true     | Whether background should be transparent or show a background.                                                                                                                                                           |
| `visibleLabel`           | `boolean`                                                 | true     | Visibility of series label.                                                                                                                                                                                              |
| `visibleValueAxis`       | `boolean`                                                 | true     | Visibility of value axis.                                                                                                                                                                                                |
| `labelAxisMode`          | `DtStackedSeriesChartLabelAxisMode`                       | `full`   | Mode of the label axis, compact would make space for more labels.                                                                                                                                                        |
| `maxTrackSize`           | `number`                                                  | 16       | Maximum size of the track.                                                                                                                                                                                               |
| `continuousAxisType`     | `DtStackedSeriesChartValueContinuousAxisType`             | `'none'` | Sets the type for continuous axis scale calculation to 'none', 'date' or 'linear'. Depending on the type, scale is created in specific way.                                                                              |
| `continuousAxisInterval` | `TimeInterval`                                            | -        | (Only column mode) In case we want a specific interval for ticks (every 5 mins, per day...). You can create custom intervals or install D3-time and use its built-in ones. If used, auto fitting ticks will be discarded |
| `continuousAxisFormat`   | `string`                                                  | -        | Specific format for tick label. It follows d3-format (https://github.com/d3/d3-format) for linear type and d3-time-format (https://github.com/d3/d3-time-format) for date type                                           |
| `continuousAxisMap`      | `DtStackedSeriesChartValueContinuousAxisMap`              | -        | Mapping function to create d3 domain. It is used for d3 understand the domain and build scales properly. If not defined, it will use an "Identity" function to return the label for every node                           |

#### Outputs

| Name             | Type                                     | Description                             |
| ---------------- | ---------------------------------------- | --------------------------------------- |
| `selectedChange` | `EventEmitter<DtStackedSeriesChartNode>` | Event that fires when a node is clicked |

### DtStackedSeriesChartOverlay

The `dtStackedSeriesChartOverlay` directive applies to an `ng-template` element
lets you provide a template for the rendered overlay. The overlay will be shown
when a user hovers the slice in stacked-series-chart. The implicit context
passed to the template follows the `DtStackedSeriesChartTooltipData` interface.

```html
<ng-template dtStackedSeriesChartOverlay let-tooltip>
  <!-- Insert your template for one event here. -->
</ng-template>
```

### DtStackedSeriesChartHeatFieldOverlay

The `dtStackedSeriesChartHeatFieldOverlay` directive applies to an `ng-template`
element lets you provide a template for the heat field overlay. The overlay will
be shown when a user hovers -or selects- the heat field in stacked-series-chart.
The implicit context passed to the template follows `data` property from
`DtStackedSeriesHeatField` interface.

```html
<ng-template dtStackedSeriesChartHeatFieldOverlay let-heatField>
  <!-- Insert your template for one event here. -->
</ng-template>
```

## Models

### DtStackedSeriesChartMode

| Value    | Description       |
| -------- | ----------------- |
| `bar`    | Horizontal tracks |
| `column` | Vertical tracks   |

### DtStackedSeriesChartFillMode

For multiple series charts, every track can be fully filled or take into account
the maximum value among all series

| Value      | Description                                                            |
| ---------- | ---------------------------------------------------------------------- |
| `full`     | It fills the whole track with this series nodes                        |
| `relative` | It takes into account the `max` input and the max value for all series |

### DtStackedSeriesChartValueDisplayMode

For single series charts, legend can display the value as the received value, as
a percentage of the total or not show it.

| Value      | Description                                           |
| ---------- | ----------------------------------------------------- |
| `none`     | Do not display the value in legend                    |
| `absolute` | Display the value present in DtStackedSeriesChartNode |
| `percent`  | Display the percentage of the node within that series |

### DtStackedSeriesChartLabelAxisMode

For the `column` mode, it might be interesting to show the labels rotated in
order that more labels fit in the chart and there is less overlap between them.

| Value     | Description                                                                   |
| --------- | ----------------------------------------------------------------------------- |
| `full`    | Labels parallel to the axis                                                   |
| `compact` | Labels rotated 45º to make space for more                                     |
| `auto`    | Full mode which turns into compact if a label can fit it's proportional width |

### DtStackedSeriesChartSeries

This `DtStackedSeriesChartSeries` holds the information for one series.

| Name    | Type                         | Description                           |
| ------- | ---------------------------- | ------------------------------------- |
| `label` | `string`                     | Name of the series to be shown.       |
| `nodes` | `DtStackedSeriesChartNode[]` | Array of node for the current series. |

### DtStackedSeriesChartNode

This `DtStackedSeriesChartNode` holds the information for every node in a given
series.

| Name    | Type                 | Optional | Description                                                                                             |
| ------- | -------------------- | -------- | ------------------------------------------------------------------------------------------------------- |
| `label` | `string`             | No       | Name of the node to be shown.                                                                           |
| `value` | `number`             | No       | Numeric value used to calculate the slices.                                                             |
| `color` | `DtColors \| string` | Yes      | Color to be used. Fallback to [sorted chart colors](/resources/colors/chartcolors#sorted-chart-colors). |

### DtStackedSeriesChartTooltipData

The context of the overlay will be set to DtStackedSeriesChartTooltipData object
containing useful information that can be used inside the overlay's template

| Name            | Type                       | Description                                                      |
| --------------- | -------------------------- | ---------------------------------------------------------------- |
| `origin`        | `DtStackedSeriesChartNode` | Node passed by user in `series` array.                           |
| `valueRelative` | `number`                   | Numeric percentage value based on this node vs sum of top level. |
| `color`         | `DtColors \| string`       | Color for this node in this state.                               |
| `visible`       | `boolean`                  | If node is visible in the stacked-series-chart.                  |
| `selected`      | `boolean`                  | If node is currently selected.                                   |
| `width`         | `string`                   | Current width in percentage given only the visible nodes.        |

### DtStackedSeriesChartLegend

This `DtStackedSeriesChartLegend` holds the information for every legend item so
color and visibility is unified among same chart but also distributed charts
(i.e. multiple charts in a table).

| Name      | Type                 | Description                                |
| --------- | -------------------- | ------------------------------------------ |
| `label`   | `string`             | Label of the node.                         |
| `color`   | `DtColors \| string` | Color to be used based on nodes and theme. |
| `visible` | `boolean`            | Whether it should be visible.              |

### DtStackedSeriesChartSelectionMode

This `DtStackedSeriesChartSelectionMode` holds the information in whether the
selection should be processed at node level or at stack level

| Value   | Description                                                                                       |
| ------- | ------------------------------------------------------------------------------------------------- |
| `node`  | The nodes within a stack are selectable                                                           |
| `stack` | Only the whole stack is selectable, without holding the information of the specific node selected |

### DtStackedSeriesChartValueContinuousAxisType

This `DtStackedSeriesChartValueContinuousAxisType` holds the information about
the type that will be used for the scale to be processed. As it is not the same
to create a scale for linear and date values

| Value    | Description                                                                                                                               |
| -------- | ----------------------------------------------------------------------------------------------------------------------------------------- |
| `none`   | Scale will be created as ScalePoint. That is, every node is its own tick (No continuous axis)                                             |
| `linear` | Scale will be created as ScaleLinear. This works for real numbers but could also work for non-numeric values like color scales            |
| `date`   | Scale will be created as ScaleTime. This works for date-time values. It can be user with intervals to show ticks every X minutes/hours... |

### DtStackedSeriesChartValueContinuousAxisMap

This `DtStackedSeriesChartValueContinuousAxisMap` holds the function that will
receive the node's label and transform it to the desired value. If not defined,
an "identity function" will be used ((({origin}) => origin.label)) Any mapping
function can be applied but needs to be synced with ContinuousAxisType. Example:
if using ContinuousAxisType: 'date', for labels like "HH:MM:SS", the map
function will parse this value into a new Date() value, so that d3 builds scale
properly

## Examples

### Fill mode

<ba-live-example name="DtExampleStackedSeriesChartFilled" fullwidth></ba-live-example>

### Single selectable stacked bar chart

<ba-live-example name="DtExampleStackedSeriesChartSingle" fullwidth></ba-live-example>

### Connected legend

When needed legend can be set outside and linked to distributed stacked bar
charts. Color for each node should be set in legend object

<ba-live-example name="DtExampleStackedSeriesChartConnectedLegend" fullwidth></ba-live-example>

### Continuous axis - Linear

<ba-live-example name="DtExampleStackedSeriesChartLinear" fullwidth></ba-live-example>

### Continuous axis - Date

<ba-live-example name="DtExampleStackedSeriesChartDate" fullwidth></ba-live-example>

### Heat Fields

<ba-live-example name="DtExampleStackedSeriesChartHeatField" fullwidth></ba-live-example>
