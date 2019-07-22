---
type: 'component'
---

# Legend

<docs-source-example example="DefaultLegendExample"></docs-source-example>

## Imports

You have to import the `DtLegendModule` when you want to use the `<dt-legend>`:

```typescript
@NgModule({
  imports: [DtLegendModule],
})
class MyModule {}
```

## Usage

The `dt-legend` must contain a list of `dt-legend-item` elements. Each of these
items need to have a symbol and a text. There are two way how you can set the
symbol of a `dt-legend-item`:

_Using the `dt-legend-symbol` element_

<docs-source-example example="DefaultLegendExample"></docs-source-example>

_Using the `dtLegendSymbol` attribut on your custom element_

<docs-source-example example="SymbolAttributeLegendExample"></docs-source-example>

## Examples

### Using the Legend in the timeline chart component

<docs-source-example example="TimelineChartLegendExample"></docs-source-example>
