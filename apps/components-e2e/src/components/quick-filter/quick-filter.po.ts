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

import { Selector } from 'testcafe';

export const quickFilterCloseButton = Selector('.dt-quick-filter-close');
export const quickFilterOpenButton = Selector('.dt-quick-filter-open');
export const quickFilterGroup = Selector('.dt-quick-filter-group');

/** get a group by its name */
export const getGroup = (group: string) =>
  quickFilterGroup
    .child('.dt-quick-filter-group-headline')
    .withText(group)
    .sibling();

/** get a group item by its group and its name */
export const getGroupItem = (group: string, item: string) =>
  getGroup(group)
    .child('.dt-quick-filter-group-items > *')
    .withText(item);

/** get the native input of the specified group item */
export const getGroupItemInput = (group: string, item: string) =>
  getGroupItem(group, item)
    .child('label')
    .child('input');

/** get the selected item of the group */
export const getSelectedItem = (groupText: string) =>
  getGroup(groupText).child('.dt-checkbox-checked, .dt-radio-checked');
