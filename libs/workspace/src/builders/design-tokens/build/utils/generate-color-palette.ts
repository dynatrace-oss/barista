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

import { promises as fs } from 'fs';
import { sync as globSync } from 'glob';
import { join } from 'path';
import { from, Observable } from 'rxjs';
import { map, switchMap } from 'rxjs/operators';
import { parse, stringify } from 'yaml';
import { generatePaletteAliases } from '../palette-generators/palette-alias-generator';
import { generateHeaderNoticeComment } from './generate-header-notice-comment';
/**
 * This is a temporary solution until we can replace theo with
 * our own generator that would be able to do this on the fly.
 */
export function generateColorPalette(cwd: string): Observable<void> {
  const colorFile = globSync('**/palette-source.alias.yml', { cwd })[0];
  return from(fs.readFile(join(cwd, colorFile), { encoding: 'utf-8' })).pipe(
    map((paletteSource: string) => parse(paletteSource)),
    map((paletteSource) => generatePaletteAliases(paletteSource)),
    map((paletteTarget) => stringify(paletteTarget)),
    switchMap((paletteOutput) =>
      fs.writeFile(
        join(cwd, colorFile.replace('-source', '')),
        `${generateHeaderNoticeComment('#', '#', '#')}\n${paletteOutput}`,
      ),
    ),
  );
}
