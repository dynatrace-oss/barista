---
type: 'component'
---

# ToggleButtonGroup

## Imports

You have to import the `DtToggleButtonGroupModule` when you want to use the
`<dt-toggle-button-group>`:

```typescript
@NgModule({
  imports: [DtToggleButtonGroupModule],
})
class MyModule {}
```

## Initialization

The `<dt-toggle-button-group>` is a wrapping container for all
`<dt-toggle-button-item>` components. A `<dt-toggle-button-item>` cannot
function without a group as it is the group that is managing the toggling state.
The group can hold any content and is not limited to `dt-toggle-button-item`s.

The `<dt-toggle-button-item>` can hold any content which will be rendered into
the right part of the component. It also has a dedicated section for the icon on
the left hand side:

- `<dt-toggle-button-item-icon>` should be filled only with a `dt-icon` which
  will be styled and rendered according to the toggle-button-group container.

### Outputs

| Name     | Type                                    | Default | Description                                                                                                                                                                                                      |
| -------- | --------------------------------------- | ------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `change` | `EventEmitter<DtToggleButtonChange<T>>` | -       | EventEmitter that fires every time the selection changes. `DtToggleButtonChange` is an interface for the following object signature: `{ source: DtToggleButtonItem<T>, value: T | null, isUserInput: boolean }`. |

### Methods

| Name           | Type                    | Default | Description                                                                                             |
| -------------- | ----------------------- | ------- | ------------------------------------------------------------------------------------------------------- |
| `selectedItem` | `DtToggleButtonItem<T>` | -       | Getter to access the currently selected `DtToggleButtonItem<T>` instance or `null` if none is selected. |
| `value`        | `<T>`                   | null    | Getter to access the currently selected value.                                                          |

## Toggle button item

### Inputs

| Name               | Type      | Default | Description                                                                                                                                   |
| ------------------ | --------- | ------- | --------------------------------------------------------------------------------------------------------------------------------------------- |
| `selected`         | `boolean` | `false` | Whether or not the `DtToggleButtonItem` is selected.                                                                                          |
| `value`            | `<T>`     | `null`  | Value of the `DtToggleButtonItem`.                                                                                                            |
| `tabIndex`         | `number`  | 0       | Sets the tabIndex of the `DtToggleButtonItem`. If the item is disabled, tabIndex will be set to -1 to remove it from the keyboard navigation. |
| `disabled`         | `boolean` | `false` | Disables the `DtToggleButtonItem`.                                                                                                            |
| `aria-label`       | `string`  | -       | String that will be applied as an aria label on the `DtToggleButtonItem`.                                                                     |
| `aria-labelledby`  | `string`  | -       | One or more DOM element ids that label the `DtToggleButtonItem`. If multiple values are given, please use a space separated list.             |
| `aria-describedby` | `string`  | -       | One DOM element id that describes the actions taken by selecting the `DtToggleButtonItem`.                                                    |

### Outputs

| Name     | Type                                    | Default | Description                                                                     |
| -------- | --------------------------------------- | ------- | ------------------------------------------------------------------------------- |
| `change` | `EventEmitter<DtToggleButtonChange<T>>` | -       | EventEmitter that fires when the selection of the `DtToggleButtonItem` changes. |

### Methods

| Name       | Type       | Default | Description                                                       |
| ---------- | ---------- | ------- | ----------------------------------------------------------------- |
| `focus`    | `function` | -       | Function to programatically call focus on a `DtToggleButtonItem`. |
| `select`   | `function` | -       | Function to programmatically select on a `DtToggleButtonItem`.    |
| `deselect` | `function` | -       | Function to programmatically deselect on a `DtToggleButtonItem`.  |

## Examples

### Default

<docs-source-example example="ToggleButtonGroupDefaultExample"></docs-source-example>

### Dynamic items

<docs-source-example example="ToggleButtonGroupDynamicItemsExample"></docs-source-example>
