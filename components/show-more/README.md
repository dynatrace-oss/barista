# Show more

<ba-ux-snippet name="show-more-intro"></ba-ux-snippet>

<ba-live-example name="DtExampleShowMoreDefault"></ba-live-example>

## Imports

You have to import the `DtShowMoreModule` when you want to use the
`dt-show-more`.

```typescript
@NgModule({
  imports: [DtShowMoreModule],
})
class MyModule {}
```

## Initialization

To apply the show more component, use the `<button dt-show-more>` element. Use
the content to add a show more label above the arrow icon.

## Inputs

| Name                | Type      | Default     | Description                                                                                                                                               |
| ------------------- | --------- | ----------- | --------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `<ng-content>`      |           |             | The text which gets displayed above the arrow.                                                                                                            |
| `showLess`          | `boolean` | `false`     | Whether on click the content that has been expanded is collapsed again. When `true` the show more arrow points upwards and the show more label is hidden. |
| `ariaLabelShowLess` | `string`  | `Show less` | The aria label for the show less button without text.                                                                                                     | `(changed)` | `event<void>` |  | The event which gets fired when the state changes. The event is fired when the user clicks on the component, as well as using SPACE or ENTER keys. |  |

## Show more in use

<ba-ux-snippet name="show-more-in-use"></ba-ux-snippet>

## Dark background

The show more component can be placed on dark background.

<ba-live-example name="DtExampleShowMoreDark" themedark></ba-live-example>

## Accessibility

When the component is used as an expandable panel trigger, add a label using the
`ariaLabelShowLess` input to provide a text alternative for the button without a
text.
