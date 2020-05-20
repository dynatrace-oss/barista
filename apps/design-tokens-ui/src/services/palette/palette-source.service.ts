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

import { Injectable } from '@angular/core';
import { cloneDeep, flatMap, isEqual } from 'lodash-es';
import { BehaviorSubject, Observable, combineLatest } from 'rxjs';
import { map, take, first } from 'rxjs/operators';
import { stringify } from 'yaml';

import * as paletteSource from '@dynatrace/fluid-design-tokens-meta/aliases/palette-source.alias';
import { THEMES } from '@dynatrace/fluid-design-tokens';
import {
  FluidPaletteSourceAlias,
  FluidPaletteSource,
  FluidPaletteGenerationOptions,
} from '@dynatrace/shared/barista-definitions';
import {
  Theme,
  Palette,
  easeWithOptions,
  remapRange,
} from '@dynatrace/design-tokens-ui/shared';
import { StyleOverridesService } from '../style-overrides';
import { StateSnapshotStack } from '../../utils/state-snapshot-stack';
import { generatePaletteContrastColors } from '../../utils/colors';

const YAML_FILE_NAME = 'palette-source.alias.yml';

interface State {
  themes: Theme[];
}

@Injectable()
export class PaletteSourceService {
  private _stateSnapshots: StateSnapshotStack<State>;

  state$ = new BehaviorSubject<State>({ themes: [] });

  themes$ = this.state$.pipe(map((state) => state.themes));

  constructor(private _styleOverridesService: StyleOverridesService) {
    // Deep copy the palette source to avoid mutating the imported object
    const palettes = cloneDeep(
      (paletteSource as any).default,
    ) as FluidPaletteSource;
    const themeNames = Object.keys(THEMES).map((uppercaseName) =>
      uppercaseName.toLowerCase(),
    );

    const initialState = {
      themes: themeNames.map((themeName) => ({
        name: themeName,
        globalGenerationOptions: palettes.meta
          ? palettes.meta[themeName]?.generationOptions
          : undefined,
        palettes: palettes.aliases
          .filter((palette) => palette.theme === themeName)
          .map((palette) => ({
            name: palette.name,
            tokenData: {
              ...palette,
              generationOptions: palette.generationOptions?.globalType
                ? undefined
                : palette.generationOptions,
            },
            generatedColors: [],
          })),
      })),
    };

    this.setState(initialState);
    this._stateSnapshots = new StateSnapshotStack(this.state$);

    // Show a warning message if there are unsaved changes when closing the page
    window.addEventListener('beforeunload', (event) => {
      if (this.hasPendingChanges) {
        event.preventDefault();
        event.returnValue = ''; // Required for some browsers
      }
    });
  }

  /**
   * Overwrites the current state
   */
  setState(newState: State): void {
    if (!isEqual(newState, this.state$.getValue())) {
      this.state$.next(newState);
    }
  }

  /**
   * Records the current state to be able to restore it later
   */
  pushState(): void {
    this._stateSnapshots.pushState();
  }

  /**
   * Saves changes to the edited theme
   */
  applyChanges(): void {
    this._stateSnapshots.commitState();
  }

  /**
   * Restores the last saved state
   * @see PaletteSourceService#pushState
   */
  revertChanges(): void {
    this._stateSnapshots.revertState();
  }

  /**
   * Whether the current state has pending changes
   */
  get hasPendingChanges(): boolean {
    // To check for changes between the current and the saved state,
    // we need to get rid of the generated colors in the palettes since
    // they are lazily generated when displaying the page
    return this._stateSnapshots.checkStateModified((state) => ({
      ...state,
      themes: state.themes.map((theme) => ({
        ...theme,
        palettes: theme.palettes.map((palette) => ({
          name: palette.name,
          tokenData: palette.tokenData,
        })),
      })),
    }));
  }

  /**
   * Returns an observable with a theme from the state
   * @param name The name of the theme that should be retrieved
   */
  getTheme(name: string): Observable<Theme | undefined> {
    return this.themes$.pipe(
      map((themes) => themes.find((theme) => theme.name === name)),
    );
  }

  /**
   * Returns an observable with a palette from the state
   * @param themeName The name of the theme that contains the target palette
   * @param paletteName The name of the palette that should be retrieved from the state
   */
  getPalette(
    themeName: string,
    paletteName: string,
  ): Observable<Palette | undefined> {
    return this.getTheme(themeName).pipe(
      map((theme) =>
        theme?.palettes.find((palette) => palette.name === paletteName),
      ),
    );
  }

  /**
   * Helper function for modifying a theme in the current state
   * @param themeName The name of the theme that should be modified
   * @param changeFn A function that takes the theme as an argument and returns a new theme object
   */
  modifyTheme(themeName: string, changeFn: (theme: Theme) => Theme): void {
    const state = this.state$.getValue();
    this.state$.next({
      ...state,
      themes: [
        ...state.themes.map((theme) =>
          theme.name === themeName ? changeFn(theme) : theme,
        ),
      ],
    });
  }

  /**
   * Helper function for modifying a palette in the current state
   * @param themeName The name of the theme that contains the target palette
   * @param paletteName The name of the palette that should be modified
   * @param changeFn A function that takes the palette as an argument and returns a new palette object
   */
  modifyPalette(
    themeName: string,
    paletteName: string,
    changeFn: (palette: Palette) => Palette,
  ): void {
    this.modifyTheme(themeName, (theme) => ({
      ...theme,
      palettes: [
        ...theme.palettes.map((palette) =>
          palette.name === paletteName ? changeFn(palette) : palette,
        ),
      ],
    }));
  }

