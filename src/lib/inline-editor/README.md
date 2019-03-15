---
type: "component"
---

# Inline editor

`dt-inline-editor` is a directive that makes any text containing HTML element editable.

<docs-source-example example="DefaultInlineEditorExample"></docs-source-example>

## Imports

You have to import the `DtInlineEditorModule` when you want to use the `dt-inline-editor` directive:

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
| `ngModel` | `string` | - | The two-way data-binding to set the content and handle changes. |
| `@Input() required` | `boolean` | `false` | To specify that the input field must not be left empty. |
| `@Input() onRemoteSave` | `function` | - | A callback returning an Observable that will be triggered when the (potentially async) saving of the new value has finished. The inline editor needs to be notified so it can go back to idle state if ok or stay in editing mode if failed. |
| `@Input() errorStateMatcher` | `ErrorStateMatcher` | `DefaultErrorStateMatcher` | A class used to control when error messages are shown. |
| `@Output() saved` | `EventEmitter<string>()` | - | Emitted when value is saved. |
| `@Output() cancelled` | `EventEmitter<string>()` | - | Emitted when editing is cancelled. |
| `value()` | `string` | `''` | Value of the inline editor. |
| `idle()` | `boolean` | - | Whether current mode is idle (readonly). |
| `editing()` | `boolean` | - | Whether current mode is editing (readonly). |
| `saving()` | `boolean` | - | Whether current mode is saving (readonly). |

### Required field validation

When a value for the input field is required, an error message must be provided by adding a `<dt-error>` element inside the inline editor.

<docs-source-example example="RequiredInlineEditorExample"></docs-source-example>

Errors are hidden initially and will be displayed on invalid form fields, after the user has interacted with the element or the parent form has been submitted. The errors will appear on top of the hint labels and will overlap them.

If a form field can have more than one error state, it is up to the consumer to toggle which messages should be displayed. This can be done with `ngIf` or `ngSwitch`.

## Examples

### JavaScript API

<docs-source-example example="ApiInlineEditorExample"></docs-source-example>

### Successful asynchronous operation

<docs-source-example example="SuccessfulInlineEditorExample"></docs-source-example>

### Failing asynchronous operation

<docs-source-example example="FailingInlineEditorExample"></docs-source-example>
