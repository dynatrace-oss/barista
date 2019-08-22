---
title: "Bar indicator"
description: "Bar-indicators are used to compare values (e.g. time) with each other."
postid: bar-indicator
category: "components"
public: true
toc: true
themable: true
contributors:
  dev:
    - thomas.heller 
  ux:
    - andreas.mayr
    - kathrin.aigner
angular: "bar-indicator"
tags:
  - "progress"
  - "progress bar"
  - "angular"
  - "component"
  - "indicator"
  - "micro chart"
---

# Bar-indicator

The bar-indicator functions as a semantic alternative to the progress bar. It
should display not a progress, but rather a ratio between multiple
bar-indicators or something like "passed time" to put some visual perspective
between connected bar-indicators.

<docs-source-example example="BarIndicatorDefaultExample"></docs-source-example>

A basic bar-indicator would follow this structure:

```html
<dt-bar-indicator value="10"></dt-bar-indicator>
```

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

| Name          | Type                                 | Default | Description                                                |
| ------------- | ------------------------------------ | ------- | ---------------------------------------------------------- |
| `valueChange` | `EventEmitter<DtBarIndicatorChange>` |         | Event emitted when the value of the bar-indicator cahnges. |

## Properties

| Name      | Type     | Description                                                                                                       |
| --------- | -------- | ----------------------------------------------------------------------------------------------------------------- |
| `percent` | `number` | Returns the percentage value for the current `value` between `min` and `max`. Inherited from `HasProgressValues`. |


## Variants

The bar indicator is mostly used within table rows with the table column header as a label. It can also be used as a standalone component, which requires labels next to the bars then. As the bar indicator is not used to show total percentages of a number, but rather to compare ratios, it can't be used as a single, separated bar.  
The indicator is themeable and can also show problems.

{{#component-demo name="BarIndicatorColorExample"}}{{/component-demo}}


## Bar indicator in use

Bar-indicators are often used in tables.

![bar-indicator in tables](https://dt-cdn.net/images/bar-indicator-in-tables-620-987fc7c632.png)


But they can also stand alone and be compared with each other.

![standalone bar-indicator](https://dt-cdn.net/images/standalone-bar-indicator-317-88cbbbff8e.png)


Bar-indicator set to a fixed value.

<docs-source-example example="BarIndicatorDefaultExample"></docs-source-example>

Bar-indicator in different color variations.

<docs-source-example example="BarIndicatorColorExample"></docs-source-example>

Bar-indicator with alignment set to end
<docs-source-example example="BarIndicatorAlignmentExample"></docs-source-example>

Bar-indicator with variable `min`, `max` and `value` bindings.

<docs-source-example example="BarIndicatorDynamicExample"></docs-source-example>
