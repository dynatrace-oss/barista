---
title: "Card"
postid: card
identifier: "Cd"
category: "components"
public: true
toc: true
contributors:
  dev:
    - fabian.friedl
  ux:
    - raphaela.raudaschl
angular: "card"
tags:
  - "card"
  - "content"
  - "layout"
  - "island"
  - "section"
  - "list"
  - "panel"
  - "grouping"
  - "page structure"
  - "angular"
  - "component"
---

<!-- styling to change background color of component demos -->
<style>
.component-demo__demo {
  background-color: #f8f8f8;
}
</style>

# Card

The card component is a visual container for wrapping a wide variety of contents. 

<docs-source-example example="CardDefaultExample"></docs-source-example>

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

A card consists of multiple sections. To ensure a consistent look follow these simple patterns about how the content of a card should be structured.

### Header

The header of a card consists of the following elements:
* a title (required),
* a subtitle,
* an icon and
* actions.

Actions are [secondary buttons]({{link_to_id id='button' }}) placed in the card's top right corner. Multiple actions can be shown to the user. If space is limited, move less important actions to a [context actions menu]({{link_to_id id='context-dialog' }}). The decision which button is shown and which ones are grouped in a context actions menu depends on the use case.

<docs-source-example example="CardSubtitleExample"></docs-source-example>

<docs-source-example example="CardIconExample"></docs-source-example>

### Description

The optional description section contains information about the content of the card (only if an explanation is necessary). If the text is longer than one sentence, use the [context help]({{link_to_id id='inline-help' }}#context-help) to make the full text expandable.

### Content

This is the main section of the card and can contain all kinds of components that present data to the user. How content within a card rearranges on different screen sizes depends strongly on the content and the use case and should always be discussed with a UX designer.

### Actions

Actions can be put above and/or below the content section. Buttons that navigate to another page or drill down to more details should be placed after the content section, whereas buttons that modify content within a card should be placed above the content to be updated. When placing buttons in a card, follow the [button alignment pattern]({{link_to_id id='button-alignment' }}).

#### Header actions

<docs-source-example example="CardActionButtonsExample"></docs-source-example>

#### Footer actions

<docs-source-example example="CardFooterActionsExample"></docs-source-example>

### Pagination

The optional pagination section contains a [pagination]({{link_to_id id='pagination' }}) or a [show more]({{link_to_id id='show-more' }}) component to extend the card content. This section must always be the last one within a card.


## Dark background

A card can be placed on dark background.

<docs-source-example example="CardDarkExample" themedark="true"></docs-source-example>

## Card in use

See the [layout pattern]({{link_to_id id='layout' }}#cards) for rules how to rearrange cards on a view depending on the container size.

See the following table for margin and padding values depending on predefined breakpoints.

| container min-width | margin        | padding         |
|:----------------- | :-------------- | :-------------- |
| default           | 8px             | 8px             |
| 460px             | 8px             | 12px            |
| 992px             | 16px            | 16px            |
| 1200px            | 20px            | 16px            |


{{#internal-content}}

### Event card
An exemplary use of the card component can be seen in the <a href="https://demo.dev.dynatracelabs.com/ui/docs/events-card/" target="_blank" rel="noopener">event card</a>.

{{/internal-content}}