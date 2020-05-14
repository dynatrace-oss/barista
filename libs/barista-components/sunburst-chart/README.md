# SunburstChart

<ba-ux-snippet name="sunburst-chart-intro"></ba-ux-snippet>
<ba-live-example name="DtExampleSunburstChartDefault" fullwidth></ba-live-example>

## Imports

You have to import the `DtSunburstChartModule` when you want to use the
`<dt-sunburst-chart>`:

```typescript
@NgModule({
  imports: [DtSunburstChartModule],
})
class MyModule {}
```

## Example setup

<ba-live-example name="DtExampleSunburstChartRelativeValues" fullwidth></ba-live-example>

## Initialization

To create a `dtSunburstChart` in a minimal configuration, only `series`
attribute is required to create a valid output.

<ba-live-example name="DtExampleSunburstChartDefault" fullwidth></ba-live-example>

## Options & Properties

### DtSunburstChart

#### Inputs

| Name               | Type                     | Default      | Description                                                     |
| ------------------ | ------------------------ | ------------ | --------------------------------------------------------------- |
| `series`           | `DtSunburstChartNode[]`  | -            | Array of nodes with their children (i.e [A,B,C]).               |
| `selected`         | `DtSunburstChartNode[]`  | -            | Array of selected nodes (i.e [A, A.1, A.1.a]).                  |
| `noSelectionLabel` | `string`                 | `All`        | Label to be shown when there's no selection.                    |
| `valueDisplayMode` | `'absolute' | 'percent'` | `'absolute'` | Mode of value visualization. It can be `percent` or `absolute`. |

#### Outputs

| Name             | Type                                  | Description                                                                                    |
| ---------------- | ------------------------------------- | ---------------------------------------------------------------------------------------------- |
| `selectedChange` | `EventEmitter<DtSunburstChartNode[]>` | Event that fires when a node is clicked with an array of selected nodes (i.e [A, A.1, A.1.a]). |

#### Methods

| Name           | Params                              | Description                         |
| -------------- | ----------------------------------- | ----------------------------------- |
| `openOverlay`  | `node: DtSunburstChartTooltipNode>` | Open an overlay for the given node. |
| `closeOverlay` |                                     | Closes the overlay if open.         |

### DtSunburstChartOverlay

The `dtSunburstChartOverlay` directive applies to an `ng-template` element lets
you provide a template for the rendered overlay. The overlay will be shown when
a user hovers the slice in sunburst-chart. `tooltip` is a
`DtSunburstChartTooltipData`.

```html
<ng-template dtSunburstChartOverlay let-tooltip>
  <!-- Insert your template for one event here. -->
</ng-template>
```

## DtSunburstChartNode

This `DtSunburstChartNode` holds the information for every slice in the chart.

| Name       | Type                    | Optional               | Description                                                                                                             |
| ---------- | ----------------------- | ---------------------- | ----------------------------------------------------------------------------------------------------------------------- |
| `label`    | `string`                | No                     | Name of the node to be shown.                                                                                           |
| `value`    | `number`                | Yes if it has children | Numeric value used to calculate the slices. If it has children you can skip it and it will be calculated based on them. |
| `color`    | `DtColors | string`     | Yes                    | Color to be used. Fallback to [sorted chart colors](/resources/colors/chartcolors#sorted-chart-colors).                 |
| `children` | `DtSunburstChartNode[]` | Yes                    | Array of nodes belonging to this parent.                                                                                |

## DtSunburstChartTooltipData

The context of the overlay will be set to DtSunburstChartTooltipData object
containing useful information that can be used inside the overlay's template

| Name                      | Type                           | Description                                                                     |
| ------------------------- | ------------------------------ | ------------------------------------------------------------------------------- |
| `origin`                  | `DtSunburstChartNode`          | Node passed by user in `series` array.                                          |
| `id`                      | `string`                       | Internal identifier.                                                            |
| `label`                   | `string`                       | Name of the node to be shown. Copied from `origin.label`.                       |
| `value`                   | `number`                       | Numeric value. Copied from `origin.value` or calculated from `origin.children`. |
| `valueRelative`           | `number`                       | Numeric percentage value based on this node vs sum of top level.                |
| `children`                | `DtSunburstChartTooltipData[]` | Array of nodes belonging to this parent.                                        |
| `depth`                   | `number`                       | Number of levels of children.                                                   |
| `color`                   | `DtColors | string`            | Color for this node in this state.                                              |
| `colorHover` (deprecated) | `DtColors | string`            | Color for this node when hovering in this state.                                |
| `isCurrent`               | `boolean`                      | If node is the deepest selected one.                                            |
| `visible`                 | `boolean`                      | If node is visible in the sunburst-chart.                                       |
| `active`                  | `boolean`                      | If node or child are selected.                                                  |
| `showLabel`               | `boolean`                      | If label should be shown based on selection and a minimum angle of slice.       |

## Examples

### Default

<ba-live-example name="DtExampleSunburstChartDefault" fullwidth></ba-live-example>

### Percent values

<ba-live-example name="DtExampleSunburstChartRelativeValues" fullwidth></ba-live-example>

### Custom color

<ba-live-example name="DtExampleSunburstChartCustomColor" fullwidth></ba-live-example>
