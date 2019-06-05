---
type: "component"
---

# Form field

<docs-source-example example="DefaultFormFieldExample"></docs-source-example>

`<dt-form-field>` is a component that wraps form input components like `dtInput` and provides functionality for a label (`<dt-label>`), errors (`<dt-error>`) and hints (`<dt-hint>`).

## Imports

You have to import the `DtFormFieldModule` when you want to use the `dt-form-field`.
The `dt-form-field` component component also requires Angular's `BrowserAnimationsModule` for animations. For more details on this see *Step 2: Animations* in the Getting started Guide.
Because `<dt-form-field>` wraps a form input component, pls make sure that you have imported the specific component module (e.g. `DtInputModule`)

```typescript
@NgModule({  
  imports: [
    BrowserAnimationsModule,
    DtFormFieldModule,
  ],
})
class MyModule {}
```

## Label

A label can be applied by adding a `<dt-label>` element.
`<dt-form-field>` takes care of linking the label correctly to the form component by adding `for="input-id"` and the correct aria attributes.

## Hint labels

Hint labels are additional descriptive text that appears below the form field.
A `<dt-form-field>` can have up to two hint labels: one start-aligned and one end-aligned.

Hint labels can be added with the `<dt-hint>` element inside the form field.
Hints can be added to either side by setting the align property on `<dt-hint>` to either start or end.
Attempting to add multiple hints to the same side will raise an error.

`<dt-form-field>` takes care of linking the hints correctly to the form component.

*Example:*

<docs-source-example example="HintFormFieldExample"></docs-source-example>

## Error messages

Error messages can be shown under the form field by adding `<dt-error>` elements inside the form field.
Errors are hidden initially and will be displayed on invalid form fields, after the user has interacted with the element or the parent form has been submitted.
The errors will appear on top of the hint labels and will overlap them.

If a form field can have more than one error state, it is up to the consumer to toggle which messages should be displayed. This can be done with `ngIf` or `ngSwitch`.

*Example:*

<docs-source-example example="ErrorFormFieldExample"></docs-source-example>

## Prefix & suffix

Custom content (like buttons, icons, loading-spinners) can be included before and after the input tag, as a prefix or suffix. It will be included within the visual container that wraps the form control.
Adding the `dtPrefix` directive to an element inside the `<dt-form-field>` will designate it as the prefix. Similarly, adding `dtSuffix` will designate it as the suffix.

*Example:*

<docs-source-example example="PrefixSuffixFormFieldExample"></docs-source-example>
