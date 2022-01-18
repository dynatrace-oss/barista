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

import {
  AnimationTriggerMetadata,
  animate,
  state,
  style,
  transition,
  trigger,
} from '@angular/animations';

export const dtDrawerAnimation: AnimationTriggerMetadata[] = [
  trigger('transform', [
    state('open, open-instant', style({ transform: 'none' })),
    transition('closed => open-instant', animate('0ms')),
    transition(
      'closed <=> open, open-instant => closed',
      animate('400ms cubic-bezier(0.25, 0.8, 0.25, 1)'),
    ),
  ]),
];
