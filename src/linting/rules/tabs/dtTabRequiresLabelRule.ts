import { ElementAst } from '@angular/compiler';
import { BasicTemplateAstVisitor, NgWalker } from 'codelyzer';
import { IRuleMetadata, RuleFailure, Rules } from 'tslint';
import { SourceFile } from 'typescript';
import { addFailure, isElementWithName, findChildByAttribute, ChildNode } from '../../utils';

class DtTabVisitor extends BasicTemplateAstVisitor {

  visitElement(element: ElementAst, context: any): any {
    this._validateElement(element);
    super.visitElement(element, context);
  }

  private _validateElement(element: ElementAst): any {
    if (!isElementWithName(element, 'dt-tab')) {
      return;
    }

    const dtTabLabelChildren: ChildNode[] = [];
    findChildByAttribute(element, 'dtTabLabel', 0, dtTabLabelChildren);

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
      })
    );
  }
}
