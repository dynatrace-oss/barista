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
import { Subject, Observable } from 'rxjs';
import { takeUntil, map } from 'rxjs/operators';

import { FluidPaletteGenerationOptions } from '@dynatrace/shared/design-system/interfaces';
import { Theme } from '@dynatrace/design-tokens-ui/shared';
import { PaletteSourceService } from '../../../../services/palette';
import { ColorPickerComponent } from '../color-picker/color-picker.component';

@Component({
  selector: 'design-tokens-ui-theme-settings',
  templateUrl: './theme-settings.component.html',
  styleUrls: ['../../shared-settings-styles.scss'],
})
export class ThemeSettingsComponent implements AfterViewInit, OnDestroy {
  @ViewChild('baseColorPicker') baseColorPicker: ColorPickerComponent;

  /** @internal Identifier of the current theme */
  _themeName: string;

  /** @internal Returns the current theme */
  _theme$: Observable<Theme | undefined>;

  /** @internal Generation options of the current theme */
  _globalGenerationOptions$: Observable<
    FluidPaletteGenerationOptions | undefined
  >;

  /** @internal Returns the current theme's base color */
  _baseColor$: Observable<string>;

  private _destroy$ = new Subject<void>();

  constructor(private _paletteSourceService: PaletteSourceService) {
    this._theme$ = _paletteSourceService.theme$;

    this._globalGenerationOptions$ = this._theme$.pipe(
      map((theme) => theme?.globalGenerationOptions),
    );

    this._baseColor$ = _paletteSourceService.themeBaseColor$;
  }

  ngAfterViewInit(): void {
    // Listen to the event manually since change detection makes Chrome's color picker very unresponsive
    this.baseColorPicker.colorChange
      .pipe(takeUntil(this._destroy$))
      .subscribe((color) => {
        this._paletteSourceService.setThemeBaseColor(color);
      });
  }

  ngOnDestroy(): void {
    this._destroy$.next();
    this._destroy$.complete();
  }

  /** @internal Sets the global generation options for the current theme */
  set _globalGenerationOptions(newOptions: FluidPaletteGenerationOptions) {
    this._paletteSourceService.modifyCurrentTheme((theme) => ({
      ...theme,
      globalGenerationOptions: newOptions,
    }));
  }
}
