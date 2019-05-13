import { ElementAst } from '@angular/compiler';
import { BasicTemplateAstVisitor, NgWalker } from 'codelyzer';
import { IRuleMetadata, RuleFailure, Rules } from 'tslint';
import { SourceFile } from 'typescript';
import { addFailure, isDirectChild, isElementWithName } from '../utils';

class DtInfoGroupVisitor extends BasicTemplateAstVisitor {

  visitElement(element: ElementAst, context: any): void {
    this._validateElement(element);
    super.visitElement(element, context);
  }

  private _validateElement(element: ElementAst): any {
    if (!isElementWithName(element, 'dt-info-group')) {
      return;
    }

    const hasDtInfoGroupIcon = isDirectChild(element, 'dt-info-group-icon');

    if (hasDtInfoGroupIcon) {
      return;
    }

    addFailure(this, element, 'A dt-info-group must always contain a dt-info-group-icon as direct child.');
  }
}

/**
 * The dtInfoGroupRequiresIconRule ensures that an info group always contains a title and an icon.
 *
 * The following example passes the lint checks:
 * <dt-info-group>
 *   <dt-info-group-icon><dt-icon name="agent"></dt-icon></dt-info-group-icon>
 *   <dt-info-group-title>5 min 30 s</dt-info-group-title>
 *   Session duration
 * </dt-info-group>
 *
 * For the following example the linter throws an error:
 * <dt-info-group>
 *   <dt-info-group-title>5 min 30 s</dt-info-group-title>
 *   Session duration
 * </dt-info-group>
 */
export class Rule extends Rules.AbstractRule {

  static readonly metadata: IRuleMetadata = {
    description: 'Ensures that an info group always has an icon.',
    // tslint:disable-next-line:no-null-keyword
    options: null,
    optionsDescription: 'Not configurable.',
    rationale: 'An info group must always contain a dt-info-group-icon.',
    ruleName: 'dt-info-group-requires-icon',
    type: 'maintainability',
    typescriptOnly: true,
  };

  apply(sourceFile: SourceFile): RuleFailure[] {
    return this.applyWithWalker(
      new NgWalker(sourceFile, this.getOptions(), {
        templateVisitorCtrl: DtInfoGroupVisitor,
      })
    );
  }
}
