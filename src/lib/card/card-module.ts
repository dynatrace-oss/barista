import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import {
  DtCard,
  DtCardTitle,
  DtCardSubtitle,
  DtCardIcon,
  DtCardActions,
} from './card';

@NgModule({
  imports: [CommonModule],
  exports: [
    DtCard,
    DtCardTitle,
    DtCardSubtitle,
    DtCardIcon,
    DtCardActions,
  ],
  declarations: [
    DtCard,
    DtCardTitle,
    DtCardSubtitle,
    DtCardIcon,
    DtCardActions,
  ],
})
export class DtCardModule { }
