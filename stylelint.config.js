module.exports = {
  plugins: ['stylelint-prettier'],
  extends: [
    '@dynatrace/angular-lint-rules/stylelint',
    'stylelint-prettier/recommended',
  ],
  rules: {
    'prettier/prettier': true,
    'scss/no-duplicate-dollar-variables': null,
    'scss/dollar-variable-colon-newline-after': null,
    // This rule breaks with prettier formatting, as prettier can break long lines after an operator
    'scss/operator-no-newline-after': null,
    'at-rule-empty-line-before': null,
    'rule-empty-line-before': null,
    'selector-type-no-unknown': null,
    'no-descending-specificity': null,
    'color-no-invalid-hex': true,
    'color-hex-length': 'long',
    'color-named': 'never',
    'property-no-vendor-prefix': true,
    'value-no-vendor-prefix': true,
    'selector-no-vendor-prefix': true,
  },
};
