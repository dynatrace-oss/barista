import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import {
  DtCtaCardAction,
  DtCtaCardComponent,
  DtCtaCardTitle,
  DtCtaCardImage,
} from './cta-card';
import {DtCardModule} from '../card';

@NgModule({
  declarations: [
    DtCtaCardComponent,
    DtCtaCardAction,
    DtCtaCardTitle,
    DtCtaCardImage,
  ],
  exports: [
    DtCtaCardComponent,
    DtCtaCardAction,
    DtCtaCardTitle,
    DtCtaCardImage,
  ],
  imports: [
    CommonModule,
    DtCardModule,
    RouterModule,
  ],
})
export class DtCtaCardModule { }
