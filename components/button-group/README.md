---
title: 'Button group'
description:
  'The button group component is used to switch between different views.'
postid: button-group
identifier: 'Bg'
category: 'components'
public: true
themable: true
contributors:
  dev:
    - thomas.heller
    - daniel.kaneider
  ux:
    - raphaela.raudaschl
related:
  - 'chart'
  - 'button'
  - 'tabs'
tags:
  - 'tabs'
  - 'component'
  - 'angular'
  - 'button'
  - 'buttongroup'
---

# ButtonGroup

A button group has the same behavior as the [tabs
component]({{link_to_id id='tabs'}}) and is used to switch between different
views. The first non-disabled button is always preselected.

<docs-source-example example="ButtonGroupDefaultExample"></docs-source-example>

## Imports

You have to import the `DtButtonGroupModule` when you want to use the
`dt-button-group`

```typescript

@NgModule({
  imports: [
    DtButtonGroupModule,
  ],
}
class MyModule {}

```

## Initialization

To apply the button group component, use the `<dt-button-group>` and
`<dt-button-group-item>` elements.

| Attribute              | Description                                                                                      |
| ---------------------- | ------------------------------------------------------------------------------------------------ |
| `dt-button-group`      | Wrapper element for the button group. It can contain multiple `<dt-button-group-item>` elements. |
| `dt-button-group-item` | The individual button elements.                                                                  |

## Inputs

| Name       | Type                  | Default     | Description                                                                 |
| ---------- | --------------------- | ----------- | --------------------------------------------------------------------------- |
| `value`    | `T | undefined`       | `undefined` | Gets and sets the current value                                             |
| `disabled` | `boolean | undefined` | `undefined` | Sets disabled state if property is set and the value is truthy or undefined |
| `tabIndex` | `number`              | `0`         | Sets and gets the tabIndex property                                         |

<docs-source-example example="ButtonGroupInteractiveExample"></docs-source-example>

## Outputs

| Name          | Type       | Description                                          |
| ------------- | ---------- | ---------------------------------------------------- |
| `valueChange` | `event<T>` | Emits an event when the user selects another button. |

## Methods

| Name      | Description                                              | Return value |
| --------- | -------------------------------------------------------- | ------------ |
| `focus()` | Sets focus to the first item in the `<dt-button-group>`. | `void`       |

## Button group item inputs

| Name           | Type                  | Default     | Description                                                                                            |
| -------------- | --------------------- | ----------- | ------------------------------------------------------------------------------------------------------ |
| `<ng-content>` |                       |             | The content which is displayed inside of the item. This should only be text.                           |
| `value`        | `T | undefined`       | `undefined` | The associated value of this item                                                                      |
| `disabled`     | `boolean | undefined` | `undefined` | Sets disabled state if property is set and the value is truthy or undefined                            |
| `tabIndex`     | `number`              | `0`         | Sets and gets the tabIndex property                                                                    |
| `selected`     | `boolean`             | `false`     | Sets or gets the selected state of this item                                                           |
| `color`        | `'main' | 'error'`    | `main`      | Sets color. Possible options: <ul><li><code>main</code> (default)</li><li><code>error</code></li></ul> |

## Button group item methods

| Name      | Description                                 | Return value |
| --------- | ------------------------------------------- | ------------ |
| `focus()` | Sets focus to the `<dt-button-group-item>`. | `void`       |

## States

Buttons within a button group have a default, hover, active, focus, and disabled
state.

<docs-source-example example="ButtonGroupItemDisabledExample"></docs-source-example>

### Group disabled

The complete button group can be disabled.

<docs-source-example example="ButtonGroupDisabledExample"></docs-source-example>

### Error state

A button group can hold buttons in an error state.

<docs-source-example example="ButtonGroupErrorExample"></docs-source-example>

## Button group in use

### Chart tabs

A button group placed above the [chart]({{link_to_id id='chart'}}) can be used
to switch metrics displayed in a chart. Combined with a chart button groups are
also called chart tabs. These tabs can contain single metrics or metric groups
(e.g. response time and requests).

![Chart tabs](https://d24pvdz4mvzd04.cloudfront.net/test/chart-behavior-switch-580-f368373ea8.png)
