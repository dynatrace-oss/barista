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

import { EmbeddedTemplateAst } from '@angular/compiler';
import { BasicTemplateAstVisitor, NgWalker } from 'codelyzer';
import { IRuleMetadata, RuleFailure, Rules } from 'tslint';
import { SourceFile } from 'typescript';

import { addFailure, hasContent } from '../../utils';

class DtTabVisitor extends BasicTemplateAstVisitor {
  visitEmbeddedTemplate(template: EmbeddedTemplateAst, context: any): void {
    this._validateElement(template);
    super.visitEmbeddedTemplate(template, context);
  }

  private _validateElement(element: EmbeddedTemplateAst): any {
    if (!this._isTabLabel(element)) {
      return;
    }

    if (hasContent(element)) {
      return;
    }

    addFailure(
      this,
      element,
      'A dtTabLabel must always contain text. Make sure this is the case even if you use nested components to render text.',
    );
  }

  private _isTabLabel(element: EmbeddedTemplateAst): boolean {
    return (
      element.attrs && element.attrs.some(attr => attr.name === 'dtTabLabel')
    );
  }
}

/**
 * The dtTabLabelNoEmptyRule ensures that a dtTabLabel always contains content
 *
 * The following example passes the check:
 * <ng-template dtTabLabel>Traffic</ng-template>
 *
 * For the following example the linter throws an error:
 * <ng-template dtTabLabel> </ng-template>
 */
export class Rule extends Rules.AbstractRule {
  static readonly metadata: IRuleMetadata = {
    description: 'Ensures that a dtTabLabel always contains text content.',
    // tslint:disable-next-line:no-null-keyword
    options: null,
    optionsDescription: 'Not configurable.',
    rationale:
      'A dtTabLabel must always contain text. Make sure this is the case even if you use nested components to render text.',
    ruleName: 'dt-tab-label-no-empty',
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
