import { NgWalker } from 'codelyzer';
import { IRuleMetadata, RuleFailure, Rules } from 'tslint';
import { SourceFile } from 'typescript';

import { createAltTextVisitor } from '../utils';

/**
 * The dtMenuAltTextRule ensures that a `dt-menu` always either
 * has an `aria-label` or an `aria-labelledby` attribute set.
 *
 * The following example passes the lint checks:
 * <dt-menu aria-label="Example Menu">
 *   <a dtMenuItem>Menu item</a>
 * </dt-menu>
 *
 * For the following example the linter throws errors:
 * <dt-menu>
 *   <a dtMenuItem>Menu item</a>
 * </dt-menu>
 */
export class Rule extends Rules.AbstractRule {
  static readonly metadata: IRuleMetadata = {
    description:
      'Ensures that a dt-menu always either has an `aria-label` or an `aria-labelledby` attribute set.',
    options: null, // tslint:disable-line:no-null-keyword
    optionsDescription: 'Not configurable.',
    rationale:
      'A dt-menu must always have an aria-label or an aria-labelledby attribute that describes the element.',
    ruleName: 'dt-menu-alt-text',
    type: 'maintainability',
    typescriptOnly: true,
  };

  apply(sourceFile: SourceFile): RuleFailure[] {
    return this.applyWithWalker(
      new NgWalker(sourceFile, this.getOptions(), {
        templateVisitorCtrl: createAltTextVisitor('dt-menu'),
      }),
    );
  }
}
