/**
 * @license
 * Copyright 2020 Dynatrace LLC
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

import { ActiveDescendantKeyManager } from '@angular/cdk/a11y';
import { coerceBooleanProperty } from '@angular/cdk/coercion';
import { TemplatePortal } from '@angular/cdk/portal';
import {
  AfterContentInit,
  AfterViewInit,
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  ContentChildren,
  ElementRef,
  EventEmitter,
  Inject,
  InjectionToken,
  Input,
  Output,
  QueryList,
  TemplateRef,
  ViewChild,
  ViewContainerRef,
  ViewEncapsulation,
} from '@angular/core';

import { DtOptgroup, DtOption } from '@dynatrace/barista-components/core';

let _uniqueIdCounter = 0;

/** Event object that is emitted when an autocomplete option is selected. */
export class DtAutocompleteSelectedEvent<T> {
  constructor(
    /** Reference to the autocomplete panel that emitted the event. */
    public source: DtAutocomplete<T>,
    /** Option that was selected. */
    public option: DtOption<T>,
  ) {}
}

/** Default `dt-autocomplete` options that can be overridden. */
export interface DtAutocompleteDefaultOptions {
  /** Whether the first option should be highlighted when an autocomplete panel is opened. */
  autoActiveFirstOption?: boolean;
}

/** Injection token to be used to override the default options for `dt-autocomplete`. */
export const DT_AUTOCOMPLETE_DEFAULT_OPTIONS = new InjectionToken<
  DtAutocompleteDefaultOptions
>('dt-autocomplete-default-options', {
  providedIn: 'root',
  factory: DT_AUTOCOMPLETE_DEFAULT_OPTIONS_FACTORY,
});

/** @docs-private */
export function DT_AUTOCOMPLETE_DEFAULT_OPTIONS_FACTORY(): DtAutocompleteDefaultOptions {
  return { autoActiveFirstOption: false };
}

@Component({
  selector: 'dt-autocomplete',
  exportAs: 'dtAutocomplete',
  templateUrl: 'autocomplete.html',
  styleUrls: ['autocomplete.scss'],
  host: {
    class: 'dt-autocomplete',
  },
  preserveWhitespaces: false,
  encapsulation: ViewEncapsulation.Emulated,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DtAutocomplete<T> implements AfterContentInit, AfterViewInit {
  /**
   * Whether the first option should be highlighted when the autocomplete panel is opened.
   * Can be configured globally through the `DT_AUTOCOMPLETE_DEFAULT_OPTIONS` token.
   */
  @Input()
  get autoActiveFirstOption(): boolean {
    return this._autoActiveFirstOption;
  }
  set autoActiveFirstOption(value: boolean) {
    this._autoActiveFirstOption = coerceBooleanProperty(value);
  }
  private _autoActiveFirstOption: boolean;

  /**
   * Specify the width of the autocomplete panel.  Can be any CSS sizing value, otherwise it will
   * match the width of its host.
   */
  @Input() panelWidth: string | number;

  /** Function that maps an option's control value to its display value in the trigger. */
  @Input() displayWith: ((value: T) => string) | null = null;

  /** Event that is emitted whenever an option from the list is selected. */
  @Output() readonly optionSelected = new EventEmitter<
    DtAutocompleteSelectedEvent<T>
  >();

  /** Event that is emitted when the autocomplete panel is opened. */
  @Output() readonly opened = new EventEmitter<void>();

  /** Event that is emitted when the autocomplete panel is closed. */
  @Output() readonly closed = new EventEmitter<void>();

  /** Whether the autocomplete panel should be visible, depending on option length. */
  showPanel = false;

  /**
   * Takes classes set on the host dt-autocomplete element and applies them to the panel
   * inside the overlay container.
   */
  @Input('class')
  set classList(value: string) {
    if (value && value.length) {
      this._classList = value.split(' ').reduce(
        (classList, className) => {
          classList[className.trim()] = true;
          return classList;
        },
        // tslint:disable-next-line: no-object-literal-type-assertion
        {} as { [key: string]: boolean },
      );
    } else {
      this._classList = {};
    }
    this._setVisibilityClasses(this._classList);
    this._elementRef.nativeElement.className = '';
  }
  /** @internal Via classList input applied classes */
  _classList: { [key: string]: boolean } = {};

  /** Whether the autocomplete panel is open. */
  get isOpen(): boolean {
    return this._isOpen && this.showPanel;
  }
  /** @internal Whether the autocomplete panel is open. */
  _isOpen = false;

  /**
   * @internal
   * Manages active item in option list based on key events.
   */
  _keyManager: ActiveDescendantKeyManager<DtOption<T>>;

  /** @internal */
  _portal: TemplatePortal;

  /** Unique ID to be used by autocomplete trigger's "aria-owns" property. */
  id = `dt-autocomplete-${_uniqueIdCounter++}`;

  /**
   * @internal Reference to the template that will be rendered into the panel once it is open.
   */
  @ViewChild(TemplateRef, { static: true }) _template: TemplateRef<any>;

  /**
   * @internal Reference to the panel which will be created in the overlay.
   */
  @ViewChild('panel') _panel: ElementRef;

  /**
   * @internal References to all the options that are currently applied.
   */
  @ContentChildren(DtOption, { descendants: true })
  _options: QueryList<DtOption<T>>;

  /**
   * @interal References to all the option groups that are currently applied.
   */
  @ContentChildren(DtOptgroup) _optionGroups: QueryList<DtOptgroup>;

  constructor(
    private _changeDetectorRef: ChangeDetectorRef,
    private _elementRef: ElementRef<HTMLElement>,
    private _viewContainerRef: ViewContainerRef,
    @Inject(DT_AUTOCOMPLETE_DEFAULT_OPTIONS)
    defaults: DtAutocompleteDefaultOptions,
  ) {
    this._autoActiveFirstOption = !!defaults.autoActiveFirstOption;
  }

  ngAfterViewInit(): void {
    this._portal = new TemplatePortal(this._template, this._viewContainerRef);
  }

  ngAfterContentInit(): void {
    this._keyManager = new ActiveDescendantKeyManager<DtOption<T>>(
      this._options,
    ).withWrap();
    // Set the initial visibility state.
    this._setVisibility();
  }

  /**
   * @internal
   * Panel should hide itself when the option list is empty.
   */
  _setVisibility(): void {
    this.showPanel = !!this._options.length;
    this._setVisibilityClasses(this._classList);
    this._changeDetectorRef.markForCheck();
  }

  /**
   * @internal
   * Sets the panel scrollTop. This allows us to manually scroll to display options
   * above or below the fold, as they are not actually being focused when active.
   */
  _setScrollTop(scrollTop: number): void {
    if (this._panel) {
      this._panel.nativeElement.scrollTop = scrollTop;
    }
  }

  /**
   * @internal
   * Returns the panel's scrollTop.
   */
  _getScrollTop(): number {
    return this._panel ? this._panel.nativeElement.scrollTop : 0;
  }

  /**
   * @internal
   * Emits the `select` event.
   */
  _emitSelectEvent(option: DtOption<T>): void {
    const event = new DtAutocompleteSelectedEvent(this, option);
    this.optionSelected.emit(event);
  }

  /** Sets the autocomplete visibility classes on a classlist based on the panel is visible. */
  private _setVisibilityClasses(classList: { [key: string]: boolean }): void {
    classList['dt-autocomplete-visible'] = this.showPanel;
    classList['dt-autocomplete-hidden'] = !this.showPanel;
  }
}
