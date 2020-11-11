# Indicator

The `dtIndicator` directive adds the capability to add styling to indicate a
warning or an error.

This directive was introduced to add indicators in the `<dt-table>`, but can be
used in other components as well to handle error, warning or recovered
indications.

<ba-live-example name="DtExampleIndicatorDefault" fullwidth></ba-live-example>

For a more complex example with the indicator in use visit:
[Tree Table with DtIndicator](/components/tree-table#dtindicator)

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

| Name               | Type      | Default   | Description                      |
| ------------------ | --------- | --------- | -------------------------------- |
| `dtIndicator`      | `boolean` | `true`    | Whether the indicator is active. |
| `dtIndicatorColor` | `'error'  | 'warning' | 'recovered'`                     | `error` | Sets the color. |
