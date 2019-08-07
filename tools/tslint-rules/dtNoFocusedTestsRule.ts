// tslint:disable: deprecation
import {
  IOptions,
  IRuleMetadata,
  RuleFailure,
  Rules,
  RuleWalker,
} from 'tslint';
import * as ts from 'typescript';

const MATCHER = ['describe', 'it', 'test'];
const FORBIDDEN_FOCUS = ['only', 'skip'];

class NoFocusedRuleWalker extends RuleWalker {
  constructor(sourceFile: ts.SourceFile, options: IOptions) {
    super(sourceFile, options);
  }

  visitCallExpression(node: ts.CallExpression): void {
    if (
      ts.isPropertyAccessExpression(node.expression) &&
      ts.isIdentifier(node.expression.expression) &&
      MATCHER.includes(node.expression.expression.text) &&
      ts.isIdentifier(node.expression.name) &&
      FORBIDDEN_FOCUS.includes(node.expression.name.text)
    ) {
      this.addFailureAt(node.getStart(), node.getWidth(), Rule.FAILURE_STRING);
    }
    super.visitCallExpression(node);
  }
}

const MATCH_REGEX = /.+\.(spec|test|e2e)\.ts$/;

/**
 * Implementation of the dt-no-focused-tests rule
 */
export class Rule extends Rules.AbstractRule {
  static metadata: IRuleMetadata = {
    description:
      'Disallows skipping or prioritizing tests with `it.skip`, `it.only` or `describe.only`',
    options: null,
    optionsDescription: 'Not configurable',
    ruleName: 'dt-no-focused-tests',
    type: 'functionality',
    typescriptOnly: true,
  };

  static FAILURE_STRING = 'Focused tests are not allowed';

  apply(sourceFile: ts.SourceFile): RuleFailure[] {
    if (!MATCH_REGEX.test(sourceFile.fileName)) {
      return [];
    }

    // startMonitoring(Rule.metadata.ruleName);

    const ruleFailures = this.applyWithWalker(
      new NoFocusedRuleWalker(sourceFile, this.getOptions()),
    );

    // stopMonitoring(Rule.metadata.ruleName);

    return ruleFailures;
  }
}
