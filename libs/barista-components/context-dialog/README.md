# Context dialog

<ba-ux-snippet name="context-dialog-intro"></ba-ux-snippet>

<ba-live-example name="DtExampleContextDialogDefault"></ba-live-example>

## Imports

You have to import the `DtContextDialogModule` when you want to use the
`<dt-context-dialog>`:

```typescript
@NgModule({
  imports: [DtContextDialogModule],
})
class MyModule {}
```

## Inputs

| Name                | Type                                                       | Default     | Description                                                                                             |
| ------------------- | ---------------------------------------------------------- | ----------- | ------------------------------------------------------------------------------------------------------- |
| `tabIndex`          | `number`                                                   | `0`         | Gets and sets the tabIndex on the context dialog. Inherited by mixinTabIndex.                           |
| `disabled`          | `boolean`                                                  | `false`     | Gets and sets the disabled property on the context dialog. Inherited by mixinDisabled.                  |
| `aria-label`        | `string`                                                   | `undefined` | ARIA label of the context dialog trigger button.                                                        |
| `aria-labelledby`   | `string`                                                   | `undefined` | ARIA reference to a label describing the context-dialog.                                                |
| `ariaLabelClose`    | `string`                                                   |             | ARIA label of the context dialog close button.                                                          |
| `overlayPanelClass` | `string | string[] | Set<string> | { [key: string]: any }` |             | Custom css classes to add to the overlay panel element. Can be used to scope styling within the overlay |

To make our components accessible it is obligatory to provide either an
`aria-label` or `aria-labelledby`.

## Properties

| Name          | Type      | Description                              |
| ------------- | --------- | ---------------------------------------- |
| `isPanelOpen` | `boolean` | Returns wether or not the panel is open. |

## Outputs

| Name            | Type                    | Description                                            |
| --------------- | ----------------------- | ------------------------------------------------------ |
| `openedChanged` | `EventEmitter<boolean>` | Event emitted when the context dialog opens or closes. |

## Methods

| Name      | Description                 | Return value |
| --------- | --------------------------- | ------------ |
| `open()`  | Opens the context dialog.   | `void`       |
| `close()` | Closes the context dialog.  | `void`       |
| `focus()` | Focuses the context dialog. | `void`       |

## Configuration options

If your use case requires a different configuration of the overlay, it can be
configured using the `DT_CONTEXT_DIALOG_CONFIG` injection token. Only the
settings you provide will be overwritten, the others will fall back to the
default configuration.

## Accessibility

Context dialogs should be given a meaningful label via `aria-label` for the open
trigger and via `ariaLabelClose` for the close trigger, because the buttons do
not contain text.

## States

It is possible to disable the entire context dialog.

<ba-live-example name="DtExampleContextDialogInteractive"></ba-live-example>

## Behavior

<ba-ux-snippet name="context-dialog-behavior"></ba-ux-snippet>

## Dark background

The context dialog component can be used on dark background.

<ba-live-example name="DtExampleContextDialogDark" themedark></ba-live-example>

## Context dialog in use

### Context actions menu

<ba-ux-snippet name="context-dialog-actions-menu"></ba-ux-snippet>

### Context dialog with custom trigger

To add a custom trigger you can add the `[dtContextDialogTrigger]` directive to
any `<dt-button>` to be able to link it to the correct context dialog.

<ba-live-example name="DtExampleContextDialogCustomIcon"></ba-live-example>

### Context dialog with a header

<ba-live-example name="DtExampleContextDialogHeader"></ba-live-example>

### Context dialog with a footer

<ba-live-example name="DtExampleContextDialogFooter"></ba-live-example>
