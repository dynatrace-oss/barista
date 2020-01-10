# Show more

The show more component indicates the possibility to load more content than
currently visible. Use it when long lists of items are split into smaller sets
to load them one by one or as trigger of an expandable panel to toggle the
visibility of certain content on a page.

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

## Usage

The label text should describe how many more items are loaded on click. The show
more button is not displayed when there are no more items to load. Instead a
short note that there is no more data is shown.

<ba-live-example name="DtExampleShowMoreDefault"></ba-live-example>

### Section toggle

In case the component is used as a trigger to expand a content section, there is
no label shown when the component is in close-button-state (i.e. `showLess` is
`true`).

<ba-live-example name="DtExampleShowMoreToggle"></ba-live-example>

### Disabled

When it's not possible or the user is not allowed to load more entries or to
expand a section, the component gets disabled.

<ba-live-example name="DtExampleShowMoreDisabled"></ba-live-example>

## Dark background

The show more component can be placed on dark background.

<ba-live-example name="DtExampleShowMoreDark" themedark></ba-live-example>

## Accessibility

When the component is used as an expandable panel trigger, add a label using the
`ariaLabelShowLess` input to provide a text alternative for the button without a
text.
