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

import { IRuleMetadata, RuleFailure, Rules, WalkContext } from 'tslint';
import { getJsDoc, hasModifier } from 'tsutils';
import * as ts from 'typescript';

import {
  MemberDeclaration,
  StateContainer,
  createMemberDeclarationWalker,
  verifyGetterSetterState,
} from './utils';

const lifecycleHooks = new Set<string>([
  'ngOnChanges',
  'ngOnInit',
  'ngDoCheck',
  'ngAfterContentInit',
  'ngAfterContentChecked',
  'ngAfterViewInit',
  'ngAfterViewChecked',
  'ngOnDestroy',
]);

function verifyDeclarationHasJSDoc(
  context: WalkContext<any>, // tslint:disable-line:no-any
  declaration: MemberDeclaration,
  state?: StateContainer,
): void {
  if (state === undefined) {
    throw new Error('state must not be undefined');
  }

  if (
    !hasModifier(declaration.modifiers, ts.SyntaxKind.PrivateKeyword) &&
    declaration.name.kind === ts.SyntaxKind.Identifier &&
    declaration.name.text.charAt(0) !== '_' &&
    !lifecycleHooks.has(declaration.name.text) &&
    !verifyGetterSetterState(
      getJsDoc(declaration).length > 0,
      declaration,
      state,
    )
  ) {
    context.addFailureAtNode(
      declaration,
      `Non-private member '${declaration.name.text}' lacks JSDoc`,
    );
  }
}

const MATCH_REGEX = /src\/lib\/(?:[\w-]+\/)*[\w-]+(?!\.spec)\.ts$/i;

/**
 * The dtDocumentPublicFieldsRule ensures that all non-private fields with
 * names that do not start with an underscore are documented with JSDoc`.
 *
 * The following example passes the lint checks:
 * /** Property that holds a string. *\/
 * property = 'I am public';
 *
 * For the following example the linter throws errors:
 * property = 'I am public but have no idea what I am doing here...';
 */
export class Rule extends Rules.AbstractRule {
  static readonly metadata: IRuleMetadata = {
    description: 'Ensures that all non-private fields have JSDoc.',
    options: null, // tslint:disable-line:no-null-keyword
    optionsDescription: 'Not configurable.',
    rationale:
      'Public and protected fields should always be documented so users of the library know what they are for.',
    ruleName: 'dt-document-public-fields',
    type: 'maintainability',
    typescriptOnly: true,
  };

  apply(sourceFile: ts.SourceFile): RuleFailure[] {
    if (!MATCH_REGEX.test(sourceFile.fileName)) {
      return [];
    }

    // startMonitoring(Rule.metadata.ruleName);

    const ruleFailures = this.applyWithFunction(
      sourceFile,
      createMemberDeclarationWalker(verifyDeclarationHasJSDoc, {}),
      this.getOptions(),
    );

    // stopMonitoring(Rule.metadata.ruleName);

    return ruleFailures;
  }
}
