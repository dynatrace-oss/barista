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

function verifyDeclarationIsAnnotatedAsInternal(
  context: WalkContext<any>, // tslint:disable-line:no-any
  declaration: MemberDeclaration,
  state?: StateContainer,
): void {
  if (state === undefined) {
    throw new Error('state must not be undefined');
  }

  if (
    !hasModifier(
      declaration.modifiers,
      ts.SyntaxKind.PrivateKeyword,
      ts.SyntaxKind.ProtectedKeyword,
    ) &&
    declaration.name.kind === ts.SyntaxKind.Identifier &&
    declaration.name.text.charAt(0) === '_' &&
    !verifyGetterSetterState(
      hasInternalAnnotation(declaration),
      declaration,
      state,
    )
  ) {
    context.addFailureAtNode(
      declaration,
      `De-facto private member '${declaration.name.text}' is not annotated with @internal`,
    );
  }
}

const MATCH_REGEX = /src\/lib\/(?:[\w-]+\/)*[\w-]+(?!\.spec)\.ts$/i;

/**
 * The dtAnnotateInternalFieldsRule ensures that all public fields with names
 * that start with an underscore are annotated as `@internal`.
 *
 * The following example passes the lint checks:
 * /** @internal This field is internal *\/
 * _internalProperty = 'I am private';
 *
 * For the following example the linter throws errors:
 * _internalProperty = 'I am supposed to be private';
 */
export class Rule extends Rules.AbstractRule {
  static readonly metadata: IRuleMetadata = {
    description:
      'Ensures that all public fields with names that start with an underscore are annotated as `@internal`.',
    options: null, // tslint:disable-line:no-null-keyword
    optionsDescription: 'Not configurable.',
    rationale:
      'All members of a class or interface that start with an underscore should not be accessed from outside the library.',
    ruleName: 'dt-annotate-internal-fields',
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
      createMemberDeclarationWalker(verifyDeclarationIsAnnotatedAsInternal, {}),
      this.getOptions(),
    );

    // stopMonitoring(Rule.metadata.ruleName);

    return ruleFailures;
  }
}
