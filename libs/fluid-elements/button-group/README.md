# fluid-button-group-item

A basic representation of the button-group-item

## Properties

| Property   | Attribute  | Type      | Default    | Description                                                |
| ---------- | ---------- | --------- | ---------- | ---------------------------------------------------------- |
| `checked`  | `checked`  | `boolean` | `false`    | Whether the button-group-item is checked or not.           |
| `disabled` | `disabled` | `boolean` | `false`    | Whether the button-group-item is disabled or not.          |
| `tabbed`   | `tabbed`   | `boolean` | `false`    | Whether the button-group-item was navigated to using keys. |
| `id`       | `id`       | `string`  | `"unique"` | The id attribute of the native input element.              |
| `name`     | `name`     | `string`  |            | The name attribute of the native input element.            |
| `tabIndex` | `tabIndex` | `number`  | `0`        | Property for the tabindex of the svg in the template.      |
| `value`    | `value`    | `string`  |            | The value attribute of the native input element.           |

## Events

| Event           | Description                                                                                              |
| --------------- | -------------------------------------------------------------------------------------------------------- |
| `checkedChange` | Event that is being fired when the button-group-item checked state changes due<br />to user interaction. |

## Slots

| Name | Description                                                           |
| ---- | --------------------------------------------------------------------- |
|      | Default slot lets the user provide a label for the button-group-item. |

## CSS Custom Properties

| Property                                        | Description                                                     |
| ----------------------------------------------- | --------------------------------------------------------------- |
| `--fluid-button-group-item--label-color`        | Customize the label color.                                      |
| `--fluid-button-group-item--radio-active-color` | Customize the color of the button-group-item nob when active.   |
| `--fluid-button-group-item--radio-hover-color`  | Customize the color of the button-group-item nob when hovering. |

# fluid-button-group

A basic representation of the button-group wrapper for button-group-items

## Properties

| Property     | Attribute   | Type             | Description                                                 |
| ------------ | ----------- | ---------------- | ----------------------------------------------------------- |
| `checkedId`  | `checkedId` | `string || null` | Currently checked button group item.                        |
| `disableAll` | `disabled`  | `boolean`        | Whether the component and the children are disabled or not. |

## Slots

| Name | Description                                                                                |
| ---- | ------------------------------------------------------------------------------------------ |
|      | Default slot lets the user provide a label for the button-group.<br />to user interaction. |
