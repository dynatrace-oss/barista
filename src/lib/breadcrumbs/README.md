---
type: "component"
---

# Breadcrumbs

<docs-source-example example="DefaultBreadcrumbsExampleComponent"></docs-source-example>

Breadcrumbs are used to navigate and to indicate the currently viewed page.

## Imports

You have to import the `DtBreadcrumbsModule` when you want to use `dt-breadcrumbs` or `dt-breadcrumbs-item` elements:

```typescript
@NgModule({
  imports: [
    DtBreadcrumbsModule,
  ],
})
class MyModule {}
```

## Options & Properties

### dt-breadcrumbs

`dt-breadcrumbs` component accepts a `color` property to define the color version of the breadcrumbs. It's a wrapper for the `dt-breadcrumbs-item` elements.

| Name | Type | Default | Description |
| --- | --- | --- | --- |
| `@Input() color` | `'main' | 'error' | 'neutral'` | `main` | Current variation of the theme color which is applied to the color of the breadcrumbs.|


### dt-breadcrumbs-item

| Name | Type | Default | Description |
| --- | --- | --- | --- |
| `<ng-content>` | `html` | | HTML to be rendered as item content |
| `[href]` | `string` | any[] | Value passed to the `routerLink` attribute underneath, accepts the same values as the directive. Element will be item as active automatically if the href attribute matches the current route. |
| `[external]` | `boolean | undefined` | false | If empty or truthy parameter given, the `href` attribute will not be interpreted as internal router link but rather as en external href |

## Examples

### Listening to an observable

<docs-source-example example="ObservableBreadcrumbsExampleComponent"></docs-source-example>

### External

<docs-source-example example="ExternalBreadcrumbsExampleComponent"></docs-source-example>

### Dark

<docs-source-example example="DarkBreadcrumbsExampleComponent" themedark="true"></docs-source-example>


### Colors

<docs-source-example example="ColorBreadcrumbsExampleComponent"></docs-source-example>