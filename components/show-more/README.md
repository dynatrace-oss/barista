# Show More

The show more component is used to split long lists of items into smaller sets
and load them one by one.

<ba-live-example name="DtExampleShowMoreDefault"></ba-live-example>

## Imports

You have to import the `DtShowMoreModule` when you want to use the
`dt-show-more`:

```typescript
@NgModule({
  imports: [DtShowMoreModule],
})
class MyModule {}
```

## Initialization

To apply the show more component, use the `<dt-show-more>` element with some
content as text. To use a _Show less_ label an additional `<dt-show-less-label>`
tag can be used.

## Properties

### Button group

| Name           | Type          | Default | Description                                                                                                                                        |
| -------------- | ------------- | ------- | -------------------------------------------------------------------------------------------------------------------------------------------------- |
| `<ng-content>` |               |         | The (optional) text which gets displayed above the arrow.                                                                                          |
| `[showLess]`   | `boolean`     | `true`  | The property which stores the expanded state of the component. If the value is `true`, then the arrow of the component is pointing downwards.      |
| `[tabIndex]`   | `number`      | `0`     | Sets and gets the tabIndex property.                                                                                                               |
| `(changed)`    | `event<void>` |         | The event which gets fired when the state changes. The event is fired when the user clicks on the component, as well as using SPACE or ENTER keys. |

## Show more on dark background

<ba-live-example name="DtExampleShowMoreDark" themedark="true"></ba-live-example>

## Behavior

As the list is divided into equal parts, the button shows the number of entries
of the next part, if possible. As soon as there are no more entries available,
the show more button is hidden. Once expanded, the list cannot be collapsed
anymore without a full page reload.

Another variant of the paging behavior - loading more items if not everything is
visible initially - is the [pagination component](/components/pagination).

## States

The show more component can be disabled.

<ba-live-example name="DtExampleShowMoreDisabled"></ba-live-example>

## Show more in use

When combining the show more component with other components, make sure there is
always a 20px space above and below the show more component.

### Show more without text

<ba-live-example name="DtExampleShowMoreNoText"></ba-live-example>

### Interactive example

<ba-live-example name="DtExampleShowMoreInteractive"></ba-live-example>
