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

import { addFailure, isElementWithName } from '../utils';

class DtToggleButtonGroupVisitor extends BasicTemplateAstVisitor {
  visitElement(element: ElementAst, context: any): void {
    this._validateElement(element);
    super.visitElement(element, context);
  }

  private _validateElement(element: ElementAst): any {
    if (!element.attrs) {
      return;
    }

    const isToggleButtonItem = element.attrs.some(
      attr => attr.name === 'dt-toggle-button-item',
    );
    if (!isToggleButtonItem) {
      return;
    }

    if (isElementWithName(element, 'button')) {
      return;
    }

    addFailure(
      this,
      element,
      'A toggle button group item must always be a button.',
    );
  }
}

/**
 * The dtToggleButtonGroupItemButton ensures that a toggle button group item is always a btuton.
 *
 * The following examples pass the lint checks:
 * <button dt-toggle-button-item value="1">
 *   // ...
 * </button>
 *
 * For the following example the linter throws an error:
 * <a dt-toggle-button-item value="1">
 *   // ...
 * </a>
 */
export class Rule extends Rules.AbstractRule {
  static readonly metadata: IRuleMetadata = {
    description: 'Ensures that a toggle button group item is always a button.',
    // tslint:disable-next-line:no-null-keyword
    options: null,
    optionsDescription: 'Not configurable.',
    rationale: 'A toggle button group item must always be a button.',
    ruleName: 'dt-toggle-button-group-item-is-button',
    type: 'maintainability',
    typescriptOnly: true,
  };

  apply(sourceFile: SourceFile): RuleFailure[] {
    return this.applyWithWalker(
      new NgWalker(sourceFile, this.getOptions(), {
        templateVisitorCtrl: DtToggleButtonGroupVisitor,
      }),
    );
  }
}
