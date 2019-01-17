import {
  Component,
  ChangeDetectionStrategy,
  ViewEncapsulation,
  Input,
  ChangeDetectorRef,
  Output,
  EventEmitter,
  ElementRef,
  ContentChild,
} from '@angular/core';
import { mixinColor, CanColor, DtProgressChange, HasProgressValues, mixinHasProgress, Constructor, isDefined } from '@dynatrace/angular-components/core';
import { DtProgressBarDescription } from './progress-bar-description';
import { DtProgressBarCount } from './progress-bar-count';

export type DtProgressBarChange = DtProgressChange;

export type DtProgressBarThemePalette = 'main' | 'accent' | 'warning' | 'recovered' | 'error';

export class DtProgressBarBase {
  constructor(public _elementRef: ElementRef) { }
}

export const _DtProgressBar =
  mixinHasProgress(mixinColor<Constructor<DtProgressBarBase>, DtProgressBarThemePalette>(DtProgressBarBase, 'main'));

@Component({
  moduleId: module.id,
  selector: 'dt-progress-bar',
  templateUrl: 'progress-bar.html',
  styleUrls: ['progress-bar.scss'],
  exportAs: 'dtProgressBar',
  host: {
    'class': 'dt-progress-bar',
    'role': 'progressbar',
    '[class.dt-progress-bar-end]': 'align == "end"',
    '[attr.aria-valuemin]': 'min',
    '[attr.aria-valuemax]': 'max',
    '[attr.aria-valuenow]': 'value',
  },
  inputs: ['color', 'value', 'min', 'max'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.Emulated,
})
export class DtProgressBar extends _DtProgressBar implements CanColor<DtProgressBarThemePalette>, HasProgressValues {

  @Input() align: 'start' | 'end' = 'start';

  @Output()
  readonly valueChange = new EventEmitter<DtProgressBarChange>();

  /** Contentchildren reference to the description and count sub-components */
  @ContentChild(DtProgressBarDescription) _description: DtProgressBarDescription;
  @ContentChild(DtProgressBarCount) _count: DtProgressBarCount;

  constructor(private _changeDetectorRef: ChangeDetectorRef, elementRef: ElementRef) {
    super(elementRef);
  }

  /** Updates all view parameters */
  _updateValues(): void {
    super._updateValues();
    this._changeDetectorRef.markForCheck();
  }

  /** Emits valueChange event if the value of the progressbar is updated */
  _emitValueChangeEvent(oldValue: number, newValue: number): void {
    this.valueChange.emit({oldValue, newValue});
  }

  /** Getter that returns true if either description or count are defined as contentchildren. */
  get _hasDescriptionOrCount(): boolean {
    return isDefined(this._description) || isDefined(this._count);
  }
}
