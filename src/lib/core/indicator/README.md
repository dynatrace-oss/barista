---
title: 'Indicator'
description:
  'The dtIndicator directive can be used with any component to indicate a
  warning or an error.'
properties:
  - 'dev utility'
tags:
  - 'indicator'
  - 'validation'
  - 'warning'
  - 'error'
type: 'component'
---

# Indicator

The `dtIndicator` directive adds the capability to add styling to indicate a
warning or an error.

This directive was introduced to add indicators in the `<dt-table>`, but can be
used in other components as well to handle error or warning indications.

<docs-source-example example="TableProblemExample" fullwidth="true"></docs-source-example>

## Imports

You have to import the `DtIndicatorModule` when you want to use the
`dtIndicator` directive:

```typescript
@NgModule({
  imports: [DtIndicatorModule],
})
class MyModule {}
```

## Initialization

To apply the dynatrace indicator, add the `dtIndicator` directive to any
component or HTML element.

## Inputs

| Name               | Type                  | Default | Description                      |
| ------------------ | --------------------- | ------- | -------------------------------- |
| `dtIndicator`      | `boolean`             | `true`  | Whether the indicator is active. |
| `dtIndicatorColor` | `'error' | 'warning'` | `error` | Sets the color.                  |
