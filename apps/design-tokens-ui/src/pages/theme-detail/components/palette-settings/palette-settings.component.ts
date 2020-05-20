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
import { Observable, Subject } from 'rxjs';
import { takeUntil, map, debounceTime, shareReplay } from 'rxjs/operators';

import { Palette } from '@dynatrace/design-tokens-ui/shared';
import { PaletteSourceService } from '../../../../services/palette';
import {
  FluidPaletteGenerationOptions,
  FluidPaletteSourceAlias,
  FluidPaletteColorspace,
} from '@dynatrace/shared/design-system/interfaces';
import { ColorPickerComponent } from '../color-picker/color-picker.component';

@Component({
  selector: 'design-tokens-ui-palette-settings',
  templateUrl: './palette-settings.component.html',
  styleUrls: ['../../shared-settings-styles.scss'],
})
export class PaletteSettingsComponent implements AfterViewInit, OnDestroy {
  @ViewChild('keyColorPicker') keyColorPicker: ColorPickerComponent;

  /** @internal Returns the current palette */
  _palette$: Observable<Palette | undefined>;

  /** @internal Returns the current palette's key color */
  _keyColor$: Observable<string | undefined>;

  /** @internal Returns the current palette's generation options */
  _generationOptions$: Observable<FluidPaletteGenerationOptions | undefined>;

  private _destroy$ = new Subject<void>();

  constructor(private _paletteSourceService: PaletteSourceService) {
    this._palette$ = _paletteSourceService.palette$.pipe(shareReplay());

    this._keyColor$ = this._paletteSourceService.keyColor$;

    this._generationOptions$ = this._palette$.pipe(
      map((palette) => palette?.tokenData.generationOptions),
    );
  }

  ngAfterViewInit(): void {
    // Listen to the event manually since change detection makes Chrome's color picker very unresponsive
    this.keyColorPicker.colorChange
      .pipe(debounceTime(150), takeUntil(this._destroy$))
      .subscribe((color) => {
        this._keyColor = color;
      });
  }

  ngOnDestroy(): void {
    this._destroy$.next();
    this._destroy$.complete();
  }

  /** @internal Adds or removes custom generation options to a palette */
  _setGenerationOptionsEnabled(enable: boolean): void {
    this._paletteSourceService.setPaletteGenerationOptionsEnabled(enable);
  }

  /** @internal Sets the key color of the current palette */
  set _keyColor(color: string) {
    this._modifyPaletteTokenData((tokenData) => ({
      ...tokenData,
      keyColor: color,
    }));
  }

  /** @internal Sets the color space of the current palette */
  set _colorspace(colorspace: FluidPaletteColorspace) {
    this._modifyPaletteTokenData((tokenData) => ({
      ...tokenData,
      colorspace,
    }));
  }

  /** @internal Sets the generation options of the current palette */
  set _generationOptions(newOptions: FluidPaletteGenerationOptions) {
    this._modifyPaletteTokenData((tokenData) => ({
      ...tokenData,
      generationOptions: newOptions,
    }));
  }

  private _modifyPaletteTokenData(
    changeFn: (tokenData: FluidPaletteSourceAlias) => FluidPaletteSourceAlias,
  ): void {
    this._paletteSourceService.modifyCurrentPalette((palette) => ({
      ...palette,
      tokenData: changeFn(palette.tokenData),
    }));
  }
}
