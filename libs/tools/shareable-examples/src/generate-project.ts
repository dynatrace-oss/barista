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

import { dirname } from 'path';
import { getExampleComponentClassFile } from './utils/get-example-component-class-file';
import { getClassnameFromSourceFile } from './utils/get-classname-from-source-file';
import { getRelativeImportsFromSourceFile } from './utils/get-relative-imports-from-source-file';
import { getExampleModule } from './utils/get-example-module';
import { getComponentSelectorFromSourceFile } from './utils/get-component-selector-from-source-file';
import { getBoilerplateFiles } from './utils/get-boilerplate-files';
import { ExampleFile, ExampleProject } from './utils/examples.interface';
import { getTemplateAndStyleFilesFromComponentSourceFiles } from './utils/get-template-and-style-files-from-component-source-file';
import { tsCreateSourceFile } from '@dynatrace/shared/node';

/** Isolates the required files for a barista example and builds a list of files (project) that are runnable within an online IDE i.e. stackblitz or codesandbox. */
export async function generateShareableExampleProject(
  exampleRoot: string,
): Promise<ExampleProject | null> {
  const componentClassFile = await getExampleComponentClassFile(exampleRoot);

  // Get the classname of the example.
  const exampleClassName = getClassnameFromSourceFile(componentClassFile.ast);
  // Get the component selector from the example
  const exampleSelector = await getComponentSelectorFromSourceFile(
    componentClassFile.ast,
  );
  //Get the template and styles files from the component file
  const exampleTemplatesAndStyles =
    await getTemplateAndStyleFilesFromComponentSourceFiles(
      componentClassFile.ast,
      exampleRoot,
    );
  // Get files that are relatively imported from the example class file.
  const relativeImports = await getRelativeImportsFromSourceFile(
    componentClassFile.ast,
    exampleRoot,
  );

  // Get all relative imports from relative ones as well
  // For now, one level should be enough, because nx rules will force boundaries
  // and scopes anyway
  const additionalImports: ExampleFile[] = [];
  for (const relativeImport of relativeImports) {
    const relativeImportAst = await tsCreateSourceFile(relativeImport.path);
    additionalImports.push(
      ...(await getRelativeImportsFromSourceFile(
        relativeImportAst,
        dirname(exampleRoot),
      )),
    );
  }

  // Get the transformed module file that works for this example.
  const moduleFile = await getExampleModule(exampleRoot, exampleClassName);
  const moduleClassName = getClassnameFromSourceFile(moduleFile.ast);
  const relativeModuleImports = await getRelativeImportsFromSourceFile(
    moduleFile.ast,
    dirname(moduleFile.path),
  );

  // Get all relative imports from relative module imports as well
  // For now, one level should be enough, because nx rules will force boundaries
  // and scopes anyway
  for (const relativeImport of relativeModuleImports) {
    const relativeImportAst = await tsCreateSourceFile(relativeImport.path);
    additionalImports.push(
      ...(await getRelativeImportsFromSourceFile(
        relativeImportAst,
        dirname(relativeImport.path),
      )),
    );
  }

  // Append default files.
  const additionalBoilerplateFiles = await getBoilerplateFiles(
    exampleClassName,
    exampleSelector,
    moduleClassName,
    moduleFile.path,
  );

  // Pack everything into an html.
  const files: ExampleFile[] = [
    componentClassFile,
    ...exampleTemplatesAndStyles,
    moduleFile,
    ...relativeImports,
    ...relativeModuleImports,
    ...additionalBoilerplateFiles,
    ...additionalImports,
  ];

  // File to open in the online ide.
  return { name: exampleClassName, files };
}
