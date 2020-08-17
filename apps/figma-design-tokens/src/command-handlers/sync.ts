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

import { setCachedTokens, getCachedTokens } from '../shared/storage';
import {
  htmlToFigmaColor,
  getFirstAvailableFontFromFamily,
  cssSizeToPixels,
  cssToFigmaLineHeight,
  cssToFigmaTextTransform,
  designTokenToFigmaColorName,
} from '../shared/conversion';
import { createWorker, fetchTokens } from '../shared/ipc';

/** Synchronizes design tokens from GitHub. */
export default async function run(): Promise<void> {
  createWorker();

  try {
    await synchronizeTokens(await fetchTokens());
  } catch (error) {
    alert(`An error occured, please check your connection: ${error.message}`);
  }
}

/** @internal  Updates the figma styles to match the newly downloaded design tokens.  */
async function synchronizeTokens(newTokens: TokenStoreModel): Promise<void> {
  const previousTokens = getCachedTokens();
  let deletedTokens: TokenStoreModel | undefined = undefined;
  if (previousTokens) {
    deletedTokens = findDeletedTokens(previousTokens, newTokens);
  }

  setCachedTokens(newTokens);

  await applyPalettes(newTokens.palettes);
  await applyTypography(newTokens.typography);

  if (deletedTokens) {
    const deletedTokenNames = Object.keys({
      ...deletedTokens.palettes,
      ...deletedTokens.typography,
    });

    if (deletedTokenNames.length > 0) {
      await markDeletedPalettes(deletedTokens.palettes);
      await markDeletedTypography(deletedTokens.typography);

      alert(
        `${
          deletedTokenNames.length
        } tokens were deleted:\n${deletedTokenNames.join(', ')} ` +
          '\n\nDeleted colors have been marked with pink and yellow gradients.' +
          '\nDeleted typography tokens have been marked with Comic Sans MS.',
      );
    }
  }
}

/** @internal Updates the paint styles in the document to match color tokens */
async function applyPalettes(palettes: DesignTokenMap): Promise<void> {
  const paintStyles = figma.getLocalPaintStyles();

  for (const [name, palette] of Object.entries(palettes)) {
    const targetName = designTokenToFigmaColorName(name);
    let paintStyle = paintStyles.find((style) => style.name === targetName);
    if (!paintStyle) {
      paintStyle = figma.createPaintStyle();
      paintStyle.name = targetName;
    }

    paintStyle.description = palette.meta?.friendlyName ?? '';

    paintStyle.paints = [
      { type: 'SOLID', color: htmlToFigmaColor(palette.value as string) },
    ];
  }
}

/** @internal Updates the text styles in the document to match typography tokens */
async function applyTypography(
  typographyTokens: DesignTokenMap,
): Promise<void> {
  const textStyles = figma.getLocalTextStyles();
  const fonts = await figma.listAvailableFontsAsync();

  const loadedFonts = new Set<string>();

  for (const [name, typeSettings] of Object.entries(typographyTokens)) {
    let textStyle = textStyles.find((style) => style.name === name);
    if (!textStyle) {
      textStyle = figma.createTextStyle();
      textStyle.name = name;
    }

    textStyle.description = typeSettings.comment ?? '';

    const {
      fontFamily,
      fontSize,
      fontWeight,
      lineHeight,
      textTransform,
    } = typeSettings.value as any;

    const font = getFirstAvailableFontFromFamily(fontFamily, fonts, fontWeight);
    if (font) {
      const fontKey = `${font.fontName.family} ${font.fontName.style}`;
      if (!loadedFonts.has(fontKey)) {
        // Figma requires fonts to be loaded before accessing some properties
        await figma.loadFontAsync(font.fontName);

        // Save loaded font names for improved performance
        // (see https://www.figma.com/plugin-docs/api/properties/figma-loadfontasync/#remarks)
        loadedFonts.add(fontKey);
      }

      textStyle.fontName = font.fontName;
    }

    // The Figma defaults are used if the conversion fails
    textStyle.fontSize = cssSizeToPixels(fontSize) ?? textStyle.fontSize;
    textStyle.lineHeight =
      cssToFigmaLineHeight(lineHeight) ?? textStyle.lineHeight;
    textStyle.textCase =
      cssToFigmaTextTransform(textTransform) ?? textStyle.textCase;
  }
}

/** @internal Find deleted tokens by comparing the old and new state */
function findDeletedTokens(
  oldState: TokenStoreModel,
  newState: TokenStoreModel,
): TokenStoreModel {
  const missingTokenModel = {} as TokenStoreModel;

  for (const [type, tokens] of Object.entries(newState)) {
    const newTokenNames = new Set(Object.keys(tokens));
    const missingTokens: DesignToken[] = [];

    for (const [name, token] of Object.entries(oldState[type])) {
      if (!newTokenNames.has(name)) {
        missingTokens.push(token);
      }
    }

    // Create a TokenStoreModel with the missing tokens per type
    missingTokenModel[type] = missingTokens.reduce(
      (acc: DesignTokenMap, curr) => {
        acc[curr.name] = curr;
        return acc;
      },
      {},
    );
  }
  return missingTokenModel;
}

/**
 * @internal
 * Replaces colors that have been deleted in the design tokens with
 * a conspicuous gradient.
 */
async function markDeletedPalettes(
  deletedPalettes: DesignTokenMap,
): Promise<void> {
  const paintStyles = figma.getLocalPaintStyles();

  for (const name of Object.keys(deletedPalettes)) {
    const targetName = designTokenToFigmaColorName(name);
    let paintStyle = paintStyles.find((style) => style.name === targetName);
    if (!paintStyle) {
      continue;
    }

    const gradientAngle = (45 * Math.PI) / 180; // 45° in radians
    const pink = { r: 1, g: 0, b: 0.5, a: 1 };
    const yellow = { r: 1, g: 1, b: 0, a: 1 };
    paintStyle.paints = [
      {
        type: 'GRADIENT_LINEAR',
        gradientTransform: [
          // Rotation matrix
          [Math.cos(gradientAngle), Math.sin(gradientAngle), 0],
          [-Math.sin(gradientAngle), Math.cos(gradientAngle), 0],
        ],
        gradientStops: [
          { position: 0, color: pink },
          { position: 0.25, color: yellow },
          { position: 0.5, color: pink },
          { position: 0.75, color: yellow },
          { position: 1, color: pink },
        ],
      },
    ];
  }
}

/**
 * @internal
 * Replaces typography styles that have been deleted in the design tokens
 * with a conspicuous font.
 */
async function markDeletedTypography(
  deletedTypographyTokens: DesignTokenMap,
): Promise<void> {
  const tokenNames = Object.keys(deletedTypographyTokens);
  if (tokenNames.length <= 0) {
    return;
  }

  const textStyles = figma.getLocalTextStyles();
  const comicSans = { family: 'Comic Sans MS', style: 'Bold' };
  await figma.loadFontAsync(comicSans);

  for (const name of Object.keys(deletedTypographyTokens)) {
    let textStyle = textStyles.find((style) => style.name === name);
    if (!textStyle) {
      continue;
    }

    textStyle.fontName = comicSans;
  }
}
