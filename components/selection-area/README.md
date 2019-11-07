# Selection Area

**DEPRECATED – will be removed with version 5.0.0** Please use the
`DtChartRange` and `DtChartTimestamp` instead!

The `<dt-selection-area>` creates the possibility to create a selected area
inside an origin element and drag the edges or the entire selected area within
the constraints of the origin element. The selection area itself is not tightly
coupled with the chart component but this is the main usecase. To connect the
selection area and the chart you have to use the `dtChartSelectionArea`
directive on the `dt-chart` component and provide the instance of the
`dt-selection-area` component as an input.

<ba-live-example name="SelectionAreaChartExample" fullwidth="true"></ba-live-example>

```html
<dt-chart ... [dtChartSelectionArea]="area"></dt-chart>
<dt-selection-area #area="dtSelectionArea" ...>
  ...
</dt-selection-area>
```

Inside the `dt-selection-area` tags you can specify the content of the overlay
that gets created when creating the selected area. A special outlet for the
action button is available called `dt-selection-area-actions`.

```html
...
<dt-selection-area>
  some overlay content
  <dt-selection-area-actions>
    <button dt-button i18n>Zoom in</button>
  </dt-selection-area-actions>
</dt-selection-area>
```

The `dt-selection-area` component will fire a change event when the selected
area changes with the values for the positions of the handles. When used with a
chart the values in the event are the x-axis values for the chart. If used with
any other element the values will be pixel values.

When you want to use the selection area connected to any other element than a
dt-chart you have to use the `dtSelectionArea` directive on the origin element
and connect the area the same way.

```html
<div class="origin" ... [dtSelectionArea]="area"></div>
<dt-selection-area #area="dtSelectionArea" ...>
  ...
</dt-selection-area>
```

## Imports

You have to import the `DtSelectionAreaModule` when you want to use the
`dt-selection-area`. Note that you also need the `DtChartModule` when using with
the `dt-chart` component.

```typescript
@NgModule({
  imports: [DtSelectionAreaModule, DtChartModule],
})
class MyModule {}
```

## Accessibility

Selection areas should be given meaningful labels via
`aria-label-selected-area`, `aria-label-left-handle`, `aria-label-right-handle`
and `aria-label-close-button`, because all those interactive elements don't have
a text.

## Options & Properties

| Name                                                       | Type                                  | Default | Description                                                            |
| ---------------------------------------------------------- | ------------------------------------- | ------- | ---------------------------------------------------------------------- |
| `@Input('aria-label-selected-area') ariaLabelselectedArea` | `string`                              |         | Aria label of the selected area that is created and can be moved.      |
| `@Input('aria-label-left-handle') ariaLabelLeftHandle`     | `string`                              |         | Aria label of the left handle of the selected area.                    |
| `@Input('aria-label-right-handle') ariaLabelRightHandle`   | `string`                              |         | Aria label of the right handle of the selected area.                   |
| `@Input('aria-label-close-button') ariaLabelCloseButton`   | `string`                              |         | Aria label of the close button inside the overlay.                     |
| `@Ouput() changed`                                         | `EventEmitter<DtSelectionAreaChange>` |         | Event emitted when the position or width of the selected area changes. |
| `@Ouput() closed`                                          | `EventEmitter<void>`                  |         | Event emitted when the selected area is closed.                        |

## Methods

| Name    | Description                                    | Return value |
| ------- | ---------------------------------------------- | ------------ |
| `close` | Closes the selection area's selected area.     |              |
| `focus` | Focuses the selected area if one is available. |              |

## Interaction

Our selection area was built for mouse, keyboard and touch support. It is
possible to build the component according to your needs and use cases with the
following functionalities:

### Mouse

- **Timestamp:** it is possible to set a timestamp via click. It consists of a
  line and an overlay. The overlay shows the selected timeframe as well as an
  optional primary button and a secondary close button. Timestamps can be used
  for filtering or for drilldowns which can also lead to follow-up screens.
- **Timeframe:** drag creates an area. The overlay additionally consists of a
  primary apply button and a secondary close button. By clicking "apply" the
  chart will zoom into the selected timeframe. The global timeframe will change.
- **Positioning and adjustments:** The chosen timeframe can be adjusted with
  handles. Creating a new area on a different position will destroy the old one.
  A timestamp can be repositioned by creating a new one via click. If a
  timestamp functionality is not needed, a click can also be used to create a
  predefined area.

### Keyboard

To be able to create a timeframe or timestamp, it is necessary to focus the
chart first.

- **Timestamp:** depending on the use case "Enter" will create a line with an
  overlay in the middle of the chart.
- **Timeframe:** a timestamp will transform into an area as soon as you push
  "Shift left" or "Shift right".
- **Positioning and adjustments:** timestamp and timeframe can be adjusted or
  moved to a preferred position by using keys aligned with WAI-ARIA practices.
  For further information on how to use keyboard support, visit the
  <a href="https://www.w3.org/TR/wai-aria-practices/examples/slider/multithumb-slider.html" target="_blank" rel="noopener">
  W3C Horizontal Multi-Thumb Slider Example</a>

### Touch

- **Timestamp:** it is possible to create a timestamp via tap on a preferred
  position.
- **Timeframe:** dragging will create an area.
- **Positioning and adjustments:** same behavior as for mouse support is used.
