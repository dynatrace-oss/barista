import { Routes } from '@angular/router';
import { Home } from './ui-test-app';
import { ButtonUI } from '../button/button-ui';
import {ButtonToggleUi} from "../button-toggle/button-toggle-ui";

export const UI_TEST_APP_ROUTES: Routes = [
  { path: '', component: Home },
  { path: 'button', component: ButtonUI },
  { path: 'button-toggle', component: ButtonToggleUi },
];
