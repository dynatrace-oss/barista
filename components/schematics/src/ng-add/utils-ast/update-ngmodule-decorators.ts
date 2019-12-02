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

import * as ts from 'typescript';

export const enum NgModuleProperties {
  Providers = 'providers',
  Imports = 'imports',
}

export function updateNgModuleDecoratorProperties(
  sourceFile: ts.SourceFile,
  propertyType: NgModuleProperties,
  propertyValue: ts.Expression,
): ts.SourceFile {
  // find all decorators in the provided source file
  let decorators = findNodes(
    sourceFile,
    ts.SyntaxKind.Decorator,
  ) as ts.Decorator[];

  decorators.forEach((decorator: ts.Decorator) => {
    // check if the found decorator is the NgModule decorator and
    // if its class is exported.
    if (
      ts.isCallExpression(decorator.expression) &&
      ts.isIdentifier(decorator.expression.expression) &&
      decorator.expression.expression.text === 'NgModule' &&
      hasExportModifier(decorator.parent)
    ) {
      let updatedProperties: ts.ObjectLiteralExpression | undefined;
      // loop through the object properties of the decorator to get the imports
      decorator.expression.arguments.forEach(
        (argument: ts.ObjectLiteralExpression) => {
          const prop = argument.properties.find(
            (property: ts.PropertyAssignment) => {
              const name = getSymbolName(property);
              if (name === propertyType) {
                return true;
              }
              return false;
            },
          ) as ts.PropertyAssignment;

          if (prop && propertyValue) {
            // if we found the property append the value to the array if it is an array
            if (ts.isArrayLiteralExpression(prop.initializer)) {
              prop.initializer = ts.createArrayLiteral(
                [...prop.initializer.elements, propertyValue],
                true,
              );
            }
          } else {
            const propertiesArr: any[] = [];
            if (propertyValue) {
              propertiesArr.push(...argument.properties);
              propertiesArr.push(
                createPropertyAssignment(propertyType, propertyValue),
              );
            } else {
              // if the propertyValue is undefined then we want to delete it!
              argument.properties.forEach((property: ts.PropertyAssignment) => {
                const name = getSymbolName(property);
                // only push the properties where the name does not match the provided type
                if (name !== propertyType) {
                  propertiesArr.push(property);
                }
              });
            }
            // if the property does not exist in the NgModule we have to create it and append it!
            updatedProperties = ts.createObjectLiteral(propertiesArr, true);
          }
        },
      );

      // if we have updated properties we have to recreate the call expression
      if (updatedProperties) {
        decorator.expression = ts.createCall(
          ts.createIdentifier('NgModule'),
          undefined,
          [updatedProperties],
        );
      }
    }
  });

  return sourceFile;
}

function findNodes(
  node: ts.Node,
  kind: ts.SyntaxKind,
  maxItems: number = Infinity,
): ts.Node[] {
  let max = maxItems;

  if (!node || max === 0) {
    return [];
  }

  const arr: ts.Node[] = [];
  if (node.kind === kind) {
    arr.push(node);
    max -= 1;
  }
  if (max > 0) {
    for (const child of node.getChildren()) {
      findNodes(child, kind, max).forEach((n: ts.Node) => {
        if (max > 0) {
          arr.push(n);
        }
        max -= 1;
      });

      if (max <= 0) {
        break;
      }
    }
  }

  return arr;
}

function hasExportModifier(node: ts.Declaration): boolean {
  return (ts.getCombinedModifierFlags(node) && ts.ModifierFlags.Export) !== 0;
}

function getSymbolName(node: any): string | undefined {
  if (!node) {
    return '';
  }

  // node is a StringLiteral
  if (node.literal && node.literal.kind === ts.SyntaxKind.StringLiteral) {
    return node.literal.text;
  }
  // node is a StringLiteral
  if (node.kind && node.kind === ts.SyntaxKind.StringLiteral) {
    return node.text;
  }
  // node is a Identifier
  if (node.kind && node.kind === ts.SyntaxKind.Identifier) {
    return node.text;
  }

  if (
    (node.name && node.name.kind === ts.SyntaxKind.Identifier) ||
    (node.name && node.name.kind === ts.SyntaxKind.StringLiteral)
  ) {
    return node.name.text;
  }
  // node is a TypeReference
  if (node.typeName && node.kind === ts.SyntaxKind.TypeReference) {
    return node.typeName.text;
  }

  // call expression
  if (node.expression && node.expression.kind === ts.SyntaxKind.Identifier) {
    return node.expression.text;
  }

  switch (node.kind) {
    case ts.SyntaxKind.VariableStatement:
      return getSymbolName(node.declarationList);
    case ts.SyntaxKind.VariableDeclarationList:
      return node.declarations
        .map((declaration: any) => getSymbolName(declaration))
        .join(', ');
    // call expression that does not match the if case before.
    case ts.SyntaxKind.CallExpression:
    case ts.SyntaxKind.ObjectLiteralExpression:
    case ts.SyntaxKind.ArrayLiteralExpression:
    case ts.SyntaxKind.FunctionType:
    case ts.SyntaxKind.IndexSignature:
    case ts.SyntaxKind.ConstructorType:
      // Array or Object Literal expressions can't have a name!
      return;
    default:
      console.warn(
        `Unsupported Syntax kind {bgBlue  <${
          ts.SyntaxKind[node.kind]
        }> } {grey – function getSymbolName(node)}`,
      );
  }
}

function createPropertyAssignment(
  name: string,
  expression: ts.Expression,
): ts.PropertyAssignment {
  return ts.createPropertyAssignment(ts.createIdentifier(name), expression);
}
