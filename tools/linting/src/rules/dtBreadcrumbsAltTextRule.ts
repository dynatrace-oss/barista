import { NgWalker } from 'codelyzer';
import { IRuleMetadata, RuleFailure, Rules } from 'tslint';
import { SourceFile } from 'typescript';

import { createAltTextVisitor } from '../utils';

/**
 * The dtBreadcrumbsAltTextRule ensures that a `dt-breadcrumbs` always either
 * has an `aria-label` or an `aria-labelledby` attribute set.
 *
 * The following example passes the lint checks:
 * <dt-breadcrumbs aria-label="Description goes here"></dt-breadcrumbs>
 *
 * For the following example the linter throws errors:
 * <dt-breadcrumbs></dt-breadcrumbs>
 */
export class Rule extends Rules.AbstractRule {
  static readonly metadata: IRuleMetadata = {
    description:
      'Ensures that a dt-breadcrumbs always either has an `aria-label` or an `aria-labelledby` attribute set.',
    options: null, // tslint:disable-line:no-null-keyword
    optionsDescription: 'Not configurable.',
    rationale:
      'A dt-breadcrumbs must always have an aria-label or an aria-labelledby attribute that describes the element.',
    ruleName: 'dt-breadcrumbs-alt-text',
    type: 'maintainability',
    typescriptOnly: true,
  };

  apply(sourceFile: SourceFile): RuleFailure[] {
    return this.applyWithWalker(
      new NgWalker(sourceFile, this.getOptions(), {
        templateVisitorCtrl: createAltTextVisitor('dt-breadcrumbs'),
      }),
    );
  }
}
