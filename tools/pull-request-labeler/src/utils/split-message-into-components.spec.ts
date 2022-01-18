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

import { splitStringIntoCommitMessage } from './split-message-into-components';
import { CommitTypes } from '../interfaces/commit-message';

it('should split a feature commit correctly', () => {
  const message = 'feat(ng-update): Added test for .spec file';
  const split = splitStringIntoCommitMessage(message);
  expect(split.breakingChange).toBeFalsy();
  expect(split.releaseCommit).toBeFalsy();
  expect(split.components).toEqual(['ng-update']);
  expect(split.message).toBe('Added test for .spec file');
  expect(split.type).toBe(CommitTypes.FEAT);
});

it('should split a fix commit correctly', () => {
  const message = 'fix(ng-update): Added test for .spec file';
  const split = splitStringIntoCommitMessage(message);
  expect(split.breakingChange).toBeFalsy();
  expect(split.releaseCommit).toBeFalsy();
  expect(split.components).toEqual(['ng-update']);
  expect(split.message).toBe('Added test for .spec file');
  expect(split.type).toBe(CommitTypes.FIX);
});

it('should split a chore commit correctly', () => {
  const message = 'chore: Bump something';
  const split = splitStringIntoCommitMessage(message);
  expect(split.breakingChange).toBeFalsy();
  expect(split.releaseCommit).toBeFalsy();
  expect(split.components).toEqual([]);
  expect(split.message).toBe('Bump something');
  expect(split.type).toBe(CommitTypes.CHORE);
});

it('should split a barista commit correctly', () => {
  const message = 'barista: Some design system changes';
  const split = splitStringIntoCommitMessage(message);
  expect(split.breakingChange).toBeFalsy();
  expect(split.releaseCommit).toBeFalsy();
  expect(split.components).toEqual([]);
  expect(split.message).toBe('Some design system changes');
  expect(split.type).toBe(CommitTypes.BARISTA);
});

it('should split a build commit correctly', () => {
  const message = 'build: Some build system changes';
  const split = splitStringIntoCommitMessage(message);
  expect(split.breakingChange).toBeFalsy();
  expect(split.releaseCommit).toBeFalsy();
  expect(split.components).toEqual([]);
  expect(split.message).toBe('Some build system changes');
  expect(split.type).toBe(CommitTypes.BUILD);
});

it('should split a ci commit correctly', () => {
  const message = 'ci: Some ci system changes';
  const split = splitStringIntoCommitMessage(message);
  expect(split.breakingChange).toBeFalsy();
  expect(split.releaseCommit).toBeFalsy();
  expect(split.components).toEqual([]);
  expect(split.message).toBe('Some ci system changes');
  expect(split.type).toBe(CommitTypes.CI);
});

it('should split a docs commit correctly', () => {
  const message = 'docs: Some docs changes';
  const split = splitStringIntoCommitMessage(message);
  expect(split.breakingChange).toBeFalsy();
  expect(split.releaseCommit).toBeFalsy();
  expect(split.components).toEqual([]);
  expect(split.message).toBe('Some docs changes');
  expect(split.type).toBe(CommitTypes.DOCS);
});

it('should split a perf commit correctly', () => {
  const message = 'perf: Some performance changes';
  const split = splitStringIntoCommitMessage(message);
  expect(split.breakingChange).toBeFalsy();
  expect(split.releaseCommit).toBeFalsy();
  expect(split.components).toEqual([]);
  expect(split.message).toBe('Some performance changes');
  expect(split.type).toBe(CommitTypes.PERF);
});

it('should split a refactor commit correctly', () => {
  const message = 'refactor: Some refactor changes';
  const split = splitStringIntoCommitMessage(message);
  expect(split.breakingChange).toBeFalsy();
  expect(split.releaseCommit).toBeFalsy();
  expect(split.components).toEqual([]);
  expect(split.message).toBe('Some refactor changes');
  expect(split.type).toBe(CommitTypes.REFACTOR);
});

it('should split a style commit correctly', () => {
  const message = 'style: Some style changes';
  const split = splitStringIntoCommitMessage(message);
  expect(split.breakingChange).toBeFalsy();
  expect(split.releaseCommit).toBeFalsy();
  expect(split.components).toEqual([]);
  expect(split.message).toBe('Some style changes');
  expect(split.type).toBe(CommitTypes.STYLE);
});

it('should split a test commit correctly', () => {
  const message = 'test: Some test changes';
  const split = splitStringIntoCommitMessage(message);
  expect(split.breakingChange).toBeFalsy();
  expect(split.releaseCommit).toBeFalsy();
  expect(split.components).toEqual([]);
  expect(split.message).toBe('Some test changes');
  expect(split.type).toBe(CommitTypes.TEST);
});

it('should split a multiple components correctly', () => {
  const message = 'feat(ng-update, autocomplete): Added test for .spec file';
  const split = splitStringIntoCommitMessage(message);
  expect(split.breakingChange).toBeFalsy();
  expect(split.releaseCommit).toBeFalsy();
  expect(split.components).toEqual(['ng-update', 'autocomplete']);
  expect(split.message).toBe('Added test for .spec file');
  expect(split.type).toBe(CommitTypes.FEAT);
});

it('should split a multiline message correctly', () => {
  const message = `fix(chart): Fixes an issue where tooltips in pie/donut charts did not work anymore

Fixes an issue where the tooltip was not updated when a different series was hovered on the same x-datapoint`;
  const split = splitStringIntoCommitMessage(message);
  expect(split.breakingChange).toBeFalsy();
  expect(split.releaseCommit).toBeFalsy();
  expect(split.components).toEqual(['chart']);
  expect(split.message)
    .toBe(`Fixes an issue where tooltips in pie/donut charts did not work anymore

Fixes an issue where the tooltip was not updated when a different series was hovered on the same x-datapoint`);
  expect(split.type).toBe(CommitTypes.FIX);
});

it('should detect release commits correctly', () => {
  const message = 'chore: Bump version to 5.0.0 w/ changelog';
  const split = splitStringIntoCommitMessage(message);
  expect(split.breakingChange).toBeFalsy();
  expect(split.releaseCommit).toBeTruthy();
  expect(split.components).toEqual([]);
  expect(split.message).toBe('Bump version to 5.0.0 w/ changelog');
  expect(split.type).toBe(CommitTypes.CHORE);
});

it('should detect breaking changes in single-line', () => {
  const message = 'feat: Changed something critical BREAKING CHANGE.';
  const split = splitStringIntoCommitMessage(message);
  expect(split.breakingChange).toBeTruthy();
  expect(split.releaseCommit).toBeFalsy();
  expect(split.components).toEqual([]);
  expect(split.message).toBe('Changed something critical BREAKING CHANGE.');
  expect(split.type).toBe(CommitTypes.FEAT);
});

it('should detect breaking changes in multi-line', () => {
  const message = `feat(filter-field): Improves typing for the data structures the default-data-source takes.

BREAKING CHANGE: Changes the typing for the default-data-source to better match the data structures.`;
  const split = splitStringIntoCommitMessage(message);
  expect(split.breakingChange).toBeTruthy();
  expect(split.releaseCommit).toBeFalsy();
  expect(split.components).toEqual(['filter-field']);
  expect(split.message)
    .toBe(`Improves typing for the data structures the default-data-source takes.

BREAKING CHANGE: Changes the typing for the default-data-source to better match the data structures.`);
  expect(split.type).toBe(CommitTypes.FEAT);
});
