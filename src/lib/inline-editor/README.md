---
type: "component"
---

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
| `errorMessage` | `string` | `Value cannot be empty!` | Error message to be displayed incase of empty input |
| `onRemoteSave` | `function` | `` | A callback returning an Observable that will be triggered when the (potentially async) saving of the new value has finished. The inline editor needs to be notified so it can go back to idle state if ok or stay in editing mode if failed. |

## Examples

### JavaScript API

<docs-source-example example="ApiInlineEditorExample"></docs-source-example>

### Required field validation

<docs-source-example example="RequiredInlineEditorExample"></docs-source-example>

Error messages can be shown under the form field by adding `<dt-error>` elements inside the inline editor.
Errors are hidden initially and will be displayed on invalid form fields, after the user has interacted with the element or the parent form has been submitted.
The errors will appear on top of the hint labels and will overlap them.

If a form field can have more than one error state, it is up to the consumer to toggle which messages should be displayed. This can be done with `ngIf` or `ngSwitch`.

### Successful asynchronous operation

<docs-source-example example="SuccessfulInlineEditorExample"></docs-source-example>

### Failing asynchronous operation

<docs-source-example example="FailingInlineEditorExample"></docs-source-example>
