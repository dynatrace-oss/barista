---
type: 'component'
---

# Empty state

The `<dt-empty-state>` component is a placeholder for content that does not yet
exist. It consists of one or more items with each item containing an image, an
optional header and a short description text. It can be used within a
`<dt-card>` or an `<dt-table>`.

<docs-source-example example="EmptyStateDefaultExample"></docs-source-example>

To set the content for a empty state component, the following tags are
available:

- `<dt-empty-state-item>` - An empty state item - an empty state card may
  contain one or more such items
- `<dt-empty-state-item-img>` - The image of an empty state card item
- `<dt-empty-state-item-title>` - The (optional) heading of an empty state card
  item

## Imports

You have to import the `DtEmptyStateModule` when you want to use the
`<dt-empty-state>`:

```typescript
@NgModule({
  imports: [DtEmptyStateModule],
})
class MyModule {}
```

## Examples

### Multiple items

Uses a `<dt-empty-state>` component with several items.

<docs-source-example example="EmptyStateMultipleItemsExample" fullwidth="true"></docs-source-example>

### Implement a CTA card

Uses a `<dt-empty-state>` component in combination with a
[card](/components/card) to implement a CTA card.

<docs-source-example example="EmptyStateInCardExample"></docs-source-example>

### Implement a CTA card (multiple items)

Uses a `<dt-empty-state>` component with multiple items in combination with a
[card](/components/card) to implement a CTA card.

<docs-source-example example="EmptyStateMultipleItemsInCardExample"></docs-source-example>
