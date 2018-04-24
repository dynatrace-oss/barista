import { Routes } from '@angular/router';
import { Home } from './ui-test-app';
import { ButtonUI } from '../button/button-ui';
import { ExpandableSectionUi } from '../expandable-section/expandable-section-ui';
import {ExpandablePanelUi} from '../expandable-panel/expandable-panel-ui';

export const UI_TEST_APP_ROUTES: Routes = [
  { path: '', component: Home },
  { path: 'button', component: ButtonUI },
  { path: 'expandable-panel', component: ExpandablePanelUi },
  { path: 'expandable-section', component: ExpandableSectionUi },
];
