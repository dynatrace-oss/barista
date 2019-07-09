---
type: 'component'
---

# Tag

The `dt-tag` wraps text or key-value pairs.

## Imports

You have to import the `DtTagModule` when you want to use the `dt-tag`:

```typescript
@NgModule({
  imports: [DtTagModule],
})
class MyModule {}
```

## Initialization

To use the Dynatrace tag, use the `<dt-tag>` element.

In addition, also other selectors can be used.

- `<dt-tag>` or `[dt-tag]` or `[dtTag]` - To create the tag itself. Attribute selectors can be used on an anchor tag for example.
- `<dt-tag-key>` or `[dt-tag-key]` or `[dtTagKey]` - To identify a content child as a key/attribute for the tag.

<docs-source-example example="TagDefaultExample"></docs-source-example>

## Inputs

| Name        | Type      | Default     | Description                                                                              |
| ----------- | --------- | ----------- | ---------------------------------------------------------------------------------------- |
| `value`     | `T`       | `undefined` | This can be used to bind a specific value to a tag.                                      |
| `removable` | `boolean` | `false`     | If this is set to `true`, the tag can be removed by the user by clicking the abort icon. |
| `disabled`  | `boolean` | `false`     | **DEPRECATED - will be removed with 5.0.0 without replacement**                          |

## Outputs

| Name      | Type       | Default | Description                                                 |
| --------- | ---------- | ------- | ----------------------------------------------------------- |
| `removed` | `event<T>` |         | This event is fired, when the user triggers the abort icon. |

## Examples

### Removable state

<docs-source-example example="TagRemovableExample"></docs-source-example>

### With key/category

<docs-source-example example="TagKeyExample"></docs-source-example>

### Interactive example

<docs-source-example example="TagInteractiveExample"></docs-source-example>

