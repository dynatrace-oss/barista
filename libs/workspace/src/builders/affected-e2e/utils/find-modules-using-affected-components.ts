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

import { sync } from 'glob';
import { join } from 'path';
import { tsCreateSourceFile } from '@dynatrace/shared/node';
import {
  isImportDeclaration,
  ImportDeclaration,
  isStringLiteral,
} from 'typescript';

/**
 * Checks if a module file imports a module that has been affected by
 * the changeset.
 */
async function usesAffectedComponent(
  filePath: string,
  affectedComponents: string[],
): Promise<boolean> {
  const sourceFile = await tsCreateSourceFile(filePath);
  const importsFromAffectedModules = sourceFile.statements
    // Filter all statements that are import statements
    .filter((statement) => isImportDeclaration(statement))
    // Filter all import statements that import from @dynatrace/barista-components/
    .filter((importStatement: ImportDeclaration) => {
      const moduleSpecifier = importStatement.moduleSpecifier;
      if (isStringLiteral(moduleSpecifier)) {
        return (
          moduleSpecifier.text.includes('@dynatrace/barista-components') &&
          affectedComponents.some((component) =>
            moduleSpecifier.text.includes(component),
          )
        );
      }
      return false;
    });

  return importsFromAffectedModules.length > 0;
}

/**
 * Finds the modules within the e2e test app that are using one
 * or more of the affected components passed.
 */
export async function findE2eModulesUsingAffectedComponents(
  affectedComponents: string[],
  appSourceFolder: string,
): Promise<string[]> {
  // Find all module.ts files within the target app
  const moduleFilePaths = sync('**/*.module.ts', { cwd: appSourceFolder });

  // Initilize an array of affected e2e modules.
  const affectedE2EModules: string[] = [];

  // Iterate over the modules and process them to find out if
  // a module uses an effected component
  for (const moduleFilePath of moduleFilePaths) {
    const hasAffectedComponent = await usesAffectedComponent(
      join(appSourceFolder, moduleFilePath),
      affectedComponents,
    );
    if (hasAffectedComponent) {
      affectedE2EModules.push(moduleFilePath);
    }
  }
  return affectedE2EModules;
}
