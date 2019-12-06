/**
 * @license
 * Copyright 2019 Dynatrace LLC
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DtCardModule } from '@dynatrace/barista-components/card';

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
  imports: [CommonModule, DtCardModule],
})
export class DtCtaCardModule {}
