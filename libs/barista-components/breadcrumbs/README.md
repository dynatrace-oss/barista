# Breadcrumbs

<ba-ux-snippet name="breadcrumbs-intro"></ba-ux-snippet>

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

<ba-ux-snippet name="breadcrumbs-behavior"></ba-ux-snippet>

## Theming

<ba-ux-snippet name="breadcrumbs-theming"></ba-ux-snippet>

## Breadcrumb in use

### Listening to an observable

Content within the breadcrumb can change.

<ba-live-example name="DtExampleBreadcrumbsObservable"></ba-live-example>

### Dark

Breadcrumbs also work on dark background.

<ba-live-example name="DtExampleBreadcrumbsDark" themedark></ba-live-example>
