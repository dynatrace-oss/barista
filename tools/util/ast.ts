/**
 * @license
 * Copyright 2019 Dynatrace LLC
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
  Node,
  isCallExpression,
  isIdentifier,
  isObjectLiteralExpression,
  isClassDeclaration,
  Decorator,
  ObjectLiteralExpression,
  CallExpression,
} from 'typescript';

/** TODO */
export function getClassDecorators(node: Node): Decorator[] {
  return isClassDeclaration(node) && node.decorators && node.decorators.length
    ? Array.from(node.decorators)
    : [];
}

export function isComponentDecorator(
  decorator: Decorator,
): decorator is Decorator {
  return (
    isCallExpression(decorator.expression) &&
    isIdentifier(decorator.expression.expression) &&
    decorator.expression.expression.text === 'Component' &&
    decorator.expression.arguments.length === 1 &&
    isObjectLiteralExpression(decorator.expression.arguments[0])
  );
}

export function getComponentDecorator(node: Node): Decorator | null {
  return getClassDecorators(node).find(isComponentDecorator) || null;
}

export function getComponentDecoratorMetadataObject(
  node: Node,
): ObjectLiteralExpression | null {
  const decorator = getComponentDecorator(node);
  return decorator
    ? ((decorator.expression as CallExpression)
        .arguments[0] as ObjectLiteralExpression) || null
    : null;
}
