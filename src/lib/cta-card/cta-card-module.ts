import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import {
  DtCtaCardAction,
  DtCtaCard,
  DtCtaCardTitle,
  DtCtaCardImage,
  DtCtaCardTitleAction,
} from './cta-card';
import { DtCardModule } from '../card/';

@NgModule({
  declarations: [
    DtCtaCard,
    DtCtaCardAction,
    DtCtaCardTitleAction,
    DtCtaCardTitle,
    DtCtaCardImage,
  ],
  exports: [
    DtCtaCard,
    DtCtaCardAction,
    DtCtaCardTitleAction,
    DtCtaCardTitle,
    DtCtaCardImage,
  ],
  imports: [
    CommonModule,
    DtCardModule,
  ],
})
export class DtCtaCardModule { }
