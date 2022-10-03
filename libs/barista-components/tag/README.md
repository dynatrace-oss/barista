# Tag

<ba-ux-snippet name="tag-intro"></ba-ux-snippet>

The `dt-tag` wraps text or key-value pairs, which then is wrapped by
`dt-tag-list`.

<ba-live-example name="DtExampleTagDefault"></ba-live-example>

## Imports

You have to import the `DtTagModule` to use the `dt-tag-list` and the `dt-tag`:

```typescript
@NgModule({
  imports: [DtTagModule],
})
class MyModule {}
```

## Initialization

To display tags in your view, use the `<dt-tag-list>` wrapper element put
`<dt-tag>` elements inside the wrapper.

In addition `<dt-tag>` allows other selectors to be used.

- `<dt-tag>` or `[dt-tag]` or `[dtTag]` - To create the tag itself. Attribute
  selectors can be used on an anchor tag for example.
- `<dt-tag-key>` or `[dt-tag-key]` or `[dtTagKey]` - To identify a content child
  as a key/attribute for the tag.

## Inputs

| Name        | Type      | Default     | Description                                                                              |
| ----------- | --------- | ----------- | ---------------------------------------------------------------------------------------- |
| `value`     | `T`       | `undefined` | This can be used to bind a specific value to a tag.                                      |
| `removable` | `boolean` | `false`     | If this is set to `true`, the tag can be removed by the user by clicking the abort icon. |

## Outputs

| Name      | Type       | Default | Description                                                 |
| --------- | ---------- | ------- | ----------------------------------------------------------- |
| `removed` | `event<T>` |         | This event is fired, when the user triggers the abort icon. |

## Tag list

The `dt-tag-list` element evaluates whether an amount of `dt-tag` elements fit
in one line and displays a 'more' button when it doesn't fit. If provided
`dt-tag-add` will always be displayed at the end of the `dt-tag-list`.

### Inputs

| Name         | Type     | Default      | Description                                                             |
| ------------ | -------- | ------------ | ----------------------------------------------------------------------- |
| `aria-label` | `string` | `undefinded` | Used to set the 'aria-label' attribute on the underlying input element. |

## Tag add button

The `dt-tag-add` button allows manual tag entries to an entity. The tag add
button should be placed inside the `dt-tag-list` wrapper and after your `dt-tag`
elements.

<ba-live-example name="DtExampleTagListWithTagAdd"></ba-live-example>

### Inputs

| Name          | Type     | Default      | Description                                                             |
| ------------- | -------- | ------------ | ----------------------------------------------------------------------- |
| `placeholder` | `string` | `undefined`  | Placeholder string for the add tag input overlay.                       |
| `aria-label`  | `string` | `undefinded` | Used to set the 'aria-label' attribute on the underlying input element. |
| `title`       | `string` | `Add Tag`    | Title of the 'Add' button and overlay.                                  |

### Outputs

| Name        | Type                  | Description                                                                                                                     |
| ----------- | --------------------- | ------------------------------------------------------------------------------------------------------------------------------- |
| `submitted` | `EventEmitter<event>` | Emits event when the form is submitted. With the default form the event contains a `tag` key that holds the value of the input. |
| `closed`    | `EventEmitter<void>`  | Emits event when the input overlay is closed.                                                                                   |

### Methods

| Name       | Type   | Description                                    |
| ---------- | ------ | ---------------------------------------------- |
| `open()`   | `void` | Opens the input overlay.                       |
| `close()`  | `void` | Closes the input overlay.                      |
| `submit()` | `void` | Triggers `submitted` **if** the form is valid. |

## Custom tag add form

A custom form can be passed to the `dt-tag-add` component. You need to include a
`FormGroupDirective` (from `@angular/forms`) inside the ng-content and the
form's value will be used when the form is submitted in the output.

<ba-live-example name="DtExampleCustomAddFormTag"></ba-live-example>

## Examples

### Removable state

<ba-live-example name="DtExampleTagRemovable"></ba-live-example>

### With key/category

<ba-live-example name="DtExampleTagKey"></ba-live-example>

### Interactive example

<ba-live-example name="DtExampleTagInteractive"></ba-live-example>
