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

import { coerceBooleanProperty, BooleanInput } from '@angular/cdk/coercion';
import { TemplatePortal } from '@angular/cdk/portal';
import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  ContentChild,
  ElementRef,
  Input,
  OnInit,
  Optional,
  TemplateRef,
  ViewContainerRef,
  ViewEncapsulation,
  forwardRef,
  Inject,
} from '@angular/core';
import {
  CanDisable,
  HasTabIndex,
  mixinDisabled,
  mixinTabIndex,
} from '@dynatrace/barista-components/core';
import { Subject } from 'rxjs';
import { DtTabGroup } from '../tab-group';
import { DtTabContent } from './tab-content';
import { DtTabLabel } from './tab-label';

let nextUniqueId = 0;

export class DtTabChange {
  /** Reference to the currently-selected tab. */
  source: DtTab;
  /** Wether the tab change occured due to a userInteraction */
  isUserInteraction: boolean;
}

export type TabThemePalette = 'main' | 'error' | 'recovered' | undefined;
const defaultPalette: TabThemePalette = 'main';

// Boilerplate for applying mixins to DtTab.
export class DtTabBase {
  constructor(public _elementRef: ElementRef) {}
}
export const _DtTabMixinBase = mixinTabIndex(mixinDisabled(DtTabBase));

@Component({
  selector: 'dt-tab',
  exportAs: 'dtTab',
  templateUrl: 'tab.html',
  inputs: ['disabled', 'color'],
  host: {
    class: 'dt-tab',
  },
  preserveWhitespaces: false,
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.Emulated,
})
export class DtTab
  extends _DtTabMixinBase
  implements OnInit, CanDisable, HasTabIndex
{
  /** Content for the tab label */
  @ContentChild(DtTabLabel, { static: true }) label: DtTabLabel;

  /**
   * @internal
   * ContentRef if the content is provided inside a ng-template
   * with a dtTabContent directive for lazy loading
   */
  @ContentChild(DtTabContent, { read: TemplateRef, static: true })
  _lazyContentRef: TemplateRef<any>; // eslint-disable-line @typescript-eslint/no-explicit-any

  /** Unique id of the element. */
  @Input()
  get id(): string {
    return this._id;
  }
  set id(value: string) {
    this._id = value || this._uniqueId;
  }

  /** Wether the tab is disabed */
  @Input()
  get disabled(): boolean {
    return this._disabled;
  }
  set disabled(value: boolean) {
    const newDisabledState = coerceBooleanProperty(value);
    if (this._disabled !== newDisabledState) {
      this._disabled = newDisabledState;
      this._changeDetectorRef.markForCheck();
    }
    this._stateChanges.next();
  }
  static ngAcceptInputType_disabled: BooleanInput;

  /** Whether tab is selected. */
  @Input()
  get selected(): boolean {
    return this._selected;
  }
  set selected(value: boolean) {
    const newSelectedState = coerceBooleanProperty(value);
    if (this._selected !== newSelectedState) {
      this._selected = newSelectedState;
      this._notifyTabGroup(false);
      this._changeDetectorRef.markForCheck();
    }
  }
  static ngAcceptInputType_selected: BooleanInput;

  /**
   * Color of the tab
   * mixinColor is not working here because the dt-tab does not get rendered to the dom this input is just a proxy
   * so the color gets applied correctly with the dtColor directive on the header
   */
  @Input()
  get color(): TabThemePalette {
    return this._color;
  }
  set color(value: TabThemePalette) {
    this._color = value;
    this._stateChanges.next();
  }

  /** Aria label for the tab. */
  @Input('aria-label') ariaLabel: string;

  /** Reference to the element that the tab is labelled by. */
  @Input('aria-labelledby') ariaLabelledby: string;

  /** @internal Stream that emits whenever an input of a tab changes */
  readonly _stateChanges = new Subject<void>();

  /** Portal that will be the hosted content of the tab */
  private _contentPortal: TemplatePortal | null = null;

  private _uniqueId = `dt-tab-${++nextUniqueId}`;
  private _selected = false;
  private _disabled = false;
  private _color: TabThemePalette = defaultPalette;
  private _id: string;

  /** @internal Used in the tabgroup to get the content template portal */
  get _content(): TemplatePortal | null {
    return this._contentPortal;
  }

  constructor(
    elementRef: ElementRef,
    private _viewContainerRef: ViewContainerRef,
    private _changeDetectorRef: ChangeDetectorRef,
    @Inject(forwardRef(() => DtTabGroup))
    @Optional()
    private _tabGroup: DtTabGroup,
  ) {
    super(elementRef);
    // Force setter to be called in case id was not specified.
    // eslint-disable-next-line no-self-assign
    this.id = this.id;
  }

  ngOnInit(): void {
    if (this._lazyContentRef) {
      this._contentPortal = new TemplatePortal(
        this._lazyContentRef,
        this._viewContainerRef,
      );
    }
    if (this._tabGroup) {
      this.selected = this._tabGroup._selected === this;
    }
  }

  /** @internal Selects the tab and notifies its group */
  _select(viaInteraction: boolean): void {
    this._selected = true;
    this._notifyTabGroup(viaInteraction);
    this._changeDetectorRef.markForCheck();
  }

  /** @internal Deselects the tab */
  _deselect(): void {
    this._selected = false;
  }

  private _notifyTabGroup(viaInteraction: boolean): void {
    if (this._selected && this._tabGroup && this._tabGroup._selected !== this) {
      this._tabGroup._tabChange(this, viaInteraction);
    }
  }
}
