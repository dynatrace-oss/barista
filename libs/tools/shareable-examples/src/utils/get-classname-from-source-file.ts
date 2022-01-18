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

import { SourceFile, isClassDeclaration, ClassDeclaration } from 'typescript';

/** Too many classes error generator function. */
export function DtTooManyClassesInExampleError(fileName: string): Error {
  return Error(
    `There were more than one class detected in ${fileName}. This is currently not supported for shareable example generation.`,
  );
}

/** Get a classname from an AST sourcefile */
export function getClassnameFromSourceFile(source: SourceFile): string {
  // Get the className of the example for later use.
  const classNodes = source.statements
    .filter((statement) => isClassDeclaration(statement))
    .map((statement: ClassDeclaration) => statement.name!.escapedText);

  // Assume the last class within the example is the actual root example.
  return classNodes[classNodes.length - 1].toString();
}
