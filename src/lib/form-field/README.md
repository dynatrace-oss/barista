---
title: 'Form field'
description:
  'The form field component can be used to wrap input components to provide a
  label, errors or hints.'
postid: form-field
identifier: 'Ff'
category: 'components'
public: true
contributors:
  dev:
    - thomas.pink
  ux:
    - raphaela.raudaschl
properties:
  - 'work in progress'
related:
  - 'input'
  - 'validation'
tags:
  - 'input fields'
  - 'forms'
  - 'form validation'
  - 'angular'
  - 'component'
---

The `<dt-form-field>` is a component that wraps form input components like
`dtInput` and provides functionality for a label (`<dt-label>`), errors
(`<dt-error>`) and hints (`<dt-hint>`).

<docs-source-example example="FormFieldDefaultExample"></docs-source-example>

## Imports

You have to import the `DtFormFieldModule` when you want to use the
`dt-form-field`. The `dt-form-field` component also requires Angular's
`BrowserAnimationsModule` for animations. For more details on this see
[Step 2: Animations](https://barista.dynatrace.org/components/get-started/#step-2-animations)
in the getting started guide.

Because `<dt-form-field>` wraps a form input component, make sure that you also
have imported the specific component module (e.g. `DtInputModule`).

```typescript
@NgModule({
  imports: [BrowserAnimationsModule, DtFormFieldModule],
})
class MyModule {}
```

## Label

A label can be applied by adding a `<dt-label>` element. `<dt-form-field>` takes
care of linking the label correctly to the form component by adding
`for="input-id"` and the correct ARIA-attributes.

## Hint labels

Hint labels are additional descriptive text that appears below the form field. A
hint is usually used to provide information that the user should know
independent from their actions. A `<dt-form-field>` can have up to two hint
labels: one start-aligned and one end-aligned.

<docs-source-example example="FormFieldHintExample"></docs-source-example>

Hint labels can be added with the `<dt-hint>` element inside the form field.
Hints can be added to either side by setting the align property on `<dt-hint>`
to either start or end. Attempting to add multiple hints to the same side will
raise an error.

`<dt-form-field>` takes care of linking the hints correctly to the form
component.

## Validation (live hints)

Live hints are used to provide feedback and suggestions immediately while users
are typing. They are used to e.g. show users if the password they entered
fulfills all requirements, it is used to show users what they need to type in,
etc. If errors occur, they will be displayed as soon as the input loses focus or
after three seconds of inactivity.

<docs-source-example example="FormFieldErrorExample"></docs-source-example>

Live hints can also contain other content than error messages. For example
password requirements.

![Input with password requirements](https://dt-cdn.net/images/password-live-hint-strength-01-340-69fafbe994-340-69fafbe994.png)

### Error messages

Error messages can be shown under the form field by adding `<dt-error>` elements
inside the form field. By default errors are hidden initially and will be
displayed on invalid form fields, after the user has interacted with the element
or the parent form has been submitted. The errors will appear on top of the hint
labels and will overlap them. If you want to show the errors at a different time
you can customize this behaviour by passing an ErrorStateMatcher to the input
used in the form field.

A form field can have more than one error, it is up to the consumer to toggle
which messages should be displayed. This can be done with `ngIf` or `ngSwitch`.

<docs-source-example example="FormFieldErrorCustomValidatorExample"></docs-source-example>

It is recommended that errors turn green once the issue is resolved. This helps
the user understand that his changes were successful.

**Note**: This feature as well as neutral live hints as described above are not
yet implemented.

![Successful input validation](https://dt-cdn.net/images/input-validation-success-340-17231c8405-340-17231c8405.png)

Find more about form-fields and (live-)hints on the [input fields
page]({{link_to_id id='input' }}), see the [validation
pattern]({{link_to_id id='validation' }}) for more information about the error
behavior.

## Prefix and suffix

Custom content (like buttons, icons, loading-spinners) can be included before
and after the input tag, as a prefix or suffix. It will be included within the
visual container that wraps the form control. Adding the `dtPrefix` directive to
an element inside the `<dt-form-field>` will designate it as the prefix.
Similarly, adding `dtSuffix` will designate it as the suffix.

<docs-source-example example="FormFieldPrefixSuffixExample"></docs-source-example>
