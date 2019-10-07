import { splitStringIntoCommitMessage } from './split-message-into-components';

describe('Message string split into CommitMessage', () => {
  test('if a default commit message is detected correctly', () => {
    const inputString =
      '***REMOVED*** fix(filter-field): Fixes an issue where the spinner was placed in an odd positions in certain scenarios. The spinner is now replacing the filter icon in loading states.';
    expect(splitStringIntoCommitMessage(inputString)).toMatchObject({
      issueNumber: '***REMOVED***',
      type: 'fix',
      components: ['filter-field'],
      breakingChange: false,
      releaseCommit: false,
      message:
        'Fixes an issue where the spinner was placed in an odd positions in certain scenarios. The spinner is now replacing the filter icon in loading states.',
      original: inputString,
    });
  });

  test('if a release commit is detected correctly', () => {
    const inputString = 'chore: bump version to 4.8.2 w/ changelog';
    expect(splitStringIntoCommitMessage(inputString)).toMatchObject({
      issueNumber: '',
      type: 'chore',
      components: [],
      breakingChange: false,
      releaseCommit: true,
      message: 'bump version to 4.8.2 w/ changelog',
      original: inputString,
    });
  });

  test('if a commit without an issue number is detected correctly', () => {
    const inputString =
      'build: Adjusted jenkinsfile to match new branching model';
    expect(splitStringIntoCommitMessage(inputString)).toMatchObject({
      issueNumber: '',
      type: 'build',
      components: [],
      breakingChange: false,
      releaseCommit: false,
      message: 'Adjusted jenkinsfile to match new branching model',
      original: inputString,
    });
  });

  test('if a commit with multiple components is detected correctly', () => {
    const inputString =
      'docs(bar-indicator, breadcrumbs, filter-field): Changed content according to pull request feedback.';
    expect(splitStringIntoCommitMessage(inputString)).toMatchObject({
      issueNumber: '',
      type: 'docs',
      components: ['bar-indicator', 'breadcrumbs', 'filter-field'],
      breakingChange: false,
      releaseCommit: false,
      message: 'Changed content according to pull request feedback.',
      original: inputString,
    });
  });

  test('if a commit with a breaking change is detected correctly', () => {
    const inputString =
      '***REMOVED*** feat(filter-field): Improved typing for consumer facing api BREAKING CHANGE';
    expect(splitStringIntoCommitMessage(inputString)).toMatchObject({
      issueNumber: '***REMOVED***',
      type: 'feat',
      components: ['filter-field'],
      breakingChange: true,
      releaseCommit: false,
      message: 'Improved typing for consumer facing api BREAKING CHANGE',
      original: inputString,
    });
  });

  test('if a commit with a special commit message should not result in a breaking change', () => {
    const inputString = 'chore(tslint): set linebreaks to LF ALWAYS';
    expect(splitStringIntoCommitMessage(inputString)).toMatchObject({
      issueNumber: '',
      type: 'chore',
      components: ['tslint'],
      breakingChange: false,
      releaseCommit: false,
      message: 'set linebreaks to LF ALWAYS',
      original: inputString,
    });
  });

  test('if a commit with a breaking change is detected correctly even though semantics are off', () => {
    const inputString =
      '***REMOVED*** feat(filter-field): Improved typing for consumer facing api breakes things';
    expect(splitStringIntoCommitMessage(inputString)).toMatchObject({
      issueNumber: '***REMOVED***',
      type: 'feat',
      components: ['filter-field'],
      breakingChange: true,
      releaseCommit: false,
      message: 'Improved typing for consumer facing api breakes things',
      original: inputString,
    });
  });
});
