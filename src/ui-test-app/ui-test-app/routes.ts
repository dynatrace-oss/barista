import { Routes } from '@angular/router';
import { Home } from './ui-test-app';
import { DummyUI } from '../dummy/dummy-ui';

export const UI_TEST_APP_ROUTES: Routes = [
  { path: '', component: Home },
  { path: 'dummy', component: DummyUI },
];
