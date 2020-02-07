# Legend

<ba-live-example name="DtExampleLegendDefault"></ba-live-example>

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

<ba-live-example name="DtExampleLegendDefault"></ba-live-example>

_Using the `dtLegendSymbol` attribut on your custom element_

<ba-live-example name="DtExampleLegendSymbolAttribute"></ba-live-example>

## Overlay

The `dt-legend` also supports applying an overlay to the items which will appear
once the user hovers with the mouse. To set an overlay create an `ng-template`
element with the `dtLegendOverlay` attribute on it inside the `dt-legend-item`
element.

<ba-live-example name="DtExampleLegendOverlay"></ba-live-example>

## Examples

### Using the Legend in the timeline chart component

<ba-live-example name="DtExampleLegendTimelineChart"></ba-live-example>
