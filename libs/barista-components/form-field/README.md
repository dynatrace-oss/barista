# Form field

The `<dt-form-field>` is a component that wraps form input components like
`dtInput` and provides functionality for a label (`<dt-label>`), errors
(`<dt-error>`) and hints (`<dt-hint>`).

<ba-live-example name="DtExampleFormFieldDefault"></ba-live-example>

## Imports

You have to import the `DtFormFieldModule` when you want to use the
`dt-form-field`. The `dt-form-field` component also requires Angular's
`BrowserAnimationsModule` for animations. For more details on this see
[Step 2: Animations](https://barista.dynatrace.com/components/get-started/#step-2-animations)
in the getting started guide.

Because `<dt-form-field>` wraps a form input component, make sure that you also
have imported the specific component module (e.g. `DtInputModule`).

```typescript
@NgModule({
  imports: [BrowserAnimationsModule, DtFormFieldModule],
})
class MyModule {}
```

## Compatible barista form-controls

The following barista form-controls are compatible with the form-field.

- [Input](https://barista.dynatrace.com/components/input)
- [Select](https://barista.dynatrace.com/components/select)
- [Checkbox](https://barista.dynatrace.com/components/checkbox)
- [Switch](https://barista.dynatrace.com/components/switch)
- [Radio-group](https://barista.dynatrace.com/components/radio#radio-groups)

## Custom form-control

To make your custom form-control compatible with the form-field, your control
needs to implement the
[`DtFormFieldControl`](https://github.com/dynatrace-oss/barista/blob/master/libs/barista-components/form-field/src/form-field-control.ts)
interface.

_Note_: Your custom form-control also needs to support `ngModel`. This can be
done by implementing the `ControlValueAccessor` interface shipped by the
`@angular/forms` package.

## Label

A label can be applied by adding a `<dt-label>` element. `<dt-form-field>` takes
care of linking the label correctly to the form component by adding
`for="input-id"` and the correct ARIA-attributes.

## Hint labels

<ba-ux-snippet name="form-field-hint-labels"></ba-ux-snippet>

<ba-live-example name="DtExampleFormFieldHint"></ba-live-example>

Hint labels can be added with the `<dt-hint>` element inside the form field.
Hints can be added to either side by setting the align property on `<dt-hint>`
to either start or end. Attempting to add multiple hints to the same side will
raise an error.

`<dt-form-field>` takes care of linking the hints correctly to the form
component.

## Validation (live hints)

<ba-ux-snippet name="form-field-validation"></ba-ux-snippet>

## Prefix and suffix

Custom content (like buttons, icons, loading-spinners) can be included before
and after the input tag, as a prefix or suffix. It will be included within the
visual container that wraps the form control. Adding the `dtPrefix` directive to
an element inside the `<dt-form-field>` will designate it as the prefix.
Similarly, adding `dtSuffix` will designate it as the suffix.

<ba-live-example name="DtExampleFormFieldPrefixSuffix"></ba-live-example>

**Note: Prefix or suffix may only be used for input and select controls!**

<ba-live-example name="DtExampleFormFieldNonBoxControl"></ba-live-example>
