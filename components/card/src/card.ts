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
  selector: 'dt-card-footer-actions',
  exportAs: 'dtCardFooterActions',
  host: {
    class: 'dt-card-footer-actions',
  },
})
export class DtCardFooterActions {}

@Component({
  moduleId: module.id,
  selector: 'dt-card',
  exportAs: 'dtCard',
  templateUrl: 'card.html',
  styleUrls: ['card.scss'],
  host: {
    class: 'dt-card',
    // We know that a header is present when the card has at least a title
    '[class.dt-card-has-header]': '!!_title',
  },
  // tslint:disable-next-line: use-view-encapsulation
  encapsulation: ViewEncapsulation.None,
  preserveWhitespaces: false,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DtCard {
  /** @internal Reference to the card title directive. */
  @ContentChild(DtCardTitle, { static: false }) _title: DtCardTitle;
}
