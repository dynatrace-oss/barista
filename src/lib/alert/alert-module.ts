import {NgModule} from '@angular/core';
import {DtAlert} from './alert';
import {CommonModule} from '@angular/common';
import { DtIconModule } from '@dynatrace/angular-components/icon';

@NgModule({
  imports: [
    CommonModule,
    DtIconModule,
  ],
  exports: [
    DtAlert,
  ],
  declarations: [
    DtAlert,
  ],
})
export class DtAlertModule { }
