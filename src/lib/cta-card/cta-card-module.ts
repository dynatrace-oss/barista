import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import {
  DtCtaCard,
  DtCtaCardAction,
  DtCtaCardTitleAction,
  DtCtaCardTitle,
  DtCtaCardImage,
} from './cta-card';
import { DtCardModule } from '@dynatrace/angular-components/card';

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
