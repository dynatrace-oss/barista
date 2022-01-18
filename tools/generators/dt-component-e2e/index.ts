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

import { strings } from '@angular-devkit/core';
import {
  apply,
  chain,
  mergeWith,
  Rule,
  template,
  Tree,
  url,
} from '@angular-devkit/schematics';
import { formatFiles } from '@nrwl/workspace';
import { join } from 'path';
import * as ts from 'typescript';
import { findNodes, getSourceFile } from '../utils/ast-utils';
import { commitChanges, InsertChange } from '../utils/change';
import { DtComponentE2EOptions } from './schema';
import { generateComponentOptions } from '../utils/schematics-utils';
interface DtE2EExtendedOptions {
  selector: string;
  componentModule: {
    name: string;
    package: string;
  };
  e2eComponent: {
    component: string;
    module: string;
  };
  name: string;
}

function generateE2EComponentOptions(name: string): {
  component: string;
  module: string;
} {
  return {
    component: `DtE2E${strings.classify(name)}`,
    module: `DtE2E${strings.classify(name)}Module`,
  };
}

/**
 * Adds a new route inside the ui-test routes
 */
export function addRoute(options: DtE2EExtendedOptions): Rule {
  return (host: Tree) => {
    const modulePath = join(
      'apps',
      'components-e2e',
      'src',
      'app',
      'app.routing.module.ts',
    );
    const sourceFile = getSourceFile(host, modulePath);

    /**
     * find last route and add new route
     */
    const routesDeclaration = findNodes(
      sourceFile,
      ts.SyntaxKind.VariableDeclaration,
    ).find(
      (node: ts.VariableDeclaration) => node.name.getText() === 'routes',
    ) as ts.VariableDeclaration;
    const routesElements = (
      routesDeclaration.initializer as ts.ArrayLiteralExpression
    ).elements;
    const lastElement = routesElements[routesElements.length - 1];
    const end = routesElements.hasTrailingComma
      ? lastElement.getEnd() + 1
      : lastElement.getEnd();
    const toInsert = `{
    path: '${strings.dasherize(options.name)}',
    loadChildren: () =>
      import('../components/${strings.dasherize(
        options.name,
      )}/${strings.dasherize(options.name)}.module').then(
        (module) => module.${options.e2eComponent.module},
      ),
  },`;
    const routesChange = new InsertChange(modulePath, end, toInsert);

    return commitChanges(host, [routesChange], modulePath);
  };
}

export default function (options: DtComponentE2EOptions): Rule {
  return async () => {
    const extendedOptions: DtE2EExtendedOptions = {
      ...options,
      selector: `dt-${strings.dasherize(options.name)}`,
      componentModule: generateComponentOptions(options.name),
      e2eComponent: generateE2EComponentOptions(options.name),
    };

    const templateSource = apply(url('./files'), [
      template({
        ...strings,
        ...extendedOptions,
      }),
    ]);

    return chain([
      mergeWith(templateSource),
      addRoute(extendedOptions),
      formatFiles(),
    ]);
  };
}
