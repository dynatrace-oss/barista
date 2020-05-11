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

import { BuilderContext } from '@angular-devkit/architect';
import { tsCreateSourceFile } from '@dynatrace/shared/node';
import { promises as fs } from 'fs';
import { parse as cssParse } from 'gonzales-pe';
import { dirname, resolve } from 'path';
import { forkJoin, from, Observable } from 'rxjs';
import { map, switchMap } from 'rxjs/operators';
import {
  ClassDeclaration,
  Identifier,
  ImportDeclaration,
  isArrayLiteralExpression,
  isClassDeclaration,
  isGetAccessor,
  isIdentifier,
  isImportDeclaration,
  isPropertyDeclaration,
  isReturnStatement,
  isStringLiteral,
  ReturnStatement,
  SourceFile,
  StringLiteral,
} from 'typescript';
import { DependencyGraph } from './dependency-graph';
import { findSourceFiles } from './find-source-files';
import { DesignTokensDependencyTreeOptions } from './schema';

/**
 * Finds all ClassDeclarations that extend from LitElement
 * This will work for now, but as soon as we have multiple extends
 * this will be a bit more complicated.
 */
export function getCustomElementsFromSourceFile(
  sourceFile: SourceFile,
): ClassDeclaration[] {
  const componentClassDeclarations = sourceFile.statements
    // Filter out all non ClassDeclarations
    .filter((statement) => isClassDeclaration(statement))
    // Filter out all ClassDeclarations that do not extend from LitElement
    .filter((classDeclaration: ClassDeclaration) => {
      if (classDeclaration.heritageClauses) {
        const extendsFromLit = classDeclaration.heritageClauses.find(
          (heritageClause) =>
            heritageClause.types.some(
              (type) => (type.expression as Identifier).text === 'LitElement',
            ),
        );
        return Boolean(extendsFromLit);
      }
    }) as ClassDeclaration[];
  return componentClassDeclarations;
}

export function findUsedStylesInComponentClass(
  componentClass: ClassDeclaration,
): string[] {
  // Find static style declaration
  const styleMember = componentClass.members.find((member) => {
    if (member.name && isIdentifier(member.name)) {
      return member.name.text === 'styles';
    }
    return false;
  });

  // If there is no style member, exit
  if (!styleMember) {
    return [];
  }

  // If a stylesMember was found, check the various versions of implementations
  // to find which variable was used.

  // If styles is a property declaration, check it's initialzer
  if (isPropertyDeclaration(styleMember) && styleMember.initializer) {
    // If the initializer is a single identifier, use the text of the identifier
    if (isIdentifier(styleMember.initializer)) {
      return [styleMember.initializer.text];
    }
    // If the initializer is an arraz expression, use the identifiers from the elements.
    if (isArrayLiteralExpression(styleMember.initializer)) {
      return styleMember.initializer.elements
        .map((element) => (isIdentifier(element) ? element.text : ''))
        .filter(Boolean);
    }
  }
  // If styles is a getAccessor declaration, check its body for return
  // statements and find the used variables.
  if (isGetAccessor(styleMember) && styleMember.body) {
    // Find all return statements in the getters body
    const returnStatements = styleMember.body.statements.filter((statement) =>
      isReturnStatement(statement),
    ) as ReturnStatement[];

    const returnedVariables: string[] = [];
    // Iterate over all returnStatements and find the return variables
    // that are used.
    for (const returnStatement of returnStatements) {
      // If the returnStatement is an Identifier expression
      // use its text.
      if (
        returnStatement.expression &&
        isIdentifier(returnStatement.expression)
      ) {
        returnedVariables.push(returnStatement.expression.text);
      }
      // If the returnStatement is and ArrayLiteralExpression
      // find all elements indentifiers that are used.
      if (
        returnStatement.expression &&
        isArrayLiteralExpression(returnStatement.expression)
      ) {
        returnedVariables.push(
          ...returnStatement.expression.elements
            .map((element) => (isIdentifier(element) ? element.text : ''))
            .filter(Boolean),
        );
      }
    }
    return returnedVariables;
  }
  return [];
}

/** Process a single scss file and find. */
export function processScssFile(
  dependencyGraph: DependencyGraph,
  scssContent: string,
  componentName: string,
): void {
  const parsedTree = cssParse(scssContent, { syntax: 'scss' });

  // TODO: Eventually we want to find out which
  // selector controls this assignment.
  // For now we settle for finding the assignments.
  parsedTree.traverse((node, _index, parent) => {
    if (
      // Found a sassVariable
      node.type === 'variable' ||
      // The combination of custom property and NOT declarations resembles
      // a used custom property.
      (node.type === 'customProperty' && parent.type !== 'declaration')
    ) {
      const variableName = node.content[0].content;
      if (dependencyGraph.hasNode({ name: variableName, type: 'token' })) {
        dependencyGraph.addDependency(
          {
            name: componentName,
            type: 'component',
          },
          {
            name: variableName,
            type: 'token',
          },
        );
      }
    }
  });
}

/** Process the typescript file and find relevant connections to the design tokens. */
async function processTypescriptFile(
  dependencyGraph: DependencyGraph,
  sourceFile: SourceFile,
): Promise<void> {
  // Get customElement from source file
  const componentClasses = getCustomElementsFromSourceFile(sourceFile);

  // If there are no component classes within the file
  if (componentClasses.length === 0) {
    return;
  }

  // Find scss imports
  const styleImports = sourceFile.statements
    .filter((statement) => isImportDeclaration(statement))
    .filter((importStatement: ImportDeclaration) => {
      if (isStringLiteral(importStatement.moduleSpecifier)) {
        return importStatement.moduleSpecifier.text.match(/\.(s)?css$/);
      }
      return false;
    }) as ImportDeclaration[];

  for (const componentClass of componentClasses) {
    const usedStyles = findUsedStylesInComponentClass(componentClass);
    const componentName = componentClass.name?.text;

    // Find styles used by this components
    if (usedStyles.length) {
      // Find style imports that are used within a component to process the file.
      const usedStyleImports = styleImports.filter((importDeclaration) => {
        if (importDeclaration && importDeclaration.importClause) {
          return usedStyles.includes(
            importDeclaration.importClause!.name!.text,
          );
        }
      });
      // Iterate over the found used style imports and process the scss files.
      for (const usedStyleImport of usedStyleImports) {
        const styleFilePath = (usedStyleImport.moduleSpecifier as StringLiteral)
          .text;
        const resolvedPath = resolve(
          dirname(sourceFile.fileName),
          styleFilePath,
        );
        const source = await fs.readFile(resolvedPath, { encoding: 'utf-8' });
        processScssFile(dependencyGraph, source, componentName!);
      }
    }
  }
}

/**
 * Processes all fluid component files
 * - finds style imports
 * - tries to resolve custom property dependencies in scss files
 * - tries to resolve sass variable dependencies in scss files
 */
export function processComponentsDependencies(
  dependencyGraph: DependencyGraph,
  context: BuilderContext,
  options: DesignTokensDependencyTreeOptions,
): Observable<DependencyGraph> {
  return findSourceFiles(
    options.componentFiles || [],
    context.workspaceRoot,
  ).pipe(
    switchMap((filePaths) =>
      forkJoin(
        // Create a source file for each file found in the glob
        filePaths.map((filePath) =>
          from(tsCreateSourceFile(filePath)).pipe(
            switchMap((tsFile) =>
              processTypescriptFile(dependencyGraph, tsFile),
            ),
          ),
        ),
      ),
    ),
    map(() => dependencyGraph),
  );
}
