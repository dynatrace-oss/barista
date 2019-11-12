import { ElementAst } from '@angular/compiler';
import { BasicTemplateAstVisitor, NgWalker } from 'codelyzer';
import { IRuleMetadata, RuleFailure, Rules } from 'tslint';
import { SourceFile } from 'typescript';

import { addFailure, findChild, isElementWithName } from '../../utils';

class DtTabGroupVisitor extends BasicTemplateAstVisitor {
  visitElement(element: ElementAst, context: any): void {
    this._validateElement(element);
    super.visitElement(element, context);
  }

  private _validateElement(element: ElementAst): any {
    if (!isElementWithName(element, 'dt-tab-group')) {
      return;
    }

    const dtTabChildren = findChild(element, 'dt-tab', 0);

    if (dtTabChildren.length > 1) {
      return;
    }

    addFailure(this, element, 'A dt-tab-group must contain at least two tabs.');
  }
}

/**
 * The dtTabGroupRequiresTabsRule ensures that a dt-tab-group always contains at least two tabs.
 *
 * The following examples pass the lint checks:
 * <dt-tab-group>
 *   <dt-tab disabled>
 *    ...
 *   </dt-tab>
 *   <dt-tab>
 *    ...
 *   </dt-tab>
 * </dt-tab-group>
 *
 * For the following examples the linter throws errors:
 * <dt-tab-group>
 *   <dt-tab disabled>
 *    ...
 *   </dt-tab>
 * </dt-tab-group>
 */
export class Rule extends Rules.AbstractRule {
  static readonly metadata: IRuleMetadata = {
    description: 'Ensures that a dt-tab-group contains at least two tabs.',
    // tslint:disable-next-line:no-null-keyword
    options: null,
    optionsDescription: 'Not configurable.',
    rationale: 'A dt-tab-group must always contain at least two tabs.',
    ruleName: 'dt-tab-group-requires-tabs',
    type: 'maintainability',
    typescriptOnly: true,
  };

  apply(sourceFile: SourceFile): RuleFailure[] {
    return this.applyWithWalker(
      new NgWalker(sourceFile, this.getOptions(), {
        templateVisitorCtrl: DtTabGroupVisitor,
      }),
    );
  }
}
