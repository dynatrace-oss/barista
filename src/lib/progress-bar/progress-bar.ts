import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  ContentChild,
  ElementRef,
  Input,
  ViewEncapsulation,
} from '@angular/core';

import {
  CanColor,
  Constructor,
  DtProgressChange,
  HasProgressValues,
  isDefined,
  mixinColor,
  mixinHasProgress,
} from '@dynatrace/angular-components/core';

import { DtProgressBarCount } from './progress-bar-count';
import { DtProgressBarDescription } from './progress-bar-description';

export type DtProgressBarChange = DtProgressChange;

export type DtProgressBarThemePalette =
  | 'main'
  | 'accent'
  | 'warning'
  | 'recovered'
  | 'error';

export class DtProgressBarBase {
  constructor(public _elementRef: ElementRef) {}
}

export const _DtProgressBar = mixinHasProgress(
  mixinColor<Constructor<DtProgressBarBase>, DtProgressBarThemePalette>(
    DtProgressBarBase,
    'main',
  ),
);

@Component({
  moduleId: module.id,
  selector: 'dt-progress-bar',
  templateUrl: 'progress-bar.html',
  styleUrls: ['progress-bar.scss'],
  exportAs: 'dtProgressBar',
  host: {
    class: 'dt-progress-bar',
    role: 'progressbar',
    '[class.dt-progress-bar-end]': 'align == "end"',
    '[attr.aria-valuemin]': 'min',
    '[attr.aria-valuemax]': 'max',
    '[attr.aria-valuenow]': 'value',
  },
  inputs: ['color', 'value', 'min', 'max'],
  outputs: ['valueChange'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.Emulated,
})
export class DtProgressBar extends _DtProgressBar
  implements CanColor<DtProgressBarThemePalette>, HasProgressValues {
  /** Defines the alignment of the bar. */
  @Input() align: 'start' | 'end' = 'start';

  /** @internal Reference to the description sub-component */
  @ContentChild(DtProgressBarDescription, { static: true })
  _description: DtProgressBarDescription;

  /** @internal Reference to the count sub-component */
  @ContentChild(DtProgressBarCount, { static: true })
  _count: DtProgressBarCount;

  constructor(
    private _changeDetectorRef: ChangeDetectorRef,
    elementRef: ElementRef,
  ) {
    super(elementRef);
  }

  /** @internal Updates all view parameters */
  _updateValues(): void {
    super._updateValues();
    this._changeDetectorRef.markForCheck();
  }

  /**
   * @internal
   * Getter that returns true if either description or count are defined as contentchildren.
   */
  get _hasDescriptionOrCount(): boolean {
    return isDefined(this._description) || isDefined(this._count);
  }
}
