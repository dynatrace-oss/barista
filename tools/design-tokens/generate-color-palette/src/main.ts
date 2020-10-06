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

import { readFileSync, writeFileSync } from 'fs';
import { parse, stringify } from 'yaml';
import { generatePaletteAliases } from './palette-alias-generator';
import { generateHeaderNoticeComment } from '../../shared/src/utils';
import { options } from 'yargs';

/**
 * This is a temporary solution until we can replace theo with
 * our own generator that would be able to do this on the fly.
 */
export function main(): void {
  const { colorFile, out } = options({
    colorFile: { type: 'string' },
    out: { type: 'string' },
  }).argv;

  const colorFileContents = readFileSync(colorFile!, {
    encoding: 'utf-8',
  });
  const paletteSource = parse(colorFileContents);
  const aliases = generatePaletteAliases(paletteSource);
  const paletteOutput = stringify(aliases);
  writeFileSync(
    out!,
    `${generateHeaderNoticeComment('#', '#', '#')}\n${paletteOutput}`,
  );
}

main();
