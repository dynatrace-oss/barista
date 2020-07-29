---
strapiPageID: 4
---

# fluid-button

This is an experimental button element built with lit-elements and
web-components. It registers itself as `fluid-button` custom element.

## Properties

| Property   | Attribute  | Type                                           | Default    | Description                               |
| ---------- | ---------- | ---------------------------------------------- | ---------- | ----------------------------------------- |
| `color`    | `color`    | `'main' \| 'positive' \| 'warning' \| 'error'` | "'main'"   | Defines the color theme of the button.    |
| `disabled` | `disabled` | `boolean`                                      | false      | Defines if the button is disabled or not. |
| `emphasis` | `emphasis` | `'low' \| 'medium' \| 'high'`                  | "'medium'" | Defines the emphasis of the button.       |
| `size`     | `size`     | `'small' \| 'default' \| 'large'`              | "'large'"  | Defines the size of the button.           |

## Slots

| Name | Description                                                      |
| ---- | ---------------------------------------------------------------- |
|      | The content of the button will be put inside the button element. |

## CSS Custom Properties

| Property                                     | Description                                                    |
| -------------------------------------------- | -------------------------------------------------------------- |
| `--fluid-button--background-disabled`        | Controls the background color for the disabled state.          |
| `--fluid-button--background-key`             | Controls the background color for the key setting.             |
| `--fluid-button--background-key-active`      | Controls the background active color for the key setting.      |
| `--fluid-button--background-key-hover`       | Controls the background hover color for the key setting.       |
| `--fluid-button--background-negative`        | Controls the background color for the negative setting.        |
| `--fluid-button--background-negative-active` | Controls the background active color for the negative setting. |
| `--fluid-button--background-negative-hover`  | Controls the background hover color for the negative setting.  |
| `--fluid-button--background-positive`        | Controls the background color for the positive setting.        |
| `--fluid-button--background-positive-active` | Controls the background active color for the positive setting. |
| `--fluid-button--background-positive-hover`  | Controls the background hover color for the positive setting.  |
| `--fluid-button--background-warning`         | Controls the background color for the warning setting.         |
| `--fluid-button--background-warning-active`  | Controls the background active color for the warning setting.  |
| `--fluid-button--background-warning-hover`   | Controls the background hover color for the warning setting.   |
| `--fluid-button--foreground-disabled`        | Controls the foreground color for the disabled state.          |
| `--fluid-button--foreground-key`             | Controls the foreground color for the key setting.             |
| `--fluid-button--foreground-key-active`      | Controls the foreground active color for the key setting.      |
| `--fluid-button--foreground-key-hover`       | Controls the foreground hover color for the key setting.       |
| `--fluid-button--foreground-negative`        | Controls the foreground color for the negative setting.        |
| `--fluid-button--foreground-negative-active` | Controls the foreground active color for the negative setting. |
| `--fluid-button--foreground-negative-hover`  | Controls the foreground hover color for the negative setting.  |
| `--fluid-button--foreground-positive`        | Controls the foreground color for the positive setting.        |
| `--fluid-button--foreground-positive-active` | Controls the foreground active color for the positive setting. |
| `--fluid-button--foreground-positive-hover`  | Controls the foreground hover color for the positive setting.  |
| `--fluid-button--foreground-warning`         | Controls the foreground color for the warning setting.         |
| `--fluid-button--foreground-warning-active`  | Controls the foreground active color for the warning setting.  |
| `--fluid-button--foreground-warning-hover`   | Controls the foreground hover color for the warning setting.   |
| `--fluid-button--padding-large`              | Controls the padding for large buttons.                        |
| `--fluid-button--padding-medium`             | Controls the padding for medium buttons.                       |
| `--fluid-button--padding-small`              | Controls the padding for small buttons.                        |
