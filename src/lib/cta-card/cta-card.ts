import {ChangeDetectionStrategy, Component, ContentChild, Directive, ViewEncapsulation} from '@angular/core';

/** Title of the cta card */
@Directive({
  host: {
    class: 'dt-cta-card-title',
  },
  selector: 'dt-cta-card-title',
})
export class DtCtaCardTitle { }

/** The image content that is placed into the illustration region of the cta card */
@Directive({
  host: {
    class: 'dt-cta-card-image',
  },
  selector: 'dt-cta-card-image',
})
export class DtCtaCardImage { }

/** The action button that is placed below the text of the cta card (must be one cta styled primary button) */
@Directive({
  host: {
    class: 'dt-cta-card-action',
  },
  selector: 'dt-cta-card-action',
})
export class DtCtaCardAction { }

@Component({
  moduleId: module.id,
  selector: 'dt-cta-card',
  exportAs: 'dtCtaCard',
  templateUrl: 'cta-card.html',
  styleUrls: ['cta-card.scss'],
  host: {
    'class': 'dt-cta-card',
    // We know that a header is present when the cta card has at least a title
    '[class.dt-cta-card-has-header]': '!!_title',
  },
  // tslint:disable-next-line: use-view-encapsulation
  encapsulation: ViewEncapsulation.None,
  preserveWhitespaces: false,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DtCtaCardComponent {
  @ContentChild(DtCtaCardTitle) _title: DtCtaCardTitle;
}
