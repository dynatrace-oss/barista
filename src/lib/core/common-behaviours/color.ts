import { Constructor } from './constructor';
import { ElementRef, Directive, NgModule } from '@angular/core';
import { replaceCssClass } from '../util/platform-util';

export interface CanColor {
  /** Theme color palette for the component. */
  color: Partial<DtThemePalette>;
}

export interface HasElementRef {
  _elementRef: ElementRef;
}

/** Possible color palette values. */
export type DtThemePalette = 'main' | 'accent' | 'warning' | 'error' | 'cta' | undefined;

/** Mixin to augment a directive with a `color` property. */
export function mixinColor<T extends Constructor<HasElementRef>>(
  base: T, defaultColor?: DtThemePalette): Constructor<CanColor> & T;
export function mixinColor<T extends Constructor<HasElementRef>, P extends Partial<DtThemePalette>>(
  base: T, defaultColor?: P): Constructor<CanColor> & T;
export function mixinColor<T extends Constructor<HasElementRef>, P extends Partial<DtThemePalette>>(
  base: T, defaultColor?: P): Constructor<CanColor> & T {
  return class extends base {
    private _color: P;

    get color(): P { return this._color; }
    set color(value: P) {
      const colorPalette = value || defaultColor as P;

      if (colorPalette !== this._color) {
        setComponentColorClasses(this, colorPalette);
        this._color = colorPalette;
      }
    }

    // tslint:disable-next-line:no-any
    constructor(...args: any[]) {
      super(...args);

      // Set the default color that can be specified from the mixin.
      this.color = defaultColor as P;
    }
  };
}

export function setComponentColorClasses<T extends { color: string | undefined } & HasElementRef>(
  component: T,
  color?: string
): void {

  if (color !== component.color) {
    replaceCssClass(
      component._elementRef,
      component.color ? `dt-color-${component.color}` : null,
      color ? `dt-color-${color}` : null);
  }
}

export class DtColorBase {
  constructor(public _elementRef: ElementRef) { }
}
export const _DtColorMixinBase = mixinColor(DtColorBase);

@Directive({
  selector: '[dtColor]',
  inputs: ['color'],
  exportAs: 'dtColor',
})
export class DtColor extends _DtColorMixinBase implements CanColor {
  constructor(elementRef: ElementRef) {
    super(elementRef);
  }
}

@NgModule({
  exports: [DtColor],
  declarations: [DtColor],
})
export class DtColorModule { }
