---
title: <%= classify(name) %>
description: 'TODO: Add one sentence that describes this component.'
public: true
toc: true
contributors:
  dev:
    - firstname.lastname
  ux:
    - firstname.lastname
---

# <%= classify(name) %>

<!-- TODO: Check the title (front matter) and h1 of this page; write e.g. "Button group" instead of "ButtonGroup". -->

<!-- TODO: Add a short introduction text that describes the purpose of this component. -->

<docs-source-example example="<%= classify(name) %>DefaultExample"></docs-source-example>

## Imports

You have to import the `<%= moduleName %>` when you want to use the
`<dt-<%= dasherize(name) %>>`.

```typescript
@NgModule({
  imports: [
    <%= moduleName %>,
  ],
})
class MyModule {}
```

## Initialization

<!-- TODO: Describe how this component is used; which tags and properties are needed to make it work. -->

## Inputs

| Name | Type | Default | Description |
| ---- | ---- | ------- | ----------- |

## Outputs

| Name | Type | Description |
| ---- | ---- | ----------- |


<!-- TODO: Add sections about variants, theming, sub-components etc... The (headline-)structure depends on the component and use cases. -->

## Accessibility

<!-- TODO: If necessary and useful, add some words about accessibility. -->

## <%= classify(name) %> in use

<!-- TODO: Describe how and when this component is used and add examples/demos. -->
