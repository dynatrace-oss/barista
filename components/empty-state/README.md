# Empty state

<ba-ux-snippet name="empty-state-intro"></ba-ux-snippet>

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

<ba-ux-snippet name="empty-state-in-use"></ba-ux-snippet>

## Custom empty state

Custom/Reusable empty states are also supported using the `dtCustomEmptyState`
directive. The custom empty state must both extend and provide itself as a
`DtEmptyState`.

<ba-live-example name="DtExampleCustomEmptyStateTable" background></ba-live-example>
