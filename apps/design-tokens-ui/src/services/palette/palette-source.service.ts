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
import { Router, ParamMap, ActivationStart } from '@angular/router';
import { cloneDeep, flatMap, isEqual, uniq } from 'lodash-es';
import {
  map,
  filter,
  distinctUntilChanged,
  debounceTime,
  share,
} from 'rxjs/operators';
import { stringify } from 'yaml';

import * as paletteSource from '@dynatrace/fluid-design-tokens-meta/aliases/palette-source.alias';
import { THEMES } from '@dynatrace/fluid-design-tokens';
import {
  FluidPaletteSource,
  FluidPaletteGenerationOptions,
} from '@dynatrace/shared/barista-definitions';
import {
  Theme,
  Palette,
  easeWithOptions,
  remapRange,
  DEFAULT_GENERATION_OPTIONS,
} from '@dynatrace/design-tokens-ui/shared';
import { StyleOverridesService } from '../style-overrides';
import { generatePaletteContrastColors } from '../../utils/colors';
import { StatefulServiceBase } from '../stateful-service';
import { downloadStringAsTextFile } from '../../utils/download';

const YAML_FILE_NAME = 'palette-source.alias.yml';

interface State {
  themes: Theme[];
  currentThemeName?: string;
  currentPaletteName?: string;
}

// Selectors
export const getCurrentTheme = (state: State) =>
  state.themes.find((theme) => theme.name === state.currentThemeName);

export const getGlobalGenerationOptions = (theme: Theme | undefined) =>
  theme?.globalGenerationOptions;

export const getCurrentPalette = (state: State) =>
  getCurrentTheme(state)?.palettes.find(
    (palette) => palette.name === state.currentPaletteName,
  );

export const getPaletteGenerationOptions = (palette: Palette | undefined) =>
  palette?.tokenData.generationOptions;

export const getThemeBaseColor = (theme: Theme | undefined) =>
  theme?.palettes && theme.palettes.length > 0
    ? theme.palettes[0].tokenData.baseColor
    : '#ffffff';

export const getKeyColor = (palette: Palette) =>
  Array.isArray(palette.tokenData.keyColor)
    ? palette.tokenData.keyColor[0]
    : palette.tokenData.keyColor;

@Injectable({
  providedIn: 'root',
})
export class PaletteSourceService extends StatefulServiceBase<State> {
  /** Observable with all themes */
  themes$ = this.state$.pipe(map((state) => state.themes));

  /** Observable with the current theme */
  theme$ = this.state$.pipe(map(getCurrentTheme));

  /** Observable with the current theme's base color */
  themeBaseColor$ = this.theme$.pipe(map(getThemeBaseColor));

  /** Observable with the current theme's palette */
  palette$ = this.state$.pipe(map(getCurrentPalette));

  /** Observable with the current palette's key color */
  keyColor$ = this.palette$.pipe(filter(Boolean), map(getKeyColor));

  constructor(
    router: Router,
    private _styleOverridesService: StyleOverridesService,
  ) {
    super();

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

    this.modifyState(() => initialState);

    // Only regenerate all palette colors if relevant properties changed
    this.theme$
      .pipe(
        share(),
        distinctUntilChanged(this._canSkipPaletteGeneration),
        filter<Theme>(Boolean),
        debounceTime(200),
      )
      .subscribe((theme) => {
        for (const palette of theme.palettes) {
          this.regeneratePaletteColors(palette);
        }
        this.overrideStylesForThemePalettes();
      });

    // Regenerate palette on changes
    this.palette$
      .pipe(share(), filter<Palette>(Boolean), debounceTime(200))
      .subscribe((palette) => {
        this.regeneratePaletteColors(palette);
        this.overrideStylesForThemePalettes();
      });

    router.events
      .pipe(
        filter((evt) => evt instanceof ActivationStart),
        map((evt: ActivationStart) => evt.snapshot.paramMap),
      )
      .subscribe((params: ParamMap) => {
        this.modifyState((state) => ({
          ...state,
          currentThemeName: params.get('theme') ?? undefined,
          currentPaletteName: params.get('palette') ?? undefined,
        }));
      });
  }
  /** Restores the last saved state. */
  revertChanges(): void {
    super.revertChanges();

    // Make sure to reset the previous state in the UI
    this.overrideStylesForThemePalettes();
    this.overrideStylesForThemeBaseColor();
  }

