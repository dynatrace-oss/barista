# Copy to clipboard

<p>
  The <code>&lt;dt-copy-to-clipboard&gt;</code> creates a container including a textarea, input or a label ready
  to be copied to the clipboard.
  It is possible to disable the entire copy clipboard container.
</p>
<p>
  Using <code>&lt;dt-copy-to-clipboard-label&gt;</code> defines the button content (e.g. text like "click here to copy").
</p>

<docs-source-example example="DefaultCopyToClipboardExampleComponent"></docs-source-example>

## Imports

<p>You have to import the `DtCopyToClipboardModule` when you want to use the `dt-copy-to-clipboard`:</p>

```typescript
@NgModule({
  imports: [
  DtCopyClipboardModule,
  ],
})
class MyModule {}

```

## Options & Properties

### Button group

| Name | Type | Default | Description |
| --- | --- | --- | --- |
| `disabled` | `boolean` | `false` | If `true` (= default) the included button and textarea are disabled, no copy is possible |
| `(copied)` | `event<void>` | `0` | Callback that is triggered after a successful copy |
| `(copyFailed)` | `event<void>` | | Callback that is triggered after a failed copy |

## Examples

### With Callback

<docs-source-example example="CallbackCopyToClipboardExampleComponent"></docs-source-example>

### Disabled example

<docs-source-example example="DisabledCopyToClipboardExampleComponent"></docs-source-example>

### Dark theme

<docs-source-example example="DarkCopyToClipboardExampleComponent" themedark="true"></docs-source-example>
### Example withing context dialog

<docs-source-example example="ContextCopyToClipboardExampleComponent"></docs-source-example>



