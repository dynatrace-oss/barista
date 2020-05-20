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

import { Component, OnDestroy, ViewChild, AfterViewInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Observable, Subject } from 'rxjs';
import {
  takeUntil,
  map,
  filter,
  debounceTime,
  switchMap,
  first,
} from 'rxjs/operators';

import {
  Palette,
  DEFAULT_GENERATION_OPTIONS,
} from '@dynatrace/design-tokens-ui/shared';
import { PaletteSourceService } from '../../../../services/palette';
import {
  FluidPaletteGenerationOptions,
  FluidPaletteSourceAlias,
  FluidPaletteColorspace,
} from '@dynatrace/shared/barista-definitions';
import { ColorPickerComponent } from '../color-picker/color-picker.component';

@Component({
  selector: 'design-tokens-ui-palette-settings',
  templateUrl: './palette-settings.component.html',
  styleUrls: ['../../shared-settings-styles.scss'],
})
export class PaletteSettingsComponent implements AfterViewInit, OnDestroy {
  @ViewChild('keyColorPicker') keyColorPicker: ColorPickerComponent;

  /** @internal Identifier of the current theme */
  _themeName: string;

  /** @internal Identifier of the current palette */
  _paletteName: string;

  /** @internal Returns the current palette */
  _palette$: Observable<Palette>;

  /** @internal Returns the current palette's key color */
  _keyColor$: Observable<string>;

  /** @internal Returns the current palette's generation options */
  _generationOptions$: Observable<FluidPaletteGenerationOptions | undefined>;

  private _destroy$ = new Subject<void>();

  constructor(
    private _paletteSourceService: PaletteSourceService,
    route: ActivatedRoute,
  ) {
    this._palette$ = route.params.pipe(
      takeUntil(this._destroy$),
      switchMap((params) => {
        this._themeName = params.theme;
        this._paletteName = params.palette;

        return this._paletteSourceService
          .getPalette(this._themeName, this._paletteName)
          .pipe(filter(Boolean)) as Observable<Palette>;
      }),
    );

    this._keyColor$ = this._palette$.pipe(
      map((palette) => palette.tokenData.keyColor),
      map((keyColor) => (Array.isArray(keyColor) ? keyColor[0] : keyColor)),
    );

    this._generationOptions$ = this._palette$.pipe(
      map((palette) => palette.tokenData.generationOptions),
    );
  }

  ngAfterViewInit(): void {
    // Listen to the event manually since change detection makes Chrome's color picker very unresponsive
    this.keyColorPicker.colorChange
      .pipe(takeUntil(this._destroy$), debounceTime(150))
      .subscribe((color) => {
        this._keyColor = color;
      });
  }

  ngOnDestroy(): void {
    this._destroy$.next();
    this._destroy$.complete();
  }

  /** @internal Adds or removes custom generation options to a palette */
  async _setGenerationOptionsEnabled(enable: boolean): Promise<void> {
    this._generationOptions$.pipe(first()).subscribe(async (options) => {
      if (options && !enable) {
        this._removeGenerationOptions();
      } else if (!options && enable) {
        const theme = await this._paletteSourceService
          .getTheme(this._themeName)
          .pipe(first())
          .toPromise();

        this._generationOptions = {
          ...(theme?.globalGenerationOptions ?? DEFAULT_GENERATION_OPTIONS),
        };
      }
    });
  }

  /** @internal Sets the key color of the current palette */
  set _keyColor(color: string) {
    this._modifyPaletteTokenData((tokenData) => ({
      ...tokenData,
      keyColor: color,
    }));

    this._regenerateColors(false);
  }

  /** @internal Sets the color space of the current palette */
  set _colorspace(colorspace: FluidPaletteColorspace) {
    this._modifyPaletteTokenData((tokenData) => ({
      ...tokenData,
      colorspace,
    }));

    this._regenerateColors(false);
  }

  /** @internal Sets the generation options of the current palette */
  set _generationOptions(newOptions: FluidPaletteGenerationOptions) {
    this._modifyPaletteTokenData((tokenData) => ({
      ...tokenData,
      generationOptions: newOptions,
    }));

    this._regenerateColors(true);
  }

  private _modifyPaletteTokenData(
    changeFn: (tokenData: FluidPaletteSourceAlias) => FluidPaletteSourceAlias,
  ): void {
    this._paletteSourceService.modifyPalette(
      this._themeName,
      this._paletteName,
      (palette) => ({
        ...palette,
        tokenData: changeFn(palette.tokenData),
      }),
    );
  }

  private _regenerateColors(recalculateDistributions: boolean): void {
    this._paletteSourceService.regeneratePaletteColors(
      this._themeName,
      this._paletteName,
      recalculateDistributions,
    );
  }

  private _removeGenerationOptions(): void {
    this._modifyPaletteTokenData((tokenData) => {
      const tokenDataCopy = { ...tokenData };
      delete tokenDataCopy.generationOptions;
      return tokenDataCopy;
    });

    this._regenerateColors(true);
  }
}
