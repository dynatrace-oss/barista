---
type: "component"
---

# Card

`<dt-card>` is a visual container for wrapping a wide variety of contents.
In addition to the custom content, the card can also hold some special sections (directives):

* `<dt-card-title>` - The title of this card, needs to be defined to show the card's headline. This should be text only.
* `<dt-card-subtitle>` - Right below the title, a subtitle can be placed.
* `<dt-card-icon>` - An icon in the top left corner of the card. Use the `<dt-icon>` component for this.
* `<dt-card-title-actions>` - The place to add action buttons. Will be displayed in the top right corner. For multiple `<dt-button>` elements, use the `secondary` variant.
* `<dt-card-footer-actions>` - Action buttons, displayed below the text. There should only be one `primary` `<dt-button>`.

<docs-source-example example="CardDefaultExample"></docs-source-example>

## Imports

You have to import the `DtCardModule` when you want to use the `dt-card`:

```typescript
@NgModule({
  imports: [
    DtCardModule,
  ],
})
class MyModule {}
```

## Examples

### Title & Subtitle

<docs-source-example example="CardSubtitleExample"></docs-source-example>

### Actions

<docs-source-example example="CardActionButtonsExample"></docs-source-example>

### Footer actions

<docs-source-example example="CardFooterActionsExample"></docs-source-example>

### Icon

**Note:** icons are not yet implemented. This is merely a placeholder to show card capabilities.

<docs-source-example example="CardIconExample"></docs-source-example>

### Dark theme

<docs-source-example example="CardDarkExample" themedark="true"></docs-source-example>
