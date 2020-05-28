/**
 * @license
 * Copyright 2020 Dynatrace LLC
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

import { Component, OnDestroy, HostBinding } from '@angular/core';
import { Location } from '@angular/common';
import { ActivatedRoute } from '@angular/router';
import { DomSanitizer, SafeStyle } from '@angular/platform-browser';
import { FluidPaletteSourceAlias } from '@dynatrace/shared/design-system/interfaces';

import { PaletteSourceService } from '../../services/palette';
import {
  generatePaletteContrastColors,
  getTextColorOnBackground,
} from '../../utils/colors';
import { takeUntil } from 'rxjs/operators';
import { Subject } from 'rxjs';
import { DEFAULT_GENERATION_OPTIONS } from '../../utils/palette-generation';

@Component({
  selector: 'design-tokens-ui-palette-detail',
  templateUrl: './palette-detail.component.html',
  styleUrls: ['./palette-detail.component.scss'],
})
export class PaletteDetailComponent implements OnDestroy {
  /** @internal maximum contrast ratio supported by Leonardo */
  readonly _maxRatio = 21;

  /** @internal palette that is currently edited */
  _palette: FluidPaletteSourceAlias;

  /** @internal cached to avoid recalculating on change detection cycles */
  _contrastColors: string[];

  /** Identifier of the current palette */
  private _paletteName: string;

  /** @internal the user must click the delete button twice to confirm */
  _showDeletePaletteConfirmation = false;

  /** @internal Enable or disable gaps in the preview */
  _showGaps = false;

  private _destroy$ = new Subject<void>();

  constructor(
    private _paletteSourceService: PaletteSourceService,
    private _location: Location,
    private _sanitizer: DomSanitizer,
    route: ActivatedRoute,
  ) {
    route.params.pipe(takeUntil(this._destroy$)).subscribe((params) => {
      this._paletteName = params.palette;
      this._palette = _paletteSourceService.getPaletteAlias(this._paletteName)!;

      if (!this._palette.generationOptions) {
        // Easing options might not be available initially
        this._palette.generationOptions = { ...DEFAULT_GENERATION_OPTIONS };
      }
      this._calculateContrastColors();
    });
  }

  ngOnDestroy(): void {
    // Save edited palette on destroy using the original name
    this._paletteSourceService.setPaletteAlias(
      this._paletteName,
      this._palette,
    );

    this._destroy$.next();
    this._destroy$.complete();
  }

  @HostBinding('style')
  get style(): SafeStyle {
    // TODO: replace with new shades when naming scheme is implemented
    return this._sanitizer.bypassSecurityTrustStyle(
      `--color: ${this.getGeneratedContrastShade(0)};
       --color-dark: ${this.getGeneratedContrastShade(1)};
       --color-darker: ${this.getGeneratedContrastShade(2)};`,
    );
  }

  /** The main color the palette is based on */
  get keyColor(): string {
    if (!this._palette) {
      return 'white';
    }
    return this._paletteSourceService.getKeyColor(this._palette);
  }

  set keyColor(color: string) {
    this._palette.keyColor = color;
  }

  /** @internal Recalculate the contrast colors */
  _calculateContrastColors(): void {
    this._contrastColors = generatePaletteContrastColors(this._palette);
  }

  /** @internal */
  _deletePalette(): void {
    if (!this._showDeletePaletteConfirmation) {
      // Confirm deletion
      this._showDeletePaletteConfirmation = true;
      return;
    }

    // The button was clicked a second time, so we can delete now
    this._paletteSourceService.deletePaletteAlias(this._palette.name);
    this._location.back();
  }

  /** @internal */
  _resetDeletePaletteConfirmation(): void {
    this._showDeletePaletteConfirmation = false;
  }

  /** @internal */
  _toggleGaps(): void {
    this._showGaps = !this._showGaps;
  }

  /** @internal Change detection workaround for interpolation options */
  _setGenerationOption(option: string, value: any): void {
    // Make sure that numeric strings get converted to actual numbers
    const numericValue = parseFloat(value);
    const convertedValue = isNaN(numericValue) ? value : numericValue;

    const newOptions = { ...this._palette.generationOptions };
    newOptions[option] = convertedValue;
    if (newOptions.lowerExponent > 0 && newOptions.upperExponent > 0) {
      this._palette.generationOptions = newOptions;
      this._calculateContrastColors();
    }
  }

  /** @internal Applies shade distributions from curve output */
  _distributionsChanged(distributions: number[]): void {
    this._palette.shades = distributions.map((ratio, index) => {
      const { name, comment, aliasName } = this._palette.shades[index];
      return {
        name,
        ratio,
        comment,
        aliasName,
      };
    });
    this._calculateContrastColors();
  }

  /** @internal */
  _getTextColorOnBackground(color: string): string {
    return getTextColorOnBackground(color);
  }

  /**
   * @internal Retrieve a contast shade relative to the base color
   * @param shadeRelativeToBase zero for the base shade a negative or positive number
   * for a lower or higher contrast compared to the base shade
   */
  getGeneratedContrastShade(shadeRelativeToBase: number): string {
    // The base shade is located at the middle
    const baseShadeIndex = Math.floor(this._contrastColors.length / 2);
    return this._contrastColors[baseShadeIndex + shadeRelativeToBase];
  }

  /** @internal Adobe Leonardo URL for the current color palette */
  get leonardoUrl(): string {
    return this._paletteSourceService.getLeonardoUrl(this._palette);
  }
}
