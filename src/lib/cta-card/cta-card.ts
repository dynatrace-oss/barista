import {
  ChangeDetectionStrategy,
  Component,
  Directive,
  ViewEncapsulation,
} from '@angular/core';

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
    class: 'dt-cta-card-footer-actions',
  },
  selector: 'dt-cta-card-footer-actions',
})
export class DtCtaCardFooterActions { }

/** The action button that is placed on the top right corner of the cta card (must be one cta styled secondary button with icon) */
@Directive({
  host: {
    class: 'dt-cta-card-title-actions',
  },
  selector: 'dt-cta-card-title-actions',
})
export class DtCtaCardTitleActions { }

@Component({
  moduleId: module.id,
  selector: 'dt-cta-card',
  exportAs: 'dtCtaCard',
  templateUrl: 'cta-card.html',
  styleUrls: ['cta-card.scss'],
  encapsulation: ViewEncapsulation.Emulated,
  preserveWhitespaces: false,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DtCtaCard {
}
