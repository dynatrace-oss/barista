# Copy to clipboard

<ba-ux-snippet name="copy-to-clipboard-intro"></ba-ux-snippet>

<ba-live-example name="DtExampleCopyToClipboardDefault"></ba-live-example>

## Imports

You have to import the `DtCopyToClipboardModule` when you want to use the
`dt-copy-to-clipboard`.

```typescript
@NgModule({
  imports: [DtCopyToClipboardModule],
})
class MyModule {}
```

## Initialization

The `<dt-copy-to-clipboard>` creates a container including a textarea, input or
a label ready to be copied to the clipboard.

Using `<dt-copy-to-clipboard-label>` defines the button content (e.g. text like
"click here to copy").

## Inputs

| Name      | Type                      | Default   | Description                                                   |
| --------- | ------------------------- | --------- | ------------------------------------------------------------- |
| `variant` | `'primary' | 'secondary'` | `primary` | Defines the variant of the embedded copy-to-clipboard button. |

## Outputs

| Name         | Type                 | Description                                                                                 |
| ------------ | -------------------- | ------------------------------------------------------------------------------------------- |
| `copied`     | `EventEmitter<void>` | Callback that is triggered after a successful copy.                                         |
| `afterCopy`  | `EventEmitter<void>` | Callback that is triggered after a successful copy and after the copy animation is stopped. |
| `copyFailed` | `EventEmitter<void>` | Callback that is triggered after a failed copy.                                             |

The following example shows a copy to clipboard component that triggers a
callback function after a successful copy action.

<ba-live-example name="DtExampleCopyToClipboardCallback"></ba-live-example>

## Methods

| Name                | Description                                  | Return value |
| ------------------- | -------------------------------------------- | ------------ |
| `copyToClipboard()` | Triggers copy to clipboard programmatically. | `void`       |

## Error state

<ba-ux-snippet name="copy-to-clipboard-error-state"></ba-ux-snippet>

## Dark theme

The copy to clipboard component can be placed on dark background.

<ba-live-example name="DtExampleCopyToClipboardDark" themedark></ba-live-example>

## Copy to clipboard in use

<ba-ux-snippet name="copy-to-clipboard-in-use"></ba-ux-snippet>
