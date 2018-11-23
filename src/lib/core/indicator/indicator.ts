import { Directive, ElementRef, Input } from '@angular/core';
import { Constructor, mixinColor, CanColor } from '../common-behaviours';
import { coerceBooleanProperty } from '@angular/cdk/coercion';

export type DtIndicatorThemePalette = 'error' | 'warning' | undefined;

// Boilerplate for applying mixins to DtIndicator.
export class DtIndicatornBase {
  constructor(public _elementRef: ElementRef) { }
}

export const _DtIndicatorMixinBase =
  mixinColor<Constructor<DtIndicatornBase>, DtIndicatorThemePalette>(DtIndicatornBase);

@Directive({
  selector: '[dtIndicator]',
  inputs: ['color: dtIndicatorColor'],
  exportAs: 'dtIndicator',
  host: {
    class: 'dt-indicator',
  },
})
export class DtIndicator extends _DtIndicatorMixinBase implements CanColor<DtIndicatorThemePalette> {

  @Input('dtIndicator')
  get active(): boolean { return this._active; }
  set active(value: boolean) { this._active = coerceBooleanProperty(value); }
  private _active = true;

  constructor(elementRef: ElementRef) {
    super(elementRef);
  }
}
