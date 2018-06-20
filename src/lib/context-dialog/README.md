# Context dialog

{{component-demo name="DefaultContextDialogExampleComponent"}}

The `<dt-context-dialog>` creates a container that is hidden inside an overlay.
It is possible to disable the entire context dialog.
The context dialog traps the focus inside the overlay until it is closed again.
It sets the focus to the previously focused element when closed.
The closing button inside the context dialog will get the focus, when the context menu is opened.

## Imports

You have to import the `DtContextDialogModule` when you want to use the `dt-context-dialog`:

```typescript

@NgModule({
  imports: [
  DtContextDialogModule,
  ],
})
class MyModule {}

```

## Accessibility

Context dialogs should be given a meaningful label via aria-label, because the button does not have a text.

## Options & Properties

| Name | Type | Default | Description |
| --- | --- | --- | --- |
| `@Input() tabIndex` | `number` | `0` | Gets and sets the tabIndex on the context dialog. Inherited by mixinTabIndex |
| `@Input() disabled` | `boolean` | `false` | Gets and sets the disabled property on the context dialog. Inherited by mixinDisabled |
| `@Input() aria-label` | `string` |  | Aria label of the context dialog trigger button. |
| `@Ouput() openedChanged` | `EventEmitter<boolean>` |  | Event emitted when the context dialog opens or closes. |
| `isPanelOpen` | `boolean` |  | Returns wether or not the panel is open |

## Methods

| Name | Description | Return value |
| --- | --- | --- |
| `open` | Opens the context dialog | `void` |
| `close` | Closes the context dialog | `void` |
| `focus` | Focuses the context dialog | `void` |

## Examples

### Focus previously focused element on close

To show the previous focused element working - please use the button labeled "Open" and not the button with the icon to open the context dialog

{{component-demo name="PrevFocusContextDialogExampleComponent"}}

### Context dialog with custom icon

To add a custom icon use the `<dt-button dt-icon-button></dt-button>` component and add the directive `[dtContextDialogTrigger]` to be able to link it to the correct context dialog.

{{component-demo name="CustomIconContextDialogExampleComponent"}}

### Context dialog on dark background

{{component-demo name="DarkContextDialogExampleComponent"}}

### Interactive

{{component-demo name="InteractiveContextDialogExampleComponent"}}
