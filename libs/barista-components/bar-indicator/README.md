# Bar-indicator

<ba-ux-snippet name="bar-indicator-intro"></ba-ux-snippet>

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

<ba-ux-snippet name="bar-indicator-variants"></ba-ux-snippet>

## Bar indicator in use

### Theming and validation

<ba-ux-snippet name="bar-indicator-theming"></ba-ux-snippet>

### Alignment

<ba-ux-snippet name="bar-indicator-alignment"></ba-ux-snippet>

### Value bindings

Bar-indicator with variable `min`, `max` and `value` bindings.
<ba-live-example name="DtExampleBarIndicatorDynamic"></ba-live-example>
