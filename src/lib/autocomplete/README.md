---
type: "component"
---

# Autocomplete

The autocomplete is a normal text input enhanced by a panel of suggested options.

<docs-source-example example="DefaultAutocompleteExample"></docs-source-example>

## Imports

You have to import the `DtAutocompleteModule` when you want to use `dt-autocomplete` and `dtAutocompleteTrigger`.

```typescript
@NgModule({
  imports: [
    DtAutocompleteModule,
  ],
})
class MyModule {}
```

## Custom filter
If we want our options to filter when we type, we need to add a custom filter. You can filter the options in any way you like based on the text input*

*For optimal accessibility, you may want to consider adding text guidance on the page to explain filter criteria. This is especially helpful for screenreader users if you're using a non-standard filter that doesn't limit matches to the beginning of the string.

<docs-source-example example="AutocompleteCustomFilterExample"></docs-source-example>

## Separate control and display values

If you want the option's control value (what is saved in the form) to be different than the option's display value (what is displayed in the text field), you'll need to set the `displayWith` property on your autocomplete element. A common use case for this might be if you want to save your data as an object, but display just one of the option's string properties.

To make this work, create a function on your component class that maps the control value to the desired display value. Then bind it to the autocomplete's `displayWith` property.

<docs-source-example example="AutocompleteControlValuesExample"></docs-source-example>

## Automatically highlighting the first option
If your use case requires for the first autocomplete option to be highlighted when the user opens the panel, you can do so by setting the `autoActiveFirstOption` input on the `dt-autocomplete` component. This behavior can be configured globally using the `DT_AUTOCOMPLETE_DEFAULT_OPTIONS` injection token.

<docs-source-example example="AutocompleteHighlightFirstOptionExample"></docs-source-example>

## Attaching the panel to a different element

By default the autocomplete panel will be attached to your input element, however in some cases you may want it to attach to a different container element. You can change the element that the autocomplete is attached to using the `dtAutocompleteOrigin` directive together with the `dtAutocompleteConnectedTo` input.

<docs-source-example example="AutocompleteAttachDifferentElementExample"></docs-source-example>

## Option groups

Of course the `dt-autocomplete` component also supports collecting `dt-option` elements into groups using the `dt-optgroup element`.

<docs-source-example example="AutocompleteGroupsExample"></docs-source-example>

## Accessibility
The input for an autocomplete without text or labels should be given a meaningful label via `aria-label` or `aria-labelledby`.

The autocomplete trigger is given `role="combobox"`. The trigger sets `aria-owns` to the autocomplete's id, and sets `aria-activedescendant` to the active option's id.
