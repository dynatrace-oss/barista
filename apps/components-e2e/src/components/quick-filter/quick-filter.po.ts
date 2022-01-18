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

export const quickFilterGroup = Selector('.dt-quick-filter-group');
export const quickFilterBackButton = Selector('.dt-back-to-quick-filter');
export const filterFieldInput = Selector('.dt-filter-field-input');

/** get a group headline */
const groupHeadline = (group: string) =>
  quickFilterGroup.child('.dt-quick-filter-group-headline').withText(group);

/** get a group by its name */
export const getGroup = (group: string) => groupHeadline(group).sibling();

/** get all items inside a group */
export const getGroupItems = (group: string) =>
  getGroup(group).find('.dt-radio-button,.dt-checkbox');

/** get a group item by its group and its name */
export const getGroupItem = (group: string, item: string) =>
  getGroupItems(group).withText(item);

/** get the native input of the specified group item */
export const getGroupItemInput = (group: string, item: string) =>
  getGroupItem(group, item).child('label').child('input');

/** get the selected item of the group */
export const getSelectedItem = (groupText: string) =>
  getGroup(groupText).child('.dt-checkbox-checked, .dt-radio-checked');

/** Get the show more text of a group */
export const getShowMoreText = (group: string) =>
  groupHeadline(group).sibling('.dt-quick-filter-show-more-text').innerText;

/** Get the show more button of a group */
export const getShowMoreButton = (group: string) =>
  groupHeadline(group).sibling('button');
