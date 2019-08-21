import { A11yModule } from '@angular/cdk/a11y';
import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';

import { DtAnchor, DtButton } from './button';

@NgModule({
  imports: [CommonModule, A11yModule],
  exports: [DtButton, DtAnchor],
  declarations: [DtButton, DtAnchor],
})
export class DtButtonModule {}
