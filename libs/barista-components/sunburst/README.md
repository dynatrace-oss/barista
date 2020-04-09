# Sunburst

<ba-ux-snippet name="sunburst-intro"></ba-ux-snippet>
<ba-live-example name="DtExampleSunburstDefault" fullwidth></ba-live-example>

## Imports

You have to import the `DtSunburstModule` when you want to use the
`<dt-sunburst>`:

```typescript
@NgModule({
  imports: [DtSunburstModule],
})
class MyModule {}
```

## Example setup

<ba-live-example name="DtExampleSunburstRelativeValues" fullwidth></ba-live-example>

## Initialization

To create a `dtSunburst` in a minimal configuration, only `series` attribute is
required to create a valid output.

<ba-live-example name="DtExampleSunburstDefault" fullwidth></ba-live-example>

## Options & Properties

### DtSunburst

#### Inputs

| Name               | Type                  | Default    | Description                                                     |
| ------------------ | --------------------- | ---------- | --------------------------------------------------------------- |
| `series`           | `DtSunburstNode[]`    | -          | Array of nodes with their children (i.e [A,B,C]).               |
| `selected`         | `DtSunburstNode[]`    | -          | Array of selected nodes (i.e [A, A.1, A.1.a]).                  |
| `noSelectionLabel` | `string`              | `All`      | Label to be shown when there's no selection.                    |
| `valueDisplayMode` | `DtSunburstValueMode` | `absolute` | Mode of value visualization. It can be `percent` or `absolute`. |

#### Outputs

| Name             | Type                             | Description                                                                                    |
| ---------------- | -------------------------------- | ---------------------------------------------------------------------------------------------- |
| `selectedChange` | `EventEmitter<DtSunburstNode[]>` | Event that fires when a node is clicked with an array of selected nodes (i.e [A, A.1, A.1.a]). |

### DtSunburstOverlay

The `dtSunburstOverlay` directive applies to an `ng-template` element lets you
provide a template for the rendered overlay. The overlay will be shown when a
user hovers the slice in sunburst. `tooltip` is a `DtSunburstNodeInternal`.

```html
<ng-template dtSunburstOverlay let-tooltip>
  <!-- Insert your template for one event here. -->
</ng-template>
```

## DtSunburstNode

This `DtSunburstNode` can be extended to get as much information as needed (i.e.
filterName, filterValue)

| Name       | Type                | Optional               | Description                                                                                                             |
| ---------- | ------------------- | ---------------------- | ----------------------------------------------------------------------------------------------------------------------- |
| `label`    | `string`            | No                     | Name of the node to be shown.                                                                                           |
| `value`    | `number`            | Yes if it has children | Numeric value used to calculate the slices. If it has children you can skip it and it will be calculated based on them. |
| `color`    | `DtColors | string` | Yes                    | Color to be used. Fallback to [sorted chart colors](/resources/colors/chartcolors#sorted-chart-colors).                 |
| `children` | `DtSunburstNode[]`  | Yes                    | Array of nodes belonging to this parent.                                                                                |

## DtSunburstNodeInternal

Model used internally. It's exposed in the overlay so dev can have more info
when displaying the data

| Name            | Type                       | Description                                                                     |
| --------------- | -------------------------- | ------------------------------------------------------------------------------- |
| `origin`        | `DtSunburstNode`           | Node passed by user in `series` array.                                          |
| `id`            | `string`                   | Internal identifier.                                                            |
| `label`         | `string`                   | Name of the node to be shown. Copied from `origin.label`.                       |
| `value`         | `number`                   | Numeric value. Copied from `origin.value` or calculated from `origin.children`. |
| `valueRelative` | `number`                   | Numeric percentage value based on this node vs sum of top level.                |
| `children`      | `DtSunburstNodeInternal[]` | Array of nodes belonging to this parent.                                        |
| `color`         | `DtColors | string`        | Color for this node in this state.                                              |
| `isCurrent`     | `boolean`                  | If node is the deepest selected one.                                            |
| `visible`       | `boolean`                  | If node is visible in the sunburst.                                             |
| `active`        | `boolean`                  | If node or child are selected.                                                  |
| `showLabel`     | `boolean`                  | If label should be shown based on selection and a minimum angle of slice.       |

## DtSunburstValueMode

This `enum` is used to specify the type of visualization of the labels

| Name       | Value      | Description                                                                |
| ---------- | ---------- | -------------------------------------------------------------------------- |
| `ABSOLUTE` | `absolute` | Data is shown with no transformation.                                      |
| `PERCENT`  | `percent`  | Data is piped to show the percentage value based on the sum of all values. |

## Examples

### Default

<ba-live-example name="DtExampleSunburstDefault" fullwidth></ba-live-example>

### Percent values

<ba-live-example name="DtExampleSunburstRelativeValues" fullwidth></ba-live-example>

### Custom color

<ba-live-example name="DtExampleSunburstCustomColor" fullwidth></ba-live-example>
