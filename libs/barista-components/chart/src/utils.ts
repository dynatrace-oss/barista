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
  DOWN_ARROW,
  LEFT_ARROW,
  PAGE_DOWN,
  PAGE_UP,
  RIGHT_ARROW,
  UP_ARROW,
} from '@angular/cdk/keycodes';
import { ElementRef, QueryList } from '@angular/core';
import { Observable, OperatorFunction, fromEvent, merge } from 'rxjs';
import { filter, map } from 'rxjs/operators';

import { _readKeyCode } from '@dynatrace/barista-components/core';
import { DtChartSeries } from './chart.interface';

/** @internal Highcharts plot background dimensions */
export interface DtPlotBackgroundInfo {
  width: number;
  height: number;
  left: number;
  top: number;
}

/** @internal the large offset for keyboard navigation */
const KEYBOARD_NAVIGATION_LARGE_OFFSET = 10;

/**
 * @internal
 * Calculate according to a keyboardEvents key code the offset
 * that should be used to move an element. Weather it is a large offset
 * or a small one.
 */
export function getKeyboardNavigationOffset(event: KeyboardEvent): number {
  switch (_readKeyCode(event)) {
    case RIGHT_ARROW:
    case UP_ARROW:
      return 1;
    case LEFT_ARROW:
    case DOWN_ARROW:
      return -1;
    case PAGE_UP:
      return KEYBOARD_NAVIGATION_LARGE_OFFSET;
    case PAGE_DOWN:
      return -KEYBOARD_NAVIGATION_LARGE_OFFSET;
    default:
      return 0;
  }
}

/**
 * @internal
 * Captures an event on multiple elements and merges them to one stream.
 * returns this merged stream.
 */
export function captureAndMergeEvents<
  E extends Element,
  T extends keyof WindowEventMap,
>(
  type: T,
  elements: E[],
  options: EventListenerOptions = {},
): Observable<WindowEventMap[T]> {
  const eventOptions = {
    ...options,
    passive: type.startsWith('touch'),
  };

  return merge(
    ...elements
      .filter(Boolean)
      .map((element: E) =>
        fromEvent<WindowEventMap[T]>(element, type, eventOptions),
      ),
  );
}

/**
 * @internal
 * Custom operator that provides the first elementRef safely from a QueryList
 */
export function getElementRef<T>(
  queryList: QueryList<ElementRef<T>>,
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
): OperatorFunction<any, ElementRef<T>> {
  return (input$) =>
    input$.pipe(
      map(() => {
        if (queryList && queryList.first) {
          return queryList.first;
        }
      }),
      filter<ElementRef<T>>(Boolean),
    );
}

/**
 * @internal
 * Sets the {top, left, width, height} of an element
 */
export function setPosition(
  element: HTMLElement,
  bounding: Partial<ClientRect>,
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

/**
 * @internal
 * get the scroll offset from the document
 */
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

/**
 * @internal
 * Get the mouse position from a mouse event.
 * Returns the x and y coordinates
 * @param event The MouseEvent where the x and y coordinates are taken.
 */
export const getMousePosition = (
  event: MouseEvent,
): { x: number; y: number } => ({
  x: event.clientX,
  y: event.clientY,
});

/**
 * @internal
 * Get the position from a touch event.
 * Returns the x and y coordinates
 * @param event Touch event where the last touch is taken to get the x and y coordinates.
 */
export function getTouchPosition(event: TouchEvent): { x: number; y: number } {
  const index = event.touches.length - 1;
  return {
    x: event.touches[index].clientX,
    y: event.touches[index].clientY,
  };
}

/**
 * @internal
 * Get the relative mouse position to a provided container
 * from a provided mouse event
 * @param event The touch or mouse event to get the coordinates from.
 * @param container The `HTMLElement` where the relative position should be calculated.
 */
export function getRelativeMousePosition(
  event: MouseEvent | TouchEvent,
  container: HTMLElement,
): { x: number; y: number } {
  const { x: clientX, y: clientY } =
    window.hasOwnProperty('TouchEvent') && event instanceof TouchEvent
      ? getTouchPosition(event)
      : getMousePosition(event as MouseEvent);
  const boundingClientRect = container.getBoundingClientRect();
  const scroll = getScrollOffset();

  // eslint-disable-next-line  no-magic-numbers
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

/**
 * @internal
 * Returns the plotBackground information (sizing and positioning) of a provided
 * plot background element.
 * @param plotBackground plot background element of Highcharts
 */
export function getPlotBackgroundInfo(
  plotBackground: SVGRectElement,
): DtPlotBackgroundInfo {
  return {
    width: parseInt(plotBackground.getAttribute('width') ?? '0', 10),
    height: parseInt(plotBackground.getAttribute('height') ?? '0', 10),
    left: parseInt(plotBackground.getAttribute('x') ?? '0', 10),
    top: parseInt(plotBackground.getAttribute('y') ?? '0', 10),
  };
}

/**
 * Retains the visibility setting of a series, if the series was already
 * set to not visible via highcharts legend clicks or settings.
 */
export function retainSeriesVisibility(
  oldSeries: Highcharts.Series[] | undefined,
): (singleSeries: DtChartSeries) => DtChartSeries {
  return (singleSeries: DtChartSeries) => {
    const previeousSingleSeries = oldSeries?.find(
      (s) => s.name === singleSeries.name,
    );
    if (previeousSingleSeries) {
      singleSeries.visible = previeousSingleSeries.visible;
    }
    return singleSeries;
  };
}
