---
type: "component"
---

# Indicator

The `dtIndicator` directive adds the capability to add styling to indicate a warning or an error. 

This directive was introduced to add indicators in the `<dt-table>`, but can be used in other components as well to handle error or warning indications. 

## Imports

You have to import the `DtIndicatorModule` when you want to use the `dtIndicator` directive:

```typescript
@NgModule({
  imports: [
    DtIndicatorModule,
  ],
})
class MyModule {}
```

## Initialization

To apply the dynatrace indicator, add the `dtIndicator` directive to any component or html element.

## Inputs

| Name | Type | Default | Description |
| --- | --- | --- | --- |
| `dtIndicator` | `boolean` | `true` | Wether the indicator is active. | 
| `dtIndicatorColor` | `string` \| `undefined` | `error` | Sets color. Possible options: `error` \| `warning`.  |
