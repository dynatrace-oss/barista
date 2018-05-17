import {NgModule} from '@angular/core';
import {DtAlert} from './alert';
import {CommonModule} from '@angular/common';

@NgModule({
  imports: [
    CommonModule,
  ],
  exports: [
    DtAlert,
  ],
  declarations: [
    DtAlert,
  ],
})
export class DtAlertModule { }
