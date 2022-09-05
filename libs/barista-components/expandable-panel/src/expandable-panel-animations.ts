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

export const dtExpandablePanelAnimation: AnimationTriggerMetadata[] = [
  /**
   * There is a bug in Angular's animation 'state' that causes the animation state to become void upon leaving the dom.
   * This can lead to a situation for the expansion panel where the state
   * of the panel is `expanded` or `collapsed` but the animation state is `void`.
   *
   * To correctly handle animating to the next state, we animate between `void` and `collapsed` which
   * are defined to have the same styles. Since angular animates from the current styles to the
   * destination state's style definition, in situations where we are moving from `void`'s styles to
   * `collapsed` this acts a noop since no style values change.
   *
   * Thanks to Angular material docs for finding this out here:
   * https://github.com/angular/components/blob/main/src/material/expansion/expansion-animations.ts
   *
   * Angular Bug: https://github.com/angular/angular/issues/18847
   */
  trigger('animationState', [
    state('collapsed, void', style({ height: '0px', visibility: 'hidden' })),
    state(
      'expanded',
      style({ height: '*', visibility: 'visible', overflow: 'visible' }),
    ),
    transition(
      'expanded <=> collapsed, void => collapsed',
      animate('225ms cubic-bezier(0.4,0.0,0.2,1)'),
    ),
  ]),
];
