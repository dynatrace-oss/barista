import { Routes } from '@angular/router';
import { Home } from './ui-test-app';
import { ButtonUI } from '../button/button-ui';
import {ButtongroupUI} from "../buttongroup/buttongroup-ui";

export const UI_TEST_APP_ROUTES: Routes = [
  { path: '', component: Home },
  { path: 'button', component: ButtonUI },
  { path: 'buttongroup', component: ButtongroupUI },
];
