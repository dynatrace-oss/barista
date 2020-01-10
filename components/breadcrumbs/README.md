# Breadcrumbs

Breadcrumbs are used to navigate and to indicate the currently viewed page. Our
breadcrumbs are hierarchy-based, which means that every item of the breadcrumb
represents a page and thus also the path that led up to the currenty visited
page.

<ba-live-example name="DtExampleBreadcrumbsDefault"></ba-live-example>

## Imports

You have to import the `DtBreadcrumbsModule` when you want to use the
`dt-breadcrumbs`.

```typescript
@NgModule({
  imports: [DtBreadcrumbsModule],
})
class MyModule {}
```

## Initialization

The `dt-breadcrumbs` component accepts a `color` property to define the color
version of the breadcrumbs. Anchor elements with the `dtBreadcrumbsItem`
directive applied can be used as breadcrumbs items.

## Inputs

| Name         | Type                           | Default     | Description                                                                            |
| ------------ | ------------------------------ | ----------- | -------------------------------------------------------------------------------------- |
| `color`      | `'main' | 'error' | 'neutral'` | `main`      | Current variation of the theme color which is applied to the color of the breadcrumbs. |
| `aria-label` | `string`                       | `undefined` | Takes precedence as the element's text alternative.                                    |

To make our components accessible it is obligatory to provide either an
`aria-label` or `aria-labelledby`.

## Behavior

Items within a breadcrumb have a maximum length. To ensure that unusually long
items do not take up too much space, their text value will be abbreviated using
an ellipsis as soon as the maximum length is exceeded.

![Breadcrumb items grouped together closed](https://dt-cdn.net/images/breadcrumb-grouping-closed-530-50b55aee7f.png)

Should there not be enough space in the component to show all items, individual
items are grouped together (starting from the left) and can be accessed by
clicking the `...` item in the breadcrumb.

![Breadcrumb items grouped together expanded](https://dt-cdn.net/images/breadcrumb-grouping-expanded-530-c1e0bd5e27.png)

## Theming

Breadcrumbs always have the theme color of the current page the user is
visiting. If the page does not have a theme color (e.g. in the settings), then
the breadcrumbs will be displayed in gray.

<ba-live-example name="DtExampleBreadcrumbsColor"></ba-live-example>

## Breadcrumb in use

### Listening to an observable

Content within the breadcrumb can change.

<ba-live-example name="DtExampleBreadcrumbsObservable"></ba-live-example>

### Dark

Breadcrumbs also work on dark background.

<ba-live-example name="DtExampleBreadcrumbsDark" themedark></ba-live-example>
