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
import { promises as fs, readFileSync } from 'fs';
import { Volume as memfsVolume } from 'memfs';
import { Volume } from 'memfs/lib/volume';
import { dirname, extname, join } from 'path';
import { forkJoin, from, Observable, of } from 'rxjs';
import { catchError, map, mapTo, switchMap } from 'rxjs/operators';
import { registerFormat, convert, Format, TransformOptions } from 'theo';
import {
  dtDesignTokensScssConverter,
  dtDesignTokensTypescriptConverter,
  dtDesignTokensScssThemeConverter,
  dtDesignTokensTypescriptThemeConverter,
  dtDesignTokensScssTypographyConverter,
  dtDesignTokensCssTypographyConverter,
  dtDesignTokensCssSpacingConverter,
  dtDesignTokensJavascriptConverter,
  dtDesignTokensTypescriptTypographyConverter,
} from './token-converters';
import { DesignTokensBuildOptions } from './schema';
import { parse } from 'yaml';
import {
  DesignTokenSource,
  DesignTokenFormatters,
} from '../interfaces/design-token-source';
import { executeCommand } from '@dynatrace/shared/node';
import {
  generateColorPalette,
  readSourceFiles,
  generateTypescriptBarrelFile,
  generateEcmascriptBarrelFile,
  addAliasMetadataFiles,
} from './utils';
import { dtDesignTokensJavascriptTypographyConverter } from './token-converters/dt-javascript-typography';

/** Simple representation of a design token file. */
interface DesignTokenFile {
  path: string;
  content: string;
}

registerFormat('dt-scss', dtDesignTokensScssConverter);
registerFormat('dt-scss-typography', dtDesignTokensScssTypographyConverter);
registerFormat('dt-scss-theme', dtDesignTokensScssThemeConverter);
registerFormat('dt-css-typography', dtDesignTokensCssTypographyConverter);
registerFormat('dt-css-spacing', dtDesignTokensCssSpacingConverter);
registerFormat('dt-typescript', dtDesignTokensTypescriptConverter);
registerFormat('dt-typescript-theme', dtDesignTokensTypescriptThemeConverter);
registerFormat(
  'dt-typescript-typography',
  dtDesignTokensTypescriptTypographyConverter,
);
registerFormat('dt-javascript', dtDesignTokensJavascriptConverter);
registerFormat(
  'dt-javascript-typography',
  dtDesignTokensJavascriptTypographyConverter,
);

/** Run the conversion for a single file through the theo converter. */
function runTokenConversion(
  file: string,
  baseDirectory: string,
  formatType: DesignTokenFormatters,
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
    const fileSource = readFileSync(join(options.baseDirectory, file), {
      encoding: 'utf-8',
    });
    const yamlFileSource: DesignTokenSource = parse(fileSource);
    // Add the conversion for evey defined output in the source yaml file.
    for (const output of yamlFileSource.outputs ?? []) {
      conversions.push(
        runTokenConversion(
          file,
          options.baseDirectory,
          output.formatter,
          output.type,
        ),
      );
    }
    conversions.push(
      runTokenConversion(file, options.baseDirectory, 'raw.json', 'json'),
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
    map((memoryVolume) => generateEcmascriptBarrelFile(options, memoryVolume)),
    switchMap((memoryVolume) =>
      addAliasMetadataFiles(
        join(context.workspaceRoot, options.baseDirectory),
        options,
        memoryVolume,
      ),
    ),
    switchMap((memoryVolume) => commitVolumeToFileSystem(memoryVolume)),
    switchMap(() => executeCommand('npm run format:write')),
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
