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
import * as inquirer from 'inquirer';
import { parse } from 'semver';
import { createVersionChoice, promptForNewVersion } from './new-version-prompt';
import * as recommendBump from './recommend-bump';

test('Should offer the correct choices in the prompt', async () => {
  jest.spyOn(console, 'log').mockImplementation();
  jest.spyOn(recommendBump, 'recommendBump').mockImplementation(async () => ({
    level: 0,
    reason: 'There are 11 BREAKING CHANGES and 5 features',
    releaseType: 'major',
  }));

  expect.assertions(1);

  jest
    .spyOn(inquirer, 'prompt')
    .mockImplementation((questions: inquirer.QuestionCollection<any>) => {
      expect(questions[0].choices).toEqual(
        expect.arrayContaining([
          { value: '6.0.0', releaseType: 'major', name: expect.any(String) },
          { value: '5.1.0', releaseType: 'minor', name: expect.any(String) },
          { value: '5.0.1', releaseType: 'patch', name: expect.any(String) },
          { value: 'custom', releaseType: undefined, name: expect.any(String) },
        ]),
      );
      // this is ugly - inquirer monkey patching onto a promise - looks solid as a rock
      const prom = new Promise(() => {}) as Promise<any> & { ui: any };
      return (prom.ui = {} as any);
    });

  await promptForNewVersion(parse('5.0.0')!);
});

test('should create a major version for rc', async () => {
  const currentVersion = parse('5.0.0-rc.0')!;
  const prompt = createVersionChoice(currentVersion, 'major', 'Major release');

  expect(prompt).toEqual({
    name: 'Major release (5.0.0)',
    releaseType: 'major',
    value: '5.0.0',
  });
});

test('should create a newer patch version for 5.0.1', async () => {
  const currentVersion = parse('5.0.1')!;
  const prompt = createVersionChoice(currentVersion, 'patch', 'Patch release');

  expect(prompt).toEqual({
    name: 'Patch release (5.0.2)',
    releaseType: 'patch',
    value: '5.0.2',
  });
});

test('should create a newer minor version for 5.1.1', async () => {
  const currentVersion = parse('5.1.1')!;
  const prompt = createVersionChoice(currentVersion, 'minor', 'Minor release');

  expect(prompt).toEqual({
    name: 'Minor release (5.2.0)',
    releaseType: 'minor',
    value: '5.2.0',
  });
});

test('should create a newer major version for 5.1.1', async () => {
  const currentVersion = parse('5.1.1')!;
  const prompt = createVersionChoice(currentVersion, 'major', 'Major release');

  expect(prompt).toEqual({
    name: 'Major release (6.0.0)',
    releaseType: 'major',
    value: '6.0.0',
  });
});
