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
import { promises as fs } from 'fs';
import {
  Node,
  isCallExpression,
  isIdentifier,
  isObjectLiteralExpression,
  isClassDeclaration,
  Decorator,
  ObjectLiteralExpression,
  CallExpression,
  SourceFile,
  ScriptTarget,
  ScriptKind,
  createSourceFile,
  ClassDeclaration,
} from 'typescript';

export enum AngularClassDecoratorName {
  Component = 'Component',
  Module = 'NgModule',
}

/** TODO */
export function getClassDecorators(node: Node): Decorator[] {
  return isClassDeclaration(node) && node.decorators && node.decorators.length
    ? Array.from(node.decorators)
    : [];
}

export function isAngularClassDecorator(
  decorator: Decorator,
  name: AngularClassDecoratorName,
): decorator is Decorator {
  return (
    isCallExpression(decorator.expression) &&
    isIdentifier(decorator.expression.expression) &&
    decorator.expression.expression.text === name &&
    decorator.expression.arguments.length === 1 &&
    isObjectLiteralExpression(decorator.expression.arguments[0])
  );
}

export function getAngularClassDecorator(
  node: Node,
  decoratorName: AngularClassDecoratorName,
): Decorator | null {
  return (
    getClassDecorators(node).find((decorator) =>
      isAngularClassDecorator(decorator, decoratorName),
    ) || null
  );
}

export function getAngularClassDecoratorMetadataObject(
  node: Node,
  decoratorName: AngularClassDecoratorName,
): ObjectLiteralExpression | null {
  const decorator = getAngularClassDecorator(node, decoratorName);
  return decorator
    ? ((decorator.expression as CallExpression)
        .arguments[0] as ObjectLiteralExpression) || null
    : null;
}

export async function tsCreateSourceFile(
  fileName: string,
): Promise<SourceFile> {
  const tsSource = (
    await fs.readFile(fileName, {
      encoding: 'utf-8',
    })
  ).toString();

  return createSourceFile(
    fileName,
    tsSource,
    ScriptTarget.Latest,
    true, // setParentNodes
    ScriptKind.TS,
  );
}

export interface AngularDecoratedClass {
  decorator: ObjectLiteralExpression;
  classNode: ClassDeclaration;
}

export async function getAngularDecoratedClasses(
  fileName: string,
  decoratorName: AngularClassDecoratorName,
): Promise<AngularDecoratedClass[]>;
export async function getAngularDecoratedClasses(
  sourceFile: SourceFile,
  decoratorName: AngularClassDecoratorName,
): Promise<AngularDecoratedClass[]>;
export async function getAngularDecoratedClasses(
  fileNameOrSourceFile: string | SourceFile,
  decoratorName: AngularClassDecoratorName,
): Promise<AngularDecoratedClass[]> {
  const sourceFile =
    typeof fileNameOrSourceFile === 'string'
      ? await tsCreateSourceFile(fileNameOrSourceFile)
      : fileNameOrSourceFile;

  const decoratedClasses: AngularDecoratedClass[] = [];
  for (const statement of sourceFile.statements) {
    const decoratorMetaObj = getAngularClassDecoratorMetadataObject(
      statement,
      decoratorName,
    );
    if (decoratorMetaObj) {
      decoratedClasses.push({
        classNode: statement as ClassDeclaration,
        decorator: decoratorMetaObj,
      });
    }
  }
  return decoratedClasses;
}
