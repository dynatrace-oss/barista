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
  IOptions,
  IRuleMetadata,
  RuleFailure,
  RuleWalker,
  Rules,
} from 'tslint';
import * as ts from 'typescript';

const ORIGINAL_CLASS_NAME_IMPORT_DIR = '../../../core/decorators';

const FAILURE_STRING = `The imports in the docs/components/../exmaples folder have to be
from the same folder, or from the node_modules. In case that it get consumed from
htttp://barista.dynatrace.com/ as a flat folder structure.
Except the OriginalClassName import from '../../../core/decorators'! `;

class DocsImportRuleWalker extends RuleWalker {
  constructor(sourceFile: ts.SourceFile, options: IOptions) {
    super(sourceFile, options);
  }

  visitImportDeclaration(node: ts.ImportDeclaration): void {
    const moduleSpecifier = (node.moduleSpecifier as ts.StringLiteral).text;
    if (
      !moduleSpecifier.match(ORIGINAL_CLASS_NAME_IMPORT_DIR) &&
      moduleSpecifier.match(/\.\./gm)
    ) {
      this.addFailureAt(
        node.getStart(),
        node.getWidth(),
        `${FAILURE_STRING}\n${node.getText()}`,
      );
    }

    super.visitImportDeclaration(node);
  }
}

const MATCH_REGEX = /\/docs\/components\/[-\w]+\/examples\/.+\.ts$/;

/**
 * Implementation of the dt-docs-import-barista rule.
 */
// tslint:disable-next-line:max-classes-per-file
export class Rule extends Rules.AbstractRule {
  static metadata: IRuleMetadata = {
    description:
      'Only import files from the same directory, or from node_modules in the docs!',
    options: null, // tslint:disable-line no-null-keyword
    optionsDescription: '',
    ruleName: 'dt-docs-import-barista',
    type: 'maintainability',
    typescriptOnly: true,
  };

  apply(sourceFile: ts.SourceFile): RuleFailure[] {
    if (!MATCH_REGEX.test(sourceFile.fileName)) {
      return [];
    }

    // startMonitoring(Rule.metadata.ruleName);

    const ruleFailures = this.applyWithWalker(
      new DocsImportRuleWalker(sourceFile, this.getOptions()),
    );

    // stopMonitoring(Rule.metadata.ruleName);

    return ruleFailures;
  }
}
