import { NgWalker } from 'codelyzer';
import { IRuleMetadata, RuleFailure, Rules } from 'tslint';
import { SourceFile } from 'typescript';

import { createAltTextVisitor } from '<%= category ? '../../' : '../' %>utils';

/**
 * The <%= camelize(name) %>Rule ensures that a `<%= alttext %>` always either
 * has an `aria-label` or an `aria-labelledby` attribute set.
 *
 * The following example passes the lint checks:
 * <<%= alttext %> aria-label="Description goes here"></<%= alttext %>>
 *
 * For the following example the linter throws errors:
 * <<%= alttext %>></<%= alttext %>>
 */
export class Rule extends Rules.AbstractRule {
  static readonly metadata: IRuleMetadata = {
    description:
      'Ensures that a <%= alttext %> always either has an `aria-label` or an `aria-labelledby` attribute set.',
    options: null, // tslint:disable-line:no-null-keyword
    optionsDescription: 'Not configurable.',
    rationale:
      'A <%= alttext %> must always have an aria-label or an aria-labelledby attribute that describes the element.',
    ruleName: '<%= name %>',
    type: 'maintainability',
    typescriptOnly: true,
  };

  apply(sourceFile: SourceFile): RuleFailure[] {
    return this.applyWithWalker(
      new NgWalker(sourceFile, this.getOptions(), {
        templateVisitorCtrl: createAltTextVisitor('<%= alttext %>'),
      }),
    );
  }
}
