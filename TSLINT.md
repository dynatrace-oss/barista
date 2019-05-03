# TSLint

To ensure a high code quality, the Angular components library comes with a set of custom TSLint rules to prevent wrong usage of components.

## Angular component usage

We provide a set of custom TSLint rules to help you using the Angular components correctly as intended. Using a wrong component structure, missing attributes or properties can lead to a wrong output. The following rules should help you preventing those errors:

| Name | Description |
| --- | --- |
| `dt-button-no-empty` | A button must always contain text content or a component that renders text. |
| `dt-card-direct-children` | All predefined child components of a `dt-card`, i.e. `dt-card-title`, `dt-card-subtitle`, `dt-card-icon`, `dt-card-title-actions` and `dt-card-footer-actions` must be direct children of the `dt-card`. |
| `dt-card-needs-title` | A `dt-card-title` is a required child element of a `dt-card`. |
| `dt-card-no-empty` | A card must contain content apart from the predefined child components `dt-card-title`, `dt-card-subtitle`, `dt-card-icon`, `dt-card-title-actions` and `dt-card-footer-actions`. |
| `dt-checkbox-no-empty` | A checkbox must always contain text content or a component that renders text. If no content is given, an `aria-label` or `aria-labelledby` attribute is required. |
| `dt-copy-to-clipboard-no-empty` | The copy-to-clipboard component must always contain a `dt-copy-to-clipboard-label`, that is a direct child of `dt-copy-to-clipboard`. |
| `dt-icon-button-alt-text` | An icon-only button must always have an alternative text in form of an `aria-label` or `aria-labelledby` attribute. |
| `dt-icon-button-needs-icon` | The content of an icon button (`dt-icon-button`) must always be an icon component (`<dt-icon>`). |
| `dt-info-group-needs-title-and-icon` | The `dt-info-group-title` and `dt-info-group-icon` are required child elements of the `dt-info-group` and must be direct children. |
| `dt-loading-distractor-no-empty` | A loading distractor must always contain text content or a component that renders text. |
| `dt-nested-button-is-icon-button` | Every nested button (`variant="nested"`) must be an icon button (`dt-icon-button`). |
| `dt-radio-button-no-empty` | When no text is provided for the radio button, an `aria-label` or `aria-labelledby` attribute is required. |
| `dt-selection-area-alt-text`| A selection area must provide alternative texts for both handles, the selected area and the close button using the following inputs: `aria-label-selected-area`, `aria-label-left-handle`, `aria-label-right-handle` and `aria-label-close-button`. |
| `dt-show-more-no-empty` | A show more component must always contain text apart from the `dt-show-less-label`. If no content is given at least an `aria-label` or `aria-labelledby` attribute must be given. |
| `dt-switch-no-empty` | A switch must always contain text content or a component that renders text. If no content is given, an `aria-label` or `aria-labelledby` attribute is required. |
| `dt-tab-content-no-empty` | A dtTabContent must always contain content. |
| `dt-tab-label-no-empty` | A dtTabLabelContent must always contain text content or a component that renders text. |
| `dt-tag-no-empty` | A tag must always contain text content or a component that renders text apart from the `dt-tag-key` child component. |
| `dt-tile-direct-children` | All predefined child components of a `dt-tile`, i.e. `dt-tile-title`, `dt-tile-subtitle` and `dt-tile-icon` must be direct children of the `dt-tile`. |
| `dt-tile-needs-title` | A `dt-tile-title` is a required child element of a `dt-tile`. |
| `dt-tile-needs-icon` | A `dt-tile-icon` is a required child element of a `dt-tile`. |
| `dt-tile-no-empty` | A tile must contain content apart from the predefined child components `dt-tile-title`, `dt-tile-subtitle` and `dt-tile-icon`. |
| `dt-toggle-button-group-item-is-button` | The element that has the attribute `dt-toggle-button-item` must always be a button. |

### Accessibility (a11y)

Some of the TSLint rules check for text alternatives when no (text) content is given. The usage of ARIA labels with meaningful text improve accessibility and user experience.

## Enable TSLint rules

To use the Angular component TSLint rules in your project, add the following to your `tslint.json` file:

```js
"extends": [
  "@dynatrace/angular-components/tslint"
]
```

To enable (or disable) TSLint rules, add the following to your `tslint.json` file:

```js
"rules": {
  "dt-card-no-empty": true
  "dt-button-no-empty": { "severity": "warning" },
}
```

When set to `true`, the TSLint rule is enabled and will throw an error when violated. When set to `{ "severity": "warning" }`, a warning is shown but linting does not fail. When set to `false` the rule is disabled.


## Testing TSLint rules

Every TSLint rule comes with a set of tests to guarantee that rules pass and fail as expected. All test files can be found in `src/linting/test/rules/**`. Build the TSLint rules and run tests by using the following commands:

```
yarn tslint:build
yarn tslint:test
```
