import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { OverlayModule } from '@angular/cdk/overlay';
import { A11yModule } from '@angular/cdk/a11y';
import { DtButtonModule, } from '@dynatrace/angular-components/button';
import { DtThemingModule } from '@dynatrace/angular-components/theming';
import { DtContextDialog } from './context-dialog';
import { DtContextDialogTrigger } from './context-dialog-trigger';
import { DtIconModule } from '@dynatrace/angular-components/icon';

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
    DtIconModule,
  ],
  exports: [
    ...EXPORTED_DECLARATIONS,
  ],
  declarations: [
    ...EXPORTED_DECLARATIONS,
  ],
})
export class DtContextDialogModule {}
