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

import { ElementAst } from '@angular/compiler';
import { BasicTemplateAstVisitor, NgWalker } from 'codelyzer';
import { IRuleMetadata, RuleFailure, Rules } from 'tslint';
import { SourceFile } from 'typescript';

import {
  addFailure,
  hasContentApartFrom,
  hasTextContentAlternative,
  isElementWithName,
} from '../utils';

class DtShowMoreVisitor extends BasicTemplateAstVisitor {
  visitElement(element: ElementAst, context: any): void {
    this._validateElement(element);
    super.visitElement(element, context);
  }

  private _validateElement(element: ElementAst): any {
    if (!isElementWithName(element, 'dt-show-more')) {
      return;
    }

    const showMoreChildren = ['dt-show-less-label'];

    if (
      hasContentApartFrom(element, showMoreChildren) ||
      hasTextContentAlternative(element)
    ) {
      return;
    }

    addFailure(
      this,
      element,
      'A dt-show-more must always contain text or an aria-label/aria-labelledby attribute.',
    );
  }
}

/**
 * The dtShowMoreNoEmpty ensures that a dt-show-more always contains content.
 *
 * The following examples pass the check:
 * <dt-show-more ...>
 *   Show more
 *   <dt-show-less-label>Show less</dt-show-less-label>
 * </dt-show-more>
 * <dt-show-more ... aria-label="Show more data"></dt-show-more>
 *
 * For the following example the linter throws an error:
 * <dt-show-more ...>
 *   <dt-show-less-label>Show less</dt-show-less-label>
 * </dt-show-more>
 */
export class Rule extends Rules.AbstractRule {
  static readonly metadata: IRuleMetadata = {
    description:
      'Ensures that a dt-show-more always contains content or a text alternative.',
    // tslint:disable-next-line:no-null-keyword
    options: null,
    optionsDescription: 'Not configurable.',
    rationale:
      'A dt-show-more must always contain content apart from the dt-show-less-label or a text alternative.',
    ruleName: 'dt-show-more-no-empty',
    type: 'maintainability',
    typescriptOnly: true,
  };

  apply(sourceFile: SourceFile): RuleFailure[] {
    return this.applyWithWalker(
      new NgWalker(sourceFile, this.getOptions(), {
        templateVisitorCtrl: DtShowMoreVisitor,
      }),
    );
  }
}
