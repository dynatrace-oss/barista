import { A11yModule } from '@angular/cdk/a11y';
import { OverlayModule } from '@angular/cdk/overlay';
import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';

import { DtButtonModule } from '@dynatrace/angular-components/button';
import { DtIconModule } from '@dynatrace/angular-components/icon';
import { DtThemingModule } from '@dynatrace/angular-components/theming';

import { DtContextDialog } from './context-dialog';
import { DtContextDialogTrigger } from './context-dialog-trigger';
import { DtContextDialogHeader } from './header/context-dialog-header';
import { DtContextDialogHeaderTitle } from './header/context-dialog-header-title';

const EXPORTED_DECLARATIONS = [
  DtContextDialog,
  DtContextDialogTrigger,
  DtContextDialogHeader,
  DtContextDialogHeaderTitle,
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
  exports: [...EXPORTED_DECLARATIONS],
  declarations: [...EXPORTED_DECLARATIONS],
})
export class DtContextDialogModule {}
