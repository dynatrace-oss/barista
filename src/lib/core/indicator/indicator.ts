import { Directive, ElementRef } from '@angular/core';
import { Constructor, mixinColor, CanColor } from '../common-behaviours';

export type DtIndicatorThemePalette = 'error' | 'warning';

// Boilerplate for applying mixins to DtIndicator.
export class DtIndicatornBase {
  constructor(public _elementRef: ElementRef) { }
}

export const _DtIndicatorMixinBase =
  mixinColor<Constructor<DtIndicatornBase>, DtIndicatorThemePalette>(DtIndicatornBase, 'error');

@Directive({
  selector: '[dtIndicator]',
  inputs: ['color'],
  exportAs: 'dtIndicator',
  host: {
    class: 'dt-indicator',
  },
})
export class DtIndicator extends _DtIndicatorMixinBase implements CanColor<DtIndicatorThemePalette> {
  constructor(elementRef: ElementRef) {
    super(elementRef);
  }
}
