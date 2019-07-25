---
type: 'component'
---

# <%= classify(name) %>

<docs-source-example example="<%= classify(name) %>DefaultExample"></docs-source-example>

## Imports

You have to import the `<%= moduleName %>` when you want to use the
`<dt-<%= dasherize(name) %>>`:

```typescript
@NgModule({
  imports: [
    <%= moduleName %>,
  ],
})
class MyModule {}
```

## Initialization

## Options & Properties

| Name | Type | Default | Description |
| ---- | ---- | ------- | ----------- |


## Examples
