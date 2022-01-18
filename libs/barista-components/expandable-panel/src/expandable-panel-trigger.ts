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

import { DOWN_ARROW, UP_ARROW } from '@angular/cdk/keycodes';
import { ChangeDetectorRef, Directive, Input, OnDestroy } from '@angular/core';
import { Subscription, merge } from 'rxjs';

import { _readKeyCode } from '@dynatrace/barista-components/core';

import { DtExpandablePanel } from './expandable-panel';

@Directive({
  selector: 'button[dtExpandablePanel]',
  exportAs: 'dtExpandablePanelTrigger',
  host: {
    role: 'button',
    class: 'dt-expandable-panel-trigger',
    '[class.dt-expandable-panel-trigger-open]':
      'dtExpandablePanel && dtExpandablePanel.expanded',
    '[attr.disabled]':
      'dtExpandablePanel && dtExpandablePanel.disabled ? true: null',
    '[attr.aria-disabled]': 'dtExpandablePanel && dtExpandablePanel.disabled',
    '[attr.aria-expanded]': 'dtExpandablePanel && dtExpandablePanel.expanded',
    '[attr.aria-controls]': 'dtExpandablePanel && dtExpandablePanel.id',
    '[tabindex]': 'dtExpandablePanel && dtExpandablePanel.disabled ? -1 : 0',
    '(click)': '_handleClick($event)',
    '(keydown)': '_handleKeydown($event)',
  },
})
export class DtExpandablePanelTrigger implements OnDestroy {
  /** The expandable panel that should be connected to this trigger. */
  @Input()
  get dtExpandablePanel(): DtExpandablePanel {
    return this._panel;
  }
  set dtExpandablePanel(value: DtExpandablePanel) {
    this._panel = value;
    this._expandedSubscription.unsubscribe();
    this._expandedSubscription = merge(
      this.dtExpandablePanel.expandChange,
      this.dtExpandablePanel._id,
    ).subscribe(() => {
      this._changeDetectorRef.markForCheck();
    });
  }
  private _panel: DtExpandablePanel;
  private _expandedSubscription: Subscription = Subscription.EMPTY;

  constructor(private _changeDetectorRef: ChangeDetectorRef) {}

  ngOnDestroy(): void {
    this._expandedSubscription.unsubscribe();
  }

  /** @internal Handles the trigger's click event. */
  _handleClick(event: MouseEvent): void {
    event.preventDefault();
    event.stopPropagation();
    if (this.dtExpandablePanel && !this.dtExpandablePanel.disabled) {
      this.dtExpandablePanel.toggle();
    }
  }

  /** @internal Handles the trigger's click event. */
  _handleKeydown(event: KeyboardEvent): void {
    if (this.dtExpandablePanel && !this.dtExpandablePanel.disabled) {
      const keyCode = _readKeyCode(event);
      const isAltKey = event.altKey;
      if (isAltKey && keyCode === DOWN_ARROW) {
        event.preventDefault();
        this.dtExpandablePanel.open();
      } else if (isAltKey && keyCode === UP_ARROW) {
        event.preventDefault();
        this.dtExpandablePanel.close();
      }
    }
  }
}
