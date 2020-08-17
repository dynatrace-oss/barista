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

const themeMappings: { [key: string]: string } = {
  Light: 'surface',
  Dark: 'abyss',
};

const paletteMappings: { [key: string]: string } = {
  Orange: 'nasty-orange',
  Pink: 'hot-pink',
  Turquoise: 'soylent-green',
  Purple: 'naughty-purple',
};

const baseColorMappings: { [key: string]: string } = {
  Base: 'background',
  Text: 'maxcontrast',
};

/**
 * Automatically migrates color styles with another naming convention
 * (e.g. Dark/Purple) to one compatible with design tokens (e.g. abyss/naughty-purple).
 */
export default async function run(): Promise<void> {
  for (const style of figma.getLocalPaintStyles()) {
    const themeAndName = style.name.split('/');
    if (themeAndName.length !== 2) {
      continue;
    }

    const [theme, colorName] = themeAndName;
    const [paletteOrBaseColor, shade] = colorName.split('-');
    if (!paletteOrBaseColor) {
      continue;
    }

    const newThemeName = themeMappings[theme];
    if (!newThemeName) {
      continue;
    }

    if (shade) {
      // The color is a "normal" palette color
      const newPaletteName =
        paletteMappings[paletteOrBaseColor] || paletteOrBaseColor.toLowerCase();
      style.name = `${newThemeName}/${newPaletteName}-${shade}`;
    } else {
      // The color is a base color
      const newBaseColorName = baseColorMappings[paletteOrBaseColor];
      if (!newBaseColorName) {
        continue;
      }

      style.name = `${newThemeName}/${newBaseColorName}`;
    }
  }
}
