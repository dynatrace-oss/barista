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

/** Creates a browser MouseEvent with the specified options. */
export function createMouseEvent(
  type: string,
  x: number = 0,
  y: number = 0,
): MouseEvent {
  const event = document.createEvent('MouseEvent');

  event.initMouseEvent(
    type,
    false /* canBubble */,
    type !== 'mousemove' /* cancelable */,
    window /* view */,
    0 /* detail */,
    x /* screenX */,
    y /* screenY */,
    x /* clientX */,
    y /* clientY */,
    false /* ctrlKey */,
    false /* altKey */,
    false /* shiftKey */,
    false /* metaKey */,
    0 /* button */,
    null /* relatedTarget */,
  );

  return event;
}

/** Creates a browser TouchEvent with the specified pointer coordinates. */
export function createTouchEvent(
  type: string,
  pageX: number = 0,
  pageY: number = 0,
): UIEvent {
  const event = new UIEvent(type, {
    cancelable: true,
    bubbles: true,
    view: window,
    detail: 0,
  });

  const touchDetails = { pageX, pageY };
  // Most of the browsers don't have a "initTouchEvent" method that can be used to define
  // the touch details.
  Object.defineProperties(event, {
    touches: { value: [touchDetails] },
    targetTouches: { value: [touchDetails] },
    changedTouches: { value: [touchDetails] },
  });

  return event;
}

/** Dispatches a keydown event from an element. */
export function createKeyboardEvent(
  type: string,
  code: string,
  _target?: Element,
  key?: string,
): KeyboardEvent;
export function createKeyboardEvent(
  type: string,
  keyCode: number,
  _target?: Element,
  key?: string,
): KeyboardEvent;
export function createKeyboardEvent(
  type: string,
  keycodeOrCode: string | number,
  _target?: Element,
  key?: string,
): KeyboardEvent {
  const initializer: KeyboardEventInit = {
    key,
    bubbles: true,
    cancelable: true,
    view: window,
  };

  if (typeof keycodeOrCode === 'number') {
    (initializer as any).keyCode = keycodeOrCode;
  } else {
    initializer.code = keycodeOrCode;
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const event = new KeyboardEvent(type, initializer);
  const originalPreventDefault = event.preventDefault;

  // IE won't set `defaultPrevented` on synthetic events so we need to do it manually.
  event.preventDefault = function (): void {
    Object.defineProperty(event, 'defaultPrevented', { get: () => true });
    // eslint-disable-next-line prefer-rest-params
    return originalPreventDefault.apply(this, arguments);
  };

  return event;
}

/** Creates a fake event object with any desired event type. */
export function createFakeEvent(
  type: string,
  canBubble: boolean = false,
  cancelable: boolean = true,
): Event {
  const event = document.createEvent('Event');
  event.initEvent(type, canBubble, cancelable);
  return event;
}
