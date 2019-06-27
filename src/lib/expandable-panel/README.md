---
type: "component"
---

# Expandable panel

This Angular component provides basic expand/collapse functionality without any styling. The expandable trigger directive `dtExpandablePanel` allows you to bind a custom element as trigger to an expandable panel `<dt-expandable-panel>`. The expandable trigger binds to key and click events.

## Imports

You have to import the `DtExpandablePanelModule` when you want to use the `dt-expandable-panel`.
The `dt-expandable-panel` component also requires Angular's `BrowserAnimationsModule` for animations. For more details on this see [*Step 2: Animations*](***REMOVED*** in the getting started guide.

```typescript
@NgModule({
  imports: [
    DtExpandablePanelModule,
    BrowserAnimationsModule,
  ],
})
class MyModule {}

```

## Initialization

To apply the Dynatrace expandable panel, use the `<dt-expandable-panel>` element. Example:

| Attribute | Description |
| --- | --- |
| `dt-expandable-panel` | The expandable panel, with the behaviour, but without styling |
| `[dtExpandablePanel]=#panel` | The expandable trigger which listens on click and key events. The trigger needs to get a panel assigned. |

<docs-source-example example="DefaultExpandablePanelExampleComponent"></docs-source-example>

## Expandable panel

### Inputs

| Name | Type | Default | Description |
| --- | --- | --- | --- |
| `expanded` | `boolean` | `false` | Sets or gets the panel's expanded state. |
| `disabled` | `boolean` | `false` | Sets or gets the panel's disabled state. |

### Outputs

| Name | Type | Description |
| --- | --- | --- |
| `expandChange` | `EventEmitter<boolean>` | Emits an event when the expanded state changes. |
| `expanded` | `EventEmitter<void>` | Event emitted when the panel is expanded. |
| `collapsed` | `EventEmitter<void>` | Event emitted when the panel is collapsed. |

### Properties

| Name | Type | Description |
| --- | --- | --- |
| `toggle` | `boolean` | Toggles the expanded state, i.e. changes it to expanded if collapsed, or vice-versa. |
| `open` | `void` | Expands the panel. |
| `close` | `void` | Collapses the panel .|

## Expandable trigger

| Name | Type | Default | Description |
| --- | --- | --- | --- |
| `[opened]` | `boolean` | `false` | Sets or gets the opened state |
| `[dtExpandablePanel]` | `DtExpandablePanel` | `undefined` | Attaches the expandable panel to this trigger |

## Examples

### Open state

<docs-source-example example="OpenExpandablePanelExampleComponent"></docs-source-example>

## Simple trigger

<docs-source-example example="TriggerSimpleExpandablePanelExampleComponent"></docs-source-example>

## Styled trigger

<docs-source-example example="TriggerExpandablePanelExampleComponent"></docs-source-example>
