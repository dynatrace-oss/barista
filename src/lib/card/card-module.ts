import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  DtCard,
  DtCardTitle,
  DtCardSubtitle,
  DtCardIcon,
  DtCardActions,
  DtCardFooterActions
} from './card';

@NgModule({
  imports: [CommonModule],
  exports: [
    DtCard,
    DtCardTitle,
    DtCardSubtitle,
    DtCardIcon,
    DtCardActions,
    DtCardFooterActions,
  ],
  declarations: [
    DtCard,
    DtCardTitle,
    DtCardSubtitle,
    DtCardIcon,
    DtCardActions,
    DtCardFooterActions,
  ],
})
export class DtCardModule { }
