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

import { ExampleFile } from './examples.interface';
import {
  SourceFile,
  isPropertyAssignment,
  PropertyAssignment,
  isArrayLiteralExpression,
  isStringLiteral,
  isIdentifier,
} from 'typescript';
import {
  getAngularDecoratedClasses,
  AngularClassDecoratorName,
} from '@dynatrace/shared/node';
import { promises as fs } from 'fs';
import { resolve } from 'path';

async function getDecoratorPropertyAssigments(
  source: SourceFile,
): Promise<PropertyAssignment[]> {
  // Get the componentClassDecorator
  const componentClass = (
    await getAngularDecoratedClasses(
      source,
      AngularClassDecoratorName.Component,
    )
  )[0];
  // Iterate all properties within the decorator
  const decoratorPropertyAssignments = componentClass.decorator.properties
    // Filter everything that is not a property assignment
    .filter((property) => isPropertyAssignment(property));
  return decoratorPropertyAssignments as PropertyAssignment[];
}

/** Extract the templateUrl value from the decorator */
async function getTemplatePathFromSourceFile(
  source: SourceFile,
): Promise<string> {
  // Get all PropertyAssignments in the decorator
  const decoratorPropertyAssignments = await getDecoratorPropertyAssigments(
    source,
  );

  return (
    decoratorPropertyAssignments
      // Filter everything that is not the selector assignment
      .filter(
        (property: PropertyAssignment) =>
          isIdentifier(property.name) && property.name.text === 'templateUrl',
      )
      // Map to the initializer value
      .map((property: PropertyAssignment) =>
        isStringLiteral(property.initializer) ? property.initializer.text : '',
      )[0] // take the first element found
  );
}

async function getStyleUrlsFromSourceFile(
  source: SourceFile,
): Promise<string[]> {
  // Get all PropertyAssignments in the decorator
  const decoratorPropertyAssignments = await getDecoratorPropertyAssigments(
    source,
  );
  const stylesFilePaths = decoratorPropertyAssignments
    // Filter everything that is not the selector assignment
    .filter(
      (property: PropertyAssignment) =>
        isIdentifier(property.name) && property.name.text === 'styleUrls',
    )
    // Map to the initializer value
    .map((property: PropertyAssignment) => {
      if (isArrayLiteralExpression(property.initializer)) {
        // Return every value in the array initializer
        return property.initializer.elements.map((element) =>
          isStringLiteral(element) ? element.text : '',
        );
      }
    })
    // Filter empty entries from the array.
    .filter(Boolean)
    // Flatten the array
    .reduce<string[]>((aggregator, styleUrls) => {
      return [...aggregator!, ...styleUrls!];
    }, []);
  return stylesFilePaths || [];
}

/** Gets the files referenced in the component decorator as template and styleUrls. */
export async function getTemplateAndStyleFilesFromComponentSourceFiles(
  source: SourceFile,
  fileRoot: string,
): Promise<ExampleFile[]> {
  // Get the templatePath from the decorator and load the template file
  const templatePath = await getTemplatePathFromSourceFile(source);
  const resolvedTemplatePath = resolve(fileRoot, templatePath);
  const templateContent = await fs.readFile(resolvedTemplatePath, {
    encoding: 'utf-8',
  });

  // Get the stylesUrls from the decorator and load all of them
  const stylePaths = await getStyleUrlsFromSourceFile(source);
  const stylesFiles: ExampleFile[] = [];
  for (const stylePath of stylePaths) {
    const resolvedStylePath = resolve(fileRoot, stylePath);
    const content = await fs.readFile(resolvedStylePath, { encoding: 'utf-8' });
    stylesFiles.push({
      path: resolvedStylePath,
      content,
    });
  }

  return [
    {
      path: resolvedTemplatePath,
      content: templateContent,
    },
    ...stylesFiles,
  ];
}
