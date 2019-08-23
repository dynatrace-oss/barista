---
title: "Breadcrumbs"
description: "Breadcrumbs are a navigational aid that help the user understand on what page they are and what path led them there."
postid: breadcrumbs
category: "components"
public: true
toc: true
properties:
  - 'work in progress'
contributors:
  dev:
    - fabian.friedl
    - szymon.bultrowicz
  ux:
    - andreas.haslinger
themable: true
tags:
  - "nav"
  - "component"
  - "angular"
  - "navbar"
  - "navigation"
  - "breadcrumbs"
---

# Breadcrumbs

Breadcrumbs are used to navigate and to indicate the currently viewed page. Our breadcrumbs are hierarchy-based, which means that every item of the breadcrumb represents a page and thus also the path that led up to the currenty visited page. 

<component-demo name="BreadcrumbsDefaultExample"></component-demo>

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

The `dt-breadcrumbs` component accepts a `color` property to define the color
version of the breadcrumbs. Anchor elements with the `dtBreadcrumbsItem`
directive applied can be used as breadcrumbs items.

### Inputs

| Name         | Type                           | Default | Description                                                                            |
| ------------ | ------------------------------ | ------- | -------------------------------------------------------------------------------------- |
| `color`      | `'main' | 'error' | 'neutral'` | `main`  | Current variation of the theme color which is applied to the color of the breadcrumbs. |
| `aria-label` | `string`                       | -       | Takes precedence as the element's text alternative.                                    |

## dt-breadcrumbs-item

### Inputs

| Name           | Type                  | Default | Description                                                                                                                                                                                    |
| -------------- | --------------------- | ------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `<ng-content>` | `html`                |         | HTML to be rendered as item content                                                                                                                                                            |
| `href`         | `string`              | any[]   | Value passed to the `routerLink` attribute underneath, accepts the same values as the directive. Element will be item as active automatically if the href attribute matches the current route. |
| `external`     | `boolean | undefined` | false   | If empty or truthy parameter given, the `href` attribute will not be interpreted as internal router link but rather as en external href   |                              

## Behavior

Items within a breadcrumb have a maximum length. To ensure that unusually long items do not take up too much space, their text value will be abbreviated using an ellipsis as soon as the maximum length is exceeded. 

{{#figure imagebox='true'}}
![Breadcrumb items grouped together closed](https://dt-cdn.net/images/breadcrumb-grouping-closed-530-50b55aee7f.png)
{{/figure}}

Should there not be enough space in the component to show all items, individual items are grouped together (starting from the left) and can be accessed by clicking the `...` item in the breadcrumb.

{{#figure imagebox='true'}}
![Breadcrumb items grouped together expanded](https://dt-cdn.net/images/breadcrumb-grouping-expanded-530-c1e0bd5e27.png)
{{/figure}}

## Theming

Breadcrumbs always have the theme color of the current page the user is visiting. If the page does not have a theme color (e.g. in the settings), then the breadcrumbs will be displayed in gray.

<docs-source-example example="BreadcrumbsColorExample"></docs-source-example>


## Breadcrumb in use

### Listening to an observable

Content within the breadcrumb can change.

<docs-source-example example="BreadcrumbsObservableExample"></docs-source-example>

### Dark

Breadcrumbs also work on dark background.

<docs-source-example example="BreadcrumbsDarkExample" themedark="true"></docs-source-example>



