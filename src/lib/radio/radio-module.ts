import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { A11yModule } from '@angular/cdk/a11y';
import { UNIQUE_SELECTION_DISPATCHER_PROVIDER } from '@angular/cdk/collections';
import { DtRadioButton } from './radio';
import { DtRadioGroup } from './radio-group';

@NgModule({
  imports: [
    CommonModule,
    A11yModule,
  ],
  exports: [
    DtRadioButton,
    DtRadioGroup,
  ],
  declarations: [
    DtRadioButton,
    DtRadioGroup,
  ],
  providers: [UNIQUE_SELECTION_DISPATCHER_PROVIDER],
})
export class DtRadioModule { }
