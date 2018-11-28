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

To use the dynatrace pagination component, use the `<dt-pagination>` element.

*Example:*

<docs-source-example example="DefaultPaginationExampleComponent"></docs-source-example>

## Options & Properties

| Name | Type | Default | Description |
| --- | --- | --- | --- |
| `[maxPages]` | `number` | `undefined` | This specifies the maximum page number displayed. |
| `[currentPage]` | `number` | `1` | This indicates the currently selected page number. If not specified, this will default to one. |
| `(changed)` | `event<number>` |  | The event which is fire, when the user changes the page. This can be either using one of the arrows, or by clicking on a page number. The number passed by this event, is the new page which should get displayed. |

## Examples

### Many pages

<docs-source-example example="ManyPaginationExampleComponent"></docs-source-example>
