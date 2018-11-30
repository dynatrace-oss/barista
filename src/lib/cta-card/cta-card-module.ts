import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { DtCardModule } from '@dynatrace/angular-components';
import {
  DtCtaCardAction,
  DtCtaCardComponent,
  DtCtaCardTitle,
  DtCtaCardImage,
} from './cta-card';

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
