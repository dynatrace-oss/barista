module.exports = {
  plugins: ['stylelint-prettier'],
  extends: [
    '@dynatrace/angular-lint-rules/stylelint',
    'stylelint-prettier/recommended',
  ],
  rules: {
    'prettier/prettier': true,
    'at-rule-empty-line-before': null,
    'rule-empty-line-before': null,
    'selector-type-no-unknown': null,
    'no-descending-specificity': null,
    'color-no-invalid-hex': true,
    'color-hex-length': 'long',
    'color-named': 'never',
    'scss/no-duplicate-dollar-variables': null,
    'scss/dollar-variable-colon-newline-after': null,
    'property-no-vendor-prefix': true,
    'value-no-vendor-prefix': true,
    'selector-no-vendor-prefix': true,
  },
};
