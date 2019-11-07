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

import { existsSync, promises as fs, lstatSync } from 'fs';
import { dirname, join, basename } from 'path';
import {
  ObjectLiteralExpression,
  isPropertyAssignment,
  createSourceFile,
  ScriptTarget,
  ScriptKind,
  ClassDeclaration,
} from 'typescript';

import { getComponentDecoratorMetadataObject } from '../../util/ast';

export interface BaristaExampleMetadata {
  tsFileLocation: string;
  templateFileLocation: string | null;
  classSource: string;
  className: string;
  templateSource: string;
  packageName: string;
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
      } else if (property.name.getText() === 'templateUrl') {
        const parts = property.initializer
          .getText()
          .match(/^(?:'|"|`)(.*)(?:'|"|`)$/);
        if (parts && parts[1]) {
          const fileLocation = join(dirname(fileName), parts[1]);
          if (existsSync(fileLocation) && lstatSync(fileLocation).isFile()) {
            const source = (await fs.readFile(fileLocation, {
              encoding: 'utf-8',
            })).toString();
            return { source, fileLocation };
          }
        }
      }
    }
  }
  return null;
}

/** Collects and returns a list of example metadata objects included in a file. */
export async function getExampleMetadataObjects(
  fileName: string,
): Promise<BaristaExampleMetadata[]> {
  const tsSource = (await fs.readFile(fileName, {
    encoding: 'utf-8',
  })).toString();

  const sourceFile = createSourceFile(
    fileName,
    tsSource,
    ScriptTarget.Latest,
    true, // setParentNodes
    ScriptKind.TS,
  );

  const metadata: BaristaExampleMetadata[] = [];

  for (const node of sourceFile.statements) {
    const metadataObjectLiteral = getComponentDecoratorMetadataObject(node);

    // We know, if we get a metadata literal this node is a component class
    if (metadataObjectLiteral) {
      const className = (node as ClassDeclaration).name!.getText();
      const fullClassSource = node.getText();
      const decoratorSource = metadataObjectLiteral.getText();
      const classSource = fullClassSource
        .split(decoratorSource)
        .join('{ ... }');
      const packageName = basename(dirname(fileName));

      const templateMeta = await resolveTemplate(
        metadataObjectLiteral,
        fileName,
      );
      if (templateMeta) {
        metadata.push({
          tsFileLocation: fileName,
          classSource,
          className,
          templateFileLocation: templateMeta.fileLocation,
          templateSource: templateMeta.source,
          packageName,
        });
      }
    }
  }

  return Promise.resolve(metadata);
}
