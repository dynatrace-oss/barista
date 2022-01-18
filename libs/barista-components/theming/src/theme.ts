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

import {
  Directive,
  ElementRef,
  Input,
  OnDestroy,
  Optional,
  SkipSelf,
  isDevMode,
} from '@angular/core';
import { NEVER, Subject, Subscription } from 'rxjs';

import {
  DtLogger,
  DtLoggerFactory,
  _replaceCssClass,
} from '@dynatrace/barista-components/core';

import {
  getDtThemeNotValidError,
  getDtThemeVariantNotValidError,
} from './theming-errors';

const LOG: DtLogger = DtLoggerFactory.create('DtTheme');

const MAX_DEPTH = 2;

export type DtThemeVariant = 'light' | 'dark' | null;
const THEME_VALIDATION_RX = /^((?:[a-zA-Z-]+)?)(?::(light|dark))?$/;
const THEME_VARIANTS: DtThemeVariant[] = ['light', 'dark'];

interface NameVariantClasses {
  name: string | null;
  variant: string | null;
}

@Directive({
  selector: '[dtTheme]',
  exportAs: 'dtTheme',
  host: {
    class: 'dt-theme',
  },
})
export class DtTheme implements OnDestroy {
  /**
   * Theme name and the variant.
   * could be:
   * - royalblue
   * - royalblue:light
   * - royalblue:dark
   * - :light
   * - :dark
   */
  @Input()
  set dtTheme(value: string) {
    const { name, variant } = this._parseThemeValue(value);

    if (name !== this._name || variant !== this._variant) {
      this._name = name;
      this._variant = variant;
      this._updateHostClasses();
      this._stateChanges.next();
    }
  }

  /** Name of the specified theme (royalblue, ...) */
  get name(): string | null {
    return this._name || (this._parentTheme && this._parentTheme.name);
  }

  /** Whether the theme is the light or dark variant */
  get variant(): DtThemeVariant | null {
    return this._variant || (this._parentTheme && this._parentTheme.variant);
  }

  /** @internal The level of depth */
  get _depthLevel(): number {
    return this._parentTheme ? this._parentTheme._depthLevel + 1 : 1;
  }

  /** @internal Emits on state change */
  readonly _stateChanges: Subject<void> = new Subject<void>();

  private _name: string | null = null;
  private _variant: DtThemeVariant | null = null;
  private _classNames: NameVariantClasses = { name: null, variant: null };
  private _parentSub: Subscription = NEVER.subscribe();

  constructor(
    private _elementRef: ElementRef,
    @Optional() @SkipSelf() private _parentTheme: DtTheme,
  ) {
    if (this._parentTheme) {
      this._parentSub = this._parentTheme._stateChanges.subscribe(() => {
        // Only update if either the local name or the local variant is not set
        // If both are set we do not need the values from the parent
        if (!this._name || !this._variant) {
          this._updateHostClasses();
          // Notify child themes of this changes
          this._stateChanges.next();
        }
      });
    }
    this._warnIfDepthExceeded();
  }

  ngOnDestroy(): void {
    this._stateChanges.next();
    this._stateChanges.complete();
    if (this._parentTheme) {
      this._parentSub.unsubscribe();
    }
  }

  /** Updates name and variant classes on the host element */
  private _updateHostClasses(): void {
    const currentClassNames = this._classNames;
    const newClassNames = this._genClassNames();
    _replaceCssClass(
      this._elementRef,
      currentClassNames.name,
      newClassNames.name,
    );
    _replaceCssClass(
      this._elementRef,
      currentClassNames.variant,
      newClassNames.variant,
    );
    this._classNames = newClassNames;
  }

  /** Generates the theme class names for the currently defined name and variant */
  private _genClassNames(): NameVariantClasses {
    return {
      name: this.name ? `dt-theme-${this.name}` : null,
      variant: this.variant ? `dt-theme-${this.variant}` : null,
    };
  }

  /** Notify developers if max depth level has been exceeded */
  private _warnIfDepthExceeded(): void {
    if (isDevMode() && this._depthLevel > MAX_DEPTH) {
      LOG.warn(
        `The max supported depth level (${MAX_DEPTH}) of nested themes (dtTheme) has ` +
          `been exceeded. This could result in wrong styling unpredictable styling side effects.`,
      );
    }
  }

  private _parseThemeValue(value: string): {
    name: string;
    variant: DtThemeVariant;
  } {
    // eslint-disable-next-line no-extra-boolean-cast
    const result = !!value ? value.match(THEME_VALIDATION_RX) : null;
    if (result === null) {
      throw getDtThemeNotValidError(value);
    }
    const [, name, variant] = result;
    if (variant && THEME_VARIANTS.indexOf(variant as DtThemeVariant) === -1) {
      throw getDtThemeVariantNotValidError(value, variant);
    }
    return { name, variant: variant as DtThemeVariant };
  }
}
