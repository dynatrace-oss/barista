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
  animate,
  AnimationTriggerMetadata,
  state,
  style,
  transition,
  trigger,
} from '@angular/animations';

/**
 * Reusable fade animation with default parameters that can be overridden
 * by the animation trigger property binding
 * Default animation:
 * _triggerProperty: 'void' | 'state-name' = 'void'
 * Override params:
 * _triggerProperty = { value: 'void', params: { duration: '300ms', easing: 'ease-out' }}
 */
export const dtFadeAnimation: AnimationTriggerMetadata = trigger('fade', [
  state('void', style({ opacity: 0 })),
  transition(':enter', [animate('{{ duration }} {{ easing }}')], {
    params: {
      duration: '150ms',
      easing: 'ease-in-out',
    },
  }),
  transition(':leave', [animate('{{ duration }} {{ easing }}')], {
    params: {
      duration: '150ms',
      easing: 'ease-in-out',
    },
  }),
]);
