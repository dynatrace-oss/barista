# fluid-checkbox

A basic representation of the checkbox input

## Properties

| Property        | Attribute       | Type      | Default | Description                                 |
| --------------- | --------------- | --------- | ------- | ------------------------------------------- |
| `checked`       | `checked`       | `boolean` |         | Defines if the checkbox is checked or not.  |
| `disabled`      | `disabled`      | `boolean` | false   | Defines if the checkbox is disabled or not. |
| `indeterminate` | `indeterminate` | `boolean` |         | Indeterminate state property.               |

## Methods

| Method   | Type       | Description                                                                                          |
| -------- | ---------- | ---------------------------------------------------------------------------------------------------- |
| `toggle` | `(): void` | Toggles the state of the checkbox.<br />When called programmatically will not fire a `change` event. |

## Events

| Event                 | Description                                                                             |
| --------------------- | --------------------------------------------------------------------------------------- |
| `change`              | Event that is being fired when the checkbox state changes due<br />to user interaction. |
| `indeterminateChange` | Event that is being fired when the indeterminate<br />state of the checkbox changes.    |

## Slots

| Name | Description                                                  |
| ---- | ------------------------------------------------------------ |
|      | Default slot lets the user provide a label for the checkbox. |
