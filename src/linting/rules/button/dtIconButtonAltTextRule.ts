import { NgWalker } from 'codelyzer';
import { IRuleMetadata, RuleFailure, Rules } from 'tslint';
import { SourceFile } from 'typescript';

import { createAltTextVisitor } from '../../utils';

/**
 * The dtIconButtonAltTextRule ensures that a `dt-icon-button` always either
 * has an `aria-label` or an `aria-labelledby` attribute set.
 *
 * The following example passes the lint checks:
 * <dt-icon-button aria-label="Description goes here"></dt-icon-button>
 *
 * For the following example the linter throws errors:
 * <dt-icon-button></dt-icon-button>
 */
export class Rule extends Rules.AbstractRule {
  static readonly metadata: IRuleMetadata = {
    description:
      'Ensures that a dt-icon-button always either has an `aria-label` or an `aria-labelledby` attribute set.',
    options: null, // tslint:disable-line:no-null-keyword
    optionsDescription: 'Not configurable.',
    rationale:
      'A dt-icon-button must always have an aria-label or an aria-labelledby attribute that describes the element.',
    ruleName: 'dt-icon-button-alt-text',
    type: 'maintainability',
    typescriptOnly: true,
  };

  apply(sourceFile: SourceFile): RuleFailure[] {
    return this.applyWithWalker(
      new NgWalker(sourceFile, this.getOptions(), {
        templateVisitorCtrl: createAltTextVisitor(
          ['button', 'a'],
          'dt-icon-button',
        ),
      }),
    );
  }
}
