import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';

import {
  DtCard,
  DtCardFooterActions,
  DtCardIcon,
  DtCardSubtitle,
  DtCardTitle,
  DtCardTitleActions,
} from './card';

@NgModule({
  imports: [CommonModule],
  exports: [
    DtCard,
    DtCardTitle,
    DtCardSubtitle,
    DtCardIcon,
    DtCardTitleActions,
    DtCardFooterActions,
  ],
  declarations: [
    DtCard,
    DtCardTitle,
    DtCardSubtitle,
    DtCardIcon,
    DtCardTitleActions,
    DtCardFooterActions,
  ],
})
export class DtCardModule {}
