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
import { coerceBooleanProperty, BooleanInput } from '@angular/cdk/coercion';
import { BreakpointObserver, BreakpointState } from '@angular/cdk/layout';
import {
  AfterContentChecked,
  ChangeDetectionStrategy,
  Component,
  ElementRef,
  EventEmitter,
  InjectionToken,
  Input,
  OnDestroy,
  OnInit,
  Output,
  ViewEncapsulation,
  ChangeDetectorRef,
} from '@angular/core';
import { Observable, Subject } from 'rxjs';
import { distinctUntilChanged, filter, map, takeUntil } from 'rxjs/operators';

import { dtDrawerAnimation } from './drawer-animation';
import { DtDrawerContainer } from './drawer-container';

/** The breakpoint when the side mode changes to an overlay mode */
export const DT_DRAWER_MODE_BREAKPOINT = 1024;
export type DtDrawerAnimationState = 'open' | 'open-instant' | 'closed';

export const DT_DRAWER_CONTAINER = new InjectionToken<DtDrawerContainer>(
  'DT_DRAWER_CONTAINER',
);

@Component({
  selector: 'dt-drawer',
  exportAs: 'dtDrawer',
  templateUrl: 'drawer.html',
  styleUrls: ['drawer.scss'],
  animations: dtDrawerAnimation,
  encapsulation: ViewEncapsulation.Emulated,
  changeDetection: ChangeDetectionStrategy.OnPush,
  preserveWhitespaces: false,
  host: {
    class: 'dt-drawer',
    '[@transform]': '_animationState',
    '(@transform.start)': '_animationStarted.next($event)',
    '(@transform.done)': '_animationEnd.next($event)',
    '[class.dt-drawer-end]': 'position === "end"',
    '[class.dt-drawer-over]': '_currentMode === "over"',
    '[class.dt-drawer-side]': '_currentMode === "side"',
    '[attr.aria-hidden]': '!opened ? true : null',
    '[style.min-width.px]': '_closedWidth',
    '[style.max-width.px]': '_closedWidth',
  },
})
export class DtDrawer implements OnInit, AfterContentChecked, OnDestroy {
  /**
   * The mode of the drawer can be `'side' | 'over'`. The mode describes the behavior of the
   * overlaying or pushing to side mechanism of the drawer.
   */
  @Input()
  get mode(): 'side' | 'over' {
    return this._mode;
  }
  set mode(value: 'side' | 'over') {
    this._mode = value;
    this._currentMode = value;
    this._stateChanges.next();
  }

  /**
   * @internal
   * We need the current mode separately in case that the screen size can change the mode
   * temporarily
   */
  _currentMode: 'side' | 'over' = 'side';

  /** holds only the value from the `@Input` and to reset the mode to its original state */
  private _mode: 'side' | 'over' = 'side';

  /**
   * The position defines if the drawer is on the start or on the end. `start` could be seen as synonym for
   * left and `end` can be seen as synonym for right. So the first and the last drawer in a container.
   * A drawer container can only have one drawer per position.
   */
  @Input()
  get position(): 'start' | 'end' {
    return this._position;
  }
  set position(value: 'start' | 'end') {
    this._position = value;
    this._stateChanges.next();
  }
  private _position: 'start' | 'end' = 'start';

  /**
   * The opened property toggles the drawer open state.
   * Can be applied as directive to the drawer to open it initial.
   */
  @Input()
  get opened(): boolean {
    return this._opened;
  }
  set opened(value: boolean) {
    // we hav to coerce the value in case that we always want a boolean value
    // if the property `opened` is set on the element it the value will not be true
    // but it is a truthy value
    this.toggle(coerceBooleanProperty(value));
  }
  private _opened = false;
  static ngAcceptInputType_opened: BooleanInput;

  /**
   * Emits when the drawer open state changes. Emits a boolean value for the
   * open state (true for open, false for close).
   * Fires after the animation is completed
   */
  @Output() readonly openChange = new EventEmitter<boolean>(true);

  /**
   * @internal
   * Event emitted when the drawer has been opened.
   */
  @Output('opened')
  readonly _openedStream: Observable<void> = this.openChange.pipe(
    filter((o) => o),
    map(() => {}),
  );

  /**
   * @internal
   * Event emitted when the drawer has been closed.
   */
  @Output('closed')
  readonly _closedStream: Observable<void> = this.openChange.pipe(
    filter((o) => !o),
    map(() => {}),
  );

