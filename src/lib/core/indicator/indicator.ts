import { Directive, ElementRef, Input, OnDestroy, OnChanges } from '@angular/core';
import { Constructor, mixinColor, CanColor } from '../common-behaviours/index';
import { coerceBooleanProperty } from '@angular/cdk/coercion';
import { Subject } from 'rxjs';

export type DtIndicatorThemePalette = 'error' | 'warning' | undefined;

// Boilerplate for applying mixins to DtIndicator.
export class DtIndicatorBase {
  constructor(public _elementRef: ElementRef) { }
}

export const _DtIndicatorMixinBase =
  mixinColor<Constructor<DtIndicatorBase>, DtIndicatorThemePalette>(DtIndicatorBase);

@Directive({
  selector: '[dtIndicator]',
  inputs: ['color: dtIndicatorColor'],
  exportAs: 'dtIndicator',
  host: {
    'class': 'dt-indicator',
    '[class.dt-indicator-active]': 'active',
  },
})
export class DtIndicator extends _DtIndicatorMixinBase implements CanColor<DtIndicatorThemePalette>, OnDestroy, OnChanges {

  /**
   * @internal
   * Emits whenever some inputs change on the indicator so the row can reevaluate the indicator
   */
  _stateChanges = new Subject<void>();

  @Input('dtIndicator')
  get active(): boolean { return this._active; }
  set active(value: boolean) {
    const coerceValue = coerceBooleanProperty(value);
    if (coerceValue !== this._active) {
      this._active = coerceValue;
      this._stateChanges.next();
    }
  }
  private _active = true;

  constructor(elementRef: ElementRef) {
    super(elementRef);
  }

  ngOnChanges(): void {
    this._stateChanges.next();
  }

  ngOnDestroy(): void {
   this._stateChanges.complete();
  }
}
