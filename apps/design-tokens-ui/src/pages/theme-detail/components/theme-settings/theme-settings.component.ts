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
import { Subject, Observable } from 'rxjs';
import {
  takeUntil,
  switchMap,
  filter,
  tap,
  map,
  debounceTime,
} from 'rxjs/operators';

import { FluidPaletteGenerationOptions } from '@dynatrace/shared/barista-definitions';
import { Theme } from '@dynatrace/design-tokens-ui/shared';
import { PaletteSourceService } from '../../../../services/palette';
import { StyleOverridesService } from '../../../../services/style-overrides';
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
  _theme$: Observable<Theme>;

  /** @internal Generation options of the current theme */
  _globalGenerationOptions$: Observable<
    FluidPaletteGenerationOptions | undefined
  >;

  /** @internal Returns the current theme's base color */
  _baseColor$: Observable<string>;

  private _destroy$ = new Subject<void>();

  constructor(
    private _paletteSourceService: PaletteSourceService,
    private _styleOverridesService: StyleOverridesService,
    route: ActivatedRoute,
  ) {
    this._theme$ = route.params.pipe(
      switchMap((params) => _paletteSourceService.getTheme(params.theme)),
      takeUntil(this._destroy$),
      filter(Boolean),
      tap((theme: Theme) => {
        this._themeName = theme.name;
      }),
    );

    this._globalGenerationOptions$ = this._theme$.pipe(
      map((theme) => theme.globalGenerationOptions),
    );

    this._baseColor$ = this._theme$.pipe(
      map((theme) => this._paletteSourceService.getThemeBaseColor(theme)),
    );
  }

  ngAfterViewInit(): void {
    // Listen to the event manually since change detection makes Chrome's color picker very unresponsive
    this.baseColorPicker.colorChange
      .pipe(
        takeUntil(this._destroy$),
        tap((color) =>
          this._styleOverridesService.addColorOverride(
            this._themeName,
            'background',
            color,
          ),
        ),
        debounceTime(250),
      )
      .subscribe((color) => {
        this._baseColor = color;
      });
  }

  ngOnDestroy(): void {
    this._destroy$.next();
    this._destroy$.complete();
  }

  /** @internal Sets the global generation options for the current theme */
  set _globalGenerationOptions(newOptions: FluidPaletteGenerationOptions) {
    this._paletteSourceService.modifyTheme(this._themeName, (theme) => ({
      ...theme,
      globalGenerationOptions: newOptions,
    }));
  }

  /** @internal Sets the base color for the current theme */
  set _baseColor(color: string) {
    // The base color must be saved in all individual palettes
    // due to the way the design token builder works
    this._paletteSourceService.modifyTheme(this._themeName, (theme) => ({
      ...theme,
      palettes: [
        ...theme.palettes.map((palette) => ({
          ...palette,
          tokenData: { ...palette.tokenData, baseColor: color },
        })),
      ],
    }));
  }
}
