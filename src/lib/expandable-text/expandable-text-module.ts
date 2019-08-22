import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';

import { DtExpandableText } from './expandable-text';

@NgModule({
  imports: [CommonModule],
  exports: [DtExpandableText],
  declarations: [DtExpandableText],
})
export class DtExpandableTextModule {}
