# Context dialog

The context dialog is an overlay which appears on click of a button. It holds
context related actions and contains other components like
[buttons](/components/button), [links](/resources/font#links),
[checkboxes](/components/checkbox), etc.

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

| Name                      | Type                                                       | Default     | Description                                                                                             |
| ------------------------- | ---------------------------------------------------------- | ----------- | ------------------------------------------------------------------------------------------------------- |
| `tabIndex`                | `number`                                                   | `0`         | Gets and sets the tabIndex on the context dialog. Inherited by mixinTabIndex.                           |
| `disabled`                | `boolean`                                                  | `false`     | Gets and sets the disabled property on the context dialog. Inherited by mixinDisabled.                  |
| `aria-label`              | `string`                                                   | `undefined` | ARIA label of the context dialog trigger button.                                                        |
| `aria-labelledby`         | `string`                                                   | `undefined` | ARIA reference to a label describing the context-dialog.                                                |
| `aria-label-close-button` | `string`                                                   |             | ARIA label of the context dialog close button.                                                          |
| `overlayPanelClass`       | `string | string[] | Set<string> | { [key: string]: any }` |             | Custom css classes to add to the overlay panel element. Can be used to scope styling within the overlay |

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

## Accessibility

Context dialogs should be given a meaningful label via `aria-label` for the open
trigger and via `aria-label-close-button` for the close trigger, because the
buttons do not contain text.

## States

It is possible to disable the entire context dialog.

<ba-live-example name="DtExampleContextDialogInteractive"></ba-live-example>

## Behavior

As soon as the context dialog is open, the focus is set on the first interactive
element within the dialog. The context dialog traps the focus inside the
overlay. When it is closed again, the focus is set to the previously focused
element. The dialog can be opened via "ENTER" or "SPACE" when focused, "ESC"
closes it.

<ba-live-example name="DtExampleContextDialogPreviousFocus"></ba-live-example>

## Dark background

The context dialog component can be used on dark background.

<ba-live-example name="DtExampleContextDialogDark" themedark></ba-live-example>

## Context dialog in use

### Context actions menu

The context actions menu is a variant of the context dialog placed on the top
right within a [card](/components/card), containing
[secondary buttons](/components/button).

<ba-live-example name="DtExampleContextDialogActions" background></ba-live-example>

### Context dialog with custom trigger

To add a custom trigger you can add the `[dtContextDialogTrigger]` directive to
any `<dt-button>` to be able to link it to the correct context dialog.

<ba-live-example name="DtExampleContextDialogCustomIcon"></ba-live-example>

### Context dialog with a header

<ba-live-example name="DtExampleContextDialogHeader"></ba-live-example>
