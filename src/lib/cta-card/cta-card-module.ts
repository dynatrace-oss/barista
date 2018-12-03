import { NgModule } from '@angular/core';
import {
  DtCtaCard,
  DtCtaCardFooterActions,
  DtCtaCardTitleActions,
  DtCtaCardTitle,
  DtCtaCardImage,
} from './cta-card';
import { DtCardModule } from '@dynatrace/angular-components/card';

@NgModule({
  declarations: [
    DtCtaCard,
    DtCtaCardFooterActions,
    DtCtaCardTitleActions,
    DtCtaCardTitle,
    DtCtaCardImage,
  ],
  exports: [
    DtCtaCard,
    DtCtaCardFooterActions,
    DtCtaCardTitleActions,
    DtCtaCardTitle,
    DtCtaCardImage,
  ],
  imports: [
    DtCardModule,
  ],
})
export class DtCtaCardModule { }
