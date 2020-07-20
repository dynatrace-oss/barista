# fluid-switch

A basic representation of the switch input

## Properties

| Property   | Attribute  | Type      | Default | Description                                     |
| ---------- | ---------- | --------- | ------- | ----------------------------------------------- |
| `checked`  | `checked`  | `boolean` |         | Whether the switch is considered `on` or `off`. |
| `disabled` | `disabled` | `boolean` | false   | Whether the switch is disabled or not           |
| `value`    | `value`    | `string`  | "on"    | The value attribute of the native input element |

## Methods

| Method   | Type       | Description              |
| -------- | ---------- | ------------------------ |
| `toggle` | `(): void` | Toggle the checked state |

## Events

| Event    | Description                                                                           |
| -------- | ------------------------------------------------------------------------------------- |
| `change` | Event that is being fired when the switch state changes due<br />to user interaction. |

## Slots

| Name | Description                                                |
| ---- | ---------------------------------------------------------- |
|      | Default slot lets the user provide a label for the switch. |

## CSS Custom Properties

| Property                                 | Description                                                            |
| ---------------------------------------- | ---------------------------------------------------------------------- |
| `--fluid-switch--container`              | Customize the container color.                                         |
| `--fluid-switch--container-fill-checked` | Customize the fill color when<br />the switch is in the checked state. |
| `--fluid-switch--fill`                   | Customize the switch fill color.                                       |
| `--fluid-switch--focus`                  | Customize the focus color.                                             |
| `--fluid-switch--knob`                   | Customize the knob color.                                              |
| `--fluid-switch--knob-checked`           | Customize the knob color when<br />the switch is in the checked state. |
| `--fluid-switch--label-color`            | Customize the label color.                                             |
