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
import { Observable, of, from } from 'rxjs';
import { mapTo, catchError, switchMap } from 'rxjs/operators';
import { promises as fs } from 'fs';
import { DesignTokensTailwindcssOptions } from './schema';
import * as postcss from 'postcss';
import * as postcssImport from 'postcss-import';
import * as tailwindcss from 'tailwindcss';
import { generateTailwindcssConfig } from './utils/generate-tailwind-config';
import { join } from 'path';

/**
 * Tailwindcss builder for design tokens.
 * Generates a tailwind config based on the design tokens and
 * outputs a finishe dtailwind.css file
 */
export function designTokensTailwindcssBuilder(
  options: DesignTokensTailwindcssOptions,
  context: BuilderContext,
): Observable<BuilderOutput> {
  return from(generateTailwindcssConfig(options.baseDirectory)).pipe(
    switchMap((config) =>
      postcss([postcssImport(), tailwindcss(config)]).process(
        `
  @import '${options.themeFile}';
  @tailwind base;
  @tailwind components;
  @tailwind utilities;
      `,
        {
          // Setting from to undefined to prevent PostCss from
          // generating a source map.
          from: undefined,
        },
      ),
    ),
    switchMap((postCssResult) =>
      fs.writeFile(
        join(context.workspaceRoot, options.outputPath),
        postCssResult.content,
      ),
    ),
    mapTo({ success: true }),
    catchError((error: Error) => {
      context.logger.error(error.stack!);
      return of({
        success: false,
      });
    }),
  );
}
