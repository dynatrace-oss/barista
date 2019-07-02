---
type: "component"
---

# Loading distractor & loading spinner

The `<dt-loading-spinner>` and `<dt-loading-distractor>` are circular indicators of activity (e.g. loading of data).

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

## Loading spinner

The loading spinner consists of an anmiated SVG circle and can be used in combination with other components, e.g. a form field.

<docs-source-example example="LoadingDistractorSpinnerExample"></docs-source-example>

### Inside a form field

When a `<dt-loading-spinner>` is placed as a prefix or suffix inside a `<dt-form-field>` the color and size adjust automatically.

<docs-source-example example="LoadingDistractorInputExample"></docs-source-example>

## Loading distractor

The `<dt-loading-distractor>` wraps the spinner and adds a label next to it.

<docs-source-example example="LoadingDistractorDefaultExample"></docs-source-example>

### Options & Properties

| Name | Type | Default | Description |
| --- | --- | --- | --- |
| `ng-content` | `string` (html content) | `-` | Defines the label of the loading distractor |

## Accessibility

Each `<dt-loading-spinner>` should be given a meaningful label via `aria-label` or `aria-labelledby`.
The `aria-labelledby` attribute of the `<dt-loading-distractor>` is set automatically based on the given content.
