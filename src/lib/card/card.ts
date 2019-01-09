import {
  Component,
  ViewEncapsulation,
  ChangeDetectionStrategy,
  Directive,
  ContentChild
} from '@angular/core';

/** Title of a card, needed as it's used as a selector in the API. */
@Directive({
  selector: `dt-card-title, [dt-card-title], [dtCardTitle]`,
  host: {
    class: 'dt-card-title',
  },
})
export class DtCardTitle { }

/** Icon of a card, needed as it's used as a selector in the API. */
@Directive({
  selector: `dt-card-icon, [dt-card-icon], [dtCardIcon]`,
  host: {
    class: 'dt-card-icon',
  },
})
export class DtCardIcon { }

/** Sub-title of a card, needed as it's used as a selector in the API. */
@Directive({
  selector: `dt-card-subtitle, [dt-card-subtitle], [dtCardSubtitle]`,
  host: {
    class: 'dt-card-subtitle',
  },
})
export class DtCardSubtitle { }

/**
 * @deprecated Use `DtCardTitleActions` instead.
 * @breaking-change 2.0.0 To be changed to `DtCardTitleActions`
 * Title actions of a card, needed as it's used as a selector in the API.
 */
@Directive({
  selector: `dt-card-actions, [dt-card-actions], [dtCardctions]`,
  host: {
    class: 'dt-card-actions, dt-card-title-actions',
  },
})
export class DtCardActions { }

/** Title actions of a card, needed as it's used as a selector in the API. */
@Directive({
  selector: `dt-card-title-actions, [dt-card-title-actions], [dtCardTitleActions]`,
  host: {
    class: 'dt-card-title-actions',
  },
})
export class DtCardTitleActions { }

@Directive({
  host: {
    class: 'dt-card-footer-actions',
  },
  selector: 'dt-card-footer-actions',
})
export class DtCardFooterActions { }

@Component({
  moduleId: module.id,
  selector: 'dt-card',
  exportAs: 'dtCard',
  templateUrl: 'card.html',
  styleUrls: ['card.scss'],
  host: {
    'class': 'dt-card',
    // We know that a header is present when the card has at least a title
    '[class.dt-card-has-header]': '!!_title',
  },
  // tslint:disable-next-line: use-view-encapsulation
  encapsulation: ViewEncapsulation.None,
  preserveWhitespaces: false,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DtCard {
  @ContentChild(DtCardTitle) _title: DtCardTitle;
}
