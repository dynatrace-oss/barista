# Card

<!-- styling to change background color of component demos -->
<style>
.component-demo__demo {
  background-color: #f8f8f8;
}
</style>

The card component is a visual container for wrapping a wide variety of
contents.

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

A card consists of multiple sections. To ensure a consistent look follow these
simple patterns about how the content of a card should be structured.

### Header

The header of a card consists of the following elements:

- a title (required),
- a subtitle,
- an icon and
- actions.

Actions are [secondary buttons](/components/button) placed in the card's top
right corner. Multiple actions can be shown to the user. If space is limited,
move less important actions to a
[context actions menu](/components/context-dialog). The decision which button is
shown and which ones are grouped in a context actions menu depends on the use
case.

<ba-live-example name="DtExampleCardSubtitle" background></ba-live-example>

<ba-live-example name="DtExampleCardIcon" background></ba-live-example>

### Description

The optional description section contains information about the content of the
card (only if an explanation is necessary). If the text is longer than one
sentence, use the [expandable text component](/components/expandable-text) to
make the full text expandable.

### Card content

This is the main section of the card and can contain all kinds of components
that present data to the user. How content within a card rearranges on different
screen sizes depends strongly on the content and the use case and should always
be discussed with a UX designer.

### Actions

Actions can be put above and/or below the content section. Buttons that navigate
to another page or drill down to more details should be placed after the content
section, whereas buttons that modify content within a card should be placed
above the content to be updated. When placing buttons in a card, follow the
[button alignment pattern](/patterns/button-alignment).

#### Header actions

<ba-live-example name="DtExampleCardActionButtons" background></ba-live-example>

#### Footer actions

<ba-live-example name="DtExampleCardFooterActions" background></ba-live-example>

### Pagination

The optional pagination section contains a [pagination](/components/pagination)
or a [show more](/components/show-more) component to extend the card content.
This section must always be the last one within a card.

## Dark background

A card can be placed on dark background.

<ba-live-example name="DtExampleCardDark" themedark></ba-live-example>

## Card in use

See the [layout pattern](/patterns/layout/#cards) for rules how to rearrange
cards on a view depending on the container size.

See the following table for margin and padding values depending on predefined
breakpoints.

| container min-width | margin | padding |
| :------------------ | :----- | :------ |
| default             | 8px    | 8px     |
| 460px               | 8px    | 12px    |
| 992px               | 16px   | 16px    |
| 1200px              | 20px   | 16px    |
