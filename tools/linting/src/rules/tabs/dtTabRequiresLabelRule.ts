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

import {
  addFailure,
  findChildByAttribute,
  isElementWithName,
} from '../../utils';

class DtTabVisitor extends BasicTemplateAstVisitor {
  visitElement(element: ElementAst, context: any): void {
    this._validateElement(element);
    super.visitElement(element, context);
  }

  private _validateElement(element: ElementAst): any {
    if (!isElementWithName(element, 'dt-tab')) {
      return;
    }

    const dtTabLabelChildren = findChildByAttribute(element, 'dtTabLabel', 0);

    if (dtTabLabelChildren.length > 0) {
      return;
    }

    addFailure(this, element, 'A dt-tab must always contain a dtTabLabel.');
  }
}

/**
 * The dtTabRequiresLabelRule ensures that a dt-tab always has a label.
 *
 * The following example passes the check:
 * <dt-tab>
 *   <ng-template dtTabLabel>Packets</ng-template>
 *   <ng-template dtTabContent>
 *     <h3>Packets</h3>
 *   </ng-template>
 * </dt-tab>
 *
 * For the following example the linter throws an error:
 * <dt-tab>
 *   <ng-template dtTabContent>
 *     <h3>Packets</h3>
 *   </ng-template>
 * </dt-tab>
 */
export class Rule extends Rules.AbstractRule {
  static readonly metadata: IRuleMetadata = {
    description: 'Ensures that a dt-tab always has a label.',
    // tslint:disable-next-line:no-null-keyword
    options: null,
    optionsDescription: 'Not configurable.',
    rationale: 'A dt-tab must always have a label.',
    ruleName: 'dt-tab-requires-label',
    type: 'maintainability',
    typescriptOnly: true,
  };

  apply(sourceFile: SourceFile): RuleFailure[] {
    return this.applyWithWalker(
      new NgWalker(sourceFile, this.getOptions(), {
        templateVisitorCtrl: DtTabVisitor,
      }),
    );
  }
}
