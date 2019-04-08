import { ElementAst } from '@angular/compiler';
import { BasicTemplateAstVisitor, NgWalker } from 'codelyzer';
import { IRuleMetadata, RuleFailure, Rules } from 'tslint';
import { SourceFile } from 'typescript';
import { childNode, findChild } from '../helpers';

class DtCardVisitor extends BasicTemplateAstVisitor {

  // tslint:disable-next-line no-any
  visitElement(element: ElementAst, context: any): any {
    this._validateElement(element);
    super.visitElement(element, context);
  }
  
  // tslint:disable-next-line no-any
  private _validateElement(element: ElementAst): any {
    if (element.name !== 'dt-card') {
      return;
    }

    const directChildren = [
      'dt-card-title',
      'dt-card-subtitle',
      'dt-card-icon',
      'dt-card-title-actions',
      'dt-card-footer-actions',
    ];

    let childNodes: childNode[] = [];
    directChildren.forEach((childName) => {
      findChild(element, childName, 0, childNodes);
    });

    const filteredChildren: string[] = childNodes
      .filter((el) => el.level > 1)
      .map((el) => el.name);
    
    if (filteredChildren.length < 1) {
      return;
    }

    const childrenNames = Array.from(new Set(filteredChildren));

    const startOffset = element.sourceSpan.start.offset;
    const endOffset = element.sourceSpan.end.offset;
    this.addFailureFromStartToEnd(startOffset, endOffset, `The following elements must be direct children of a dt-card: ${childrenNames.join(', ')}`);
  }
}

/**
 * The dtCardDirectChildrenRule ensures that the defined elements are always direct children of a dt-card.
 *
 * The following example passes the check:
 * <dt-card>
 *   <dt-card-title>Top 3 JavaScript errors</dt-card-title>
 *   <dt-card-subtitle>Detailed information about JavaScript errors</dt-card-subtitle>
 *   // ...
 * </dt-card>
 *
 * For the following example the linter throws an error:
 * <dt-card>
 *   <dt-card-title>Top 3 JavaScript errors</dt-card-title>
 *   <div>
 *     <dt-card-subtitle>Detailed information about JavaScript errors</dt-card-subtitle>
 *   </div>
 *   // ...
 * </dt-card>
 */
// tslint:disable-next-line:max-classes-per-file
export class Rule extends Rules.AbstractRule {

  static readonly metadata: IRuleMetadata = {
    description: 'Ensures that a card\'s child components are direct children of a dt-card.',
    // tslint:disable-next-line no-null-keyword
    options: null,
    optionsDescription: 'Not configurable.',
    rationale: 'A card\'s child components (title, subtitle, actions, ...) must always be direct children of the dt-card.',
    ruleName: 'dt-card-direct-children',
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
