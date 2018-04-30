import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { OverlayModule } from '@angular/cdk/overlay';
import { A11yModule } from '@angular/cdk/a11y';
import { DtButtonModule, } from '../button/index';
import { DtThemingModule } from '../theming/index';
import { DtContextDialog } from './context-dialog';

@NgModule({
  imports: [
    CommonModule,
    DtButtonModule,
    DtThemingModule,
    OverlayModule,
    A11yModule,
  ],
  exports: [
    DtContextDialog,
  ],
  declarations: [
    DtContextDialog,
  ],
})
export class DtContextDialogModule {}
