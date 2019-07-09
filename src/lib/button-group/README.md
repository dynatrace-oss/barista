---
type: 'component'
---

# ButtonGroup

This component creates a button group element with Dynatrace styling.

## Imports

You have to import the `DtButtonGroupModule` when you want to use the `dt-button-group`

```typescript

@NgModule({
  imports: [
    DtButtonGroupModule,
  ],
}
class MyModule {}

```

## Initialization

To apply the Dynatrace button group, use the `<dt-button-group>` and `<dt-button-group-item>` elements.

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

## Examples

### Default

<docs-source-example example="ButtonGroupDefaultExample"></docs-source-example>

### Group disabled

<docs-source-example example="ButtonGroupDisabledExample"></docs-source-example>

### Item disabled

<docs-source-example example="ButtonGroupItemDisabledExample"></docs-source-example>

### Error state

<docs-source-example example="ButtonGroupErrorExample"></docs-source-example>

### Interactive example

<docs-source-example example="ButtonGroupInteractiveExample"></docs-source-example>
