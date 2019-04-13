import { EmbeddedTemplateAst } from '@angular/compiler';
import { BasicTemplateAstVisitor, NgWalker } from 'codelyzer';
import { IRuleMetadata, RuleFailure, Rules } from 'tslint';
import { SourceFile } from 'typescript';
import { addFailure, hasContent } from '../helpers';

class DtTabVisitor extends BasicTemplateAstVisitor {

  visitEmbeddedTemplate(template: EmbeddedTemplateAst, context: any): any {
    this._validateElement(template);
    super.visitEmbeddedTemplate(template, context);
  }

  private _validateElement(element: EmbeddedTemplateAst): any {
    if (!this._isTabContent(element)) {
      return;
    }

    if (hasContent(element)) {
      return;
    }

    addFailure(this, element, 'A dtTabContent must always contain content.');
  }

  private _isTabContent(element: EmbeddedTemplateAst): boolean {
    return element.attrs &&
      element.attrs.some((attr) => attr.name === 'dtTabContent');
  }
}

/**
 * The dtTabContentNoEmptyRule ensures that a dtTabContent always contains content
 *
 * The following example passes the check:
 * <ng-template dtTabContent>
 *   <h3>Traffic</h3>
 * </ng-template>
 *
 * For the following example the linter throws an error:
 * <ng-template dtTabContent>
 * </ng-template>
 */
export class Rule extends Rules.AbstractRule {

  static readonly metadata: IRuleMetadata = {
    description: 'Ensures that a dtTabContent always contains content.',
    // tslint:disable-next-line:no-null-keyword
    options: null,
    optionsDescription: 'Not configurable.',
    rationale: 'A dtTabContent must always contain content.',
    ruleName: 'dt-tab-content-no-empty',
    type: 'maintainability',
    typescriptOnly: true,
  };

  apply(sourceFile: SourceFile): RuleFailure[] {
    return this.applyWithWalker(
      new NgWalker(sourceFile, this.getOptions(), {
        templateVisitorCtrl: DtTabVisitor,
      })
    );
  }
}
