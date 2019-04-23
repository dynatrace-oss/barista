module.exports = {
  'extends': '@dynatrace/angular-lint-rules/stylelint',
  'rules': {
    'at-rule-empty-line-before': null,
    'rule-empty-line-before': null,
    'selector-type-no-unknown': null,
    'no-descending-specificity': null,
    'color-hex-case': 'lower',
    'color-no-invalid-hex': true,
    'color-hex-length': 'long',
    'color-named': 'never',
    'scss/no-duplicate-dollar-variables': null,
    "property-no-vendor-prefix": true,
    "value-no-vendor-prefix": true,
    "selector-no-vendor-prefix": true,
  },
};
