import { ElementAst } from '@angular/compiler';
import { BasicTemplateAstVisitor, NgWalker } from 'codelyzer';
import { IRuleMetadata, RuleFailure, Rules } from 'tslint';
import { SourceFile } from 'typescript';
import { childNode, findChild } from '../helpers';

class DtTileVisitor extends BasicTemplateAstVisitor {

  // tslint:disable-next-line no-any
  visitElement(element: ElementAst, context: any): any {
    this._validateElement(element);
    super.visitElement(element, context);
  }
  
  // tslint:disable-next-line no-any
  private _validateElement(element: ElementAst): any {
    if (element.name !== 'dt-tile') {
      return;
    }

    const directChildren = [
      'dt-tile-title',
      'dt-tile-subtitle',
      'dt-tile-icon',
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
    this.addFailureFromStartToEnd(startOffset, endOffset, `The following elements must be direct children of a dt-tile: ${childrenNames.join(', ')}`);
  }
}

/**
 * The dtTileDirectChildrenRule ensures that the defined elements are always direct children of a dt-tile.
 *
 * The following example passes the check:
 * <dt-tile>
 *   <dt-tile-icon><dt-icon name="agent"></dt-icon></dt-tile-icon>
 *   <dt-tile-title>L-W8-64-APMDay3</dt-tile-title>
 *   // ...
 * </dt-tile>
 *
 * For the following example the linter throws an error:
 * <dt-tile>
 *   <dt-tile-icon><dt-icon name="agent"></dt-icon></dt-tile-icon>
 *   <dt-tile-title>L-W8-64-APMDay3</dt-tile-title>
 *   <div>
 *     <dt-tile-subtitle>Linux (x84, 64-bit)</dt-tile-subtitle>
 *   </div>
 *   // ...
 * </dt-tile>
 */
// tslint:disable-next-line:max-classes-per-file
export class Rule extends Rules.AbstractRule {

  static readonly metadata: IRuleMetadata = {
    description: 'Ensures that a tile\'s child components are direct children of a dt-tile.',
    // tslint:disable-next-line no-null-keyword
    options: null,
    optionsDescription: 'Not configurable.',
    rationale: 'A tile\'s child components (title, subtitle, icon) must always be direct children of the dt-tile.',
    ruleName: 'dt-tile-direct-children',
    type: 'maintainability',
    typescriptOnly: true,
  };

  apply(sourceFile: SourceFile): RuleFailure[] {
    return this.applyWithWalker(
      new NgWalker(sourceFile, this.getOptions(), {
        templateVisitorCtrl: DtTileVisitor,
      }),
    );
  }
}
