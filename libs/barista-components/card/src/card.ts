/**
 * @license
 * Copyright 2022 Dynatrace LLC
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

import {
  ChangeDetectionStrategy,
  Component,
  ContentChild,
  Directive,
  ViewEncapsulation,
} from '@angular/core';

/** Title of a card, needed as it's used as a selector in the API. */
@Directive({
  selector: `dt-card-title, [dt-card-title], [dtCardTitle]`,
  exportAs: 'dtCardTitle',
  host: {
    class: 'dt-card-title',
  },
})
export class DtCardTitle {}

/** Icon of a card, needed as it's used as a selector in the API. */
@Directive({
  selector: `dt-card-icon, [dt-card-icon], [dtCardIcon]`,
  exportAs: 'dtCardIcon',
  host: {
    class: 'dt-card-icon',
  },
})
export class DtCardIcon {}

/** Sub-title of a card, needed as it's used as a selector in the API. */
@Directive({
  selector: `dt-card-subtitle, [dt-card-subtitle], [dtCardSubtitle]`,
  exportAs: 'dtCardSubtitle',
  host: {
    class: 'dt-card-subtitle',
  },
})
export class DtCardSubtitle {}

/** Title actions of a card, needed as it's used as a selector in the API. */
@Directive({
  selector: `dt-card-title-actions, [dt-card-title-actions], [dtCardTitleActions]`,
  exportAs: 'dtCardTitleActions',
  host: {
    class: 'dt-card-title-actions',
  },
})
export class DtCardTitleActions {}

@Directive({
  selector:
    'dt-card-footer-actions, [dt-card-footer-actions], [dtCardFooterActions]',
  exportAs: 'dtCardFooterActions',
  host: {
    class: 'dt-card-footer-actions',
  },
})
export class DtCardFooterActions {}

@Component({
  selector: 'dt-card',
  exportAs: 'dtCard',
  templateUrl: 'card.html',
  styleUrls: ['card.scss'],
  host: {
    class: 'dt-card',
    // We know that a header is present when the card has at least a title
    '[class.dt-card-has-header]': '!!_title',
  },
  encapsulation: ViewEncapsulation.None,
  preserveWhitespaces: false,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DtCard {
  /** @internal Reference to the card title directive. */
  @ContentChild(DtCardTitle) _title: DtCardTitle;
}
