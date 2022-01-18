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
  createFakeEvent,
  createKeyboardEvent,
  createMouseEvent,
} from './event-objects';

/** Utility to dispatch any event on a Node. */
export function dispatchEvent(node: Node | Window, event: Event): Event {
  node.dispatchEvent(event);
  return event;
}

/** Shorthand to dispatch a fake event on a specified node. */
export function dispatchFakeEvent(
  node: Node | Window,
  type: string,
  canBubble?: boolean,
): Event {
  return dispatchEvent(node, createFakeEvent(type, canBubble));
}

/** Shorthand to dispatch a keyboard event with a specified code */
export function dispatchKeyboardEvent(
  node: Node,
  type: string,
  code: string,
  target?: Element,
): KeyboardEvent;
/** Shorthand to dispatch a keyboard event with a specified key code. */
export function dispatchKeyboardEvent(
  node: Node,
  type: string,
  keyCode: number,
  target?: Element,
): KeyboardEvent;
export function dispatchKeyboardEvent(
  node: Node,
  type: string,
  keycodeOrCode: number | string,
  target?: Element,
): KeyboardEvent {
  if (typeof keycodeOrCode === 'number') {
    return dispatchEvent(
      node,
      createKeyboardEvent(type, keycodeOrCode, target),
    ) as KeyboardEvent;
  } else {
    return dispatchEvent(
      node,
      createKeyboardEvent(type, keycodeOrCode, target),
    ) as KeyboardEvent;
  }
}

/** Shorthand to dispatch a mouse event on the specified coordinates. */
export function dispatchMouseEvent(
  node: Node | Window,
  type: string,
  x: number = 0,
  y: number = 0,
  event: MouseEvent = createMouseEvent(type, x, y),
): MouseEvent {
  return dispatchEvent(node, event) as MouseEvent;
}
