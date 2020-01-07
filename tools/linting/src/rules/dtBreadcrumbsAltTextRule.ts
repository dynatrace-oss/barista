/**
 * @license
 * Copyright 2020 Dynatrace LLC
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

import { NgWalker } from 'codelyzer';
import { IRuleMetadata, RuleFailure, Rules } from 'tslint';
import { SourceFile } from 'typescript';

import { createAltTextVisitor } from '../utils';

/**
 * The dtBreadcrumbsAltTextRule ensures that a `dt-breadcrumbs` always either
 * has an `aria-label` or an `aria-labelledby` attribute set.
 *
 * The following example passes the lint checks:
 * <dt-breadcrumbs aria-label="Description goes here"></dt-breadcrumbs>
 *
 * For the following example the linter throws errors:
 * <dt-breadcrumbs></dt-breadcrumbs>
 */
export class Rule extends Rules.AbstractRule {
  static readonly metadata: IRuleMetadata = {
    description:
      'Ensures that a dt-breadcrumbs always either has an `aria-label` or an `aria-labelledby` attribute set.',
    options: null, // tslint:disable-line:no-null-keyword
    optionsDescription: 'Not configurable.',
    rationale:
      'A dt-breadcrumbs must always have an aria-label or an aria-labelledby attribute that describes the element.',
    ruleName: 'dt-breadcrumbs-alt-text',
    type: 'maintainability',
    typescriptOnly: true,
  };

  apply(sourceFile: SourceFile): RuleFailure[] {
    return this.applyWithWalker(
      new NgWalker(sourceFile, this.getOptions(), {
        templateVisitorCtrl: createAltTextVisitor('dt-breadcrumbs'),
      }),
    );
  }
}
