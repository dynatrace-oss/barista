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

import { normalize, strings } from '@angular-devkit/core';
import { formatFiles } from '@nrwl/workspace';
import {
  apply,
  chain,
  mergeWith,
  move,
  noop,
  Rule,
  template,
  Tree,
  url,
  SchematicContext,
} from '@angular-devkit/schematics';
import { join } from 'path';
import * as ts from 'typescript';
import {
  addExport,
  addImport,
  findNodes,
  getSourceFile,
} from '../utils/ast-utils';
import { commitChanges, InsertChange } from '../utils/change';
import { LICENSE_HEADER } from '../utils/common-utils';
import {
  changeNavigation,
  changeRoutingModule,
  updateExamplesBarrel,
  updateExamplesModule,
} from './example-tools.utils';
import { DtComponentExampleOptions } from './schema';

export interface DtExampleExtendedOptions {
  componentSelector: string;
  examplesModule: string;
  exampleRoute: string;
  exampleId: string;
  selector: string;
  componentModule: {
    name: string;
    package: string;
  };
  exampleComponent: {
    component: string;
    module: string;
    modulesConstant: string;
    template: string;
  };
  name: string;
  component: string;
  dashName: string;
}

const EXAMPLES_SOURCE_PATH = 'libs/examples/src/';

/**
 * Function to generate util options for the component level generation.
 * @param options
 */
function generateComponentOptions(options: DtComponentExampleOptions): {
  name: string;
  package: string;
} {
  return {
    name: `Dt${strings.classify(options.component)}Module`,
    package: `@dynatrace/barista-components/${strings.dasherize(
      options.component,
    )}`,
  };
}

/**
 * Function to generate util options to be used during example generation.
 * @param options
 */
function generateExampleComponentOptions(options: DtComponentExampleOptions): {
  component: string;
  module: string;
  modulesConstant: string;
  template: string;
} {
  const dashName = strings.dasherize(options.component);
  return {
    component: `DtExample${strings.classify(options.name)}${strings.classify(
      options.component,
    )}`,
    module: `DtExample${strings.classify(options.name)}Module`,
    modulesConstant: `DT_${strings
      .underscore(options.component)
      .toUpperCase()}_EXAMPLES`,
    template: `${dashName}-${strings.dasherize(options.name)}-example.html`,
  };
}

/**
 * Generate the index file for the examples.
 * @param options
 */
function generateBarrelFileContent(options: DtExampleExtendedOptions): string {
  return `${LICENSE_HEADER}

  export * from './${options.dashName}-examples.module';
  export * from './${options.exampleRoute}';
  `;
}

/**
 * Generate the module file for the examples.
 * @param options
 */
function generateModuleFileContent(options: DtExampleExtendedOptions): string {
  return `${LICENSE_HEADER}
  import { NgModule } from '@angular/core';
  import { ${options.componentModule.name} } from '${options.componentModule.package}';
  import { ${options.exampleComponent.component} } from './${options.exampleRoute}';

  @NgModule({
    imports: [${options.componentModule.name}],
    declarations: [${options.exampleComponent.component}],
  })
  export class ${options.examplesModule} {}`;
}

/**
 * Function to update the module files.
 * @param options
 */
function updateModules(options: DtExampleExtendedOptions): Rule {
  return (host: Tree) => {
    try {
      // add import
      const modulePath = join(
        'libs',
        'examples',
        'src',
        options.dashName,
        `${options.dashName}-examples.module.ts`,
      );
      const sourceFile = getSourceFile(host, modulePath);

      const importChange = addImport(
        sourceFile,
        options.exampleComponent.component,
        options.exampleRoute,
        modulePath,
      );
      // find last module in the array, and add new module
      const modulesDeclaration = findNodes(
        sourceFile,
        ts.SyntaxKind.PropertyAssignment,
      ).find(
        (node: ts.PropertyAssignment) => node.name.getText() === 'declarations',
      ) as ts.PropertyAssignment;
      const modulesElements = (
        modulesDeclaration.initializer as ts.ArrayLiteralExpression
      ).elements;
      const lastElement = modulesElements[modulesElements.length - 1];
      const end = modulesElements.hasTrailingComma
        ? lastElement.getEnd() + 1
        : lastElement.getEnd();
      const routesChange = new InsertChange(
        modulePath,
        end,
        `${modulesElements.hasTrailingComma ? ' ' : ', '}${
          options.exampleComponent.component
        }`,
      );

      return commitChanges(host, [importChange, routesChange], modulePath);
    } catch (error) {
      throw new Error(
        `There was a problem updating ${options.dashName}-examples.module.ts ${error.message}`,
      );
    }
  };
}

/**
 * Function to update the index file.
 * @param options
 */
function updateIndex(options: DtExampleExtendedOptions): Rule {
  return (host: Tree) => {
    try {
      // add export to index.ts
      const indexPath = join(
        'libs',
        'examples',
        'src',
        options.dashName,
        'index.ts',
      );
      const sourceIndexFile = getSourceFile(host, indexPath);
      const exportChange = addExport(
        sourceIndexFile,
        options.exampleRoute,
        indexPath,
      );

      return commitChanges(host, exportChange, indexPath);
    } catch (error) {
      throw new Error(
        `There was a problem updating 'libs/examples/src/${options.dashName}/index.ts' : ${error.message}`,
      );
    }
  };
}

/**
 * The main function of the example schematics.
 * @param options
 */
export default function (options: DtComponentExampleOptions): Rule {
  return (tree: Tree, schematicContext: SchematicContext) => {
    const dashName = strings.dasherize(options.component);
    const exampleId = `${dashName}-${strings.dasherize(options.name)}`;
    const extendedOptions: DtExampleExtendedOptions = {
      ...options,
      componentSelector: `dt-${dashName}`,
      selector: `dt-example-${strings.dasherize(options.name)}-${dashName}`,
      componentModule: generateComponentOptions(options),
      exampleComponent: generateExampleComponentOptions(options),
      examplesModule: `DtExamples${strings.classify(options.component)}Module`,
      exampleRoute: `${exampleId}-example/${exampleId}-example`,
      exampleId,
      dashName: dashName,
    };

    // Generating files from file templates, and moving them to their path.
    const templateSource = apply(url('./files'), [
      template({
        ...strings,
        ...extendedOptions,
      }),
      move(
        normalize(
          `${EXAMPLES_SOURCE_PATH}${dashName}/${dashName}-${strings.dasherize(
            options.name,
          )}-example`,
        ),
      ),
    ]);

    const indexPath = normalize(`${EXAMPLES_SOURCE_PATH}${dashName}/index.ts`);

    const isNewComponent = !tree.exists(indexPath);

    // If the example is for a new component, so there are no other examples for
    // for this component yet, we have to generate the index and module files.
    if (isNewComponent) {
      tree.create(indexPath, generateBarrelFileContent(extendedOptions));

      const modulePath = normalize(
        `${EXAMPLES_SOURCE_PATH}${dashName}/${dashName}-examples.module.ts`,
      );
      tree.create(modulePath, generateModuleFileContent(extendedOptions));
    }

    return chain([
      mergeWith(templateSource),
      isNewComponent ? noop() : updateModules(extendedOptions),
      isNewComponent ? noop() : updateIndex(extendedOptions),
      isNewComponent ? updateExamplesModule(extendedOptions) : noop(),
      updateExamplesBarrel(extendedOptions, isNewComponent),
      changeRoutingModule(extendedOptions),
      changeNavigation(extendedOptions, isNewComponent),
      formatFiles(),
    ])(tree, schematicContext);
  };
}
