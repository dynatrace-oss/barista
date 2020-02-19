# Consumption

<ba-ux-snippet name="consumption-intro"></ba-ux-snippet>

<ba-live-example name="DtExampleConsumptionDefault"></ba-live-example>

To set the content for a consumption component, the following tags are
available:

- `<dt-consumption-icon>` - An icon shown right next to the title (e.g.
  `<dt-icon name="host"></dt-icon>`)
- `<dt-consumption-title>` - The title of the consumption component
- `<dt-consumption-subtitle>` - The title usually shown below the actual title
- `<dt-consumption-count>` - A formatted value label shown below the progress
  bar (e.g. `5/20`)
- `<dt-consumption-label>` - A more detailed description of what the progressbar
  and count label actually represent (e.g. `Restricted host unit hours`)

Additionally an optional overlay section is supported that is only shown when
the user hovers over the consumption component:

- `<dt-consumption-overlay>` - Content that is shown in an overlay when the user
  hovers over the consumption component

## Imports

You have to import the `DtConsumptionModule` when you want to use the
`<dt-consumption>`:

```typescript
@NgModule({
  imports: [DtConsumptionModule],
})
class MyModule {}
```

## Inputs

### DtConsumption

| Name  | Type   | Default  | Description                                                                                                                |
| ----- | ------ | -------- | -------------------------------------------------------------------------------------------------------------------------- |
| max   | number | `0`      | Largest possible value for this consumption component instance                                                             |
| value | number | `0`      | The currently displayed value for this consumption component instance. The value must be within the interval `[min, max]`. |
| color | string | `'main'` | The color scheme used for the progress bar. Only values defined in type `DtConsumptionThemePalette` are considered valid.  |

### DtConsumptionIcon

| Name       | Type     | Default     | Description                                                           |
| ---------- | -------- | ----------- | --------------------------------------------------------------------- |
| aria-label | `string` | `undefined` | Accessibility label describing the icon in the consumption component. |

To make our components accessible it is obligatory to provide either an
`aria-label` or `aria-labelledby`.

## Accessibility

Icons defined with `<dt-consumption-icon>` must be given a meaningful label via
`aria-label`.

## States

<ba-ux-snippet name="consumption-states"></ba-ux-snippet>
