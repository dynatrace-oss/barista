import { map } from 'rxjs/operators';
import { Observable } from 'rxjs';

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

export const rangeInitialStyle = { left: '0px', width: '0px' };

export interface MousePosition {
  x: number;
  y: number;
}

export interface Range {
  left: number;
  width: number;
}

export type RangeInput = [MouseEvent, MousePosition];

/** Custom Rxjs operator to calculate the position of the select range */
export const createRange = (container: HTMLElement) => (
  source: Observable<RangeInput>
): Observable<Range> =>
  source.pipe(
    map(([event, { x, y }]) => {
      const mousePosition: MousePosition = getRelativeMousePosition(
        event,
        container
      );

      const width = mousePosition.x - x;

      const bcr = container.getBoundingClientRect();
      const left = width < 0 ? mousePosition.x : x;

      return {
        left,
        width: Math.abs(width),
      };
    })
  );

export const updateRange = (container: HTMLElement) => (
  source: Observable<[Range, MouseEvent, 'right' | 'left']>
): Observable<Range> =>
  source.pipe(
    map(([range, event, handle]) => {
      const bcr = container.getBoundingClientRect();
      const mousePosition: MousePosition = getRelativeMousePosition(
        event,
        container
      );
      let { width, left } = range;

      if (handle === 'right') {
        // Drag of the right handle
        if (mousePosition.x >= bcr.width) {
          // if the mousePosition is greater or equal than the container
          // set it to the container with
          width = bcr.width - left;
        } else if (mousePosition.x <= left) {
          // if the mousePosition is lesser or equal than the left handle
          // set the width to zero
          width = 0;
        } else {
          // the right handle has to be greater than the right handle
          // and smaller than the container width
          width = mousePosition.x - left;
        }
      } else {
        // Drag of the left handle
        if (mousePosition.x <= 0) {
          // if the mousePosition is lesser than zero we lock the width and
          // set left to 0
          width = width + left;
          left = 0;
        } else if (mousePosition.x >= width + left) {
          width = 0;
          // left = width + left;
        } else {
          width = width + left - mousePosition.x;
          left = mousePosition.x;
        }
      }

      return {
        left: Math.abs(left),
        width: Math.abs(width),
      };
    })
  );

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
