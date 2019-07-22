import {
  Directive,
  Input,
  ElementRef,
  Optional,
  SkipSelf,
  OnDestroy,
  isDevMode,
  Renderer2,
} from '@angular/core';
import { Subject, Subscription, NEVER } from 'rxjs';
import {
  DtLogger,
  DtLoggerFactory,
  replaceCssClass,
} from '@dynatrace/angular-components/core';
import {
  getDtThemeNotValidError,
  getDtThemeVariantNotValidError,
} from './theming-errors';

const LOG: DtLogger = DtLoggerFactory.create('DtTheme');

const MAX_DEPTH = 2;
// dtTemes placed on elements containing one of these classes
// will ignore the max depth check.
// Needed for special cases like the context dialog where the
// buttons are always dark.
// Only add if you are absolutely sure what you are doing and
// only if you have adjusted the css selectors.
const MAX_DEPTH_EXCEPTION_CLASSESS = [];

export type DtThemeVariant = 'light' | 'dark' | null;
const THEME_VALIDATION_RX = /^((?:[a-zA-Z-]+)?)(?::(light|dark))?$/;
const THEME_VARIANTS: DtThemeVariant[] = ['light', 'dark'];

interface NameVariantClasses {
  name: string | null;
  variant: string | null;
}

@Directive({
  selector: '[dtTheme]',
  exportAs: 'dtTheme',
  host: {
    class: 'dt-theme',
  },
})
export class DtTheme implements OnDestroy {
  /**
   * Theme name and the variant.
   * could be:
   * - royalblue
   * - royalblue:light
   * - royalblue:dark
   * - :light
   * - :dark
   */
  @Input()
  set dtTheme(value: string) {
    if (value !== void 0) {
      const { name, variant } = this._parseThemeValue(value);
      if (name !== this._name || variant !== this._variant) {
        this._name = name;
        this._variant = variant;
        this._updateHostClasses();
        this._stateChanges.next();
      }
    }
  }

  /** Name of the specified theme (royalblue, ...) */
  get name(): string | null {
    return this._name || (this._parentTheme && this._parentTheme.name);
  }

  /** Whether the theme is the light or dark variant */
  get variant(): DtThemeVariant | null {
    return this._variant || (this._parentTheme && this._parentTheme.variant);
  }

  /** @internal The level of depth */
  get _depthLevel(): number {
    return this._parentTheme ? this._parentTheme._depthLevel + 1 : 1;
  }

  /** @internal Emits on state change */
  readonly _stateChanges: Subject<void> = new Subject<void>();

  private _name: string | null = null;
  private _variant: DtThemeVariant | null = null;
  private _classNames: NameVariantClasses = { name: null, variant: null };
  private _parentSub: Subscription = NEVER.subscribe();

  constructor(
    private _elementRef: ElementRef,
    private _renderer: Renderer2,
    @Optional() @SkipSelf() private _parentTheme: DtTheme,
  ) {
    if (this._parentTheme) {
      this._parentSub = this._parentTheme._stateChanges.subscribe(() => {
        // Only update if either the local name or the local variant is not set
        // If both are set we do not need the values from the parent
        if (!this._name || !this._variant) {
          this._updateHostClasses();
          // Notify child themes of this changes
          this._stateChanges.next();
        }
      });
    }
    this._warnIfDepthExceeded();
  }

  ngOnDestroy(): void {
    this._stateChanges.next();
    this._stateChanges.complete();
    if (this._parentTheme) {
      this._parentSub.unsubscribe();
    }
  }

  /** Updates name and variant classes on the host element */
  private _updateHostClasses(): void {
    const currentClassNames = this._classNames;
    const newClassNames = this._genClassNames();
    replaceCssClass(
      this._elementRef,
      currentClassNames.name,
      newClassNames.name,
      this._renderer,
    );
    replaceCssClass(
      this._elementRef,
      currentClassNames.variant,
      newClassNames.variant,
      this._renderer,
    );
    this._classNames = newClassNames;
  }

  /** Generates the theme class names for the currently defined name and variant */
  private _genClassNames(): NameVariantClasses {
    return {
      name: this.name ? `dt-theme-${this.name}` : null,
      variant: this.variant ? `dt-theme-${this.variant}` : null,
    };
  }

  /** Notify developers if max depth level has been exceeded */
  private _warnIfDepthExceeded(): void {
    if (
      isDevMode() &&
      this._depthLevel > MAX_DEPTH &&
      !MAX_DEPTH_EXCEPTION_CLASSESS.some(c =>
        this._elementRef.nativeElement.classList.contains(c),
      )
    ) {
      LOG.warn(
        `The max supported depth level (${MAX_DEPTH}) of nested themes (dtTheme) has ` +
          `been exceeded. This could result in wrong styling unpredictable styling side effects.`,
      );
    }
  }

  private _parseThemeValue(
    value: string,
  ): { name: string; variant: DtThemeVariant } {
    const result = !!value ? value.match(THEME_VALIDATION_RX) : null;
    if (result === null) {
      throw getDtThemeNotValidError(value);
    }
    const [, name, variant] = result;
    if (variant && THEME_VARIANTS.indexOf(variant as DtThemeVariant) === -1) {
      throw getDtThemeVariantNotValidError(value, variant);
    }
    return { name, variant: variant as DtThemeVariant };
  }
}
