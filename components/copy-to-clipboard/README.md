# Copy to clipboard

The copy to clipboard component is a combination of a readonly input field or
text area, and a copy button. It is used to copy links, code snippets and more.
This component takes the hassle out of selecting any given amount of text and
copying it to the clipboard. This is especially helpful for complex or large
amount of content.

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

In case of an error, e.g. if the user is not able to copy something to their
clipboard, there should be an [alert](/components/alert) below the copy to
clipboard component informing the user about the problem and possible solutions.

<ba-live-example name="DtExampleCopyToClipboardError"></ba-live-example>

## Dark theme

The copy to clipboard component can be placed on dark background.

<ba-live-example name="DtExampleCopyToClipboardDark" themedark></ba-live-example>

## Copy to clipboard in use

There are two versions of the copy to clipboard component. One uses a readonly
text area and the other uses a readonly input field. The text area is used to
display large amount of text, and the input field is used to display links and
one-liners. The main difference between the two is the way they handle long
content.

The height of the text area is not defined per default, it is recommended to
make the text area high enough to fit the whole content, this avoids unnecessary
scrollbars.

<ba-live-example name="DtExampleCopyToClipboardTextarea"></ba-live-example>

### Example within context dialog

The component can also be placed inside a
[context dialog](/components/context-dialog) and is most often used to share
links.

<ba-live-example name="DtExampleCopyToClipboardContext"></ba-live-example>
