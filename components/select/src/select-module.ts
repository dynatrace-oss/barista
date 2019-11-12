import { OverlayModule } from '@angular/cdk/overlay';
import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';

import { DtOptionModule } from '@dynatrace/angular-components/core';
import { DtFormFieldModule } from '@dynatrace/angular-components/form-field';
import { DtIconModule } from '@dynatrace/angular-components/icon';

import { DtSelect } from './select';

@NgModule({
  imports: [CommonModule, OverlayModule, DtIconModule, DtOptionModule],
  exports: [DtFormFieldModule, DtOptionModule, DtSelect],
  declarations: [DtSelect],
})
export class DtSelectModule {}
