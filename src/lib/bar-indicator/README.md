---
type: "component"
---

# Bar-indicator

<docs-source-example example="DefaultBarIndicatorExampleComponent"></docs-source-example>

The bar-indicator functions as a semantic alternative to the progress bar. It should display not a progress, but rather a ratio between multiple bar-indicators or something like "passed time" to put some visual perspective between connected bar-indicators.

A basic bar-indicator would follow this structure:

```html
<dt-bar-indicator value="10"></dt-bar-indicator>
```

## Imports 

You have to import the `DtBarIndicatorModule` to use the `dt-bar-indicator`: 

```typescript
@NgModule({
  imports: [
    DtBarIndicatorModule,
  ],
})
class MyModule {}
```

## Inputs

| Name | Type | Default | Description |
| --- | --- | --- | --- |
| `align` | `'start' | 'end'` | `start` | Alignment of the bar-indicator defining if increasing percentage values let the bar grow to the left or the right. |
| `color` | `'main' | 'recovered' | 'error'` | `main` | Current variation of the theme color which is applied to the color of the bar-indicator .|
| `max` | `number`| `100` | Sets the maximum value of the bar-indicator. Inherited from `HasProgressValues`.|
| `min` | `number`| `0` | Sets the minimum value of the bar-indicator. Inherited from `HasProgressValues`.|
| `value` | `number`| - | Sets the current value of the bar-indicator. Inherited from `HasProgressValues`.|

## Outputs

| Name | Type | Default | Description |
| --- | --- | --- | --- |
| `valueChange` | `EventEmitter<DtBarIndicatorChange>` | | Event emitted when the value of the bar-indicator cahnges. |


| Name | Type | Default | Description |
| --- | --- | --- | --- |
| `percentage`| `number`| | Percentage value for the current `value` between `min` and `max`. Inherited from `HasProgressValues`. |

## Examples

Bar-indicator set to a fixed value.

<docs-source-example example="DefaultBarIndicatorExampleComponent"></docs-source-example>

Bar-indicator in different color variations.

<docs-source-example example="ColorBarIndicatorExampleComponent"></docs-source-example>

Bar-indicator with alignment set to end
<docs-source-example example="AlignmentBarIndicatorExampleComponent"></docs-source-example>

Bar-indicator with variable `min`, `max` and `value` bindings.

<docs-source-example example="DynamicBarIndicatorExampleComponent"></docs-source-example>
