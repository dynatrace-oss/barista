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

`dt-breadcrumbs` element has no configuration options. It's just a wrapper for the `dt-breadcrumbs-item` elements.

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
