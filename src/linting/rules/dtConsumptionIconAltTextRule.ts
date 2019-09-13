import { NgWalker } from 'codelyzer';
import { IRuleMetadata, RuleFailure, Rules } from 'tslint';
import { SourceFile } from 'typescript';

import { createAltTextVisitor } from '../utils';

/**
 * The dtConsumptionIconAltTextRule ensures that a `dt-consumption-icon` always either
 * has an `aria-label` or an `aria-labelledby` attribute set.
 *
 * The following example passes the lint checks:
 * <dt-consumption>
 *   <dt-consumption-icon aria-label="Host">
 *     <dt-icon name="host"></dt-icon>
 *   </dt-consumption-icon>
 * </dt-consumption>
 *
 * For the following example the linter throws errors:
 * <dt-consumption>
 *   <dt-consumption-icon>
 *     <dt-icon name="host"></dt-icon>
 *   </dt-consumption-icon>
 * </dt-consumption>
 */
export class Rule extends Rules.AbstractRule {
  static readonly metadata: IRuleMetadata = {
    description:
      'Ensures that a dt-consumption-icon always either has an `aria-label` or an `aria-labelledby` attribute set.',
    options: null, // tslint:disable-line:no-null-keyword
    optionsDescription: 'Not configurable.',
    rationale:
      'A dt-consumption-icon must always have an aria-label or an aria-labelledby attribute that describes the element.',
    ruleName: 'dt-consumption-icon-alt-text',
    type: 'maintainability',
    typescriptOnly: true,
  };

  apply(sourceFile: SourceFile): RuleFailure[] {
    return this.applyWithWalker(
      new NgWalker(sourceFile, this.getOptions(), {
        templateVisitorCtrl: createAltTextVisitor('dt-consumption-icon'),
      }),
    );
  }
}
