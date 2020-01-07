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

import { addFailure, isDirectChild, isElementWithName } from '../utils';

class DtCopyToClipboardVisitor extends BasicTemplateAstVisitor {
  visitElement(element: ElementAst, context: any): void {
    this._validateElement(element);
    super.visitElement(element, context);
  }

  private _validateElement(element: ElementAst): any {
    if (
      !isElementWithName(element, 'dt-copy-to-clipboard') ||
      isDirectChild(element, 'dt-copy-to-clipboard-label')
    ) {
      return;
    }

    addFailure(
      this,
      element,
      'A dt-copy-to-clipboard must contain a dt-copy-to-clipboard-label element, that must be a direct child.',
    );
  }
}

/**
 * The dtCopyToClipboardNoEmptyRule ensures that the copy to clipboard component
 * always contains a dt-copy-to-clipboard-label as direct child.
 *
 * The following example passes the lint checks:
 * <dt-copy-to-clipboard>
 *   <textarea dtInput>https://defaultcopy.dynatrace.com/</textarea>
 *   <dt-copy-to-clipboard-label>Copy</dt-copy-to-clipboard-label>
 * </dt-copy-to-clipboard>
 *
 * For the following example the linter throws an error:
 * <dt-copy-to-clipboard>
 *   <textarea dtInput>https://defaultcopy.dynatrace.com/</textarea>
 *   Copy
 * </dt-copy-to-clipboard>
 */
export class Rule extends Rules.AbstractRule {
  static readonly metadata: IRuleMetadata = {
    description:
      'Ensures that the dt-copy-to-clipboard component always has a label, that is a direct child.',
    // tslint:disable-next-line:no-null-keyword
    options: null,
    optionsDescription: 'Not configurable.',
    rationale:
      'The copy-to-clipboard component must always contain a dt-copy-to-clipboard-label, that is a direct child of dt-copy-to-clipboard.',
    ruleName: 'dt-copy-to-clipboard-no-empty',
    type: 'maintainability',
    typescriptOnly: true,
  };

  apply(sourceFile: SourceFile): RuleFailure[] {
    return this.applyWithWalker(
      new NgWalker(sourceFile, this.getOptions(), {
        templateVisitorCtrl: DtCopyToClipboardVisitor,
      }),
    );
  }
}
