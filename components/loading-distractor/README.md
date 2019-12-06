# Loading distractor & loading spinner

The `<dt-loading-spinner>` and `<dt-loading-distractor>` are circular indicators
of activity (e.g. loading of data). Pass in the label of the loading distractor
via `ng-content`.

<ba-live-example name="DtExampleLoadingDistractorDefault"></ba-live-example>

The loading distractor always appears vertically and horizontally centered on
the element, section or screen it is loading.

## Imports

You have to import the `DtLoadingDistractorModule` when you want to use the
`dt-loading-distractor` or `dt-loading-spinner`:

```typescript
@NgModule({
  imports: [DtLoadingDistractorModule],
})
class MyModule {}
```

## Accessibility

Each `<dt-loading-spinner>` should be given a meaningful label via `aria-label`
or `aria-labelledby`. The `aria-labelledby` attribute of the
`<dt-loading-distractor>` is set automatically based on the given content.

## Loading spinner in use

The loading spinner consists of an anmiated SVG circle and can be used in
combination with other components, e.g. a form field.

<ba-live-example name="DtExampleLoadingDistractorSpinner"></ba-live-example>

### Loading spinner inside a form field

When a `<dt-loading-spinner>` is placed as a prefix or suffix inside a
`<dt-form-field>` the color and size adjust automatically.

<ba-live-example name="DtExampleLoadingDistractorInput"></ba-live-example>

### Loading spinner in buttons

If loading is caused by triggering a [button](/components/button), the loading
distractor can be shown in the button. The button gets disabled and the loading
distractor is placed left aligned in the button with a description.

![Loading distractor in a button](https://d24pvdz4mvzd04.cloudfront.net/test/loading-button-416-7cb2ba6cef.png)

#### Styles

- x: 16px
- y: 8px
- Loading spinner width: 16px
- Loading spinner height: 16px
- Loading spinner color: same as disabled button font

### Loading spinnner in comboboxes

![Loading distractor in comboboxes](https://d24pvdz4mvzd04.cloudfront.net/test/loading-combobox-355-0d7a853704.png)

#### Styles

- x: 12px
- Loading spinner width: 12px
- Loading spinner height: 12px
- Loading spinner color: gray-500
