---
title: 'Show more'
description:
  'The show more component is used to load parts of a list one by one or to
  toggle the visibility of a content section.'
postid: show-more
category: 'components'
contributors:
  dev:
    - lara.aigmueller
    - daniel.kaneider
  ux:
    - gabriele.hasson-birkenmayer
related:
  - 'pagination'
tags:
  - 'component'
  - 'angular'
  - 'pagination'
  - 'show more'
  - 'pager'
---

# Show more

The show more component indicates the possibility to load more content than
currently visible. Use it when long lists of items are split into smaller sets
to load them one by one or as trigger of an expandable panel to toggle the
visibility of certain content on a page.

<docs-source-example example="ShowMoreDefaultExample"></docs-source-example>

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

To apply the show more component, use the `<dt-show-more>` element. Use the
content to add a show more label above the arrow icon.

## Inputs

| Name                   | Type      | Default     | Description                                                                                                                                               |
| ---------------------- | --------- | ----------- | --------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `<ng-content>`         |           |             | The text which gets displayed above the arrow.                                                                                                            |
| `showLess`             | `boolean` | `false`     | Whether on click the content that has been expanded is collapsed again. When `true` the show more arrow points upwards and the show more label is hidden. |
| `aria-label-show-less` | `string`  | `Show less` | The aria label for the show less button without text.                                                                                                     |

## Usage

The label text should describe how many more items are loaded on click. The show
more button is not displayed when there are no more items to load. Instead a
short note that there is no more data is shown.

<docs-source-example example="ShowMoreDefaultExample"></docs-source-example>

### Section toggle

In case the component is used as a trigger to expand a content section, there is
no label shown when the component is in close-button-state (i.e. `showLess` is
`true`).

<docs-source-example example="ShowMoreToggleExample"></docs-source-example>

### Disabled

When it's not possible or the user is not allowed to load more entries or to
expand a section, the component gets disabled.

<docs-source-example example="ShowMoreDisabledExample"></docs-source-example>

## Dark background

The show more component can be placed on dark background.

<docs-source-example example="ShowMoreDarkExample" themedark="true"></docs-source-example>

## Accessibility

When the component is used as an expandable panel trigger, add a label using the
`aria-label-show-less` input to provide a text alternative for the button
without a text.
