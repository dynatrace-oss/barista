import {
  ChangeDetectionStrategy,
  Component,
  Directive,
  ViewEncapsulation,
} from '@angular/core';

/**
 *  Title of the cta card.
 *
 * @deprecated Use `<dt-empty-state>` in combination with `<dt-card>` instead.
 * @breaking-change To be removed with 6.0.0.
 */
@Directive({
  selector: 'dt-cta-card-title',
  exportAs: 'dtCtaCardTitle',
  host: {
    class: 'dt-cta-card-title',
  },
})
export class DtCtaCardTitle {}

/**
 * The image content that is placed into the illustration region of the cta card.
 *
 * @deprecated Use `<dt-empty-state>` in combination with `<dt-card>` instead.
 * @breaking-change To be removed with 6.0.0.
 */
@Directive({
  selector: 'dt-cta-card-image',
  exportAs: 'dtCtaCardImage',
  host: {
    class: 'dt-cta-card-image',
  },
})
export class DtCtaCardImage {}

/**
 * The action button that is placed below the text of the cta card (must be one cta styled primary button).
 *
 * @deprecated Use `<dt-empty-state>` in combination with `<dt-card>` instead.
 * @breaking-change To be removed with 6.0.0.
 */
@Directive({
  selector: 'dt-cta-card-footer-actions',
  exportAs: 'dtCtaCardFooterActions',
  host: {
    class: 'dt-cta-card-footer-actions',
  },
})
export class DtCtaCardFooterActions {}

/**
 * The action button that is placed on the top right corner of the cta card (must be one cta styled secondary button with icon).
 *
 * @deprecated Use `<dt-empty-state>` in combination with `<dt-card>` instead.
 * @breaking-change To be removed with 6.0.0.
 */
@Directive({
  selector: 'dt-cta-card-title-actions',
  exportAs: 'dtCtaCardTitleActions',
  host: {
    class: 'dt-cta-card-title-actions',
  },
})
export class DtCtaCardTitleActions {}

/**
 * @deprecated Use `<dt-empty-state>` in combination with `<dt-card>` instead.
 *   Example:
 *   ```
 *   <dt-card>
 *     <dt-card-title>Some title</dt-card-title>
 *
 *     <dt-empty-state>
 *       <dt-empty-state-item>
 *         <dt-empty-state-item-img>
 *           <img src="/assets/cta-noagent.svg" alt="No agent" />
 *         </dt-empty-state-item-img>
 *
 *         <dt-empty-state-item-title>Some Heading</dt-empty-state-item-title>
 *
 *         Lorem ipsum dolor sit amet, consetetur sadipscing elitr.
 *       </dt-empty-state-item>
 *     </dt-empty-state>
 *
 *     <dt-card-footer-actions>
 *       <button color="cta">My Action</button>
 *     </dt-card-footer-actions>
 *   </dt-card>
 *   ```
 * @breaking-change To be removed with 6.0.0.
 */
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
export class DtCtaCard {}
