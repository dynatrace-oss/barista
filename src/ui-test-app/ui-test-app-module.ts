import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { RouterModule } from '@angular/router';
import { ReactiveFormsModule } from '@angular/forms';
import { UIApp, Home } from './ui-test-app/ui-test-app';
import { UI_TEST_APP_ROUTES } from './ui-test-app/routes';
import { ButtonUI } from './button/button-ui';
import { GhButtonModule } from '@dynatrace/angular-components';

/**
 * NgModule that contains all lib modules that are required to serve the ui-test-app.
 */
@NgModule({
  exports: [
    GhButtonModule,
  ]
})
export class DynatraceAngularCompModule {}

@NgModule({
  imports: [
    BrowserModule,
    RouterModule.forRoot(UI_TEST_APP_ROUTES),
    DynatraceAngularCompModule,
    NoopAnimationsModule,
    ReactiveFormsModule
  ],
  declarations: [
    UIApp,
    Home,
    ButtonUI,
  ],
  bootstrap: [UIApp],
  entryComponents: [Home],
})
export class UiTestAppModule { }
