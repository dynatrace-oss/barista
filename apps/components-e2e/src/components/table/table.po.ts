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

export const disableButton = Selector('#disable-toggle');
export const changeOrderButton = Selector('#change-order');
export const setEmptyDataButton = Selector('#set-empty-data');
export const setLoadingButton = Selector('#set-loading');
export const emptyState = Selector('.dt-empty-state');
export const loadingDistractor = Selector('dt-loading-distractor');
export const dragHandles = Selector('.dt-order-cell-icon');
export const orderInputs = Selector('.dt-order-cell-input');
export const expandButtons = Selector('.dt-expandable-cell .dt-button');
export const dataCells = Selector('.dt-cell.dt-table-column-name');

export const getDragDistance = async (
  currentIndex: number,
  targetIndex: number,
): Promise<number> => {
  const posY = await Selector('.dt-row')
    .nth(currentIndex)
    .getBoundingClientRectProperty('top');
  const targetPosY = await Selector('.dt-row')
    .nth(targetIndex)
    .getBoundingClientRectProperty('top');

  // Round this value as testCafe expects the dragOffset
  // to be an interger and due to rounding issues,
  // boundingClientBoxes can restult in floating point
  // issues.
  return Math.round(targetPosY - posY);
};
