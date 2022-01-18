/**
 * @license
 * Copyright 2021 Dynatrace LLC
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

import { existsSync, promises as fs, lstatSync, readdirSync } from 'fs';
import { dirname, join, basename } from 'path';
import {
  ObjectLiteralExpression,
  isPropertyAssignment,
  isArrayLiteralExpression,
} from 'typescript';
import {
  AngularClassDecoratorName,
  getAngularDecoratedClasses,
} from '@dynatrace/shared/node';

export interface ExamplePackageMetadata {
  name: string;
  dir: string;
  moduleFile: string;
  moduleClassName: string;
  examples: ExampleMetadata[];
}

export interface ExampleMetadata {
  tsFileLocation: string;
  templateFileLocation: string | null;
  classSource: string;
  className: string;
  templateSource: string;
  stylesFileLocations: string[] | null;
  stylesSource: string | null;
}

/**
 * Resolves the template of a component.
 * Can handle inline and external template files.
 */
async function resolveTemplate(
  metadataObjectLiteral: ObjectLiteralExpression,
  fileName: string,
): Promise<{ source: string; fileLocation: string | null } | null> {
  for (const property of metadataObjectLiteral.properties) {
    if (isPropertyAssignment(property)) {
      if (property.name.getText() === 'template') {
        return {
          source: property.initializer.getText(),
          fileLocation: null,
        };
      }
      if (property.name.getText() === 'templateUrl') {
        const parts = property.initializer
          .getText()
          .match(/^(?:'|"|`)(.*)(?:'|"|`)$/);
        if (parts && parts[1]) {
          const fileLocation = join(dirname(fileName), parts[1]);
          if (existsSync(fileLocation) && lstatSync(fileLocation).isFile()) {
            const source = (
              await fs.readFile(fileLocation, {
                encoding: 'utf-8',
              })
            ).toString();
            return { source, fileLocation };
          }
        }
      }
    }
  }
  return null;
}

/**
 * Resolves the styles of a component.
 * Can handle inline and external styles files.
 */
async function resolveStyles(
  metadataObjectLiteral: ObjectLiteralExpression,
  fileName: string,
): Promise<{ source: string; fileLocations: string[] | null } | null> {
  for (const property of metadataObjectLiteral.properties) {
    if (isPropertyAssignment(property)) {
      if (property.name.getText() === 'styles') {
        return {
          source: property.initializer.getText(),
          fileLocations: null,
        };
      }
      if (property.name.getText() === 'styleUrls') {
        if (isArrayLiteralExpression(property.initializer)) {
          const paths = property.initializer.elements
            .map((expression) =>
              expression.getText().match(/^(?:'|"|`)(.*)(?:'|"|`)$/),
            )
            .filter((parts) => parts && parts[1])
            .map((parts) => parts![1]);

          const styleSources = {
            source: '',
            fileLocations: [] as string[],
          };
          for (const path of paths) {
            const fileLocation = join(dirname(fileName), path);
            if (existsSync(fileLocation) && lstatSync(fileLocation).isFile()) {
              const source = (
                await fs.readFile(fileLocation, {
                  encoding: 'utf-8',
                })
              ).toString();
              styleSources.source = `${styleSources.source}/** ${path} */\n${source}\n\n`;
              styleSources.fileLocations.push(fileLocation);
            }
          }
          return styleSources;
        }
      }
    }
  }
  return null;
}

/** Collects and returns a list of example metadata objects included in a file. */
export async function getExampleMetadataObjects(
  fileName: string,
): Promise<ExampleMetadata[]> {
  const componentClasses = await getAngularDecoratedClasses(
    fileName,
    AngularClassDecoratorName.Component,
  );
  const metadata: ExampleMetadata[] = [];

  for (const component of componentClasses) {
    const className = component.classNode.name!.getText();
    const fullClassSource = component.classNode.getText();
    const decoratorSource = component.decorator.getText();
    const classSource = fullClassSource.split(decoratorSource).join('{ ... }');

    const templateMeta = await resolveTemplate(component.decorator, fileName);
    const stylesMeta = await resolveStyles(component.decorator, fileName);
    if (templateMeta) {
      metadata.push({
        tsFileLocation: fileName,
        classSource,
        className,
        templateFileLocation: templateMeta.fileLocation,
        templateSource: templateMeta.source,
        stylesFileLocations: stylesMeta ? stylesMeta.fileLocations : null,
        stylesSource: stylesMeta ? stylesMeta.source : null,
      });
    }
  }

  return metadata;
}

export async function getExamplePackageMetadata(
  dir: string,
): Promise<ExamplePackageMetadata | null> {
  let moduleFile: string | null = null;
  const exampleDirs: string[] = [];

  const fileOrDirs = readdirSync(dir).map((name) => join(dir, name));

  for (const fileOrDir of fileOrDirs) {
    const lstat = lstatSync(fileOrDir);
    if (
      !moduleFile &&
      lstat.isFile() &&
      basename(fileOrDir).toLowerCase().endsWith('-examples.module.ts')
    ) {
      moduleFile = fileOrDir;
    } else if (lstat.isDirectory()) {
      exampleDirs.push(fileOrDir);
    }
  }

  const examples = await getExampleMetadataInDirs(exampleDirs);
  if (moduleFile && examples.length) {
    const moduleClass = (
      await getAngularDecoratedClasses(
        moduleFile,
        AngularClassDecoratorName.Module,
      )
    )[0];
    if (moduleClass) {
      return {
        name: basename(dir),
        dir,
        moduleFile,
        moduleClassName: moduleClass.classNode.name!.getText(),
        examples,
      };
    }
  }
  return null;
}

async function getExampleMetadataInDirs(
  exampleDirs: string[],
): Promise<ExampleMetadata[]> {
  const examples: ExampleMetadata[] = [];
  for (const exampleDir of exampleDirs) {
    const tsFiles = readdirSync(exampleDir)
      .map((name) => join(exampleDir, name))
      .filter(
        (fileName) =>
          lstatSync(fileName).isFile() &&
          basename(fileName).toLowerCase().endsWith('.ts'),
      );
    for (const fileName of tsFiles) {
      const meta = await getExampleMetadataObjects(fileName);
      if (meta) {
        examples.push(...meta);
      }
    }
  }
  return examples;
}
