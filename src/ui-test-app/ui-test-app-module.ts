import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { RouterModule } from '@angular/router';
import { ReactiveFormsModule } from '@angular/forms';
import { UIApp, Home } from './ui-test-app/ui-test-app';
import { UI_TEST_APP_ROUTES } from './ui-test-app/routes';
import {
  DtButtonModule,
  DtButtonGroupModule,
  DtExpandableSectionModule,
  DtExpandablePanelModule,
  DtTileModule,
  DtContextDialogModule,
  DtPaginationModule,
  DtIconModule,
  DtIconModule,
  DtRadioModule,
  DtShowMoreModule,
} from '@dynatrace/angular-components';
import { ButtonUI } from './button/button-ui';
import { ButtonGroupUi } from './button-group/button-group-ui';
import { ExpandableSectionUi } from './expandable-section/expandable-section-ui';
import { ExpandablePanelUi } from './expandable-panel/expandable-panel-ui';
import { TileUI } from './tile/tile-ui';
import { ContextDialogUI } from './context-dialog/context-dialog-ui';
import { PaginationUI } from './pagination/pagination-ui';
import {HttpClientModule} from '@angular/common/http';
import { RadioUI } from './radio/radio.ui';
import { HttpClientModule } from '@angular/common/http';
import { ShowMoreUI } from './show-more/show-more-ui';

/**
 * NgModule that contains all lib modules that are required to serve the ui-test-app.
 */
@NgModule({
  exports: [
    DtButtonModule,
    DtButtonGroupModule,
    DtExpandablePanelModule,
    DtExpandableSectionModule,
    DtTileModule,
    DtContextDialogModule,
    DtPaginationModule,
    DtRadioModule,
    DtShowMoreModule,
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
    HttpClientModule,
    DtIconModule.forRoot({ svgIconLocation: `/assets/icons/{{name}}.svg` }),
    DtIconModule.forRoot({svgIconLocation: '/lib/assets/icons/{{name}}.svg'}),
    HttpClientModule,
  ],
  declarations: [
    UIApp,
    Home,
    ButtonUI,
    ButtonGroupUi,
    ExpandablePanelUi,
    ExpandableSectionUi,
    RadioUI,
    TileUI,
    ContextDialogUI,
    PaginationUI,
    ShowMoreUI,
  ],
  bootstrap: [UIApp],
})
export class UiTestAppModule { }
