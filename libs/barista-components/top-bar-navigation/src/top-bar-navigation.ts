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

import { FocusMonitor } from '@angular/cdk/a11y';
import { coerceBooleanProperty, BooleanInput } from '@angular/cdk/coercion';
import {
  ChangeDetectionStrategy,
  Component,
  Directive,
  Input,
  ViewEncapsulation,
  ElementRef,
  OnDestroy,
} from '@angular/core';

/**
 * A navigation bar for first level navigation on the pages top area.
 *
 * ```html
 * <dt-top-bar-navigation aria-label="Main">
 *   <dt-top-bar-navigation-item align="start">
 *     <a routerLink="" dt-top-bar-action><dt-icon name="agent"></dt-icon></a>
 *   </dt-top-bar-navigation-item>
 *   <dt-top-bar-navigation-item align="end">
 *     <a dt-top-bar-action hasProblem>61</a>
 *   </dt-top-bar-navigation-item>
 *   <dt-top-bar-navigation-item align="end" >
 *     <button dt-top-bar-action><dt-icon name="user-uem"></dt-icon></button>
 *   </dt-top-bar-navigation-item>
 * </dt-top-bar-navigation>
 * ```
 */
@Component({
  selector: 'dt-top-bar-navigation',
  exportAs: 'dtTopBarNavigation',
  templateUrl: 'top-bar-navigation.html',
  styleUrls: ['top-bar-navigation.scss'],
  host: {
    class: 'dt-top-bar-navigation',
  },
  preserveWhitespaces: false,
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
})
export class DtTopBarNavigation {
  /** The aria label of the navigation element */
  @Input('aria-label') ariaLabel = 'Main';
}

/**
 * A Directive to align a navigation item weather left or right.
 */
@Directive({
  selector: 'dt-top-bar-navigation-item, [dtTopBarNavigationItem]',
  exportAs: 'dtTopBarNavigationItem',
  host: {
    class: 'dt-top-bar-navigation-item',
  },
})
export class DtTopBarNavigationItem {
  /** If the item is placed on the left side or right side of the top navigation bar */
  @Input() align: 'start' | 'end' = 'start';
}

/**
 * A Directive to apply the hover styles to a navigation item.
 */
@Directive({
  selector: '[dtTopBarAction]',
  exportAs: 'dtTopBarAction',
  host: {
    class: 'dt-top-bar-action',
    '[class.dt-top-bar-action-has-problem]': 'hasProblem',
  },
})
export class DtTopBarAction implements OnDestroy {
  /** Indicates if the item has a problem state */
  @Input()
  get hasProblem(): boolean {
    return this._hasProblem;
  }
  set hasProblem(active: boolean) {
    this._hasProblem = coerceBooleanProperty(active);
  }
  /** The current state if an item has a problem */
  private _hasProblem = false;
  static ngAcceptInputType_hasProblem: BooleanInput;

  constructor(
    private _elementRef: ElementRef,
    private _focusMonitor: FocusMonitor,
  ) {
    this._focusMonitor.monitor(this._elementRef.nativeElement, true);
  }

  ngOnDestroy(): void {
    this._focusMonitor.stopMonitoring(this._elementRef.nativeElement);
  }
}
