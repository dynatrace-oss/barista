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

import { promises as fs, readFileSync } from 'fs';
import { Volume as memfsVolume } from 'memfs';
import { Volume } from 'memfs/lib/volume';
import { dirname, extname, join } from 'path';
import { forkJoin, from, Observable } from 'rxjs';
import { map, switchMap } from 'rxjs/operators';
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
import { DesignTokensBuildOptions } from './options';
import { parse } from 'yaml';
import { options as yargsOptions } from 'yargs';
import { DesignTokenSource, DesignTokenFormatters } from '../../shared';
import {
  generateTypescriptBarrelFile,
  generateEcmascriptBarrelFile,
  addAliasMetadataFiles,
  findCommonRootPath,
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
  formatType: DesignTokenFormatters,
  outfileExtension: string,
): Observable<DesignTokenFile> {
  const outputFilename = file.replace(extname(file), `.${outfileExtension}`);
  const conversion = convert({
    transform: {
      type: 'web',
      includeMeta: true,
      file,
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
  baseDirectory: string,
): Observable<Volume> {
  const conversions: Observable<DesignTokenFile>[] = [];
  // Create conversion observables for all entry files and all formats.
  for (const file of options.entrypoints) {
    const fileSource = readFileSync(file, {
      encoding: 'utf-8',
    });
    const yamlFileSource: DesignTokenSource = parse(fileSource);
    // Add the conversion for evey defined output in the source yaml file.
    for (const output of yamlFileSource.outputs ?? []) {
      conversions.push(runTokenConversion(file, output.formatter, output.type));
    }
    conversions.push(runTokenConversion(file, 'raw.json', 'json'));
  }

  return forkJoin(conversions).pipe(
    map((results) => {
      const volumeContent = results.reduce((aggregator, file) => {
        // Remove path prefixes like "libs/shared/..." to get
        // a relative path from the design tokens root
        const baseDirectoryRelativePath = file.path.replace(baseDirectory, '');
        aggregator[baseDirectoryRelativePath] = file.content;
        return aggregator;
      }, {});
      return memfsVolume.fromJSON(volumeContent, options.outputPath);
    }),
  );
}

/** Write all files within the memfs to the real file system. */
async function commitVolumeToFileSystem(
  memoryVolume: Volume,
  outputPath: string,
): Promise<void> {
  for (const [path, content] of Object.entries(memoryVolume.toJSON())) {
    const fullPath = join(outputPath, path);
    console.log(fullPath);
    const containingFolder = dirname(fullPath);
    await fs.mkdir(containingFolder, { recursive: true });
    await fs.writeFile(fullPath, content);
  }
}

/**
 * Main builder for design tokens. Runs all entry points through the theo
 * conversion and outputs them to the dist folder.
 */
export function main(): Promise<void> {
  const options = yargsOptions({
    entrypoints: { type: 'array' },
    aliasesEntrypoints: { type: 'array' },
    outputPath: { type: 'string' },
  }).argv as DesignTokensBuildOptions;

  // Find the base path containing design tokens since passing a list of files
  // instead of a directory is the preferred way with Bazel.
  const baseDirectory = findCommonRootPath(options.entrypoints);
  if (!baseDirectory) {
    throw new Error(
      "Couldn't find design tokens base directory. " +
        'Please check the paths that were passed to this tool.',
    );
  }

  // Start of by reading the required source entry files.
  return designTokenConversion(options, baseDirectory)
    .pipe(
      map((memoryVolume) => generateTypescriptBarrelFile(memoryVolume)),
      map((memoryVolume) => generateEcmascriptBarrelFile(memoryVolume)),
      switchMap((memoryVolume) => addAliasMetadataFiles(options, memoryVolume)),
      switchMap((memoryVolume) =>
        commitVolumeToFileSystem(memoryVolume, options.outputPath),
      ),
    )
    .toPromise();
}

main()
  .then(() => {
    process.exit(0);
  })
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
