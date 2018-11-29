---
type: "component"
---

# Radio

<docs-source-example example="DefaultRadioExample"></docs-source-example>

`<dt-radio-button>` provides the same functionality as a native enhanced with styling and animations.

## Grouping

### Radio groups

Radio-buttons should typically be placed inside of an unless the DOM structure would make that impossible.
The radio-group has a value property that reflects the currently selected radio-button inside of the group.
Individual radio-buttons inside of a radio-group will inherit the name of the group.

### Grouping by name

All radio-buttons with the same name comprise a set from which only one may be selected at a time.

<docs-source-example example="NameGroupingRadioExample"></docs-source-example>

## Angular forms

`<dt-radio-group>` is compatible with @angular/forms and supports both FormsModule and ReactiveFormsModule.

## Accessibility

The `<gh-radio-button>` uses an internal `<input type="radio">` to provide an accessible experience.
This internal radio button receives focus and is automatically labelled by the text content of the `<gh-radio-button>` element.

Radio button groups should be given a meaningful label via `aria-label` or `aria-labelledby`.

### Dark Example

<docs-source-example example="DarkRadioExample" themedark="true"></docs-source-example>
