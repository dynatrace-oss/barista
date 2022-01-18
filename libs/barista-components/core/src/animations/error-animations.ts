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
  animation,
  animate,
  style,
  AnimationReferenceMetadata,
} from '@angular/animations';

export const DT_ERROR_ENTER_ANIMATION: AnimationReferenceMetadata = animation([
  style({ opacity: 0, transform: 'scaleY(0)' }),
  animate('150ms cubic-bezier(0.55, 0, 0.55, 0.2)'),
]);

export const DT_ERROR_ENTER_DELAYED_ANIMATION: AnimationReferenceMetadata =
  animation([
    style({ opacity: 0, transform: 'scaleY(0)' }),
    animate(`250ms 150ms cubic-bezier(0.55, 0, 0.55, 0.2)`),
  ]);
