/**
 * @license
 * Copyright 2020 Dynatrace LLC
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
import { dtAutocompleteDef } from '@dynatrace/barista-components/filter-field';
import { buildData } from './reducer';

test('should build the data with an object', () => {
  const data = { name: 'Linz' };
  const autocomplete = dtAutocompleteDef(data, null, [], false, false);
  expect(buildData(autocomplete)).toMatchObject([data]);
});

test('should build the data with undefined', () => {
  const data = undefined;
  const autocomplete = dtAutocompleteDef(data, null, [], false, false);

  expect(buildData(autocomplete)).toMatchObject([data]);
});
