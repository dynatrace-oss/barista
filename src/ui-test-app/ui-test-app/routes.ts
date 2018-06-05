import { Routes } from '@angular/router';
import { Home } from './ui-test-app';
import { ButtonUI } from '../button/button-ui';
import { ButtonGroupUi } from '../button-group/button-group-ui';
import { ExpandableSectionUi } from '../expandable-section/expandable-section-ui';
import { ExpandablePanelUi } from '../expandable-panel/expandable-panel-ui';
import { TileUI } from '../tile/tile-ui';
import { ContextDialogUI } from '../context-dialog/context-dialog-ui';
import { RadioUI } from '../radio/radio.ui';

export const UI_TEST_APP_ROUTES: Routes = [
  { path: '', component: Home },
  { path: 'button', component: ButtonUI },
  { path: 'button-group', component: ButtonGroupUi },
  { path: 'context-dialog', component: ContextDialogUI },
  { path: 'expandable-panel', component: ExpandablePanelUi },
  { path: 'expandable-section', component: ExpandableSectionUi },
  { path: 'radio', component: RadioUI },
  { path: 'tile', component: TileUI },
];
