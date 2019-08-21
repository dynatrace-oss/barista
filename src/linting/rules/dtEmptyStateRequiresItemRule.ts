import { ElementAst } from '@angular/compiler';
import { BasicTemplateAstVisitor, NgWalker } from 'codelyzer';
import { IRuleMetadata, RuleFailure, Rules } from 'tslint';
import { SourceFile } from 'typescript';

import { addFailure, isElementWithName } from '../utils';

class DtEmptyStateItemVisitor extends BasicTemplateAstVisitor {
  visitElement(element: ElementAst, context: any): void {
    this._validateElement(element);
    super.visitElement(element, context);
  }

  private _validateElement(element: ElementAst): any {
    if (!isElementWithName(element, 'dt-empty-state')) {
      return;
    }

    for (const child of element.children) {
      if (isElementWithName(child, 'dt-empty-state-item')) {
        return;
      }
    }

    addFailure(
      this,
      element,
      'dt-empty-state does not contain any dt-empty-state-items.',
    );
  }
}

/**
 * The dtEmptyStateRequiresItemRule ensures that each dt-empty-state
 * component has at least one dt-empty-state-item.
 *
 * The following example passes the lint checks:
 * <dt-empty-state>
 *   <dt-empty-state-item>
 *     <dt-empty-state-item-img>
 *       <img src="/assets/cta-noagent.svg" alt="No agent" />
 *     </dt-empty-state-item-img>
 *     <dt-empty-state-item-title>Some Heading</dt-empty-state-item-title>
 *     Lorem ipsum dolor sit amet, consetetur sadipscing elitr.
 *   </dt-empty-state-item>
 * </dt-empty-state>
 *
 * For the following example the linter throws errors:
 * <dt-empty-state></dt-empty-state>
 */
export class Rule extends Rules.AbstractRule {
  static readonly metadata: IRuleMetadata = {
    description:
      'Ensures that each dt-empty-state component has at least one dt-empty-state-item.',
    options: null, // tslint:disable-line:no-null-keyword
    optionsDescription: 'Not configurable.',
    rationale: 'There is no use case for empty empty-state components.',
    ruleName: 'dt-empty-state-requires-item',
    type: 'maintainability',
    typescriptOnly: true,
  };

  apply(sourceFile: SourceFile): RuleFailure[] {
    return this.applyWithWalker(
      new NgWalker(sourceFile, this.getOptions(), {
        templateVisitorCtrl: DtEmptyStateItemVisitor,
      }),
    );
  }
}
