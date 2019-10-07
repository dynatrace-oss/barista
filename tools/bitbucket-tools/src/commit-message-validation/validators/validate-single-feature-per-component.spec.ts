import { splitStringIntoCommitMessage } from '../split-message-into-components';
import { PrError } from '../validate-commits-in-pull-request';
import { validateSingleFeaturePerComponent } from './validate-single-feature-per-component';

describe('Single feature commit per scope', () => {
  test('should pass if two features are in different scopes', () => {
    const commits = [
      splitStringIntoCommitMessage('feat(button): Added a button feature'),
      splitStringIntoCommitMessage('feat(card): Added a card feature'),
    ];
    expect(validateSingleFeaturePerComponent(commits)).toBeUndefined();
  });

  test('should pass if there are no feature commits', () => {
    const commits = [
      splitStringIntoCommitMessage('chore(button): Added a button chore'),
      splitStringIntoCommitMessage('fix(card): Added a card fix'),
    ];
    expect(validateSingleFeaturePerComponent(commits)).toBeUndefined();
  });

  test('should pass if there is a single feature commit with a combined scope', () => {
    const commits = [
      splitStringIntoCommitMessage('fix(card, button): Added a card fix'),
    ];
    expect(validateSingleFeaturePerComponent(commits)).toBeUndefined();
  });

  test('should fail if two feature commits are in the same scope', () => {
    const commits = [
      splitStringIntoCommitMessage('feat(button): Added a button feature'),
      splitStringIntoCommitMessage('feat(button): Added a card feature'),
    ];
    expect(validateSingleFeaturePerComponent(commits)).toBeInstanceOf(PrError);
  });

  test('should fail if two feature commits are in similar scopes', () => {
    const commits = [
      splitStringIntoCommitMessage('feat(button): Added a button feature'),
      splitStringIntoCommitMessage('feat(button, card): Added a card feature'),
    ];
    expect(validateSingleFeaturePerComponent(commits)).toBeInstanceOf(PrError);
  });
});
