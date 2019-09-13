import { Result } from 'axe-core';

const ARIA_IDENTIFIER = 'ARIA';

export const validationMatcher: jasmine.CustomMatcherFactories = {
  /**
   * CustomMatcher is only called when there is a violation.
   * The function builds a message with the 'rule', 'selectors' and if available the aria-labels of the violation.
   * Returns CustomMatchetResult with the built message.
   */
  toBeValid(
    _util: jasmine.MatchersUtil,
    _customEqualityTesters: jasmine.CustomEqualityTester[],
  ): jasmine.CustomMatcher {
    return {
      compare(analysis: Result): jasmine.CustomMatcherResult {
        const result: jasmine.CustomMatcherResult = {
          pass: false,
          message: '',
        };

        result.message = `${analysis.help} / \n`;
        result.message += buildMessage(analysis);
        if (analysis.help.includes(ARIA_IDENTIFIER)) {
          const nodes = analysis.nodes;
          let labels = '';
          nodes.forEach(node => {
            const violationData = node.any;
            violationData.forEach(data => {
              labels += `\n${data.message}`;
            });
          });
          result.message += labels;
        }

        return result;
      },
    };
  },
};

function buildMessage(violation: Result): string {
  return violation.nodes
    .map(node => node.target.join(' '))
    .reduce((content, selector) => `${content}-${selector}\n`, '');
}