  /**
   * @internal
   * Used by the drawer-container to calc the size in side mode.
   * If no elementRef is present default it to 0.
   */
  get _width(): number {
    return this._elementRef.nativeElement
      ? this._elementRef.nativeElement.offsetWidth || 0
      : 0;
  }

  /** @internal */
  readonly _stateChanges = new Subject<void>();

  /** @internal */
  _animationState: DtDrawerAnimationState = 'closed';

  /**
   * @internal
   * Emits whenever the drawer has started animating.
   */
  _animationStarted = new Subject<AnimationEvent>();

  /**
   * @internal Emits whenever the drawer is done animating.
   */
  _animationEnd = new Subject<AnimationEvent>();

  /**
   * @internal
   * Width that will be set when the Drawer is closing to keep
   * the drawer from relayouting and adjusting it's size
   * due to the flex container.
   */
  _closedWidth: number | null;

  /** Used to skip the initial animation */
  private _enableAnimations = false;

  /** Subject that is used to unsubscribe with `takeUntil()` */
  private _destroy = new Subject<void>();

  constructor(
    private _elementRef: ElementRef,
    private _breakpointObserver: BreakpointObserver,
    private _changeDetectorRef: ChangeDetectorRef,
  ) {
    // distinctUntilChanged is needed because the done event fires twice on some browsers
    // and fire if animation is done
    this._animationEnd
      .pipe(
        distinctUntilChanged(
          (x, y) => x.fromState === y.fromState && x.toState === y.toState,
        ),
      )
      .subscribe((event: AnimationEvent) => {
        const { fromState, toState } = event;

        if (
          (toState.indexOf('open') === 0 && fromState === 'closed') ||
          (toState === 'closed' && fromState.indexOf('open') === 0)
        ) {
          this.openChange.emit(this._opened);
        }
      });
  }

  ngOnInit(): void {
    // checks initial if the breakpoint of `DT_DRAWER_MODE_BREAKPOINT` is matching
    // and sets the mode to overlay if it is below the breakpoint.
    // mobile devices should only see the over mode
    this._breakpointObserver
      .observe([`(max-width: ${DT_DRAWER_MODE_BREAKPOINT}px)`])
      .pipe(takeUntil(this._destroy))
      .subscribe((state: BreakpointState) => {
        if (state.matches) {
          if (this._currentMode !== 'over') {
            this._currentMode = 'over';
            this._stateChanges.next();
          }
        } else {
          if (this._currentMode !== this.mode) {
            this._currentMode = this._mode;
            this._stateChanges.next();
          }
        }
      });
  }

  ngAfterContentChecked(): void {
    // enable animations after the life-cycle hooks have run,
    // because we don't want to see the animation on startup
    this._enableAnimations = true;
  }

  ngOnDestroy(): void {
    this._destroy.next();
    this._destroy.complete();
    this._animationStarted.complete();
    this._animationEnd.complete();
    this._stateChanges.complete();
  }

  /**
   * Opens the drawer if it is not already opened.
   */
  open(): void {
    this.toggle(true);
  }

  /**
   * Closes the drawer if it is not already closed.
   */
  close(): void {
    this.toggle(false);
  }

  /**
   * Toggles the open state of the drawer.
   *
   * @param opened the state the drawer should be toggled to – `'open' | 'close'`
   * Default the opposite of the current open state.
   */
  toggle(opened: boolean = !this.opened): void {
    this._opened = opened;

    // When the drawer is closed, we need to fix
    // it's width to the original size to prevent relayout
    // If the drawer would change size during this process,
    // a drift would appear like in APM-266068
    // ---
    // The this._width !== 0 check is necessary, because if the opened
    // value on the drawer is set via `opened="false"` (meaning without a binding)
    // this will be evaluated only once, which means there was no render
    // cycle that could have determined the correct width of the drawer.
    // As the drawer would be hidden anyway with a width of 0 we do not need
    // to set a closed widht.
    if (this._opened === false && this._width !== 0) {
      this._closedWidth = this._width;
    } else {
      this._closedWidth = null;
    }

    this._animationState = opened
      ? this._enableAnimations
        ? 'open'
        : 'open-instant'
      : (this._animationState = 'closed');

    this._changeDetectorRef.markForCheck();
  }
}
