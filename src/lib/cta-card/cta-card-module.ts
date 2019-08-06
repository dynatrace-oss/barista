import { NgModule } from '@angular/core';
import { DtCardModule } from '@dynatrace/angular-components/card';
import {
  DtCtaCard,
  DtCtaCardFooterActions,
  DtCtaCardImage,
  DtCtaCardTitle,
  DtCtaCardTitleActions,
} from './cta-card';

const CTA_CARD_DIRECTIVES = [
  DtCtaCard, // tslint:disable-line:deprecation
  DtCtaCardFooterActions, // tslint:disable-line:deprecation
  DtCtaCardTitleActions, // tslint:disable-line:deprecation
  DtCtaCardTitle, // tslint:disable-line:deprecation
  DtCtaCardImage, // tslint:disable-line:deprecation
];

@NgModule({
  declarations: CTA_CARD_DIRECTIVES,
  exports: CTA_CARD_DIRECTIVES,
  imports: [DtCardModule],
})
export class DtCtaCardModule {}
