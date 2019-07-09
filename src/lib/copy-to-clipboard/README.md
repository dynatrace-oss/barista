---
type: 'component'
---

# Copy to clipboard

The `<dt-copy-to-clipboard>` creates a container including a textarea, input or a label ready to be copied to the clipboard. It is possible to disable the entire copy clipboard container.

Using `<dt-copy-to-clipboard-label>` defines the button content (e.g. text like "click here to copy").

<docs-source-example example="CopyToClipboardDefaultExample"></docs-source-example>

## Imports

You have to import the `DtCopyToClipboardModule` when you want to use the `dt-copy-to-clipboard`:

```typescript
@NgModule({
  imports: [DtCopyClipboardModule],
})
class MyModule {}
```

## Inputs

| Name       | Type      | Default | Description                                                                               |
| ---------- | --------- | ------- | ----------------------------------------------------------------------------------------- |
| `disabled` | `boolean` | `false` | If `true` (= default) the included button and textarea are disabled, no copy is possible. |

## Outputs

| Name         | Type                 | Description                                                                                 |
| ------------ | -------------------- | ------------------------------------------------------------------------------------------- |
| `copied`     | `EventEmitter<void>` | Callback that is triggered after a successful copy.                                         |
| `afterCopy`  | `EventEmitter<void>` | Callback that is triggered after a successful copy and after the copy animation is stopped. |
| `copyFailed` | `EventEmitter<void>` | Callback that is triggered after a failed copy.                                             |

## Methods

| Name                | Description                                  | Return value |
| ------------------- | -------------------------------------------- | ------------ |
| `copyToClipboard()` | Triggers copy to clipboard programmatically. | `void`       |

## Examples

### With Callback

<docs-source-example example="CopyToClipboardCallbackExample"></docs-source-example>

### Dark theme

<docs-source-example example="CopyToClipboardDarkExample" themedark="true"></docs-source-example>

### Example within context dialog

<docs-source-example example="CopyToClipboardContextExample"></docs-source-example>
