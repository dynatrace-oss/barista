# Progress circle

The `<dt-progress-circle>` creates a container that is hidden inside an overlay.
It is possible to set the value for the progress circle as well as setting a min
and max value. The color property can be set to specify the color of the
progress. The color depends on the theme the progress circle is in. The value
will be clamped between the min and max values. With `ng-content` the content
inside the progress-circle can be set.

<ba-live-example name="DtExampleProgressCircleDefault"></ba-live-example>

## Imports

You have to import the `DtProgressCircleModule` when you want to use the
`dt-progress-circle`.

```typescript
@NgModule({
  imports: [DtProgressCircleModule],
})
class MyModule {}
```

## Inputs

| Name    | Type     | Default | Description                                            |
| ------- | -------- | ------- | ------------------------------------------------------ |
| `value` | `number` | `0`     | Gets and sets the value on the progress circle.        |
| `min`   | `number` | `0`     | Gets and sets the minimum value on the progress circle |
| `max`   | `number` | `100`   | Gets and sets the maximum value on the progress circle |

## Outputs

| Name          | Type                                                   | Description                                           |
| ------------- | ------------------------------------------------------ | ----------------------------------------------------- |
| `valueChange` | `EventEmitter<{ oldValue: number, newValue: number }>` | Event emitted when the progress circle value changes. |

<ba-live-example name="DtExampleProgressCircleChange"></ba-live-example>

## Properties

| Name         | Type     | Description                                      |
| ------------ | -------- | ------------------------------------------------ |
| `percentage` | `number` | Gets the percentage used to render the progress. |

## Variants

Progress circles can be used with icons or text as content.

<ba-live-example name="DtExampleProgressCircleWithIcon"></ba-live-example>

<ba-live-example name="DtExampleProgressCircleWithText"></ba-live-example>

## Colors

The progress circle can be colored based on its color theme palette.

<ba-live-example name="DtExampleProgressCircleWithColor"></ba-live-example>

## Accessibility

Progress circles should be given a meaningful label via aria-label or
aria-labelledby.
