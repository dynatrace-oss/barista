import {
  Component,
  Directive,
  Input,
  TemplateRef,
  ViewChild,
} from '@angular/core';

/**
 * The consumption components' title.
 *
 * @example <dt-consumption-title>Host units</dt-consumption-title>
 */
@Directive({
  selector:
    'dt-consumption-title, [dt-consumption-title], [dtConsumptionTitle]',
  exportAs: 'dtConsumptionTitle',
  host: {
    class: 'dt-consumption-title',
    'aria-role': 'heading',
    'aria-level': '1',
  },
})
export class DtConsumptionTitle {}

/**
 * The consumption components' subtitle.
 *
 * @example <dt-consumption-subtitle>Quota</dt-consumption-subtitle>
 */
@Directive({
  selector:
    'dt-consumption-subtitle, [dt-consumption-subtitle], [dtConsumptionSubtitle]',
  exportAs: 'dtConsumptionSubtitle',
  host: {
    class: 'dt-consumption-subtitle',
    'aria-role': 'heading',
    'aria-level': '2',
  },
})
export class DtConsumptionSubtitle {}

/**
 * The consumption components' icon that is displayed next to the title.
 *
 * @example
 * <dt-consumption-icon aria-label="Host">
 *   <dt-icon name="host">/dt-icon>
 * </dt-consumption-icon>
 */
@Directive({
  selector: 'dt-consumption-icon, [dt-consumption-icon], [dtConsumptionIcon]',
  exportAs: 'dtConsumptionIcon',
  host: {
    class: 'dt-consumption-icon',
    'aria-role': 'icon',
    '[attr.aria-label]': 'ariaLabel',
  },
})
export class DtConsumptionIcon {
  /** Accessibility label describing the icon in the consumption component. */
  @Input('aria-label') ariaLabel: string;
}

/**
 * A formatted value label shown below the progress bar.
 *
 * @example <dt-consumption-count>5/20</dt-consumption-count>.
 */
@Directive({
  selector:
    'dt-consumption-count, [dt-consumption-count], [dtConsumptionCount]',
  exportAs: 'dtConsumptionCount',
  host: {
    class: 'dt-consumption-count',
  },
})
export class DtConsumptionCount {}

/**
 * A more detailed description of what the progressbar and count label actually
 * represent.
 *
 * @example <dt-consumption-label>Restricted host unit hours</dt-consumption-label>
 */
@Directive({
  selector:
    'dt-consumption-label, [dt-consumption-label], [dtConsumptionLabel]',
  exportAs: 'dtConsumptionLabel',
  host: {
    class: 'dt-consumption-label',
  },
})
export class DtConsumptionLabel {}

/**
 * An overlay that is shown when the user moves his mouse over
 * the consumption component. The usage of the overlay is optional.
 *
 * @example <dt-consumption-overlay>My custom content</<dt-consumption-overlay>
 */
@Component({
  selector: 'dt-consumption-overlay',
  host: {
    class: 'dt-consumption-overlay',
  },
  template: `
    <ng-template #overlayTemplate>
      <div dtTheme=":light">
        <ng-content></ng-content>
      </div>
    </ng-template>
  `,
})
export class DtConsumptionOverlay {
  /** @internal The template that is being displayed in the overlay */
  @ViewChild('overlayTemplate', { static: true, read: TemplateRef })
  _overlayTemplate: TemplateRef<void>;
}
