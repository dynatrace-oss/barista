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
import { getJsDoc } from 'tsutils';
import * as ts from 'typescript';

import {
  MemberDeclaration,
  StateContainer,
  createMemberDeclarationWalker,
  verifyGetterSetterState,
} from './utils';

function hasInternalAnnotation(declaration: MemberDeclaration): boolean {
  const jsDoc = getJsDoc(declaration);

  for (const doc of jsDoc) {
    if (doc.tags) {
      for (const tag of doc.tags) {
        if (tag.tagName.text === 'internal') {
          return true;
        }
      }
    }
  }
  return false;
}

function verifyInternalDeclarationStartsWithUnderscore(
  context: WalkContext<any>, // tslint:disable-line:no-any
  declaration: MemberDeclaration,
  state?: StateContainer,
): void {
  if (state === undefined) {
    throw new Error('state must not be undefined');
  }

  if (
    declaration.name.kind === ts.SyntaxKind.Identifier &&
    declaration.name.text.charAt(0) !== '_' &&
    verifyGetterSetterState(
      hasInternalAnnotation(declaration),
      declaration,
      state,
    )
  ) {
    context.addFailureAtNode(
      declaration,
      `Member '${declaration.name.text}' is annotated with @internal but does not start with an underscore`,
    );
  }
}

const MATCH_REGEX = /src\/lib\/(?:[\w-]+\/)*[\w-]+(?!\.spec)\.ts$/i;

/**
 * The dtInternalFieldsUnderscoreRule ensures that all fields annotated with
 * `@internal` start with an underscore.
 *
 * The following example passes the lint checks:
 * /** @internal This field is internal *\/
 * _internalProperty = 'I am private';
 *
 * For the following example the linter throws errors:
 * /** @internal This field is internal *\/
 * internalProperty = 'I am supposed to be private';
 */
export class Rule extends Rules.AbstractRule {
  static readonly metadata: IRuleMetadata = {
    description:
      'Ensures that all fields annotated with `@internal` start with an underscore.',
    options: null, // tslint:disable-line:no-null-keyword
    optionsDescription: 'Not configurable.',
    rationale:
      'All members annotated with `@internal` should also start with an underscore to make it obvious that they have to be considered private and should not be accessed from outside the library.',
    ruleName: 'dt-internal-fields-underscore',
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
      createMemberDeclarationWalker(
        verifyInternalDeclarationStartsWithUnderscore,
        {},
      ),
      this.getOptions(),
    );

    // stopMonitoring(Rule.metadata.ruleName);

    return ruleFailures;
  }
}
