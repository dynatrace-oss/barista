# Card

<ba-ux-snippet name="card-intro"></ba-ux-snippet>

<ba-live-example name="DtExampleCardDefault" background></ba-live-example>

## Imports

You have to import the `DtCardModule` when you want to use the `dt-card`:

```typescript
@NgModule({
  imports: [DtCardModule],
})
class MyModule {}
```

## Initialization

In addition to the custom content, the card can also hold some special sections
(directives):

- `<dt-card-title>` - The title of this card, needs to be defined to show the
  card's headline. This should be text only.
- `<dt-card-subtitle>` - Right below the title, a subtitle can be placed.
- `<dt-card-icon>` - An icon in the top left corner of the card. Use the
  `<dt-icon>` component for this.
- `<dt-card-title-actions>` - The place to add action buttons. Will be displayed
  in the top right corner. For multiple `<dt-button>` elements, use the
  `secondary` variant.
- `<dt-card-footer-actions>` - Action buttons, displayed below the text. There
  should only be one `primary` `<dt-button>`.

Details about sections within a card are described below.

## Card content structure

<ba-ux-snippet name="card-content-structure"></ba-ux-snippet>

## Dark background

A card can be placed on dark background.

<ba-live-example name="DtExampleCardDark" themedark></ba-live-example>

## Card in use

<ba-ux-snippet name="card-in-use"></ba-ux-snippet>
