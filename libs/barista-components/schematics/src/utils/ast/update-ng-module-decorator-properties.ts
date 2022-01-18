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

import * as ts from 'typescript';
import { findNodes } from './find-nodes';
import { hasExportModifier } from './has-export-modifier';
import { getSymbolName } from './get-symbol-name';
import { createPropertyAssignment } from './create-property-assignment';

// eslint-disable-next-line max-len
const NO_DECORATORS_ERROR = (name: string, filename: string) =>
  `The <${name}> property cannot be updated, in case there is no @NgModule in this file!\n${filename}`;

/* eslint-disable max-len */
export const enum NgModuleProperties {
  Providers = 'providers', // The set of injectable objects that are available in the injector of this module.
  declarations = 'declarations', // The set of components, directives, and pipes (declarables) that belong to this module.
  Imports = 'imports', // The set of NgModules whose exported declarables are available to templates in this module.
  Exports = 'exports', // The set of components, directives, and pipes declared in this NgModule that can be used in the template of any component that is part of an NgModule that imports this NgModule. Exported declarations are the module's public API.
  Bootstrap = 'bootstrap', // The set of components that are bootstrapped when this module is bootstrapped. The components listed here are automatically added to entryComponents.
  Schemas = 'schemas', // The set of schemas that declare elements to be allowed in the NgModule. Elements and properties that are neither Angular components nor directives must be declared in a schema.
  Id = 'id', // A name or path that uniquely identifies this NgModule in getModuleFactory. If left undefined, the NgModule is not registered with getModuleFactory.
  Jit = 'jit', // If true, this module will be skipped by the AOT compiler and so will always be compiled using JIT.
}
/* eslint-enable max-len */

/**
 * Update properties of NgModules
 *
 * @see https://angular.io/guide/ngmodules
 * @see https://angular.io/api/core/NgModule
 * @param sourceFile The sourceFile that should be modified
 * @param {NgModuleProperties | undefined} propertyType enum of the property type or undefined if you want to delete it!
 */
export function updateNgModuleDecoratorProperties(
  sourceFile: ts.SourceFile,
  propertyType: NgModuleProperties,
  propertyValue: ts.Expression | undefined,
): ts.SourceFile {
  // find all decorators in the provided source file
  const decorators = findNodes(
    sourceFile,
    ts.SyntaxKind.Decorator,
  ) as ts.Decorator[];

  if (!decorators.length) {
    throw Error(NO_DECORATORS_ERROR(propertyType, sourceFile.fileName));
  }

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
            (agrumentProperty: ts.PropertyAssignment) => {
              const name = getSymbolName(agrumentProperty);
              if (name === propertyType) {
                return true;
              }
              return false;
            },
          ) as ts.PropertyAssignment;

          if (prop && propertyValue) {
            // if we found the property append the value to the array if it is an array
            if (ts.isArrayLiteralExpression(prop.initializer)) {
              // HACK: prop.initializer is readonly and should not be set, but
              // ts.factory.updateArrayLiteralExpression(prop.initializer, [...]) seems to be bugged (does nothing)
              (prop.initializer as any) =
                ts.factory.createArrayLiteralExpression(
                  [...prop.initializer.elements, propertyValue],
                  true,
                );
            } else {
              // TODO: lukas.holzer@dynatrace.com implement different initializer kinds.
              console.warn(
                `Property Type <${
                  ts.SyntaxKind[prop.initializer.kind]
                }> is currently not implementet!`,
              );
            }
          } else {
            const propertiesArr: ts.ObjectLiteralElementLike[] = [];
            if (propertyValue) {
              propertiesArr.push(...argument.properties);
              propertiesArr.push(
                createPropertyAssignment(propertyType, propertyValue),
              );
            } else {
              // if the propertyValue is undefined then we want to delete it!
              argument.properties.forEach(
                (argumentProperty: ts.PropertyAssignment) => {
                  const name = getSymbolName(argumentProperty);
                  // only push the properties where the name does not match the provided type
                  if (name !== propertyType) {
                    propertiesArr.push(argumentProperty);
                  }
                },
              );
            }
            // if the property does not exist in the NgModule we have to create it and append it!
            updatedProperties = ts.factory.createObjectLiteralExpression(
              propertiesArr,
              true,
            );
          }
        },
      );

      // if we have updated properties we have to recreate the call expression
      if (updatedProperties) {
        ts.factory.updateCallExpression(
          decorator.expression,
          ts.factory.createIdentifier('NgModule'),
          undefined,
          [updatedProperties],
        );
      }
    }
  });

  return sourceFile;
}
