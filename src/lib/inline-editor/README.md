# Inline Editor

{{component-demo name="DefaultInlineEditorExample"}}

`dt-inline-editor` is a directive that makes any text containing HTML element editable.

## Imports

You have to import the `DtInlineEditorModule` when you want to use `dt-inline-editor`:

```typescript

@NgModule({
  imports: [
    DtInlineEditorModule,
  ],
})
class MyModule {}

```

## Initialization

To apply, add the `dt-inline-editor` attribute to the HTML element.

## Options & Properties

| Name | Type | Default | Description |
| --- | --- | --- | --- |
| `ngModel` | `string` | `` | The two-way data-binding to set the content and handle changes. |
| `onRemoteSave` | `function` | `` | A callback returning an Observable that will be triggered when the (potentially async) saving of the new value has finished. The inline editor needs to be notified so it can go back to idle state if ok or stay in editing mode if failed. |

## Examples

### JavaScript API

{{component-demo name="ApiInlineEditorExample"}}

### Successful asynchronous operation

{{component-demo name="SuccessfulInlineEditorExample"}}

### Failing asynchronous operation

{{component-demo name="FailingInlineEditorExample"}}
