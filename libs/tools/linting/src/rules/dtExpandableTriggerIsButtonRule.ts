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

class DtExpandableTriggerVisitor extends BasicTemplateAstVisitor {
  visitElement(element: ElementAst, context: any): void {
    this._validateElement(element);
    super.visitElement(element, context);
  }

  private _validateElement(element: ElementAst): any {
    const isExpandablePanelTrigger = element.inputs.some(
      input => input.name === 'dtExpandablePanel',
    );
    if (!isExpandablePanelTrigger) {
      return;
    }

    if (isElementWithName(element, 'button')) {
      return;
    }

    addFailure(
      this,
      element,
      'The trigger of an expandable panel must be a button.',
    );
  }
}

/**
 * The dtExpandableTriggerIsButtonRule ensures that the trigger for an expandable panel is always a button.
 *
 * The following example passes the lint checks:
 * <button dt-button [dtExpandablePanel]="panel">Trigger</button>
 *
 * For the following example the linter throws errors:
 * <span [dtExpandablePanel]="panel">Trigger</span>
 */
export class Rule extends Rules.AbstractRule {
  static readonly metadata: IRuleMetadata = {
    description:
      'Ensures that the trigger of an expandable panel is always a button.',
    // tslint:disable-next-line:no-null-keyword
    options: null,
    optionsDescription: 'Not configurable.',
    rationale: 'The trigger for an expandable panel must be a button.',
    ruleName: 'dt-expandable-trigger-is-button',
    type: 'maintainability',
    typescriptOnly: true,
  };

  apply(sourceFile: SourceFile): RuleFailure[] {
    return this.applyWithWalker(
      new NgWalker(sourceFile, this.getOptions(), {
        templateVisitorCtrl: DtExpandableTriggerVisitor,
      }),
    );
  }
}
