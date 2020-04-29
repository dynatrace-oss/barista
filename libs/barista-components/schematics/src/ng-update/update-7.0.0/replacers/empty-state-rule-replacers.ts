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

const EMPTY_STATE = 'dt-empty-state';

export const TO_REPLACE_EMPTY_STATE = [
  {
    to: EMPTY_STATE,
    from: 'dt-empty-state-item-img',
  },
  {
    to: EMPTY_STATE,
    from: 'dt-table-empty-state-message',
  },
  {
    to: EMPTY_STATE,
    from: 'dt-table-empty-state-title',
  },
  {
    to: EMPTY_STATE,
    from: 'dt-table-empty-state',
  },
  {
    to: '',
    from: ' dtTableEmptyState',
  },
  {
    to: EMPTY_STATE,
    from: 'dt-cta-card-title-actions',
  },
  {
    to: EMPTY_STATE,
    from: 'dt-cta-card-title',
  },
  {
    to: EMPTY_STATE,
    from: 'dt-cta-card-image',
  },
  {
    to: EMPTY_STATE,
    from: 'dt-cta-card-footer-actions',
  },
];
