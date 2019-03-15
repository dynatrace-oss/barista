---
type: "component"
---

# Pagination

## Imports

You have to import the `DtPaginationModule` when you want to use the `dt-pagination`:

```typescript
@NgModule({
  imports: [
    DtPaginationModule,
  ],
})
class MyModule {}
```

## Initialization

To use the Dynatrace pagination component, use the `<dt-pagination>` element.

## Options & Properties

| Name | Type | Default | Description |
| --- | --- | --- | --- |
| `@Input() maxPages` | `number` | `undefined` | This specifies the maximum page number displayed. |
| `@Input() currentPage` | `number` | `1` | This indicates the currently selected page number. The default value, if not specified, is 1. |
| `@Output() changed` | `EventEmitter<number>` | - | The event which is fired when the user changes the page. This can be either done by using one of the arrows or by clicking on a page number. The number passed by this event is the new page which should get displayed. |

## Examples

### Few pages

<docs-source-example example="DefaultPaginationExampleComponent"></docs-source-example>

### Many pages

<docs-source-example example="ManyPaginationExampleComponent"></docs-source-example>
