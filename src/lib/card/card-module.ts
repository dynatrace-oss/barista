import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  DtCard,
  DtCardTitle,
  DtCardSubtitle,
  DtCardIcon,
  DtCardTitleActions,
  DtCardFooterActions
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
export class DtCardModule { }
