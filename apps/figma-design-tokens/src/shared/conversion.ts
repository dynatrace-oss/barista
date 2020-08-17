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

const fontWeightToName = new Map<number, string[]>([
  [100, ['hairline', 'thin']],
  [200, ['ultra light', 'extra light']],
  [300, ['demi', 'light', 'book']],
  [400, ['regular', 'book', 'normal']],
  [500, ['medium']],
  [
    600,
    [
      'demibold',
      'semibold',
      'demi-bold',
      'semi-bold',
      'demi bold',
      'semi bold',
    ],
  ],
  [700, ['bold']],
  [800, ['ultra bold', 'extra bold']],
  [900, ['heavy', 'black']],
]);

/** Converts an HTML color to a normalized color split into components.  */
export function htmlToFigmaColor(
  htmlColor: string,
): { r: number; g: number; b: number } {
  const colorWithoutHash = htmlColor.startsWith('#')
    ? htmlColor.slice(1)
    : htmlColor;
  const intColor = parseInt(colorWithoutHash, 16);

  // tslint:disable: no-bitwise
  const r = ((intColor >> 16) & 255) / 255;
  const g = ((intColor >> 8) & 255) / 255;
  const b = (intColor & 255) / 255;
  // tslint:enable: no-bitwise
  return { r, g, b };
}

/**
 * Attempts to create a figma-friendly color name from a source design token name.
 * The "theme/color-name" syntax causes palettes to be grouped by theme in the UI.
 */
export function designTokenToFigmaColorName(tokenName: string): string {
  const nameWithoutPrefix = tokenName.replace('fluid-color-', '');
  const splitName = nameWithoutPrefix.split('-');
  if (splitName.length < 2) {
    return tokenName;
  }

  const theme = splitName[0];
  const colorName = splitName.slice(1).join('-');

  return `${theme}/${colorName}`;
}

/** Converts CSS sizes for different units to pixels */
export function cssSizeToPixels(cssSize: string): number | undefined {
  const unitAndValue = cssSizeToUnitAndValue(cssSize);
  if (!unitAndValue) {
    return undefined;
  }
  const { value, unit } = unitAndValue;

  // https://developer.mozilla.org/en-US/docs/Learn/CSS/Building_blocks/Values_and_units#Absolute_length_units
  switch (unit) {
    // Absolute units
    case 'px':
      return value;
    case 'cm':
      return centimetersToPixels(value);
    case 'mm':
      return centimetersToPixels(value) * 0.1;
    case 'Q': // Quarter-millimeter
      return centimetersToPixels(value) * 0.1 * 0.25;
    case 'in':
      return inchesToPixels(value);
    case 'pc':
      return inchesToPixels(value) / 6;
    case 'pt':
      return inchesToPixels(value) / 72;

    // Other units
    case 'em':
    case 'rem':
      // Assumes that the root's font size is 16px (browser default)
      return value * 16;
  }

  return undefined;
}

const centimetersToPixels = (centimeterValue: number) =>
  centimeterValue * (96 / 2.54);
const inchesToPixels = (inchValue: number) => inchValue * 96;

/**
 * Converts a CSS line height to a value compatible with Figma.
 * Line heights are special cases of size values since relative
 * sizes are supported here.
 */
export function cssToFigmaLineHeight(
  cssLineHeight: string,
): LineHeight | undefined {
  const unitAndValue = cssSizeToUnitAndValue(cssLineHeight);
  if (!unitAndValue) {
    return undefined;
  }
  const { value, unit } = unitAndValue;

  switch (unit) {
    case '%':
      return {
        unit: 'PERCENT',
        value,
      };
    case 'em':
      return {
        unit: 'PERCENT',
        value: value * 100,
      };
    default:
      return {
        unit: 'PIXELS',
        value: cssSizeToPixels(cssLineHeight) ?? 0,
      };
  }
}

/** Converts a CSS text-transform to a Figma TextCase. */
export function cssToFigmaTextTransform(cssTextTransform: string): TextCase {
  if (!cssTextTransform) {
    return 'ORIGINAL';
  }

  switch (cssTextTransform.toLowerCase()) {
    case 'capitalize':
      return 'TITLE';
    case 'uppercase':
      return 'UPPER';
    case 'lowercase':
      return 'LOWER';
    default:
      return 'ORIGINAL';
  }
}

