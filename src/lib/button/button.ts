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
  replaceCssClass
} from '@dynatrace/angular-components/core';
import { DtIcon } from '@dynatrace/angular-components/icon';
import { Subscription, NEVER } from 'rxjs';

export function getDtButtonNestedVariantNotAllowedError(): Error {
  return Error(`The nested button variant is only allowed on dt-icon-button`);
}

/**
 * List of classes to add to DtButton instances based on host attributes to
 * style as different variants.
 */
const BUTTON_HOST_ATTRIBUTES = [
  'dt-button',
  'dt-icon-button',
];

// Boilerplate for applying mixins to DtButton.
export class DtButtonBase {
  constructor(public _elementRef: ElementRef) { }
}
export const _DtButtonMixinBase = mixinDisabled(mixinColor(DtButtonBase, 'main'));

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
export class DtButton extends _DtButtonMixinBase implements OnDestroy, AfterContentInit, CanDisable, CanColor, HasElementRef {

  @Input()
  get variant(): ButtonVariant { return this._variant; }
  set variant(value: ButtonVariant) {
    const variant = value || defaultVariant;
    if (variant !== this._variant) {
      if (variant === 'nested' && !this._hasHostAttributes('dt-icon-button')) {
        // throw getDtButtonNestedVariantNotAllowedError();
      }
      this._replaceCssClass(variant, this._variant);
      this._variant = variant;
    }
  }
  private _variant: ButtonVariant;
  private _iconChangesSub: Subscription = NEVER.subscribe();

  @ContentChildren(DtIcon) _icons: QueryList<DtIcon>;

  constructor(
    elementRef: ElementRef,
    private _focusMonitor: FocusMonitor,
    private _renderer: Renderer2,
    private _changeDetectorRef: ChangeDetectorRef
  ) {
    super(elementRef);

    // Set the default variant to trigger the setters.
    this.variant = defaultVariant;

    // For each of the variant selectors that is prevent in the button's host
    // attributes, add the correct corresponding class.
    for (const attr of BUTTON_HOST_ATTRIBUTES) {
      if (this._hasHostAttributes(attr)) {
        (elementRef.nativeElement as HTMLElement).classList.add(attr);
      }
    }

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

  /** Gets whether the button has one of the given attributes. */
  private _hasHostAttributes(...attributes: string[]): boolean {
    return attributes.some((attribute) => this._getHostElement().hasAttribute(attribute));
  }

  private _replaceCssClass(newClass?: string, oldClass?: string): void {
    replaceCssClass(this._elementRef, `dt-button-${oldClass}`, `dt-button-${newClass}`, this._renderer);
  }

}

/**
 * Dynatrace design button.
 */
@Component({
  moduleId: module.id,
  selector: `a[dt-button]`,
  exportAs: 'dtButton, dtAnchor',
  host: {
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

  _haltDisabledEvents(event: Event): void {
    // A disabled button shouldn't apply any actions
    if (this.disabled) {
      event.preventDefault();
      event.stopImmediatePropagation();
    }
  }
}
