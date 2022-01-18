/**
 * @license
 * Copyright 2022 Dynatrace LLC
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

import { processCommitMessages } from './process-commit-messages';

it('should add minor and patch labels to a single chore commits', () => {
  const commits = ['chore: some chore commit'];
  const result = processCommitMessages(commits);
  expect(result.errors).toHaveLength(0);
  expect(result.targets).toEqual(['target: minor', 'target: patch']);
});

it('should add minor and patch labels to a single fix commits', () => {
  const commits = ['fix: Fixes a special bug.'];
  const result = processCommitMessages(commits);
  expect(result.errors).toHaveLength(0);
  expect(result.targets).toEqual(['target: minor', 'target: patch']);
});

it('should add minor and patch labels to multiple mixed non fix/feat/perf commits', () => {
  const commits = [
    'chore: some chore commit.',
    'test: Added some tests.',
    'style: Applied proper code formatting.',
  ];
  const result = processCommitMessages(commits);
  expect(result.errors).toHaveLength(0);
  expect(result.targets).toEqual(['target: minor', 'target: patch']);
});

it('should add minor label if commits include a feature', () => {
  const commits = ['feat: Added a special feature.'];
  const result = processCommitMessages(commits);
  expect(result.errors).toHaveLength(0);
  expect(result.targets).toEqual(['target: minor']);
});

it('should add major lablel if commits include breaking changes', () => {
  const commits = ['feat: Added a special feature BREAKING CHANGE.'];
  const result = processCommitMessages(commits);
  expect(result.errors).toHaveLength(0);
  expect(result.targets).toEqual(['target: major']);
});

it('should fail if there are multiple feature commits present', () => {
  const commits = [
    'feat: Added a special feature.',
    'feat: Added another special feature.',
  ];
  const result = processCommitMessages(commits);
  expect(result.errors).toEqual([
    'There should be no more than one feature commits, within a single pull request, but found 2.',
  ]);
  expect(result.targets).toHaveLength(0);
});

it('should fail if there are multiple fix commits present', () => {
  const commits = [
    'fix: Fixes a special bug.',
    'fix: Fixes another special bug.',
  ];
  const result = processCommitMessages(commits);
  expect(result.errors).toEqual([
    'There should be no more than one fix commits, within a single pull request, but found 2.',
  ]);
  expect(result.targets).toHaveLength(0);
});

it('should fail if there are mixed commits present', () => {
  const commits = [
    'feat: Added a special feature.',
    'fix: Fixes a special bug.',
  ];
  const result = processCommitMessages(commits);
  expect(result.errors).toEqual([
    'Feature and fix commits should not be mixed.',
  ]);
  expect(result.targets).toHaveLength(0);
});

it('should add minor and patch labels to a ds commits', () => {
  const commits = ['ds: Add something for design system.'];
  const result = processCommitMessages(commits);
  expect(result.errors).toHaveLength(0);
  expect(result.targets).toEqual(['target: minor', 'target: patch']);
});
