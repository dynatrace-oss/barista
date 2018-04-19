import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { RouterModule } from '@angular/router';
import { ReactiveFormsModule } from '@angular/forms';
import { UIApp, Home } from './ui-test-app/ui-test-app';
import { UI_TEST_APP_ROUTES } from './ui-test-app/routes';
import { DtButtonModule } from '@dynatrace/angular-components/button';
import { ButtonUI } from './button/button-ui';
import { ExpandableSectionUi } from './expandable-section/expandable-section-ui';
import { DtExpandableSectionModule } from '@dynatrace/angular-components/expandable-section';

/**
 * NgModule that contains all lib modules that are required to serve the ui-test-app.
 */
@NgModule({
  exports: [
    DtButtonModule,
    DtExpandableSectionModule,
  ],
})
export class DynatraceAngularCompModule {}

@NgModule({
  imports: [
    BrowserModule,
    RouterModule.forRoot(UI_TEST_APP_ROUTES),
    DynatraceAngularCompModule,
    NoopAnimationsModule,
    ReactiveFormsModule,
  ],
  declarations: [
    UIApp,
    Home,
    ButtonUI,
    ExpandableSectionUi
  ],
  bootstrap: [UIApp],
})
export class UiTestAppModule { }
