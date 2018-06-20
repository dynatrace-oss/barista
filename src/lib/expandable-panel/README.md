# Expandable panel

This Angular component provides basic expand/collapse functionality without any styling.
A `<dt-expandable-panel>` element should be used whenever some action is performed. The expandable trigger directive (`dtExpandablePanel`)
allows you to bind a custom element as trigger to an expandable panel. The expandable trigger binds to key and click events.

Animation is done using Angular animations. So, don't forget
to provide the animations module, too.

## Imports

You have to import the `DtExpandablePanelModule` when you want to use the `dt-expandable-panel`:

```typescript

@NgModule({
  imports: [
    DtExpandablePanelModule,
  ],
})
class MyModule {}

```

## Initialization

To apply the dynatrace expandable panel, use the `<dt-expandable-panel>` element. Example:

{{component-demo name="DefaultExpandablePanelExampleComponent"}}

| Attribute | Description |
| --- | --- |
| `dt-expandable-panel` | The expandable panel, with the behaviour, but without styling |
| `[dtExpandablePanel]=#panel` | The expandable trigger which listens on click and key events. The trigger needs to get a panel assigned. |

## Options & Properties

### Expandable panel description

| Name | Type | Default | Description |
| --- | --- | --- | --- |
| `[opened]` | `boolean` | `false` | Sets or gets the opened state |
| `(openedChange)` | `event<boolean>` |  | Emits an event when the expanded state changes. |
| `toggle` | `boolean` |  | Toggles the expanded state, i.e. changes it to expanded, if collapsed, or vice-versa |
| `open` | `void` |  | Expands the panel |
| `close` | `void` |  | Collapses the panel |

### Expandable trigger

| Name | Type | Default | Description |
| --- | --- | --- | --- |
| `[opened]` | `boolean` | `false` | Sets or gets the opened state |
| `[dtExpandablePanel]` | `DtExpandablePanel` | `undefined` | Attaches the expandable panel to this trigger |

## Examples

### Open state

{{component-demo name="OpenExpandablePanelExampleComponent"}}

## Simple trigger

{{component-demo name="TriggerSimpleExpandablePanelExampleComponent"}}

## Styled trigger

{{component-demo name="TriggerExpandablePanelExampleComponent"}}
