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

## Inputs

| Name         | Type     | Default      | Description                                                               |
| ------------ | -------- | ------------ | ------------------------------------------------------------------------- |
| `aria-label` | `string` | `undefinded` | `Used to set the 'aria-label' attribute on the underlying input element.` |

## Examples

### Removable state

<ba-live-example name="DtExampleTagRemovable"></ba-live-example>

### With key/category

<ba-live-example name="DtExampleTagKey"></ba-live-example>

### Interactive example

<ba-live-example name="DtExampleTagInteractive"></ba-live-example>

## Tag add button

The `dt-tag-add` button allows manual tag entries to an entity.

<ba-live-example name="DtExampleTagListWithTagAdd"></ba-live-examples>

The tag add button should be placed inside the `dt-tag-list` wrapper and after
your `dt-tag` elements.

### Inputs

| Name          | Type     | Default      | Description                                                               |
| ------------- | -------- | ------------ | ------------------------------------------------------------------------- |
| `placeholder` | `string` | `undefined`  | `Placeholder string for the add tag input overlay.`                       |
| `aria-label`  | `string` | `undefinded` | `Used to set the 'aria-label' attribute on the underlying input element.` |

### Outputs

| Name       | Type                  | Description                      |
| ---------- | --------------------- | -------------------------------- |
| `tagAdded` | `EventEmitter<event>` | Emits event when a tag is added. |

### Methods

| Name      | Type   | Description                 |
| --------- | ------ | --------------------------- |
| `open()`  | `void` | `Opens the input overlay.`  |
| `close()` | `void` | `Closes the input overlay.` |
