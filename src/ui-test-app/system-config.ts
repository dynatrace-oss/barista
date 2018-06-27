/** Type declaration for ambient System. */
declare const System: any; // tslint:disable-line no-any

// Apply the CLI SystemJS configuration.
System.config({
  paths: {
    'node:*': 'node_modules/*',
  },
  map: {
    'rxjs': 'node:rxjs',
    'main': 'main.js',
    'moment': 'node:moment/min/moment-with-locales.min.js',
    'tslib': 'node:tslib/tslib.js',
    'highcharts': 'node:highcharts/highcharts.js',

    // Angular specific mappings.
    '@angular/core': 'node:@angular/core/bundles/core.umd.js',
    '@angular/common': 'node:@angular/common/bundles/common.umd.js',
    '@angular/common/http': 'node:@angular/common/bundles/common-http.umd.js',
    '@angular/compiler': 'node:@angular/compiler/bundles/compiler.umd.js',
    '@angular/forms': 'node:@angular/forms/bundles/forms.umd.js',
    '@angular/router': 'node:@angular/router/bundles/router.umd.js',
    '@angular/animations': 'node:@angular/animations/bundles/animations.umd.js',
    '@angular/animations/browser': 'node:@angular/animations/bundles/animations-browser.umd.js',
    '@angular/platform-browser': 'node:@angular/platform-browser/bundles/platform-browser.umd.js',
    '@angular/platform-browser/animations':
      'node:@angular/platform-browser/bundles/platform-browser-animations.umd.js',
    '@angular/platform-browser-dynamic':
      'node:@angular/platform-browser-dynamic/bundles/platform-browser-dynamic.umd.js',

    '@angular/cdk': 'node:@angular/cdk/bundles/cdk.umd.js',
    '@angular/cdk/a11y': 'node:@angular/cdk/bundles/cdk-a11y.umd.js',
    '@angular/cdk/accordion': 'node:@angular/cdk/bundles/cdk-accordion.umd.js',
    '@angular/cdk/bidi': 'node:@angular/cdk/bundles/cdk-bidi.umd.js',
    '@angular/cdk/coercion': 'node:@angular/cdk/bundles/cdk-coercion.umd.js',
    '@angular/cdk/collections': 'node:@angular/cdk/bundles/cdk-collections.umd.js',
    '@angular/cdk/keycodes': 'node:@angular/cdk/bundles/cdk-keycodes.umd.js',
    '@angular/cdk/layout': 'node:@angular/cdk/bundles/cdk-layout.umd.js',
    '@angular/cdk/observers': 'node:@angular/cdk/bundles/cdk-observers.umd.js',
    '@angular/cdk/overlay': 'node:@angular/cdk/bundles/cdk-overlay.umd.js',
    '@angular/cdk/platform': 'node:@angular/cdk/bundles/cdk-platform.umd.js',
    '@angular/cdk/portal': 'node:@angular/cdk/bundles/cdk-portal.umd.js',
    '@angular/cdk/scrolling': 'node:@angular/cdk/bundles/cdk-scrolling.umd.js',
    '@angular/cdk/stepper': 'node:@angular/cdk/bundles/cdk-stepper.umd.js',
    '@angular/cdk/table': 'node:@angular/cdk/bundles/cdk-table.umd.js',
    '@angular/cdk/text-field': 'node:@angular/cdk/bundles/cdk-text-field.umd.js',
    '@dynatrace/angular-components/alert': 'dist/lib/bundles/dynatrace-angular-components-alert.umd.js',
    '@dynatrace/angular-components/breadcrumbs': 'dist/lib/bundles/dynatrace-angular-components-breadcrumbs.umd.js',
    '@dynatrace/angular-components/button': 'dist/lib/bundles/dynatrace-angular-components-button.umd.js',
    '@dynatrace/angular-components/button-group': 'dist/lib/bundles/dynatrace-angular-components-button-group.umd.js',
    '@dynatrace/angular-components/card': 'dist/lib/bundles/dynatrace-angular-components-card.umd.js',
    '@dynatrace/angular-components/chart': 'dist/lib/bundles/dynatrace-angular-components-chart.umd.js',
    '@dynatrace/angular-components/checkbox': 'dist/lib/bundles/dynatrace-angular-components-checkbox.umd.js',
    '@dynatrace/angular-components/context-dialog': 'dist/lib/bundles/dynatrace-angular-components.umd.js',
    '@dynatrace/angular-components/core': 'dist/lib/bundles/dynatrace-angular-components-core.umd.js',
    '@dynatrace/angular-components/expandable-panel': 'dist/lib/bundles/dynatrace-angular-components-expandable-panel.umd.js',
    '@dynatrace/angular-components/expandable-section': 'dist/lib/bundles/dynatrace-angular-components-expandable-section.umd.js',
    '@dynatrace/angular-components/form-field': 'dist/lib/bundles/dynatrace-angular-components-form-field.umd.js',
    '@dynatrace/angular-components/icon': 'dist/lib/bundles/dynatrace-angular-components-icon.umd.js',
    '@dynatrace/angular-components/inline-editor': 'dist/lib/bundles/dynatrace-angular-components-inline-editor.umd.js',
    '@dynatrace/angular-components/input': 'dist/lib/bundles/dynatrace-angular-components-input.umd.js',
    '@dynatrace/angular-components/key-value-list': 'dist/lib/bundles/dynatrace-angular-components-key-value-list.umd.js',
    '@dynatrace/angular-components/loading-distractor': 'dist/lib/bundles/dynatrace-angular-components-loading-distractor.umd.js',
    '@dynatrace/angular-components/pagination': 'dist/lib/bundles/dynatrace-angular-components-pagination.umd.js',
    '@dynatrace/angular-components/progress-bar': 'dist/lib/bundles/dynatrace-angular-components-progress-bar.umd.js',
    '@dynatrace/angular-components/progress-circle': 'dist/lib/bundles/dynatrace-angular-components-progress-circle.umd.js',
    '@dynatrace/angular-components/radio': 'dist/lib/bundles/dynatrace-angular-components-radio.umd.js',
    '@dynatrace/angular-components/show-more': 'dist/lib/bundles/dynatrace-angular-components-show-more.umd.js',
    '@dynatrace/angular-components/switch': 'dist/lib/bundles/dynatrace-angular-components-switch.umd.js',
    '@dynatrace/angular-components/table': 'dist/lib/bundles/dynatrace-angular-components-table.umd.js',
    '@dynatrace/angular-components/tag': 'dist/lib/bundles/dynatrace-angular-components-tag.umd.js',
    '@dynatrace/angular-components/theming': 'dist/lib/bundles/dynatrace-angular-components-theming.umd.js',
    '@dynatrace/angular-components/tile': 'dist/lib/bundles/dynatrace-angular-components-tile.umd.js',
  },
  packages: {
    // Thirdparty barrels.
    'rxjs': {main: 'index'},
    'rxjs/operators': {main: 'index'},

    // Set the default extension for the root package, because otherwise the demo-app can't
    // be built within the production mode. Due to missing file extensions.
    '.': {
      defaultExtension: 'js',
    },
  },
});
