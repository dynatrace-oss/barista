import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  DtCard,
  DtCardTitle,
  DtCardSubtitle,
  DtCardIcon,
  DtCardActions,
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
    // tslint:disable-next-line:deprecation
    DtCardActions,
    DtCardTitleActions,
    DtCardFooterActions,
  ],
  declarations: [
    DtCard,
    DtCardTitle,
    DtCardSubtitle,
    DtCardIcon,
    // tslint:disable-next-line:deprecation
    DtCardActions,
    DtCardTitleActions,
    DtCardFooterActions,
  ],
})
export class DtCardModule { }
