import { Constructor } from './constructor';
import { ElementRef } from '@angular/core';
import { replaceCssClass } from '../util/platform-util';

export interface CanColor {
  /** Theme color palette for the component. */
  color: Partial<DtExtendedThemePalette>;
}

export interface HasElementRef {
  _elementRef: ElementRef;
}

/** Possible color palette values. */
export type DtThemePalette = 'main' | 'accent' | 'warning' | 'error' | 'cta' | undefined;

export type DtExtendedThemePalette = DtThemePalette | 'light' | 'dark';

/** Mixin to augment a directive with a `color` property. */
export function mixinColor<T extends Constructor<HasElementRef>>(
  base: T, defaultColor?: DtThemePalette): Constructor<CanColor> & T;
export function mixinColor<T extends Constructor<HasElementRef>, P extends Partial<DtExtendedThemePalette>>(
  base: T, defaultColor?: P): Constructor<CanColor> & T;
export function mixinColor<T extends Constructor<HasElementRef>, P extends Partial<DtExtendedThemePalette>>(
  base: T, defaultColor?: P): Constructor<CanColor> & T {
  return class extends base {
    private _color: P;

    get color(): P { return this._color; }
    set color(value: P) {
      const colorPalette = value || defaultColor as P;

      if (colorPalette !== this._color) {

        replaceCssClass(
          this._elementRef,
          this._color ? `dt-color-${this._color}` : null,
          colorPalette ? `dt-color-${colorPalette}` : null);

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
