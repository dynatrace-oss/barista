# Inline editor

The `dt-inline-editor` is a directive that makes any text containing HTML
element editable.

<docs-source-example example="InlineEditorDefaultExample"></docs-source-example>

## Imports

You have to import the `DtInlineEditorModule` when you want to use the
`dt-inline-editor` directive.

```typescript
@NgModule({
  imports: [DtInlineEditorModule],
})
class MyModule {}
```

## Initialization

To apply, add the `dt-inline-editor` attribute to the HTML element.

## Inputs

| Name                | Type                | Default                    | Description                                                                                                                                                                                                                                  |
| ------------------- | ------------------- | -------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `value`             | `string`            |  `''`                      |  Value of the inline editor.                                                                                                                                                                                                                 |
| `required`          | `boolean`           | `false`                    | To specify that the input field must not be left empty.                                                                                                                                                                                      |
| `onRemoteSave`      | `function`          | -                          | A callback returning an observable that will be triggered when the (potentially async) saving of the new value has finished. The inline editor needs to be notified so it can go back to idle state if ok or stay in editing mode if failed. |
| `errorStateMatcher` | `ErrorStateMatcher` | `DefaultErrorStateMatcher` | A class used to control when error messages are shown.                                                                                                                                                                                       |
| `aria-label-save`   | `string`            | -                          | Takes precedence as the save buttons's text alternative.                                                                                                                                                                                     |
| `aria-label-cancel` | `string`            | -                          | Takes precedence as the cancel button's text alternative.                                                                                                                                                                                    |

## Outputs

| Name        | Type                     | Description                         |
| ----------- | ------------------------ | ----------------------------------- |
| `saved`     | `EventEmitter<string>()` | Emitted when value is saved.        |
| `cancelled` | `EventEmitter<string>()` | Emitted when editing is cancelled.  |

## Methods

| Name                   | Description                                            | Return type |
| ---------------------- | ------------------------------------------------------ | ----------- |
| `enterEditing`         | Enters the edit mode.                                  | `void`      |
| `saveAndQuitEditing`   | Saves and quits the edit mode.                         | `void`      |
| `cancelAndQuitEditing` | Cancels and quits the edit mode.                       | `void`      |
| `focus`                | Focuses the input or the button depending on the mode. | `void`      |

<docs-source-example example="InlineEditorApiExample"></docs-source-example>

## Properties

| Name      | Type      | Description                                  |
| --------- | --------- | -------------------------------------------- |
| `idle`    | `boolean` |  Whether current mode is idle (readonly).    |
| `editing` | `boolean` |  Whether current mode is editing (readonly). |
| `saving`  | `boolean` |  Whether current mode is saving (readonly).  |

## Error messages and validation

When a value for the input field is validated, an error message must be provided
by adding a `<dt-error>` element inside the inline editor.

<docs-source-example example="InlineEditorRequiredExample"></docs-source-example>

By default errors are hidden initially and will be displayed on invalid form
fields, after the user has interacted with the element or the parent form has
been submitted. This behaviour can be customized by passing an ErrorStateMatcher
to the inline editor.

An inline editor can have more than one error, it is up to the consumer to
toggle which messages should be displayed. This can be done with `ngIf` or
`ngSwitch`. You can use the Angular forms API with the inline editor and pass
validators to it as you would with any other form field.

<docs-source-example example="InlineEditorValidationExample"></docs-source-example>

## Asynchronous operations

### Success

<docs-source-example example="InlineEditorSuccessfulExample"></docs-source-example>

### Failure

<docs-source-example example="InlineEditorFailingExample"></docs-source-example>
