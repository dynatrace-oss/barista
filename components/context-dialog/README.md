---
title: 'Context dialog'
description:
  'The context dialog is an overlay which appears on click of a button.'
postid: context-dialog
identifier: 'Cd'
category: 'components'
public: true
wiki: ***REMOVED***
contributors:
  dev:
    - fabian.friedl
  ux:
    - andreas.mayr
tags:
  - 'angular'
  - 'button'
  - 'component'
  - 'context action'
  - 'overlay'
---

# Context dialog

The context dialog is an overlay which appears on click of a button. It holds
context related actions and contains other components like
[buttons]({{link_to_id id='button'}}), [links]({{link_to_id id='link' }}),
[checkboxes]({{link_to_id id='checkbox' }}), etc.

<docs-source-example example="ContextDialogDefaultExample"></docs-source-example>

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

<docs-source-example example="ContextDialogInteractiveExample"></docs-source-example>

## Behavior

As soon as the context dialog is open, the focus is set on the first interactive
element within the dialog. The context dialog traps the focus inside the
overlay. When it is closed again, the focus is set to the previously focused
element. The dialog can be opened via "ENTER" or "SPACE" when focused, "ESC"
closes it.

<docs-source-example example="ContextDialogPreviousFocusExample"></docs-source-example>

## Dark background

The context dialog component can be used on dark background.

<docs-source-example example="ContextDialogDarkExample" themedark="true"></docs-source-example>

## Context dialog in use

### Context actions menu

The context actions menu is a variant of the context dialog placed on the top
right within a [card]({{link_to_id id='card' }}), containing [secondary
buttons]({{link_to_id id='button' }}).

![Context dialog example](https://d24pvdz4mvzd04.cloudfront.net/test/context-dialog-example-100-4075494172.png)

### Context dialog with custom icon

To add a custom icon use the `<dt-button dt-icon-button></dt-button>` component
and add the directive `[dtContextDialogTrigger]` to be able to link it to the
correct context dialog.

<docs-source-example example="ContextDialogCustomIconExample"></docs-source-example>

### Context dialog with a header

<docs-source-example example="ContextDialogHeaderExample"></docs-source-example>
