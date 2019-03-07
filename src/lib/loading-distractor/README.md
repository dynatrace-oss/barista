---
type: "component"
---

# Loading distractor & loading spinner

<docs-source-example example="DefaultLoadingDistractorExampleComponent"></docs-source-example>

`<dt-loading-spinner>` and `<dt-loading-distractor>` are a circular indicators of activity (eg. loading).

## Imports

You have to import the `DtLoadingDistractorModule` when you want to use the `dt-loading-distractor` or `dt-loading-spinner`:

```typescript
@NgModule({
  imports: [
    DtLoadingDistractorModule,
  ],
})
class MyModule {}
```

## Progress spinner

<docs-source-example example="SpinnerLoadingDistractorExampleComponent"></docs-source-example>

## Inside a Form-field

When a `<dt-loading-spinner>` is placed as a prefix or suffix inside a `<dt-form-field>` the color and size adjust automatically.

<docs-source-example example="InputLoadingDistractorExampleComponent"></docs-source-example>

## Progress distractor

The `<dt-loading-distractor>` wraps the spinner and adds a label next to it.

### Options & Properties

| Name | Type | Default | Description |
| --- | --- | --- | --- |
| `ng-content` | `string` (html content) | `-` | Defines the label of the loading distractor |

## Accessibility

Each `<dt-loading-spinner>` should be given a meaningful label via `aria-label` or `aria-labelledby`.
`<dt-loading-distractor>` will set the aria-labelledby attributes automatically.
