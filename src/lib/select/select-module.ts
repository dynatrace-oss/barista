import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { OverlayModule } from '@angular/cdk/overlay';
import { DtOptionModule } from '@dynatrace/angular-components/core';
import { DtIconModule } from '@dynatrace/angular-components/icon';
import { DtFormFieldModule } from '@dynatrace/angular-components/form-field';
import { DtSelect } from './select';

@NgModule({
  imports: [CommonModule, OverlayModule, DtIconModule, DtOptionModule],
  exports: [DtFormFieldModule, DtOptionModule, DtSelect],
  declarations: [DtSelect],
})
export class DtSelectModule {}
