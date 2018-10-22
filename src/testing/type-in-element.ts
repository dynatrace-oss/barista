import { dispatchFakeEvent } from './dispatch-events';

/**
 * Focuses an input, sets its value and dispatches
 * the `input` event, simulating the user typing.
 */
export function typeInElement(value: string, element: HTMLInputElement): void {
  element.focus();
  element.value = value;
  dispatchFakeEvent(element, 'input');
}
