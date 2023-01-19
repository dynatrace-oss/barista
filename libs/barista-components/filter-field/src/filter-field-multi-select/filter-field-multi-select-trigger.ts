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

import {
  DOWN_ARROW,
  ENTER,
  ESCAPE,
  SPACE,
  TAB,
  UP_ARROW,
} from '@angular/cdk/keycodes';
import { Overlay, OverlayContainer, ViewportRuler } from '@angular/cdk/overlay';
import { Platform } from '@angular/cdk/platform';
import { DOCUMENT } from '@angular/common';
import {
  ChangeDetectorRef,
  Directive,
  ElementRef,
  Inject,
  Input,
  NgZone,
  OnDestroy,
  Optional,
} from '@angular/core';
import {
  DtOption,
  DtViewportResizer,
  _countGroupLabelsBeforeOption,
  _getOptionScrollPosition,
  _readKeyCode,
} from '@dynatrace/barista-components/core';
import { DtFilterFieldElementTrigger } from '../shared/filter-field-element-trigger';
import { DtFilterFieldMultiSelect } from './filter-field-multi-select';

/* TODO for v2
 * When Month is selected in the dev app and the focus stays in the input field. Spacebar has 2 meanings. First it adds a space to the filtered value, second it would select the checkbox. We might need to do some more focus management here.
 * When selecting Month with ENTER, then typing Janu, then hit SPACE and ENTER. The selected value is All, where only january was filtered. We might need to handle the first active value here a bit differently.
 */
