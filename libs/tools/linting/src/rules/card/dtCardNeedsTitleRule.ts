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

import { ElementAst } from '@angular/compiler';
import { BasicTemplateAstVisitor, NgWalker } from 'codelyzer';
import { IRuleMetadata, RuleFailure, Rules } from 'tslint';
import { SourceFile } from 'typescript';

import { addFailure, isDirectChild, isElementWithName } from '../../utils';

class DtCardVisitor extends BasicTemplateAstVisitor {
  visitElement(element: ElementAst, context: any): void {
    this._validateElement(element);
    super.visitElement(element, context);
  }

  private _validateElement(element: ElementAst): any {
    if (
      !isElementWithName(element, 'dt-card') ||
      isDirectChild(element, 'dt-card-title')
    ) {
      return;
    }

    addFailure(
      this,
      element,
      'A dt-card must contain a dt-card-title element, that must be a direct child.',
    );
  }
}

/**
 * The dtCardNeedsTitleRule ensures that a card always contains a title.
 * The title must be a direct child of the dt-card.
 *
 * The following example passes the lint checks:
 * <dt-card>
 *   <dt-card-title>Top 3 JavaScript errors</dt-card-title>
 *   // ...
 * </dt-card>
 *
 * For the following example the linter throws an error:
 * <dt-card>
 *   <dt-card-subtitle>Top 3 JavaScript errors</dt-card-subtitle>
 *   // ...
 * </dt-card>
 */
export class Rule extends Rules.AbstractRule {
  static readonly metadata: IRuleMetadata = {
    description:
      'Ensures that a card always has a title, that is a direct child of dt-card.',
    // tslint:disable-next-line:no-null-keyword
    options: null,
    optionsDescription: 'Not configurable.',
    rationale:
      'A card must always contain a dt-card-title, that is a direct child of dt-card.',
    ruleName: 'dt-card-needs-title',
    type: 'maintainability',
    typescriptOnly: true,
  };

  apply(sourceFile: SourceFile): RuleFailure[] {
    return this.applyWithWalker(
      new NgWalker(sourceFile, this.getOptions(), {
        templateVisitorCtrl: DtCardVisitor,
      }),
    );
  }
}
