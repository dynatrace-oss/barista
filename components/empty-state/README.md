# Empty state

The `<dt-empty-state>` component is a placeholder for content that does not yet
exist. It consists of one or more items with each item containing an image, an
optional header and a short description text. It can be used within a
`<dt-card>` or an `<dt-table>`.

<ba-live-example name="DtExampleEmptyStateDefault"></ba-live-example>

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

## Variants

If multiple steps are needed in an explanation, they will be seperated with an
arrow. If a main call to action button is needed, add it to the card component.
This is mainly used in an empty entity view.

<ba-live-example name="DtExampleEmptyStateMultipleItems"></ba-live-example>

## Empty state in use

The empty state is often used in combination with a card component (replaces the
deprecated CTA card) or in an empty table or chart.

<ba-live-example name="DtExampleEmptyStateInCard" background></ba-live-example>

The following example shows a CTA card with multiple empty state items.

<ba-live-example name="DtExampleEmptyStateMultipleItemsInCard" background></ba-live-example>
