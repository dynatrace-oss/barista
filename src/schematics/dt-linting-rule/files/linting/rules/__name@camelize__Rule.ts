import { ElementAst } from '@angular/compiler';
import { BasicTemplateAstVisitor, NgWalker } from 'codelyzer';
import { IRuleMetadata, RuleFailure, Rules } from 'tslint';
import { SourceFile } from 'typescript';
import { addFailure } from '../utils';

class <%=classify(name)%>Visitor extends BasicTemplateAstVisitor {
  visitElement(element: ElementAst, context: any): void {
    this._validateElement(element);
    super.visitElement(element, context);
  }

  private _validateElement(element: ElementAst): any {
    addFailure(this, element, 'Something is wrong.');
  }
}

/**
 * The <%=camelize(name)%>Rule ensures that ~~~insert description here~~~.
 *
 * The following example passes the lint checks:
 * ~~~Add example code here~~~
 *
 * For the following example the linter throws errors:
 * ~~~Add example code here~~~
 */
export class Rule extends Rules.AbstractRule {
  static readonly metadata: IRuleMetadata = {
    description: 'Ensures that ~~~insert description here~~~.',
    options: null, // tslint:disable-line:no-null-keyword
    optionsDescription: 'Not configurable.',
    rationale: '~~~insert rationale here~~~.',
    ruleName: '<%=name%>',
    type: 'maintainability',
    typescriptOnly: true,
  };

  apply(sourceFile: SourceFile): RuleFailure[] {
    return this.applyWithWalker(
      new NgWalker(sourceFile, this.getOptions(), {
        templateVisitorCtrl: <%=classify(name)%>Visitor,
      }),
    );
  }
}
