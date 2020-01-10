# Bar-indicator

The bar-indicator functions as a semantic alternative to the progress bar. It
should display not a progress, but rather a ratio between multiple
bar-indicators or something like "passed time" to put some visual perspective
between connected bar-indicators.

<ba-live-example name="DtExampleBarIndicatorDefault"></ba-live-example>

## Imports

You have to import the `DtBarIndicatorModule` to use the `dt-bar-indicator`:

```typescript
@NgModule({
  imports: [DtBarIndicatorModule],
})
class MyModule {}
```

## Inputs

| Name    | Type                             | Default | Description                                                                                                        |
| ------- | -------------------------------- | ------- | ------------------------------------------------------------------------------------------------------------------ |
| `align` | `'start' | 'end'`                | `start` | Alignment of the bar-indicator defining if increasing percentage values let the bar grow to the left or the right. |
| `color` | `'main' | 'recovered' | 'error'` | `main`  | Current variation of the theme color which is applied to the color of the bar-indicator .                          |
| `max`   | `number`                         | `100`   | Sets the maximum value of the bar-indicator. Inherited from `HasProgressValues`.                                   |
| `min`   | `number`                         | `0`     | Sets the minimum value of the bar-indicator. Inherited from `HasProgressValues`.                                   |
| `value` | `number`                         | -       | Sets the current value of the bar-indicator. Inherited from `HasProgressValues`.                                   |

## Outputs

| Name          | Type                                 | Description                                                |
| ------------- | ------------------------------------ | ---------------------------------------------------------- |
| `valueChange` | `EventEmitter<DtBarIndicatorChange>` | Event emitted when the value of the bar-indicator cahnges. |

## Properties

| Name      | Type     | Description                                                                                                       |
| --------- | -------- | ----------------------------------------------------------------------------------------------------------------- |
| `percent` | `number` | Returns the percentage value for the current `value` between `min` and `max`. Inherited from `HasProgressValues`. |

## Variants

The bar indicator is mostly used within table rows with the table column header
as a label. It can also be used as a standalone component, which requires labels
next to the bars then. As the bar indicator is not used to show total
percentages of a number, but rather to compare ratios, it can't be used as a
single, separated bar.  
The indicator is themeable and can also show problems.

<ba-live-example name="DtExampleBarIndicatorColor"></ba-live-example>

## Bar indicator in use

### Theming and validation

Depending on the context, the bar-indicator can be colored according to the
page's theme or use the validation colors.
<ba-live-example name="DtExampleBarIndicatorColor"></ba-live-example>

### Alignment

It's possible to set the alignment to `end`. This is used when a bar-indicator
is part of a table row with right-alignment.
<ba-live-example name="DtExampleBarIndicatorAlignment"></ba-live-example>

### Value bindings

Bar-indicator with variable `min`, `max` and `value` bindings.
<ba-live-example name="DtExampleBarIndicatorDynamic"></ba-live-example>
