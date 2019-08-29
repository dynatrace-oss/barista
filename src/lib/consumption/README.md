---
title: 'Consumption'
description:
  'The consumption component visualizes service usage data combining an icon,
  a title, a progress bar and some description text.'
postid: consumption
category: 'components'
contributors:
  dev:
    - christoph.matscheko
  ux:
    - jayme.brown
tags:
  - 'progress'
  - 'progress bar'
  - 'icon'
  - 'consumption'
  - 'angular'
---

# Consumption

The consumption component visualizes usage data of account services. It utilizes
an icon, a title, a progress bar with a value label and a description text. The
bar grows as the usage increases with color indicating the service status. The
value label is directly correlated with the growth of the progress bar. To set
the content for a consumption component, the following tags are available:

<docs-source-example example="ConsumptionDefaultExample"></docs-source-example>

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

## Options & Properties

| Name  | Type   | Default  | Description                                                                                                                |
| ----- | ------ | -------- | -------------------------------------------------------------------------------------------------------------------------- |
| min   | number | `0`      | Smallest possible value for this consumption component instance                                                            |
| max   | number | `0`      | Largest possible value for this consumption component instance                                                             |
| value | number | `0`      | The currently displayed value for this consumption component instance. The value must be within the interval `[min, max]`. |
| color | string | `'main'` | The color scheme used for the progress bar. Only values defined in type `DtConsumptionThemePalette` are considered valid.  |

## Accessibility

Icons defined with `<dt-consumption-icon>` must be given a meaningful label via
`aria-label`.

## Examples

### Overage view (warning state)

Services that are incurring overages display a full yellow bar (warning state).
The yellow color specifically depicts a service in overage. This means the
service has used all of its pre-paid quota and is utilizing service outside the
contracted amount.

<docs-source-example example="ConsumptionWarningExample"></docs-source-example>

### Limits reached view (error state)

Services that have used their full contracted amount display a full red bar
(error state). The red color specifically depicts a service that has hit its
contracted limit and the service will no longer be available until quotas are
increased or renewed.

<docs-source-example example="ConsumptionErrorExample"></docs-source-example>
