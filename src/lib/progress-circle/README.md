---
type: 'component'
---

# Progress circle

The `<dt-progress-circle>` creates a container that is hidden inside an overlay.
It is possible to set the value for the progress circle as well as setting a min
and max value. The color property can be set to specify the color of the
progress. The color depends on the theme the progress circle is in. The value
will be clamped between the min and max values. With `ng-content` the content
inside the progress-circle can be set.

<docs-source-example example="ProgressCircleDefaultExample"></docs-source-example>

## Imports

You have to import the `DtProgressCircleModule` when you want to use the
`dt-progress-circle`:

```typescript
@NgModule({
  imports: [DtProgressCircleModule],
})
class MyModule {}
```

## Accessibility

Progress circles should be given a meaningful label via aria-label or
aria-labelledby.

## Options & Properties

## Inputs

| Name    | Type     | Default | Description                                            |
| ------- | -------- | ------- | ------------------------------------------------------ |
| `value` | `number` | `0`     | Gets and sets the value on the progress-circle.        |
| `min`   | `number` | `0`     | Gets and sets the minimum value on the progress circle |
| `max`   | `number` | `100`   | Gets and sets the maximum value on the progress circle |

## Outputs

| Name          | Type                                                   | Description                                           |
| ------------- | ------------------------------------------------------ | ----------------------------------------------------- |
| `valueChange` | `EventEmitter<{ oldValue: number, newValue: number }>` | Event emitted when the progress circle value changes. |

## Properties

| Name         | Type     | Description                                     |
| ------------ | -------- | ----------------------------------------------- |
| `percentage` | `number` | Gets the percentage used to render the progress |

## Examples

### Progress circle with text in content

<docs-source-example example="ProgressCircleWithTextExample"></docs-source-example>

### Progress circle with icon in content

<docs-source-example example="ProgressCircleWithIconExample"></docs-source-example>

### Progress circle with color

<docs-source-example example="ProgressCircleWithColorExample"></docs-source-example>

### Progress circle change

<docs-source-example example="ProgressCircleChangeExample"></docs-source-example>
