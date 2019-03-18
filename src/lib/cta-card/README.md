---
type: "component"
---

# Cta Card

<docs-source-example example="DefaultCtaCardExampleComponent"></docs-source-example>

The `<dt-cta-card>` is a specific type of card showing a call to action content, defined by a title, an image, a teaser text and an action button.
In addition to the custom content, the cta card can hold some special sections:

* `<dt-cta-card-title>` - The title of the cta card
* `<dt-cta-card-image>` - Image to be shown within the illustration region of the cta card
* `<dt-cta-card-footer-actions>` - Action buttons, displayed below the text. For the regular cases there should only be one primary cta styled dt-button.  
* `<dt-cta-card-title-actions>` - Buttons displayed next to the title. Should be a secondary styled dt-button showing an image.

## Imports

You have to import the `DtCtaCardModule` when you want to use the `dt-cta-card`:

```typescript
@NgModule({
  imports: [
    DtCtaCardModule,
  ],
})
class MyModule {}
```

Please note that you should not use the cta-card's elements like title to hold any arbitrary content just for spacing purposes, make sure to put only the cards title inside the `<dt-cta-card-title>` element and not controls like buttons.

## Examples

### Closable

<docs-source-example example="ClosableCtaCardExampleComponent"></docs-source-example>