  /**
   * Generates palette colors from palette shades of a given palette
   * @param themeName The name of the theme that contains the target palette
   * @param paletteName The name of the palette to generate colors for
   * @param recalculateDistributions Whether the contrast distribution values should also be recalculated
   */
  async regeneratePaletteColors(
    themeName: string,
    paletteName: string,
    recalculateDistributions: boolean,
  ): Promise<void> {
    const [currentPalette, currentTheme] = await combineLatest(
      this.getPalette(themeName, paletteName),
      this.getTheme(themeName),
    )
      .pipe(take(1))
      .toPromise();

    if (!currentPalette || !currentTheme) return;

    let tokenData = { ...currentPalette.tokenData };
    if (recalculateDistributions) {
      const distributions = await this.calculateDistributions(
        currentPalette,
        currentPalette.tokenData.generationOptions! ??
          currentTheme.globalGenerationOptions,
      );
      tokenData.shades = tokenData.shades.map((shade, index) => ({
        ...shade,
        ratio: distributions[index],
      }));
    }

    this.modifyPalette(themeName, paletteName, (palette) => ({
      ...palette,
      generatedColors: generatePaletteContrastColors(tokenData),
      tokenData,
    }));
  }

  /** Recalculates the shade distributions for the provided palette using the provided generation options */
  async calculateDistributions(
    palette: Palette,
    generationOptions: FluidPaletteGenerationOptions,
  ): Promise<number[]> {
    const { baseContrast, minContrast, maxContrast } = generationOptions;
    const distributionCount = palette.tokenData.shades.length;

    return new Array(distributionCount)
      .fill(0)
      .map((_, index) => index / (distributionCount - 1)) // Normalized distribution
      .map((normDistribution) =>
        easeWithOptions(normDistribution, generationOptions),
      ) // Apply easing to distribution
      .map((distributionWithEasing) =>
        distributionWithEasing < 0.5
          ? remapRange(
              0,
              0.5,
              minContrast,
              baseContrast,
              distributionWithEasing,
            )
          : remapRange(
              0.5,
              1,
              baseContrast,
              maxContrast,
              distributionWithEasing,
            ),
      ) // Distribution value in [min, max] range. The base contrast is in the middle.
      .map((value) => Math.round(value * 100) / 100); // Round to two digits
  }

  /** Applies the theme's palettes to the UI */
  async overrideStylesForThemePalettes(themeName: string): Promise<void> {
    const theme = await this.getTheme(themeName).pipe(first()).toPromise();
    if (!theme) return;

    for (const palette of theme.palettes) {
      for (let i = 0; i < palette.tokenData.shades.length; i++) {
        const shade = palette.tokenData.shades[i];
        const generatedColor = palette.generatedColors[i];
        const colorPropName = shade.aliasName.replace(
          `color-${theme.name}-`,
          '',
        );

        if (generatedColor) {
          this._styleOverridesService.addColorOverride(
            theme.name,
            colorPropName,
            palette.generatedColors[i],
          );
        } else {
          this._styleOverridesService.removeColorOverride(
            theme.name,
            colorPropName,
          );
        }
      }
    }
  }

  /** Applies the theme base color to the UI as a background color */
  async overrideStylesForThemeBaseColor(themeName: string): Promise<void> {
    const theme = await this.getTheme(themeName).pipe(first()).toPromise();
    if (!theme) return;

    this._styleOverridesService.addColorOverride(
      theme.name,
      'background',
      this.getThemeBaseColor(theme),
    );
  }

  /** Returns the first key color for the given palette */
  getKeyColor(palette: FluidPaletteSourceAlias): string {
    return Array.isArray(palette.keyColor)
      ? palette.keyColor[0]
      : palette.keyColor;
  }

  /** Utility for retrieving a theme's base color from its palettes */
  getThemeBaseColor(theme: Theme): string {
    return theme.palettes.length
      ? theme.palettes[0].tokenData.baseColor
      : '#ffffff';
  }

  /** Exports all palettes as a YAML file */
  async exportYaml(): Promise<void> {
    const themes = await this.themes$.pipe(first()).toPromise();

    const themeGenerationOptions = new Map<
      string,
      FluidPaletteGenerationOptions
    >();
    for (const theme of themes.filter(() => theme.globalGenerationOptions)) {
      themeGenerationOptions.set(theme.name, {
        ...theme.globalGenerationOptions,
        globalType: true,
      } as FluidPaletteGenerationOptions);
    }

    const meta = themes
      .filter((filter) => filter.globalGenerationOptions)
      .reduce((object, theme) => {
        object[theme.name] = {
          generationOptions: themeGenerationOptions.get(theme.name),
        };
        return object;
      }, {});

    const aliases = flatMap(themes, (theme) =>
      theme.palettes.map((palette) => [palette, theme]),
    ).map(([palette, theme]: [Palette, Theme]) => ({
      ...palette.tokenData,

      // Reference the theme's generation options if they're not overwritten
      generationOptions: palette.tokenData.generationOptions
        ? palette.tokenData.generationOptions
        : themeGenerationOptions.get(theme.name),
    }));

    const yaml = stringify({
      meta,
      aliases,
    });

    const element = document.createElement('a');
    element.setAttribute(
      'href',
      `data:text/plain;charset=utf-8,${encodeURIComponent(yaml)}`,
    );
    element.setAttribute('download', YAML_FILE_NAME);

    element.style.display = 'none';
    document.body.appendChild(element);

    element.click();

    document.body.removeChild(element);
  }
}
