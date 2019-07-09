import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { A11yModule } from '@angular/cdk/a11y';
import { DtButton, DtAnchor } from './button';

@NgModule({
  imports: [CommonModule, A11yModule],
  exports: [DtButton, DtAnchor],
  declarations: [DtButton, DtAnchor],
})
export class DtButtonModule {}