/**
 * Finds the best match for a Figma font from a CSS font-family.
 * @param fontFamily The CSS font family to search for
 * @param figmaFonts List of available Figma fonts
 */
export function getFirstAvailableFontFromFamily(
  fontFamily: string,
  figmaFonts: Font[],
  fontWeight: string,
): Font | undefined {
  if (!fontFamily) {
    return undefined;
  }

  // Split the font family into parts to search for
  const fontsInFamily = fontFamily
    .split(',')
    .map((fontName) => fontName.trim());

  for (const fontName of fontsInFamily) {
    // Try to find an exact match first
    const figmaFont = findFontByNameAndWeight(
      figmaFonts,
      fontName,
      cssFontWeightToNumber(fontWeight),
    );
    if (figmaFont) {
      return figmaFont;
    }

    // Handle cases like "serif", "sans-serif", etc.
    const fallbackFontNames = getFallbackFonts(fontName);
    for (const fallbackFontName of fallbackFontNames) {
      const figmaFallbackFont = figmaFonts.find(
        (font) => font.fontName.family === fallbackFontName,
      );
      if (figmaFallbackFont) {
        return figmaFallbackFont;
      }
    }
  }

  return undefined;
}

/** Converts a numeric CSS font-weight or special string (e.g. "bold") to a number. */
export function cssFontWeightToNumber(cssFontWeight: string): number {
  const numericWeight = parseInt(cssFontWeight, 10);
  if (numericWeight) {
    return numericWeight;
  }

  if (cssFontWeight === 'bold') {
    return 700;
  }

  return 400;
}

/** @internal Get a font for a specific CSS font weight */
function findFontByNameAndWeight(
  figmaFonts: Font[],
  name: string,
  weight: number,
): Font | undefined {
  const familyFonts = figmaFonts.filter(
    (font) => font.fontName.family === name,
  );
  const findFontWithWeight = (weight: number): Font | undefined =>
    familyFonts.find((font) =>
      fontWeightToName.get(weight)?.includes(font.fontName.style.toLowerCase()),
    );

  const roundedWeight = Math.round(weight * 100) / 100; // Make sure that the weight is a multiple of 100
  let font: Font | undefined;

  // Search for an exact match
  font = findFontWithWeight(roundedWeight);
  if (font) {
    return font;
  }

  if (roundedWeight == 400) {
    // If the desired weight is 400, check 500 first
    font = findFontWithWeight(500);
  } else if (roundedWeight == 500) {
    // If the desired weight is 500, check 400 first
    font = findFontWithWeight(400);
  }
  if (font) {
    return font;
  }

  // If we still haven't found anything, increase the search range until we
  // have a match or go outside the 100-900 range.
  let weightDifference = 100;
  do {
    font = findFontWithWeight(roundedWeight + weightDifference);
    if (!font) {
      font = findFontWithWeight(roundedWeight - weightDifference);
    }
    weightDifference += 100;
  } while (
    !font &&
    roundedWeight + weightDifference >= 100 &&
    roundedWeight + weightDifference <= 900
  );

  // Return the first font in the family or undefined if everything else fails
  return font ?? (familyFonts.length > 0 ? familyFonts[0] : undefined);
}

/** @internal Extracts value and unit from a CSS size */
function cssSizeToUnitAndValue(
  cssSize: string,
): { value: number; unit: string } | undefined {
  if (!cssSize) {
    return undefined;
  }

  const splitSize = cssSize.split(/([A-z]+)/); // Split when the first letter appears
  if (splitSize.length < 2) {
    return undefined;
  }

  const [stringValue, unit] = splitSize;
  const value = parseFloat(stringValue);
  return { value, unit };
}

/** @internal Finds candidates for Figma fonts for generic CSS font names. */
function getFallbackFonts(family: string): string[] {
  // Source: https://www.impressivewebs.com/deeper-look-generic-font-names-css/#what-are-the-default-generic-fonts
  // Prefers the Mac defaults
  switch (family) {
    case 'serif':
      return ['Times', 'Times New Roman'];
    case 'sans-serif':
      return ['Helvetica', 'Arial'];
    case 'monospace':
      return ['Courier', 'Courier New'];
    case 'cursive':
      return ['Apple Chancery', 'Comic Sans MS'];
    case 'fantasy':
      return ['Papyrus', 'Impact'];
    case 'system-ui':
      return ['.SF NS Text', 'Segoe UI'];
    default:
      return [];
  }
}
