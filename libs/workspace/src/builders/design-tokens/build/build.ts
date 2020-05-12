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

import { BuilderContext, BuilderOutput } from '@angular-devkit/architect';
import { promises as fs } from 'fs';
import { sync as globSync } from 'glob';
import { Volume as memfsVolume } from 'memfs';
import { Volume } from 'memfs/lib/volume';
import { dirname, extname, join, resolve } from 'path';
import { forkJoin, from, Observable, of } from 'rxjs';
import { catchError, map, mapTo, switchMap } from 'rxjs/operators';
import { registerFormat, convert, Format, TransformOptions } from 'theo';
import {
  dtDesignTokensScssConverter,
  dtDesignTokensTypescriptConverter,
} from './token-converters';
import { DesignTokensBuildOptions } from './schema';
import { parse, stringify } from 'yaml';
import { generatePaletteAliases } from './palette-generators/palette-alias-generator';
import { typescriptBarrelFileTemplate } from './token-converters/ts-barrel-file-template';
import { generateHeaderNoticeComment } from './generate-header-notice-comment';

/** Extend the deault provided theo formats with onces that we provide. */
type DtTheoFormats = Format | 'dt-scss' | 'typescript';

/** Simple representation of a design token file. */
interface DesignTokenFile {
  path: string;
  content: string;
}

registerFormat('dt-scss', dtDesignTokensScssConverter);
registerFormat('typescript', dtDesignTokensTypescriptConverter);

/**
 * This is a temporary solution until we can replace theo with
 * our own generator that would be able to do this on the fly.
 */
function generateColorPalette(cwd: string): Observable<void> {
  const colorFile = globSync('**/palette-source.alias.yml', { cwd })[0];
  return from(fs.readFile(join(cwd, colorFile), { encoding: 'utf-8' })).pipe(
    map((paletteSource: string) => parse(paletteSource)),
    map((paletteSource) => generatePaletteAliases(paletteSource)),
    map((paletteTarget) => stringify(paletteTarget)),
    switchMap((paletteOutput) =>
      fs.writeFile(
        join(cwd, colorFile.replace('-source', '')),
        `${generateHeaderNoticeComment('#', '#', '#')}${paletteOutput}`,
      ),
    ),
  );
}

/**
 * Globs over all entrypoint patterns, finds the files that should be processed.
 * @param entrypoints - Globbing pattern of all entry points.
 * @param cwd - Relative directory that is used as a root for the globbing patterns.
 */
function readSourceFiles(
  entrypoints: string[],
  cwd: string,
): Observable<string[]> {
  const entrypointFiles: string[] = [];
  for (const globPattern of entrypoints) {
    entrypointFiles.push(...globSync(globPattern, { cwd }));
  }
  return of(entrypointFiles);
}

/** Run the conversion for a single file through the theo converter. */
function runTokenConversion(
  file: string,
  baseDirectory: string,
  formatType: DtTheoFormats,
  outfileExtension: string,
): Observable<DesignTokenFile> {
  const outputFilename = file.replace(extname(file), `.${outfileExtension}`);
  const conversion = convert({
    transform: {
      type: 'web',
      includeMeta: true,
      file: join(baseDirectory, file),
    } as TransformOptions,
    // need to cast this one here, because includeMeta
    // is not in the theo types.
    format: {
      type: formatType as Format,
    },
  });
  return from(conversion).pipe(
    map((convertedResult: string) => ({
      content: convertedResult,
      path: outputFilename,
    })),
  );
}

/**
 * Runs all the entryfiles through all defined conversions
 * and returns a memoryFS volume with all converted files.
 */
export function designTokenConversion(
  options: DesignTokensBuildOptions,
  entryFiles: string[],
): Observable<Volume> {
  const conversions: Observable<DesignTokenFile>[] = [];
  // Create conversion observables for all entry files and all formats.
  for (const file of entryFiles) {
    conversions.push(
      runTokenConversion(file, options.baseDirectory, 'dt-scss', 'scss'),
      runTokenConversion(file, options.baseDirectory, 'typescript', 'ts'),
    );
  }
  return forkJoin(conversions).pipe(
    map((results) => {
      const volumeContent = results.reduce((aggregator, file) => {
        aggregator[file.path] = file.content;
        return aggregator;
      }, {});
      return memfsVolume.fromJSON(volumeContent, options.outputPath);
    }),
  );
}

/** Generate an index.ts barrel file that exports all design tokens. */
export function generateTypescriptBarrelFile(
  options: DesignTokensBuildOptions,
  volume: Volume,
): Volume {
  const relativeImportPaths = Object.keys(volume.toJSON())
    .filter((fileName) => extname(fileName) === '.ts')
    .map((fileName) => fileName.replace('.ts', ''))
    .map((fileName) => fileName.replace(resolve(options.outputPath), '.'));
  volume.writeFileSync(
    join(options.outputPath, 'index.ts'),
    typescriptBarrelFileTemplate(relativeImportPaths),
  );

  return volume;
}

/** Write all files within the memfs to the real file system. */
async function commitVolumeToFileSystem(memoryVolume: Volume): Promise<void> {
  for (const [path, content] of Object.entries(memoryVolume.toJSON())) {
    const containingFolder = dirname(path);
    await fs.mkdir(containingFolder, { recursive: true });
    await fs.writeFile(path, content);
  }
}

/**
 * Main builder for design tokens. Runs all entry points through the theo
 * conversion and outputs them to the dist folder.
 */
export function designTokensBuildBuilder(
  options: DesignTokensBuildOptions,
  context: BuilderContext,
): Observable<BuilderOutput> {
  // Start by reading the palette source file and generating
  // the color palette based on its input

  // Start of by reading the required source entry files.
  return generateColorPalette(
    join(context.workspaceRoot, options.baseDirectory),
  ).pipe(
    switchMap(() =>
      readSourceFiles(
        options.entrypoints || [],
        join(context.workspaceRoot, options.baseDirectory),
      ),
    ),
    switchMap((entryFiles: string[]) =>
      designTokenConversion(options, entryFiles),
    ),
    map((memoryVolume) => generateTypescriptBarrelFile(options, memoryVolume)),
    switchMap((memoryVolume) => commitVolumeToFileSystem(memoryVolume)),
    mapTo({
      success: true,
    }),
    catchError((error: Error) => {
      context.logger.error(error.stack!);
      return of({
        success: false,
      });
    }),
  );
}
