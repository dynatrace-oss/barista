import {
  ChangeDetectionStrategy,
  ViewEncapsulation,
  Component,
  InjectionToken,
  Input,
  Output,
  EventEmitter,
  ChangeDetectorRef,
  ElementRef,
  Inject,
  AfterContentInit,
  ViewChild,
  TemplateRef,
  ContentChildren,
  QueryList
} from '@angular/core';
import { coerceBooleanProperty } from '@angular/cdk/coercion';
import { DtOption, DtOptgroup } from '@dynatrace/angular-components/core';
import { ActiveDescendantKeyManager } from '@angular/cdk/a11y';

let _uniqueIdCounter = 0;

/** Event object that is emitted when an autocomplete option is selected. */
export class DtAutocompleteSelectedEvent<T> {
  constructor(
    /** Reference to the autocomplete panel that emitted the event. */
    public source: DtAutocomplete,
    /** Option that was selected. */
    public option: DtOption<T>) { }
}

/** Default `dt-autocomplete` options that can be overridden. */
export interface DtAutocompleteDefaultOptions {
  /** Whether the first option should be highlighted when an autocomplete panel is opened. */
  autoActiveFirstOption?: boolean;
}

/** Injection token to be used to override the default options for `dt-autocomplete`. */
export const DT_AUTOCOMPLETE_DEFAULT_OPTIONS = new InjectionToken<DtAutocompleteDefaultOptions>('dt-autocomplete-default-options', {
  providedIn: 'root',
  factory: DT_AUTOCOMPLETE_DEFAULT_OPTIONS_FACTORY,
});

/** @docs-private */
export function DT_AUTOCOMPLETE_DEFAULT_OPTIONS_FACTORY(): DtAutocompleteDefaultOptions {
  return { autoActiveFirstOption: false };
}

@Component({
  moduleId: module.id,
  selector: 'dt-autocomplete',
  exportAs: 'dtAutocomplete',
  templateUrl: 'autocomplete.html',
  styleUrls: ['autocomplete.scss'],
  host: {
    class: 'dt-autocomplete',
  },
  preserveWhitespaces: false,
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DtAutocomplete<T> implements AfterContentInit {

  /**
   * Whether the first option should be highlighted when the autocomplete panel is opened.
   * Can be configured globally through the `DT_AUTOCOMPLETE_DEFAULT_OPTIONS` token.
   */
  @Input()
  get autoActiveFirstOption(): boolean { return this._autoActiveFirstOption; }
  set autoActiveFirstOption(value: boolean) {
    this._autoActiveFirstOption = coerceBooleanProperty(value);
  }
  private _autoActiveFirstOption: boolean;

  /**
   * Takes classes set on the host dt-autocomplete element and applies them to the panel
   * inside the overlay container to allow for easy styling.
   */
  @Input('class')
  set classList(value: string) {
    if (value && value.length) {
      value.split(' ').forEach((className) => this._classList[className.trim()] = true);
      this._elementRef.nativeElement.className = '';
    }
  }
  _classList: {[key: string]: boolean} = {};

  /** Event that is emitted whenever an option from the list is selected. */
  @Output() readonly optionSelected = new EventEmitter<DtAutocompleteSelectedEvent<T>>();

  /** Event that is emitted when the autocomplete panel is opened. */
  @Output() readonly opened = new EventEmitter<void>();

  /** Event that is emitted when the autocomplete panel is closed. */
  @Output() readonly closed = new EventEmitter<void>();

  /** Whether the autocomplete panel should be visible, depending on option length. */
  showPanel = false;

  /** Whether the autocomplete panel is open. */
  get isOpen(): boolean { return this._isOpen && this.showPanel; }
  _isOpen = false;

  /** Manages active item in option list based on key events. */
  _keyManager: ActiveDescendantKeyManager<DtOption<T>>;

  /** Unique ID to be used by autocomplete trigger's "aria-owns" property. */
  id = `mat-autocomplete-${_uniqueIdCounter++}`;

  // tslint:disable-next-line:no-any
  @ViewChild(TemplateRef) template: TemplateRef<any>;
  @ViewChild('panel') panel: ElementRef;
  @ContentChildren(DtOption, { descendants: true }) options: QueryList<DtOption<T>>;
  @ContentChildren(DtOptgroup) optionGroups: QueryList<DtOptgroup>;

  constructor(
    private _changeDetectorRef: ChangeDetectorRef,
    private _elementRef: ElementRef<HTMLElement>,
    @Inject(DT_AUTOCOMPLETE_DEFAULT_OPTIONS) defaults: DtAutocompleteDefaultOptions) {
    this._autoActiveFirstOption = !!defaults.autoActiveFirstOption;
  }

  ngAfterContentInit(): void {
    this._keyManager = new ActiveDescendantKeyManager(this.options).withWrap();
    // Set the initial visibility state.
    this._setVisibility();
  }

  /** Panel should hide itself when the option list is empty. */
  _setVisibility(): void {
    this.showPanel = !!this.options.length;
    this._classList['dt-autocomplete-visible'] = this.showPanel;
    this._classList['dt-autocomplete-hidden'] = !this.showPanel;
    this._changeDetectorRef.markForCheck();
  }

  /**
   * Sets the panel scrollTop. This allows us to manually scroll to display options
   * above or below the fold, as they are not actually being focused when active.
   */
  _setScrollTop(scrollTop: number): void {
    if (this.panel) {
      this.panel.nativeElement.scrollTop = scrollTop;
    }
  }

  /** Returns the panel's scrollTop. */
  _getScrollTop(): number {
    return this.panel ? this.panel.nativeElement.scrollTop : 0;
  }

  /** Emits the `select` event. */
  _emitSelectEvent(option: DtOption<T>): void {
    const event = new DtAutocompleteSelectedEvent(this, option);
    this.optionSelected.emit(event);
  }
}
