/**
 * @license
 * Copyright 2022 Dynatrace LLC
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

import { parseDir } from 'sass-graph';
import { join, dirname, relative } from 'path';
import { promises as fs, existsSync } from 'fs';
import { PackagerOptions, PackagerAssetDef } from './schema';
import { BuilderContext } from '@angular-devkit/architect';
import { sync } from 'glob';

/** Asynchronously copies all style files and all their dependencies to the destination */
export async function copyStyles(
  options: PackagerOptions,
  context: BuilderContext,
): Promise<void> {
  for (const styleDef of options.styles) {
    const fileGlob = sync(styleDef.glob, {
      cwd: join(context.workspaceRoot, styleDef.input),
    });
    const directories = fileGlob.map((path) =>
      join(context.workspaceRoot, styleDef.input, dirname(path)),
    );
    const uniqueDirectories = [...new Set(directories)];
    const allStyleDependencies = uniqueDirectories.reduce(
      (aggr: string[], dir: string) => {
        return aggr.concat(Object.keys(parseDir(dir).index));
      },
      [],
    ) as string[];

    for (const stylesheetFilePath of allStyleDependencies) {
      await copyAsset(stylesheetFilePath, context, styleDef);
    }
  }
}

/** Copies an asset */
async function copyAsset(
  path: string,
  context: BuilderContext,
  assetDef: PackagerAssetDef,
): Promise<void> {
  const relativePath = relative(
    join(context.workspaceRoot, assetDef.input),
    path,
  );
  const destination = join(
    context.workspaceRoot,
    assetDef.output,
    relativePath,
  );
  if (!existsSync(dirname(destination))) {
    await fs.mkdir(dirname(destination), { recursive: true });
  }
  await fs.copyFile(path, destination);
}

/** Asynchronously copies all asset folders in the options specified */
export async function copyAssets(
  options: PackagerOptions,
  context: BuilderContext,
): Promise<void> {
  for (const asset of options.assets) {
    const glob = sync(asset.glob, { cwd: asset.input, nodir: true });
    for (const path of glob) {
      await copyAsset(
        join(context.workspaceRoot, asset.input, path),
        context,
        asset,
      );
    }
  }
}
