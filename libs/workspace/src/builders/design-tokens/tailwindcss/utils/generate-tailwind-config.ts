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
import { parse } from 'yaml';
import { promises as fs } from 'fs';
import { DesignTokenSource } from '../../interfaces/design-token-source';
import { sync } from 'glob';
import { join, basename } from 'path';
import {
  generateBaseColors,
  generateColorGroups,
} from './generate-color-group-config';
import { generateSpacings } from './generate-spacing-config';
import {
  generateFontFamilies,
  generateFontSize,
  generateFontWeight,
  generateLineHeights,
} from './generate-font-config';

/** Reads an alias file and parses the value */
async function readYamlFile(path: string): Promise<DesignTokenSource> {
  const aliasFileContent = await fs.readFile(path, { encoding: 'utf-8' });
  return parse(aliasFileContent) as DesignTokenSource;
}

/**
 * Generate a tailwindcss config based on the design token aliases
 * globbed from the provided directory.
 */
export async function generateTailwindcssConfig(
  baseDirectory: string,
): Promise<any> {
  const aliasPaths = sync('**/*.alias.@(yml|yaml)', { cwd: baseDirectory });

  // Store a map of all aliases to map better.
  const sourceMap = new Map<string, DesignTokenSource>();
  for (const alias of aliasPaths) {
    const aliasSource = await readYamlFile(join(baseDirectory, alias));
    const aliasName = basename(alias).replace('.alias.yml', '');
    sourceMap.set(aliasName, aliasSource);
  }

  // By setting the properties within the tailwinds config to false,
  // we stop tailwind from generating these classes and keeping the
  // css a little smaller.
  return {
    purge: [],
    theme: {
      // Backgrounds
      backgroundColor: (theme) => ({
        transparent: 'transparent',
        ...theme('colors'),
      }),
      backgroundOpacity: (theme) => theme('opacity'),
      backgroundPosition: false,
      backgroundSize: false,

      // Borders
      borderColor: (theme) => ({
        ...theme('colors'),
        default: theme('colors.neutral.100', 'currentColor'),
      }),
      borderOpacity: (theme) => theme('opacity'),

      // Box shadows
      boxShadow: false,

      // Colors
      colors: {
        ...generateBaseColors(sourceMap.get('base-color')!),
        ...generateColorGroups(sourceMap.get('palette')!),
      },

      // Devide configuration
      divideColor: false,
      divideOpacity: false,
      divideWidth: false,

      // Fonts
      fontFamily: generateFontFamilies(sourceMap.get('font')!),
      fontSize: generateFontSize(sourceMap.get('typography')!),
      fontWeight: generateFontWeight(sourceMap.get('typography')!),

      letterSpacing: false,
      lineHeight: generateLineHeights(sourceMap.get('typography')!),

      textColor: (theme) => ({
        ...theme('colors'),
        default: theme('colors.maxcontrast', 'currentcolor'),
      }),

      //Spacings
      spacing: generateSpacings(sourceMap.get('spacing')!),

      // Z index
      zIndex: false,

      // Transforms
      transformOrigin: false,
      scale: false,
      rotate: false,
      translate: false,
      skew: false,

      // Transitions
      transitionProperty: false,
      transitionTimingFunction: false,
      transitionDuration: false,
      transitionDelay: false,
    },
    variants: {},
    plugins: [],
  };
}
