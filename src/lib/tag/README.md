# Tag

## Imports

You have to import the `DtTagModule` when you want to use the `dt-tag`:

```typescript 
@NgModule({
  imports: [
    DtTagModule,
  ],
})
class MyModule {}
```

## Initialization

To use the dynatrace tag, use the `<dt-tag>` element.

In addition, also other selectors can be used.

* `<dt-tag>` or `[dt-tag]` or `[dtTag]` - To create the tag itself. Attribute selectors can be used on an anchor tag for example.
* `<dt-tag-key>` or `[dt-tag-key]` or `[dtTagKey]` - To identify a content child as a key/attribute for the tag

*Example:*

{{component-demo name="DefaultTagExampleComponent"}}

## Options & Properties

| Name | Type | Default | Description |
| --- | --- | --- | --- |
| `<ng-content>`  |   |   | The text (error/warning) message which should be displayed. |
| `[disabled]` | `boolean` | `false` | Let's the tag appear disabled. |
| `[removable]` | `boolean` | `false` | If this is set to `true`, the tag can be removed by the user by clicking the abort icon. |
| `[value]` | `T` | `undefined` | This can be used to bind a specific value to a tag. |
| `(removed)` | `event<T>` |  | The event which is fire, when the user hits the abort icon. |

## Examples

### Disabled state

{{component-demo name="DisabledTagExampleComponent"}}

### Removable state

{{component-demo name="RemovableTagExampleComponent"}}

### With key/category

{{component-demo name="KeyTagExampleComponent"}}

### Interactive example

{{component-demo name="InteractiveTagExampleComponent"}}

