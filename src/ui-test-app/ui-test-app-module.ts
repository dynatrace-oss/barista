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
  DtCheckboxModule,
  DtExpandableSectionModule,
  DtExpandablePanelModule,
  DtTileModule,
  DtInputModule,
  DtContextDialogModule,
  DtKeyValueListModule,
  DtPaginationModule,
  DtCopyClipboardModule,
  DtIconModule,
  DtRadioModule,
  DtShowMoreModule,
  DtSwitchModule,
} from '@dynatrace/angular-components';
import { ButtonUI } from './button/button-ui';
import { ButtonGroupUi } from './button-group/button-group-ui';
import { ExpandableSectionUi } from './expandable-section/expandable-section-ui';
import { ExpandablePanelUi } from './expandable-panel/expandable-panel-ui';
import { TileUI } from './tile/tile-ui';
import { ContextDialogUI } from './context-dialog/context-dialog-ui';
import { KeyValueListUI } from './key-value-list/key-value-list-ui';
import { PaginationUI } from './pagination/pagination-ui';
import { RadioUI } from './radio/radio.ui';
import { HttpClientModule } from '@angular/common/http';
import { ShowMoreUI } from './show-more/show-more-ui';
import { CheckboxUI } from './checkbox/checkbox-ui';
import { SwitchUI } from './switch/switch-ui';
import { CopyClipboardUi } from './copy-clipboard/copy-clipboard-ui';

/**
 * NgModule that contains all lib modules that are required to serve the ui-test-app.
 */
@NgModule({
  exports: [
    DtButtonModule,
    DtButtonGroupModule,
    DtCheckboxModule,
    DtInputModule,
    DtExpandablePanelModule,
    DtExpandableSectionModule,
    DtTileModule,
    DtContextDialogModule,
    DtCopyClipboardModule,
    DtPaginationModule,
    DtRadioModule,
    DtShowMoreModule,
    DtKeyValueListModule,
    DtSwitchModule,
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
    DtIconModule.forRoot({svgIconLocation: '/lib/assets/icons/{{name}}.svg'}),
  ],
  declarations: [
    UIApp,
    Home,
    ButtonUI,
    ButtonGroupUi,
    CheckboxUI,
    ExpandablePanelUi,
    ExpandableSectionUi,
    RadioUI,
    TileUI,
    ContextDialogUI,
    CopyClipboardUi,
    KeyValueListUI,
    PaginationUI,
    ShowMoreUI,
    SwitchUI,
  ],
  bootstrap: [UIApp],
})
export class UiTestAppModule { }
