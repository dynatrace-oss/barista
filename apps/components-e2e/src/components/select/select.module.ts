import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Route } from '@angular/router';
import { DtSelectModule } from '@dynatrace/barista-components/select';
import {
  DT_UI_TEST_CONFIG,
  DT_DEFAULT_UI_TEST_CONFIG,
} from 'components/core/src/testing';
import { DtE2ESelect } from './select';

const routes: Route[] = [{ path: '', component: DtE2ESelect }];

@NgModule({
  declarations: [DtE2ESelect],
  imports: [CommonModule, RouterModule.forChild(routes), DtSelectModule],
  exports: [],
  providers: [
    { provide: DT_UI_TEST_CONFIG, useValue: DT_DEFAULT_UI_TEST_CONFIG },
  ],
})
export class DtE2ESelectModule {}
