import { NgWalker } from 'codelyzer';
import { IRuleMetadata, RuleFailure, Rules } from 'tslint';
import { SourceFile } from 'typescript';

import { createAltTextVisitor } from '../utils';

/**
 * The dtTableSearchAltTextRule ensures that a `dt-table-search` always either
 * has an `aria-label` or an `aria-labelledby` attribute set.
 *
 * The following example passes the lint checks:
 * <dt-table-search aria-label="Description goes here"></dt-table-search>
 *
 * For the following example the linter throws errors:
 * <dt-table-search></dt-table-search>
 */
export class Rule extends Rules.AbstractRule {
  static readonly metadata: IRuleMetadata = {
    description:
      'Ensures that a dt-table-search always either has an `aria-label` or an `aria-labelledby` attribute set.',
    options: null, // tslint:disable-line:no-null-keyword
    optionsDescription: 'Not configurable.',
    rationale:
      'A dt-table-search must always have an aria-label or an aria-labelledby attribute that describes the element.',
    ruleName: 'dt-table-search-alt-text',
    type: 'maintainability',
    typescriptOnly: true,
  };

  apply(sourceFile: SourceFile): RuleFailure[] {
    return this.applyWithWalker(
      new NgWalker(sourceFile, this.getOptions(), {
        templateVisitorCtrl: createAltTextVisitor('dt-table-search'),
      }),
    );
  }
}
