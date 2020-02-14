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
import { environment } from '@environments/barista-environment';
import { resolve, relative } from 'path';
import { promises as fs } from 'fs';
import { ExampleFile } from './examples.interface';

/** Get all boilerplate code files that are required to have a complete project. */
export async function getBoilerplateFiles(
  exampleClassName: string,
  exampleSelector: string,
  exampleModuleClassname: string,
  exampleModulePath: string,
): Promise<ExampleFile[]> {
  const files: ExampleFile[] = [];

  // main.ts
  const mainTs = await fs.readFile(
    resolve(
      environment.shareableExamplesToolsDir,
      'templates/main.ts.template',
    ),
    { encoding: 'utf-8' },
  );
  files.push({
    path: resolve(environment.examplesLibDir, 'main.ts'),
    content: mainTs,
  });

  // styles.scss
  const stylesScss = await fs.readFile(
    resolve(
      environment.shareableExamplesToolsDir,
      'templates/styles.scss.template',
    ),
    { encoding: 'utf-8' },
  );
  files.push({
    path: resolve(environment.examplesLibDir, 'styles.scss'),
    content: stylesScss,
  });

  // index.html
  files.push({
    path: resolve(environment.examplesLibDir, 'index.html'),
    content: '<barista-demo-application></barista-demo-application>',
  });

  // angular.json
  const angularJson = await fs.readFile(
    resolve(
      environment.shareableExamplesToolsDir,
      'templates/angular.json.template',
    ),
    { encoding: 'utf-8' },
  );
  files.push({
    path: resolve(environment.examplesLibDir, '../.angular-cli.json'),
    content: angularJson,
  });

  // package.json
  const packageJson = await fs.readFile(
    resolve(
      environment.shareableExamplesToolsDir,
      'templates/package-shareable-example.json.template',
    ),
    { encoding: 'utf-8' },
  );
  files.push({
    path: resolve(environment.examplesLibDir, '../package.json'),
    content: packageJson.replace(/{{EXAMPLE_NAME}}/g, exampleClassName),
  });

  // app/app.component.ts
  const appCompontentTs = await fs.readFile(
    resolve(
      environment.shareableExamplesToolsDir,
      'templates/app.component.ts.template',
    ),
    { encoding: 'utf-8' },
  );
  files.push({
    path: resolve(environment.examplesLibDir, 'app/app.component.ts'),
    content: appCompontentTs.replace(/{{EXAMPLE_SELECTOR}}/g, exampleSelector),
  });

  // app/app.component.scss
  const appCompontentScss = await fs.readFile(
    resolve(
      environment.shareableExamplesToolsDir,
      'templates/app.component.scss.template',
    ),
    { encoding: 'utf-8' },
  );
  files.push({
    path: resolve(environment.examplesLibDir, 'app/app.component.scss'),
    content: appCompontentScss,
  });

  // app/app.module.ts
  const appModuleTs = await fs.readFile(
    resolve(
      environment.shareableExamplesToolsDir,
      'templates/app.module.ts.template',
    ),
    { encoding: 'utf-8' },
  );
  const relativeModulePath = relative(
    resolve(environment.examplesLibDir, 'app.module.ts'),
    exampleModulePath,
  )
    // remove the .ts extension for imports
    .replace('.ts', '');

  files.push({
    path: resolve(environment.examplesLibDir, 'app/app.module.ts'),
    content: appModuleTs
      .replace(/{{EXAMPLE_CLASS_NAME}}/g, exampleModuleClassname)
      .replace(/{{EXAMPLE_PATH}}/g, relativeModulePath),
  });

  // polyfills.ts
  const polyfillsTs = await fs.readFile(
    resolve(
      environment.shareableExamplesToolsDir,
      'templates/polyfills.ts.template',
    ),
    { encoding: 'utf-8' },
  );
  files.push({
    path: resolve(environment.examplesLibDir, 'polyfills.ts'),
    content: polyfillsTs,
  });

  return files;
}