@Directive({
  selector: `input[dtFilterFieldMultiSelect]`,
  exportAs: 'dtFilterFieldMultiSelectTrigger',
})
export class DtFilterFieldMultiSelectTrigger<T>
  extends DtFilterFieldElementTrigger<DtFilterFieldMultiSelect<T>>
  implements OnDestroy
{
  /** The filter-field multiSelect panel to be attached to this trigger. */
  @Input('dtFilterFieldMultiSelect')
  get element(): DtFilterFieldMultiSelect<T> {
    return this._element;
  }
  set element(value: DtFilterFieldMultiSelect<T>) {
    super.element = value;
  }

  /**
   * Whether the autocomplete is disabled. When disabled, the element will
   * act as a regular input and the user won't be able to open the panel.
   */
  @Input('dtFilterFieldMultiSelectDisabled')
  get elementDisabled(): boolean {
    return this._elementDisabled;
  }
  set elementDisabled(value: boolean) {
    super.elementDisabled = value;
  }

  /**
   * It will allow to check if the key manager is already focused on the first active item on multi select panel
   */
  isKeyManagerFocusAlreadyOnTop = false;
  /**
   * It will allow to check if the key manager is already focused on the last active item on multi select panel
   */
  isKeyManagerFocusAlreadyOnBottom = false;

  constructor(
    protected _elementRef: ElementRef,
    protected _overlay: Overlay,
    protected _changeDetectorRef: ChangeDetectorRef,
    protected _viewportRuler: ViewportRuler,
    protected _platform: Platform,
    protected _overlayContainer: OverlayContainer,
    protected _zone: NgZone,
    // tslint:disable-next-line:no-any
    @Inject(DOCUMENT) protected _document: any,
    @Optional() public _viewportResizer: DtViewportResizer,
  ) {
    super(
      _elementRef,
      _overlay,
      _changeDetectorRef,
      _viewportResizer,
      _zone,
      _viewportRuler,
      _platform,
      _overlayContainer,
      _document,
    );
  }

  /** Opens the filter-field multiSelect panel. */
  openPanel(): void {
    if (this.element && !this.element._isOpen) {
      // As now there is no autofocus anymore, the key manager and its boundaries must be reset after opening the panel
      this.resetActiveItemAndKeyManagerLimitsOnPanel();
      super.openPanel();
    }
  }

  /** Closes the filter-field multiSelect panel. */
  closePanel(shouldEmit: boolean = true): void {
    if (this.element && this.element._isOpen) {
      // As now there is no autofocus anymore, the key manager and its boundaries must be reset after closing the panel
      this.resetActiveItemAndKeyManagerLimitsOnPanel();
      super.closePanel(shouldEmit);
    }
  }

  /** Reset the focus of keymanager and limits on panel */
  resetActiveItemAndKeyManagerLimitsOnPanel(doScroll: boolean = true): void {
    this._resetActiveItem();
    this._resetBoundariesOnKeyManager(doScroll);
  }

  /** Before, navigation was done via wrapping the keymanager, now is done checking current active indexes and key event */
  handleCustomArrowKeyNavigation(keyCode: number): void {
    if (keyCode === DOWN_ARROW || keyCode === UP_ARROW) {
      // Identify valid indexes of active items as key manager cant provide list
      const activeItemIndexes: number[] = [];
      this.element._options.toArray().forEach((element, index) => {
        if (!element.disabled) {
          activeItemIndexes.push(index);
        }
      });

      // if is the first active element
      if (
        keyCode == UP_ARROW &&
        this.element._keyManager.activeItemIndex == activeItemIndexes[0] &&
        activeItemIndexes.length > 1
      ) {
        // if has limit set, go to input focus
        if (this.isKeyManagerFocusAlreadyOnTop) {
          this.resetActiveItemAndKeyManagerLimitsOnPanel();
          // set limit on top
        } else {
          this.isKeyManagerFocusAlreadyOnTop = true;
          this.isKeyManagerFocusAlreadyOnBottom =
            activeItemIndexes.length === 1;
        }
        // from input focus, go to the last active item
      } else if (
        keyCode == UP_ARROW &&
        this.element._keyManager.activeItemIndex == -1 &&
        activeItemIndexes.length > 0
      ) {
        this.element._keyManager.setLastItemActive();
        this.isKeyManagerFocusAlreadyOnTop = activeItemIndexes.length === 1;
        this.isKeyManagerFocusAlreadyOnBottom = true;
        // update limit on first active item
      } else if (
        keyCode == DOWN_ARROW &&
        this.element._keyManager.activeItemIndex == activeItemIndexes[0] &&
        activeItemIndexes.length > 1
      ) {
        this.isKeyManagerFocusAlreadyOnTop = true;
        this.isKeyManagerFocusAlreadyOnBottom = false;
        // if is the last active element
      } else if (
        keyCode == DOWN_ARROW &&
        this.element._keyManager.activeItemIndex ==
          activeItemIndexes[activeItemIndexes.length - 1]
      ) {
        // if has limit set, go to input focus
        if (this.isKeyManagerFocusAlreadyOnBottom) {
          this.resetActiveItemAndKeyManagerLimitsOnPanel();
          // set limit on bottom
        } else {
          this.isKeyManagerFocusAlreadyOnTop = activeItemIndexes.length === 1;
          this.isKeyManagerFocusAlreadyOnBottom = true;
        }
        // if unique option, reset to input focus
      } else if (activeItemIndexes.length === 1) {
        this.resetActiveItemAndKeyManagerLimitsOnPanel();
        // in any other case, reset
      } else {
        this.isKeyManagerFocusAlreadyOnTop = false;
        this.isKeyManagerFocusAlreadyOnBottom = false;
      }
      // do scroll, specially when jumping from panel to input and viceversa
      if (
        this.isKeyManagerFocusAlreadyOnTop ||
        this.isKeyManagerFocusAlreadyOnBottom
      ) {
        // When selecting the first active or last active element from list, scroll will take place
        this.element._keyManager.activeItem
          ?._getHostElement()
          ?.scrollIntoView();
      }
    }
  }

  /** @internal Handler for the users key down events. */
  _handleKeydown(event: KeyboardEvent): void {
    const keyCode = _readKeyCode(event);

    // Prevent the default action on all escape key presses. This is here primarily to bring IE
    // in line with other browsers. By default, pressing escape on IE will cause it to revert
    // the input value to the one that it had on focus, however it won't dispatch any events
    // which means that the model value will be out of sync with the view.
    if (keyCode === ESCAPE) {
      event.preventDefault();
    }

    if (!this.element._applyDisabled && keyCode === ENTER && this.panelOpen) {
      this.element._handleSubmit(event);
      this.resetActiveItemAndKeyManagerLimitsOnPanel();

      event.preventDefault();
    } else if (this.element && this.element._keyManager) {
      const prevActiveItem = this.element._keyManager.activeItem;
      const isArrowKey = keyCode === UP_ARROW || keyCode === DOWN_ARROW;

      if (this.panelOpen || keyCode === TAB) {
        this.element._keyManager.onKeydown(event);
      } else if (isArrowKey && this._canOpen()) {
        this.openPanel();
      }

      if (this.panelOpen && keyCode === SPACE) {
        if (this.element._keyManager.activeItem)
          this.element._toggleOption(this.element._keyManager.activeItem);
      }

      if (
        isArrowKey ||
        this.element._keyManager.activeItem !== prevActiveItem
      ) {
        this._scrollToOption();
        this.element._keyManager.activeItem
          ?._getHostElement()
          ?.scrollIntoView();
      }
    }
  }

  /** Resets the active item to -1 so arrow events will activate the correct options. */
  protected _resetActiveItem(): void {
    this.element._keyManager.setActiveItem(-1);
  }

  /** The currently active option, coerced to DtOption type. */
  get activeOption(): DtOption<T> | null {
    if (this.element && this.element._keyManager) {
      return this.element._keyManager.activeItem;
    }
    return null;
  }

  /**
   * After doing use of key navigation, it will reset boundary controls on multi select panel
   * @param doScroll if true, does scroll into view for the current focused element, on the key manager
   */
  private _resetBoundariesOnKeyManager(doScroll: boolean): void {
    this.isKeyManagerFocusAlreadyOnTop = false;
    this.isKeyManagerFocusAlreadyOnBottom = false;
    if (doScroll)
      this.element._options.get(0)?._getHostElement().scrollIntoView();
  }

  protected _scrollToOption(): void {
    const index = this.element._keyManager.activeItemIndex || 0;
    const labelCount = _countGroupLabelsBeforeOption(
      index,
      this.element._options.toArray(),
    );

    const newScrollPosition = _getOptionScrollPosition(
      index + labelCount,
      this._optionHeight,
      this.element._getScrollTop(),
      this._maxPanelHeight,
    );

    this.element._setScrollTop(newScrollPosition);
  }
}
