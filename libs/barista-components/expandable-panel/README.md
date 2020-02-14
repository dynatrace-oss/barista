# Expandable panel

The expandable panel component provides basic expand/collapse functionality
without any styling. The expandable trigger directive `dtExpandablePanel` allows
you to bind a custom element as trigger to an expandable panel
`<dt-expandable-panel>`. The expandable trigger binds to key and click events.

<ba-live-example name="DtExampleExpandablePanelDefault"></ba-live-example>

## Imports

You have to import the `DtExpandablePanelModule` when you want to use the
`dt-expandable-panel`. The `dt-expandable-panel` component also requires
Angular's `BrowserAnimationsModule` for animations. For more details on this see
[_Step 2: Animations_](https://barista.dynatrace.com/components/get-started/#step-2-animations)
in the getting started guide.

```typescript
@NgModule({
  imports: [DtExpandablePanelModule, BrowserAnimationsModule],
})
class MyModule {}
```

## Initialization

To apply the Dynatrace expandable panel, use the `<dt-expandable-panel>`
element.

| Attribute                    | Description                                                                                              |
| ---------------------------- | -------------------------------------------------------------------------------------------------------- |
| `dt-expandable-panel`        | The expandable panel, with the behaviour, but without styling                                            |
| `[dtExpandablePanel]=#panel` | The expandable trigger which listens on click and key events. The trigger needs to get a panel assigned. |

## Inputs

| Name       | Type      | Default | Description                              |
| ---------- | --------- | ------- | ---------------------------------------- |
| `expanded` | `boolean` | `false` | Sets or gets the panel's expanded state. |
| `disabled` | `boolean` | `false` | Sets or gets the panel's disabled state. |

## Outputs

| Name           | Type                    | Description                                     |
| -------------- | ----------------------- | ----------------------------------------------- |
| `expandChange` | `EventEmitter<boolean>` | Emits an event when the expanded state changes. |
| `expanded`     | `EventEmitter<void>`    |  Event emitted when the panel is expanded.      |
| `collapsed`    | `EventEmitter<void>`    |  Event emitted when the panel is collapsed.     |

## Properties

| Name     | Type      | Description                                                                          |
| -------- | --------- | ------------------------------------------------------------------------------------ |
| `toggle` | `boolean` | Toggles the expanded state, i.e. changes it to expanded if collapsed, or vice-versa. |
| `open`   | `void`    | Expands the panel.                                                                   |
| `close`  | `void`    | Collapses the panel.                                                                 |

## Expandable trigger input

| Name                | Type                | Default     | Description                                   |
| ------------------- | ------------------- | ----------- | --------------------------------------------- |
| `dtExpandablePanel` | `DtExpandablePanel` | `undefined` | Attaches an expandable panel to this trigger. |

## Expandable panel in use

### Disabled

The expandable panel can be disabled, which also disables the trigger button.

<ba-live-example name="DtExampleExpandablePanelDisabled"></ba-live-example>

### Dynamic trigger

The expandable panel's trigger can be updated according to the panel's current
state.

<ba-live-example name="DtExampleExpandablePanelDynamicTrigger"></ba-live-example>

### Programmatic trigger

The expandable panel can be opened/closed/toggled programmatically.

<ba-live-example name="DtExampleExpandablePanelProgrammatic"></ba-live-example>
