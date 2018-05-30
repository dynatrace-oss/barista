import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { OverlayModule } from '@angular/cdk/overlay';
import { A11yModule } from '@angular/cdk/a11y';
import { DtButtonModule, } from '../button/index';
import { DtThemingModule } from '../theming/index';
import { DtContextDialog, DtContextDialogTrigger } from './context-dialog';

const EXPORTED_DECLARATIONS = [
  DtContextDialog,
  DtContextDialogTrigger,
];

@NgModule({
  imports: [
    CommonModule,
    DtButtonModule,
    DtThemingModule,
    OverlayModule,
    A11yModule,
  ],
  exports: [
    ...EXPORTED_DECLARATIONS,
  ],
  declarations: [
    ...EXPORTED_DECLARATIONS,
  ],
})
export class DtContextDialogModule {}
