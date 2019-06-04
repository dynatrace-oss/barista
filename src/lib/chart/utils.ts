import { fromEvent, Observable, merge } from 'rxjs';

/**
 * @internal
 * Captures an event on multiple elements and merges them to one stream.
 * returns this merged stream.
 */
export function captureAndMergeEvents<
  E extends Element,
  T extends keyof WindowEventMap
>(type: T, elements: E[]): Observable<WindowEventMap[T]> {
  return merge(
    ...elements
      .filter(Boolean)
      .map((element: E) => fromEvent<WindowEventMap[T]>(element, type))
  );
}

/** @internal Check if an event target is the left or right handle  */
export function identifyLeftOrRightHandle(event: MouseEvent): 'left' | 'right' | null {
  const target = event.target;

  if (!!target && target instanceof Element) {
    if (target.className.includes('dt-chart-right-handle')) {
      return 'right';
    }
    if (target.className.includes('dt-chart-left-handle')) {
      return 'left';
    }
  }
  return null;
}

/**
 * Sets the {top, left, width, height} of an element
 */
export function setPosition(
  element: HTMLElement,
  bounding: Partial<ClientRect>
): void {
  const elementStyle: CSSStyleDeclaration = element.style;
  if (bounding.top) {
    elementStyle.top = `${bounding.top}px`;
  }
  if (bounding.left) {
    elementStyle.left = `${bounding.left}px`;
  }
  if (bounding.width) {
    elementStyle.width = `${bounding.width}px`;
  }
  if (bounding.height) {
    elementStyle.height = `${bounding.height}px`;
  }
}

export function getScrollOffset(): { x: number; y: number } {
  if (!document || !document.documentElement) {
    return {
      x: 0,
      y: 0,
    };
  }

  return {
    x: document.documentElement.scrollLeft || document.body.scrollLeft,
    y: document.documentElement.scrollTop || document.body.scrollTop,
  };
}

export function getMousePosition(event: MouseEvent): { x: number; y: number } {
  return {
    x: event.clientX,
    y: event.clientY,
  };
}

export function getRelativeMousePosition(
  event: MouseEvent,
  container: HTMLElement
): { x: number; y: number } {
  const { x: clientX, y: clientY } = getMousePosition(event);
  const boundingClientRect = container.getBoundingClientRect();
  const scroll = getScrollOffset();

  // tslint:disable-next-line no-magic-numbers
  const borderSize = (boundingClientRect.width - container.clientWidth) / 2;
  const offsetLeft = boundingClientRect.left + scroll.x;
  const offsetTop = boundingClientRect.top + scroll.y;

  return {
    x:
      clientX -
      borderSize -
      (offsetLeft - window.pageXOffset) +
      container.scrollLeft,
    y:
      clientY -
      borderSize -
      (offsetTop - window.pageYOffset) +
      container.scrollTop,
  };
}
