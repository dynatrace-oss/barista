import {
  Component,
  ElementRef,
  ViewEncapsulation,
  ChangeDetectionStrategy,
  OnDestroy,
  Input,
  Renderer2,
  ContentChildren,
  QueryList,
  AfterContentInit,
  ChangeDetectorRef,
} from '@angular/core';
import { FocusMonitor } from '@angular/cdk/a11y';
import {
  mixinColor,
  CanColor,
  HasElementRef,
  mixinDisabled,
  CanDisable,
  replaceCssClass,
  Constructor
} from '@dynatrace/angular-components/core';
import { DtIcon } from '@dynatrace/angular-components/icon';
import { Subscription, NEVER } from 'rxjs';

export function getDtButtonNestedVariantNotAllowedError(): Error {
  return Error(`The nested button variant is only allowed on dt-icon-button`);
}

export type DtButtonThemePalette = 'main' | 'warning' | 'cta';

// Boilerplate for applying mixins to DtButton.
export class DtButtonBase {
  constructor(public _elementRef: ElementRef) { }
}
export const _DtButtonMixinBase =
  mixinDisabled(mixinColor<Constructor<DtButtonBase>, DtButtonThemePalette>(DtButtonBase, 'main'));

export type ButtonVariant = 'primary' | 'secondary' | 'nested';
const defaultVariant = 'primary';

/**
 * Dynatrace design button.
 */
@Component({
  moduleId: module.id,
  selector: `button[dt-button], button[dt-icon-button]`,
  exportAs: 'dtButton',
  host: {
    'class': 'dt-button',
    '[class.dt-icon-button]': '_isIconButton',
    '[disabled]': 'disabled || null',
  },
  templateUrl: 'button.html',
  styleUrls: ['button.scss'],
  inputs: ['disabled', 'color'],
  // Removing view encapsulation so we can style tags like <sup> inside the ng-content
  // tslint:disable-next-line:use-view-encapsulation
  encapsulation: ViewEncapsulation.None,
  preserveWhitespaces: false,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DtButton extends _DtButtonMixinBase
  implements OnDestroy, AfterContentInit, CanDisable, CanColor<DtButtonThemePalette>, HasElementRef {

  @Input()
  get variant(): ButtonVariant { return this._variant; }
  set variant(value: ButtonVariant) {
    const variant = value || defaultVariant;
    if (variant !== this._variant) {
      this._replaceCssClass(variant, this._variant);
      this._variant = variant;
    }
  }
  private _variant: ButtonVariant;
  private _iconChangesSub: Subscription = NEVER.subscribe();

  @ContentChildren(DtIcon) _icons: QueryList<DtIcon>;

  /** @internal Whether the button is icon only. */
  _isIconButton = false;

  constructor(
    elementRef: ElementRef,
    private _focusMonitor: FocusMonitor,
    private _renderer: Renderer2,
    private _changeDetectorRef: ChangeDetectorRef
  ) {
    super(elementRef);

    // Set the default variant to trigger the setters.
    this.variant = defaultVariant;

    this._isIconButton = this._getHostElement().hasAttribute('dt-icon-button');

    this._focusMonitor.monitor(this._elementRef.nativeElement, true);
  }

  ngAfterContentInit(): void {
    // We need to set markForCheck manually on every icons change
    // so that the template can determine if the icon container
    // should be shown or not
    this._iconChangesSub = this._icons.changes
      .subscribe(() => { this._changeDetectorRef.markForCheck(); });
  }

  ngOnDestroy(): void {
    this._focusMonitor.stopMonitoring(this._elementRef.nativeElement);
    this._iconChangesSub.unsubscribe();
  }

  /** Focuses the button. */
  focus(): void {
    this._getHostElement().focus();
  }

  /** Retrieves the native element of the host. */
  private _getHostElement(): HTMLElement {
    return this._elementRef.nativeElement;
  }

  private _replaceCssClass(newClass?: string, oldClass?: string): void {
    replaceCssClass(this._elementRef, `dt-button-${oldClass}`, `dt-button-${newClass}`, this._renderer);
  }

}

/**
 * Dynatrace design button.
 * TODO: lukas.holzer, thomas.pink rethink naming of props (UX-8947)
 * @design-unrelated
 */
@Component({
  moduleId: module.id,
  selector: `a[dt-button], a[dt-icon-button]`,
  exportAs: 'dtButton, dtAnchor',
  host: {
    'class': 'dt-button',
    '[class.dt-icon-button]': '_isIconButton',
    '[attr.tabindex]': 'disabled ? -1 : 0',
    '[attr.disabled]': 'disabled || null',
    '[attr.aria-disabled]': 'disabled.toString()',
    '(click)': '_haltDisabledEvents($event)',
  },
  inputs: ['disabled', 'color'],
  templateUrl: 'button.html',
  styleUrls: ['button.scss'],
  encapsulation: ViewEncapsulation.None,
  preserveWhitespaces: false,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DtAnchor extends DtButton {
  constructor(
    elementRef: ElementRef,
    focusMonitor: FocusMonitor,
    renderer: Renderer2,
    changeDetectorRef: ChangeDetectorRef
  ) {
    super(elementRef, focusMonitor, renderer, changeDetectorRef);
  }

  /**
   * @internal Halts all events when the button is disable.
   * This is required because otherwise the anchor would redirect to it's href
   */
  _haltDisabledEvents(event: Event): void {
    // A disabled button shouldn't apply any actions
    if (this.disabled) {
      event.preventDefault();
      event.stopImmediatePropagation();
    }
  }
}
