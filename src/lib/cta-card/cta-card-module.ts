import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import {
  DtCtaCardAction,
  DtCtaCardComponent,
  DtCtaCardTitle,
  DtCtaCardImage,
  DtCtaCardTitleAction,
} from './cta-card';
import {DtCardModule} from '../card';

@NgModule({
  declarations: [
    DtCtaCardComponent,
    DtCtaCardAction,
    DtCtaCardTitleAction,
    DtCtaCardTitle,
    DtCtaCardImage,
  ],
  exports: [
    DtCtaCardComponent,
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