  /** Whether the current state has pending changes */
  get hasPendingChanges(): boolean {
    // To check for changes between the current and the saved state,
    // we need to get rid of the generated colors in the palettes since
    // they are lazily generated when displaying the page
    return this.checkStateModified((state) => ({
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
   * Helper function for modifying a theme in the current state
   * @param changeFn A function that takes the theme as an argument and returns a new theme object
   */
  modifyCurrentTheme(changeFn: (theme: Theme) => Theme): void {
    this.modifyState((state) => ({
      ...state,
      themes: [
        ...state.themes.map((theme) =>
          theme.name === state.currentThemeName ? changeFn(theme) : theme,
        ),
      ],
    }));
  }

  /**
   * Helper function for modifying a palette in the current state
   * @param palette The palette that should be modified
   * @param changeFn A function that takes the palette as an argument and returns a new palette object
   */
  modifyPalette(
    palette: Palette,
    changeFn: (palette: Palette) => Palette,
  ): void {
    this.modifyCurrentTheme((theme) => ({
      ...theme,
      palettes: [
        ...theme.palettes.map((p) =>
          p.name === palette.name ? changeFn(palette) : p,
        ),
      ],
    }));
  }

  /**
   * Helper function for modifying a palette in the current theme
   * @param changeFn A function that takes the palette as an argument and returns a new palette object
   */
  modifyCurrentPalette(changeFn: (palette: Palette) => Palette): void {
    const currentPalette = this.selectState(getCurrentPalette)!;
    this.modifyPalette(currentPalette, changeFn);
  }

  /** Creates the global generation options for the current theme. */
  createGlobalGenerationOptions(): void {
    this.modifyCurrentTheme((theme) => ({
      ...theme,
      globalGenerationOptions: { ...DEFAULT_GENERATION_OPTIONS },
    }));
  }

  /** Modifies the base color of the current theme. */
  setThemeBaseColor(color: string): void {
    // The base color must be saved in all individual palettes
    // due to the way the design token builder works
    this.modifyCurrentTheme((theme) => ({
      ...theme,
      palettes: [
        ...theme.palettes.map((palette) => ({
          ...palette,
          tokenData: { ...palette.tokenData, baseColor: color },
        })),
      ],
    }));

    this.overrideStylesForThemeBaseColor();
  }

  setPaletteGenerationOptionsEnabled(enable: boolean): void {
    const state = this.state$.getValue();
    const currentGenerationOptions = getPaletteGenerationOptions(
      getCurrentPalette(state),
    );

    let newGenerationOptions:
      | FluidPaletteGenerationOptions
      | undefined = currentGenerationOptions;
    if (currentGenerationOptions && !enable) {
      newGenerationOptions = undefined;
    } else if (!currentGenerationOptions && enable) {
      const theme = getCurrentTheme(state);
      newGenerationOptions = {
        ...(theme?.globalGenerationOptions ?? DEFAULT_GENERATION_OPTIONS),
      };
    }

    this.modifyCurrentPalette((palette) => ({
      ...palette,
      tokenData: {
        ...palette.tokenData,
        generationOptions: newGenerationOptions,
      },
    }));
  }

  /**
   * Generates palette colors from palette shades of a given palette
   * @param themeName The name of the theme that contains the target palette
   * @param paletteName The name of the palette to generate colors for
   */
  regeneratePaletteColors(palette: Palette): void {
    const currentTheme = this.selectState(getCurrentTheme);
    if (!currentTheme) return;

    let tokenData = { ...palette.tokenData };
    if (currentTheme.globalGenerationOptions) {
      // Distributions can only be recalculated if global or local generation options are set
      const distributions = this.calculateDistributions(
        palette,
        palette.tokenData.generationOptions! ??
          currentTheme.globalGenerationOptions,
      );
      tokenData.shades = tokenData.shades.map((shade, index) => ({
        ...shade,
        ratio: distributions[index],
      }));
    }

    this.modifyPalette(palette, () => ({
      ...palette,
      generatedColors: generatePaletteContrastColors(tokenData),
      tokenData,
    }));
  }

  /** Recalculates the shade distributions for the provided palette using the provided generation options */
  calculateDistributions(
    palette: Palette,
    generationOptions: FluidPaletteGenerationOptions,
  ): number[] {
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
  overrideStylesForThemePalettes(): void {
    const theme = this.selectState(getCurrentTheme);
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
  overrideStylesForThemeBaseColor(): void {
    const theme = this.selectState(getCurrentTheme);
    if (!theme) return;

    this._styleOverridesService.addColorOverride(
      theme.name,
      'background',
      getThemeBaseColor(theme),
    );
  }

  /** Exports all palettes as a YAML file */
  exportYaml(): void {
    const themes = this.selectState((state) => state.themes);

    const themeGenerationOptions = new Map<
      string,
      FluidPaletteGenerationOptions
    >();
    for (const theme of themes.filter((t) => t.globalGenerationOptions)) {
      themeGenerationOptions.set(theme.name, {
        ...theme.globalGenerationOptions,
        globalType: true,
      } as FluidPaletteGenerationOptions);
    }

    const meta = themes
      .filter((theme) => theme.globalGenerationOptions)
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

    downloadStringAsTextFile(YAML_FILE_NAME, yaml);
  }

  private _canSkipPaletteGeneration(prev: Theme, curr: Theme): boolean {
    if (!prev || !curr) {
      return false;
    }

    const distinctBaseColors = (theme: Theme) =>
      uniq(theme.palettes.map((palette) => palette.tokenData.baseColor));

    return (
      prev.globalGenerationOptions === curr.globalGenerationOptions &&
      isEqual(distinctBaseColors(prev), distinctBaseColors(curr))
    );
  }
}
