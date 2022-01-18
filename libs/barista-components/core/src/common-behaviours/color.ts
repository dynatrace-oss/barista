/**
 * @license
 * Copyright 2022 Dynatrace LLC
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
/* eslint-disable no-redeclare */

import { Directive, ElementRef, NgModule } from '@angular/core';

import { _replaceCssClass } from '../util/platform-util';
import { Constructor } from './constructor';

export interface CanColor<P extends Partial<DtThemePalette>> {
  /** Theme color palette for the component. */
  color: P;
}

export interface HasElementRef {
  _elementRef: ElementRef;
}

/** Possible color palette values. */
export type DtThemePalette =
  | 'main'
  | 'accent'
  | 'warning'
  | 'error'
  | 'cta'
  | 'recovered'
  | 'neutral'
  | 'critical'
  | undefined;

/** Mixin to augment a directive with a `color` property. */
export function mixinColor<T extends Constructor<HasElementRef>>(
  base: T,
  defaultColor?: DtThemePalette,
): Constructor<CanColor<DtThemePalette>> & T;
export function mixinColor<
  T extends Constructor<HasElementRef>,
  P extends Partial<DtThemePalette>,
>(base: T, defaultColor?: P): Constructor<CanColor<P>> & T;
export function mixinColor<
  T extends Constructor<HasElementRef>,
  P extends Partial<DtThemePalette>,
>(base: T, defaultColor?: P): Constructor<CanColor<P>> & T {
  return class extends base {
    private _color: P;

    get color(): P {
      return this._color;
    }
    set color(value: P) {
      const colorPalette = value || (defaultColor as P);

      if (colorPalette !== this._color) {
        setComponentColorClasses(this, colorPalette);
        this._color = colorPalette;
      }
    }

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    constructor(...args: any[]) {
      super(...args);
      // Set the default color that can be specified from the mixin.
      this.color = defaultColor as P;
    }
  };
}

export function setComponentColorClasses<
  T extends { color?: string } & HasElementRef,
>(component: T, color?: string): void {
  if (color !== component.color) {
    _replaceCssClass(
      component._elementRef,
      component.color ? `dt-color-${component.color}` : null,
      color ? `dt-color-${color}` : null,
    );
  }
}

/**
 * Base class that uses the mixinColor mixin
 */
export class DtColorBase {
  constructor(public _elementRef: ElementRef) {}
}
export const _DtColorMixinBase = mixinColor(DtColorBase);

/**
 * Directive to add color capabilities to element
 * since the DtTab color input is set on the tab element, but the class needs to be applied to the portal outlet in the tab header
 * we need to pipe the color input to the tabgroup and the tabgroup needs the directive to apply the correct css class
 */
@Directive({
  selector: '[dtColor]',
  exportAs: 'dtColor',
  inputs: ['color'],
})
export class DtColor
  extends _DtColorMixinBase
  implements CanColor<DtThemePalette>
{
  constructor(elementRef: ElementRef) {
    super(elementRef);
  }
}

/**
 * Module that exports and declares the DtColor Directive
 */
@NgModule({
  exports: [DtColor],
  declarations: [DtColor],
})
export class DtColorModule {}
