import { ElementAst } from '@angular/compiler';
import { BasicTemplateAstVisitor, NgWalker } from 'codelyzer';
import { IRuleMetadata, RuleFailure, Rules } from 'tslint';
import { SourceFile } from 'typescript';

import {
  addFailure,
  hasTextContentAlternative,
  isElementWithName,
} from '../utils';

class DtBreadcrumbsVisitor extends BasicTemplateAstVisitor {
  visitElement(element: ElementAst, context: any): void {
    this._validateElement(element);
    super.visitElement(element, context);
  }

  private _validateElement(element: ElementAst): any {
    if (!isElementWithName(element, 'dt-breadcrumbs')) {
      return;
    }

    if (hasTextContentAlternative(element)) {
      return;
    }

    addFailure(
      this,
      element,
      'Breadcrumbs must provide an alternative text in form of an aria-label attribute.',
    );
  }
}

/**
 * The dtBreadcrumbsAltTextRule ensures that an aria-label is given for breadcrumbs.
 *
 * The following example passes the lint checks:
 * <dt-breadcrumbs aria-label="Breadcrumbs navigation">
 * ...
 * </dt-breadcrumbs>
 *
 * For the following example the linter throws errors:
 * <dt-breadcrumbs>
 * ...
 * </dt-breadcrumbs>
 *
 */
export class Rule extends Rules.AbstractRule {
  static readonly metadata: IRuleMetadata = {
    description: 'Ensures that text alternatives are given for breadcrumbs.',
    // tslint:disable-next-line:no-null-keyword
    options: null,
    optionsDescription: 'Not configurable.',
    rationale:
      'Breadcrumbs need additional attributes to provide text alternatives.',
    ruleName: 'dt-breadcrumbs-alt-text',
    type: 'maintainability',
    typescriptOnly: true,
  };

  apply(sourceFile: SourceFile): RuleFailure[] {
    return this.applyWithWalker(
      new NgWalker(sourceFile, this.getOptions(), {
        templateVisitorCtrl: DtBreadcrumbsVisitor,
      }),
    );
  }
}
