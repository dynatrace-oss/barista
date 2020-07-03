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

import { DesignTokenSource } from '../../interfaces/design-token-source';

/**
 * Generates a config object for tailwinds font family configuration.
 * Font family alias definitions are stored as comma separated values
 * in the yaml file with their own key for sans-serif, serif and monospaced.
 */
export function generateFontFamilies(
  fontAliasSource: DesignTokenSource,
): { [key: string]: string } {
  return {
    sans: fontAliasSource
      .aliases!['font-family-sans-serif'].split(',')
      .map((el) => el.trim()),
    serif: fontAliasSource
      .aliases!['font-family-serif'].split(',')
      .map((el) => el.trim()),
    mono: fontAliasSource
      .aliases!['font-family-monospaced'].split(',')
      .map((el) => el.trim()),
  };
}

/** Generates a config object for tailwinds font size configuration. */
export function generateFontSize(
  typographyAliasSource: DesignTokenSource,
): { [key: string]: string } {
  const fontSizeConfig = {};
  for (const [typoAliasName, typoAliasValue] of Object.entries(
    typographyAliasSource.aliases!,
  )) {
    // Font size aliases look like this `typography--font-size-4xl` when coming in from
    // the alias yaml file.
    if (typoAliasName.includes('font-size')) {
      // Get the correct sizing name from the alias name
      // If there is no name left, it is the default value, which needs to be `base`
      // for the tailwind config.
      // Transforming `typography--font-size-4xl` to `4xl`.
      const transformedName =
        typoAliasName.replace(/typography--font-size-?/, '') || 'base';
      fontSizeConfig[transformedName] = typoAliasValue;
    }
  }
  return fontSizeConfig;
}

/** Generates a config object for tailwinds font weight configuration. */
export function generateFontWeight(
  typographyAliasSource: DesignTokenSource,
): { [key: string]: string } {
  const fontWeightConfig = {};
  for (const [typoAliasName, typoAliasValue] of Object.entries(
    typographyAliasSource.aliases!,
  )) {
    // Font weight aliases look like this `typography--emphasis-regular` when coming in from
    // the alias yaml file.
    if (typoAliasName.includes('emphasis')) {
      // Get the correct fontweight naming from the alias name,
      // transforming it from `typography--emphasis-regular` to `regular`
      const transformedName = typoAliasName.replace(
        'typography--emphasis-',
        '',
      );
      fontWeightConfig[transformedName] = typoAliasValue;
    }
  }
  return fontWeightConfig;
}

/** Generates a config object for tailwinds font lineHeight configuration. */
export function generateLineHeights(
  typographyAliasSource: DesignTokenSource,
): { [key: string]: string } {
  const lineHeightConfig = {};
  for (const [typoAliasName, typoAliasValue] of Object.entries(
    typographyAliasSource.aliases!,
  )) {
    // Line height aliases look like this `typography--line-height-4xl` when coming in from
    // the alias yaml file.
    if (typoAliasName.includes('line-height')) {
      // Get the correct line heights name from the alias name
      // If there is no name left, it is the default value, which needs to be `base`
      // for the tailwind config.
      // Transforming it from `typography--line-height-4xl` to `4xl`
      const transformedName =
        typoAliasName.replace(/typography--line-height-?/, '') || 'base';
      lineHeightConfig[transformedName] = typoAliasValue;
    }
  }
  return lineHeightConfig;
}
