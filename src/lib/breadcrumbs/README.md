---
type: 'component'
---

# Breadcrumbs

Breadcrumbs are used to navigate and to indicate the currently viewed page.

## Imports

You have to import the `DtBreadcrumbsModule` when you want to use the
`dt-breadcrumbs`:

```typescript
@NgModule({
  imports: [DtBreadcrumbsModule],
})
class MyModule {}
```

## dt-breadcrumbs

`dt-breadcrumbs` component accepts a `color` property to define the color
version of the breadcrumbs. Anchor elements with the `dtBreadcrumbsItem`
directive applied can be used as breadcrumbs items.

### Inputs

| Name         | Type                           | Default | Description                                                                            |
| ------------ | ------------------------------ | ------- | -------------------------------------------------------------------------------------- |
| `color`      | `'main' | 'error' | 'neutral'` | `main`  | Current variation of the theme color which is applied to the color of the breadcrumbs. |
| `aria-label` | `string`                       | -       | Takes precedence as the element's text alternative.                                    |

## Examples

### Default

<docs-source-example example="BreadcrumbsDefaultExample"></docs-source-example>

### Listening to an observable

<docs-source-example example="BreadcrumbsObservableExample"></docs-source-example>

### Dark

<docs-source-example example="BreadcrumbsDarkExample" themedark="true"></docs-source-example>

### Colors

<docs-source-example example="BreadcrumbsColorExample"></docs-source-example>
