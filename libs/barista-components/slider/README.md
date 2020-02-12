# Slider

`DtSlider` is a component that mimics the native html range element. It also
contains an input field, that is used to display the current value of the slider
itself, as well as providing an input for the value. The component can have two
additional components in itself as labels. The first label is for the whole
slider component and the second is for the unit of the slider value.

<ba-live-example name="DtExampleSimpleSlider"></ba-live-example>

## Inputs

| Name       | Type      | Default | Description                                             |
| ---------- | --------- | ------- | ------------------------------------------------------- |
| `value`    | `number`  | `0`     | The initial value for the slider                        |
| `disabled` | `boolean` | `false` | Whether the slider is disabled.                         |
| `min`      | `number`  | `0`     | The minimum value the slider can take.                  |
| `max`      | `number`  | `10`    | The maximum value the slider can take.                  |
| `step`     | `number`  | `1`     | The value of the minimum increment and decrement value. |

## Outputs

| Name     | Type                   | Description                                  |
| -------- | ---------------------- | -------------------------------------------- |
| `change` | `EventEmitter<number>` | Event emitted when the slider value changed. |

## Labels

| Name              | Description                          |
| ----------------- | ------------------------------------ |
| `dt-slider-label` | The label for the slider itself.     |
| `dt-slider-unit`  | The label for the slider value unit. |

## Accessibility

The `DtSlider` tries to mimic the behavior of the native HTML range element
regarding accessibility. It supports the following aria attributes:
`aria-valuenow`, `aria-valuemin`, `aria-valuemax`, `aria-disabled`,
`aria-orientation` (this latter is hard-coded to `horizontal`). It supports the
following keyboard keys:

| Name                          | Description                               |
| ----------------------------- | ----------------------------------------- |
| `arrow-up` and `arrow-right`  | Increase the slider value by `step`.      |
| `arrow-down` and `arrow-left` | Decrease the slider value by `step`.      |
| `page-up`                     | Increase the slider value by `10 * step`. |
| `page-down`                   | Decrease the slider value by `10 * step`. |
| `home`                        | Set the slider value to `min`.            |
| `end`                         | Set the slider value to `max`.            |

## Snapping behavior

If the `DtSlider` component gets a value either from mouse action on the slider
or by a change event on the input field element, the new value of the slider
will be rounded to the nearest valid value. This behavior will take place even
if the value is set programmatically from another component. `max` is considered
a valid value, but only to the accuracy that is defined by the `step`. (So in
the example below, 8.24, the max value, gets rounded down to 8.2, because the
accuracy of the `step`)

<ba-live-example name="DtExampleFractionSlider"></ba-live-example>

## Disabled slider

The `DtSlider` can be disabled. In this state the slider input field gets
disabled as well.

<ba-live-example name="DtExampleDisabledSlider"></ba-live-example>
