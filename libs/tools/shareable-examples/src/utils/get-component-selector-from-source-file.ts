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

import {
  SourceFile,
  isPropertyAssignment,
  PropertyAssignment,
  isStringLiteral,
} from 'typescript';
import {
  AngularClassDecoratorName,
  getAngularDecoratedClasses,
} from '@dynatrace/shared/node';

/** Get the selector from the component file. */
export async function getComponentSelectorFromSourceFile(
  source: SourceFile,
): Promise<string> {
  const componentClasses = await getAngularDecoratedClasses(
    source,
    AngularClassDecoratorName.Component,
  );
  const componentClass = componentClasses[componentClasses.length - 1];
  // Iterate all properties within the decorator
  const selector = componentClass.decorator.properties
    // Filter everything that is not a property assignment
    .filter((property) => isPropertyAssignment(property))
    // Filter everything that is not the selector assignment
    .filter(
      (property: PropertyAssignment) => property.name.getText() === 'selector',
    )
    // Map to the initializer value
    .map((property: PropertyAssignment) =>
      isStringLiteral(property.initializer) ? property.initializer.text : '',
    )
    .filter(Boolean)[0]; // take the first element found
  return selector;
}
