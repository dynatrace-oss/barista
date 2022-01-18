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

import { AnimationEvent } from '@angular/animations';
import { ESCAPE } from '@angular/cdk/keycodes';
import {
  AfterContentInit,
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  ContentChildren,
  ElementRef,
  OnDestroy,
  QueryList,
  ViewEncapsulation,
} from '@angular/core';
import { Subject } from 'rxjs';
import { filter, startWith, takeUntil } from 'rxjs/operators';

import {
  _addCssClass,
  _readKeyCode,
  _removeCssClass,
} from '@dynatrace/barista-components/core';

import { DtDrawer } from './drawer';

export const DT_DRAWER_OPEN_CLASS = 'dt-drawer-is-open';

/**
 * @internal
 * Interface for the content margin object
 */
interface DtDrawerMargin {
  left: number | null;
  right: number | null;
}

/**
 * Throws an error when two DtDrawer are matching the same position
 *
 * @param position the position of the drawer
 */
export function getDtDuplicateDrawerError(position: 'start' | 'end'): Error {
  return Error(`A drawer was already declared for 'position="${position}"'`);
}

@Component({
  selector: 'dt-drawer-container',
  exportAs: 'dtDrawerContainer',
  templateUrl: 'drawer-container.html',
  styleUrls: ['drawer-container.scss'],
  encapsulation: ViewEncapsulation.Emulated,
  changeDetection: ChangeDetectionStrategy.OnPush,
  preserveWhitespaces: false,
  host: {
    class: 'dt-drawer-container',
    '(keydown)': '_handleKeyboardEvent($event)',
  },
})
export class DtDrawerContainer implements AfterContentInit, OnDestroy {
  /**
   * @internal
   * Used to calculate the margins in the side mode
   */
  _contentMargins: DtDrawerMargin = { left: null, right: null };

  /** List of all drawers in the container */
  @ContentChildren(DtDrawer) protected _drawers: QueryList<DtDrawer>;

  /** The drawer at the start (left side) */
  private _start: DtDrawer | null = null;

  /** The drawer at the end (right side) */
  private _end: DtDrawer | null = null;

  /** Subject that is used to unsubscribe with `takeUntil()` */
  private readonly _destroy = new Subject<void>();

  /** Used to skip the initial animation */
  private _enableAnimations = false;

  /**
   * @internal
   * Whether a backdrop is visible based on the mode of the drawers
   */
  get _hasBackdrop(): boolean {
    return (
      (!!this._start && this._start._currentMode === 'over') ||
      (!!this._end && this._end._currentMode === 'over')
    );
  }

  constructor(
    private _elementRef: ElementRef<HTMLElement>,
    private _changeDetectorRef: ChangeDetectorRef,
  ) {}

  ngAfterContentInit(): void {
    // initial with null because there is no change
    this._drawers.changes
      .pipe(startWith(null), takeUntil(this._destroy))
      .subscribe(() => {
        // Check if the drawers are implemented correctly
        this._validateDrawers();

        this._drawers.forEach((drawer: DtDrawer) => {
          this._watchDrawerToggle(drawer);
          this._watchStateChanges(drawer);
        });
      });
  }

  ngOnDestroy(): void {
    this._destroy.next();
    this._destroy.complete();
  }

  /** open all drawers in the container. */
  open(): void {
    this._drawers.forEach((drawer) => {
      drawer.open();
    });
  }

  /** close all drawers in the container. */
  close(): void {
    this._drawers.forEach((drawer) => {
      drawer.close();
    });
  }

  /**
   * @internal
   * function that gets called when the backdrop is clicked.
   */
  _handleBackdropClick(): void {
    this.close();
  }

  /**
   * @internal
   * handles the ESC keyboard event to close the drawers.
   */
  _handleKeyboardEvent(event: KeyboardEvent): void {
    if (_readKeyCode(event) === ESCAPE) {
      this.close();
    }
  }

  /** Toggles a class `DT_DRAWER_OPEN_CLASS` when the drawer is open or closed */
  private _toggleOpenClass(isOpen: boolean): void {
    if (isOpen) {
      _addCssClass(this._elementRef.nativeElement, DT_DRAWER_OPEN_CLASS);
    } else {
      _removeCssClass(this._elementRef.nativeElement, DT_DRAWER_OPEN_CLASS);
    }
  }

  /**
   * If the state like the mode or the position gets changed we should validate again
   * and update the content size
   */
  private _watchStateChanges(drawer: DtDrawer): void {
    if (!drawer) {
      return;
    }

    drawer._stateChanges
      .pipe(takeUntil(this._drawers.changes))
      .subscribe(() => {
        this._validateDrawers();
        this._updateContentSize();
      });
  }

  /**
   * Watches a drawer on the `_animationStarted` to toggle the transition class,
   * for smooth content transition in side mode and updating the content size.
   *
   * @param drawer The drawer that should be watched
   */
  private _watchDrawerToggle(drawer: DtDrawer): void {
    drawer._animationStarted
      .pipe(
        filter((event: AnimationEvent) => event.fromState !== event.toState),
        takeUntil(this._drawers.changes),
      )
      .subscribe((event: AnimationEvent) => {
        if (event.toState !== 'open-instant' && this._enableAnimations) {
          _addCssClass(
            this._elementRef.nativeElement,
            'dt-drawer-content-transition',
          );
        }

        this._updateContentSize();
        this._enableAnimations = true;
      });

    drawer.openChange
      .pipe(startWith(null), takeUntil(this._drawers.changes))
      .subscribe(() => {
        this._toggleOpenClass(drawer.opened);
      });
  }

  /**
   * Calculates and updates the margins for the content size,
   * to imitate the behavior of pushing and shrinking the content according to the
   * drawer width.
   */
  private _updateContentSize(): void {
    let left = this._start ? -this._start._width : 0;
    let right = this._end ? -this._end._width : 0;

    if (
      this._start &&
      this._start.opened &&
      this._start._currentMode === 'side'
    ) {
      left += this._start._width;
    }

    if (this._end && this._end.opened && this._end._currentMode === 'side') {
      right += this._end._width;
    }
    this._contentMargins = { left, right };
    this._changeDetectorRef.markForCheck();
  }

  /**
   * Validates if there is only one drawer with position start and one with
   * position end in the drawer container.
   * Otherwise throw an Error!
   */
  private _validateDrawers(): void {
    this._start = this._end = null;

    // if there is only one drawer every thing is fine
    this._drawers.forEach((drawer) => {
      if (drawer.position === 'end') {
        if (this._end !== null) {
          throw getDtDuplicateDrawerError('end');
        }
        this._end = drawer;
      } else if (drawer.position === 'start') {
        if (this._start !== null) {
          throw getDtDuplicateDrawerError('start');
        }
        this._start = drawer;
      }
    });
  }
}
