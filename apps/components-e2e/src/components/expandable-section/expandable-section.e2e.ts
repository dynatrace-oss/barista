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
import { Selector } from 'testcafe';

const toggle = Selector('#btnToggle');
const open = Selector('#open');
const buttonOpen = Selector('#btnOpen');
const buttonDisable = Selector('#btnDisable');
const labelHeader = Selector('#lblHeader');

fixture('Expandable Section').page('http://localhost:4200/expandable-section');

test('should toggle', async (testController: TestController) => {
  await testController
    .click(toggle, { speed: 0.5 })
    .expect(open.textContent)
    .eql('true')
    .click(toggle, { speed: 0.5 })
    .expect(open.textContent)
    .eql('false');
});

test('should execute click handlers when not disabled', async (testController: TestController) => {
  await testController
    .expect(open.textContent)
    .eql('false')
    .click(buttonOpen, { speed: 0.5 })
    .expect(open.textContent)
    .eql('true');
});

test('should not execute click handlers when disabled', async (testController: TestController) => {
  await testController
    .click(buttonDisable, { speed: 0.5 })
    .click(buttonOpen, { speed: 0.5 })
    .expect(open.textContent)
    .eql('false');
});

test('should close after disabling open section', async (testController: TestController) => {
  await testController
    .click(buttonOpen, { speed: 0.5 })
    .expect(open.textContent)
    .eql('true')
    .click(buttonDisable, { speed: 0.5 })
    .expect(open.textContent)
    .eql('false');
});

test('should open on label click', async (testController: TestController) => {
  await testController
    .click(labelHeader, { speed: 0.5 })
    .expect(open.textContent)
    .eql('true');
});
