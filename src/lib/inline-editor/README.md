# Inline Editor

<docs-source-example example="DefaultInlineEditorExample"></docs-source-example>

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
| `required` | `boolean` | `false` | To specify that the input field must be filled out |
| `onRemoteSave` | `function` | `` | A callback returning an Observable that will be triggered when the (potentially async) saving of the new value has finished. The inline editor needs to be notified so it can go back to idle state if ok or stay in editing mode if failed. |

## Examples

### JavaScript API

<docs-source-example example="ApiInlineEditorExample"></docs-source-example>

### Required field validation

<docs-source-example example="RequiredInlineEditorExample"></docs-source-example>

### Successful asynchronous operation

<docs-source-example example="SuccessfulInlineEditorExample"></docs-source-example>

### Failing asynchronous operation

<docs-source-example example="FailingInlineEditorExample"></docs-source-example>
