---
type: "component"
---

# Selection Area

<docs-source-example example="SelectionAreaChartExample" fullwidth="true"></docs-source-example>

The `<dt-selection-area>` creates the possibility to create a box inside an origin element and drag the edges or the entire box within the constraints of the origin element. The selection area itself is not tightly coupled with the chart component but this is the main usecase.
To connect the selection area and the chart you have to use the `dtChartSelectionArea` directive on the `dt-chart` component and provide the instance of the `dt-selection-area` component as an input.

```html
<dt-chart ... [dtChartSelectionArea]="area"></dt-chart>
<dt-selection-area #area="dtSelectionArea" ...>
...
</dt-selection-area>

```


Inside the `dt-selection-area` tags you can specify the content of the overlay that gets created when creating the box. A special outlet for the action button is available called `dt-selection-area-actions`. 

```html
...
<dt-selection-area>
  some overlay content
  <dt-selection-area-actions>
    <button dt-button i18n>Zoom in</button>
  </dt-selection-area-actions>
</dt-selection-area>

```

The `dt-selection-area` component will fire a change event when the box changes with the values for the positions of the handles. When used with a chart the values in the event are the x Axis values for the chart. If used with any other element the values will be pixel values.

When you want to use the selection area connected to any other element than a dt-chart you have to use the `dtSelectionArea` directive on the origin element and connect the area the same way. 

```html
<div class="origin" ... [dtSelectionArea]="area"></div>
<dt-selection-area #area="dtSelectionArea" ...>
...
</dt-selection-area>

```

## Imports

You have to import the `DtSelectionAreaModule` when you want to use the `dt-selection-area`. Note that you also need the `DtChartModule` when using with the `dt-chart` component.

```typescript

@NgModule({
  imports: [
  DtSelectionAreaModule,
  DtChartModule,
  ],
})
class MyModule {}

```

## Accessibility

Selection areas should be given meaningful labels via `aria-label-box`, `aria-label-left-handle`, `aria-label-right-handle` and `aria-label-close-button`, because all those interactive elements dont have a text.

## Options & Properties

| Name | Type | Default | Description |
| --- | --- | --- | --- |
| `@Input('aria-label-box') ariaLabelBox` | `string` |  | Aria label of the box that is created and can be moved.|
| `@Input('aria-label-left-handle') ariaLabelLeftHandle` | `string` | | Aria label of the left handle of the box. |
| `@Input('aria-label-right-handle') ariaLabelRightHandle` | `string` |  | Aria label of the right handle of the box. |
| `@Input('aria-label-close-button') ariaLabelCloseButton` | `string` |  | Aria label of the close button inside the overlay |
| `@Ouput() changed` | `EventEmitter<DtSelectionAreaChange>` |  | Event emitted when the position or width of the box changes |
| `@Ouput() closed` | `EventEmitter<void>` |  | Event emitted when the box is closed |


## Methods

| Name | Description | Return value |
| --- | --- | --- |
| `close` | closes the selection area's box |  |
| `focus` | focuses the box if one is available |  |

## Examples

### Usage on a non chart origin

You can use the selection area connected to any element. Not only charts are supported.

<docs-source-example example="SelectionAreaDefaultExample" fullwidth="true"></docs-source-example>

