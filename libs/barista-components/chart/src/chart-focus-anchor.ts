/**
 * @license
 * Copyright 2021 Dynatrace LLC
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

import { InteractivityChecker } from '@angular/cdk/a11y';
import { TAB } from '@angular/cdk/keycodes';
import { Directive, ElementRef, Input, OnDestroy } from '@angular/core';
import { DtChartBase } from './chart-base';
import { _readKeyCode } from '@dynatrace/barista-components/core';

type NativeFocusTarget = Element & { focus: () => void };

/** Focus event of the DtChartFocusAnchor. */
export interface DtChartFocusAnchorFocusEvent {
  nativeEvt: FocusEvent;
  anchor: DtChartFocusAnchor;
}

/** Element that redirects focus when received to a next or previous target depending on the tab-direction. */
@Directive({
  selector: 'dt-chart-focus-anchor, [dtChartFocusAnchor]',
  host: {
    class: 'cdk-visually-hidden',
    tabindex: '0',
    'aria-hidden': 'true',
    '(focus)': '_handleFocus($event)',
    '(keydown)': '_handleKeyUp($event)',
  },
})
export class DtChartFocusAnchor {
  /** The next target to shift focus to. */
  @Input() nextTarget: string | undefined;

  /** The previous target to shift focus to. */
  @Input() prevTarget: string | undefined;

  constructor(
    private _chart: DtChartBase,
    private _elementRef: ElementRef,
    private _checker: InteractivityChecker,
  ) {}

  /** @internal Handle keyup event, capture tab & shift+tab key-presses. */
  _handleKeyUp(event: KeyboardEvent): void {
    const { nextTarget, prevTarget } = this._findTargets();
    if (_readKeyCode(event) === TAB) {
      if (event.shiftKey) {
        this._focusTarget(prevTarget, event);
      } else {
        this._focusTarget(nextTarget, event);
      }
    }
  }

  /** @internal Handle receiving focus. */
  _handleFocus(event: FocusEvent): void {
    const { nextTarget, prevTarget } = this._findTargets();

    if (event.relatedTarget === nextTarget && prevTarget) {
      // shift + tab
      this._focusTarget(prevTarget, event);
    } else if (nextTarget) {
      // tab
      this._focusTarget(nextTarget, event);
    }
  }

  /** @internal Focus a target and prevent the native event. */
  private _focusTarget(
    target: DtChartFocusTarget | NativeFocusTarget | null,
    event: FocusEvent | KeyboardEvent,
  ): void {
    if (target) {
      if (event.preventDefault) {
        event.preventDefault();
      }
      target.focus();
    }
  }

  /** @internal Find the next/prev target to focus. */
  private _findTargets(): {
    nextTarget: DtChartFocusTarget | NativeFocusTarget | null;
    prevTarget: DtChartFocusTarget | NativeFocusTarget | null;
  } {
    const element = this._elementRef.nativeElement as Element;
    const nextTarget = this._findTarget(
      this.nextTarget,
      element.nextElementSibling,
    );
    const prevTarget = this._findTarget(
      this.prevTarget,
      element.parentElement?.children[0],
      (currentElement) => currentElement === element,
    );
    return { nextTarget, prevTarget };
  }

  /** @internal Find a target to focus. */
  private _findTarget(
    targetName?: string,
    startingElement?: Element | null,
    shouldStopFn?: (currentElement: Element) => boolean,
  ): DtChartFocusTarget | NativeFocusTarget | null {
    if (targetName) {
      return this._findKnownTarget(targetName);
    } else if (startingElement) {
      return (
        findNextFocusableElement(
          startingElement,
          (element) => this._checker.isFocusable(element as HTMLElement),
          shouldStopFn,
        ) || null
      );
    }
    return null;
  }

  /** @internal Find a known target to focus by name. */
  private _findKnownTarget(targetName: string): DtChartFocusTarget | null {
    for (const target of this._chart._focusTargets) {
      if (target.dtChartFocusTarget === targetName) {
        return target;
      }
    }
    return null;
  }
}

/** Directive to mare a focusable element by name so it can be found by the anchor. */
@Directive({
  selector: '[dtChartFocusTarget]',
})
export class DtChartFocusTarget implements OnDestroy {
  @Input() dtChartFocusTarget: string;

  constructor(private _chart: DtChartBase, private _element: ElementRef) {
    this._chart._focusTargets.add(this);
  }

  ngOnDestroy(): void {
    this._chart._focusTargets.delete(this);
  }

  focus(): void {
    this._element.nativeElement.focus();
  }
}

/** Find the next focusable element after a provided starting element. */
function findNextFocusableElement(
  startingElement: Element,
  isFocusable: (node: Element) => boolean,
  shouldStopFn?: (nextElement: Element) => boolean,
): (Element & { focus: () => void }) | null {
  let nextElement: Element | null = startingElement;
  const shouldStop = shouldStopFn || (() => false);
  while (nextElement && !shouldStop(nextElement)) {
    if (isFocusable(nextElement)) {
      return nextElement as (Element & { focus: () => void }) | null;
    }
    if (startingElement.children.length > 0) {
      const focusableElement = findNextFocusableElement(
        // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
        startingElement.children.item(0)!,
        isFocusable,
        shouldStop,
      );
      if (focusableElement) {
        return focusableElement;
      }
    }
    nextElement = nextElement.nextElementSibling;
  }
  return null;
}
