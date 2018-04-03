import {
  Directive,
  Input,
  ElementRef,
  Optional,
  SkipSelf,
  OnDestroy,
  isDevMode
} from '@angular/core';
import { Subject } from 'rxjs/Subject';
import { Subscription } from 'rxjs/Subscription';

const MAX_DEPTH = 1;
// dtTemes placed on elements containing one of these classes
// will ignore the max depth check.
// Needed for special cases like the context dialog where the
// buttons are always dark.
// Only add if you are absolutely sure what you are doing and
// only if you have adjusted the css selectors.
const MAX_DEPTH_EXCEPTION_CLASSESS = [];

const THEME_VALIDATION_RX = /((?:[a-zA-Z-]+)?)(?::(light|dark))?/;
const THEME_VARIANTS = ['light', 'dark'];
export type DtThemeVariant = 'light' | 'dark' | null;

export function getDtThemeNotValidError(name: string): Error {
  return Error(`The provided theme name "${name}" for dtTheme is not a valid theme!`);
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
    if (value === void 0) {
      return;
    }
    const result = !!value ? value.match(THEME_VALIDATION_RX) : null;
    if (result === null) {
      throw getDtThemeNotValidError(value);
    }
    const classNames = this._genClassNames();
    const currentName = this.name;
    const currentVariant = this.variant;
    const [, name, variant] = result;

    this._name = name || (this._parentTheme && this._parentTheme.name) || null;
    this._variant =
      variant && THEME_VARIANTS[variant] !== -1 ? variant as DtThemeVariant :
        (this._parentTheme && this._parentTheme.variant) || null;

    // Only replace css classes if name or variant have actually changed
    if (name !== currentName || variant !== currentVariant) {
      this._replaceHostClasses(this._genClassNames(), classNames);
      this._stateChanges.next();
    }
  }

  /** Name of the specified theme (royalblue, ...) */
  get name(): string | null { return this._name; }

  /** Whether the theme is the light or dark variant */
  get variant(): DtThemeVariant { return this._variant; }

  /** @internal The level of depth */
  get _depthLevel(): number {
    return this._parentTheme ? this._parentTheme._depthLevel + 1 : 1;
  }

  /** @internal Emits on state change */
  readonly _stateChanges: Subject<void> = new Subject<void>();

  private _name: string | null = null;
  private _variant: DtThemeVariant = null;
  private _parentSub: Subscription;

  constructor(
    private _elementRef: ElementRef,
    @Optional() @SkipSelf() private _parentTheme: DtTheme
  ) {
    if (this._parentTheme) {
      this._parentSub = this._parentTheme._stateChanges
        .subscribe(() => this.dtTheme = this.dtTheme);
    }
    this._warnIfDepthExceeded();
  }

  ngOnDestroy(): void {
    this._stateChanges.next();
    this._stateChanges.complete();
  }

  /** Generates the theme class names for the currently defined name and variant */
  private _genClassNames(): [string | null, string | null] {
    return [
      this.name ? `dt-theme-${this.name}` : null,
      this.variant ? `dt-theme-${this.variant}` : null,
    ];
  }

  /** Replaces classes on the host element */
  private _replaceHostClasses(
    newClasses?: [string | null, string | null],
    oldClasses?: [string | null, string | null]
  ): void {
    // To run this in universal we have to use className instead of classList
    let classes: string[] = this._elementRef.nativeElement.className.split(' ');
    if (oldClasses) {
      classes = classes.filter((c) => oldClasses.filter((o) => !!o).indexOf(c) === -1);
    }
    if (newClasses) {
      classes.push(...(newClasses.filter((c) => !!c && classes.indexOf(c) === -1) as string[]));
    }
    this._elementRef.nativeElement.className = classes.filter((c) => !!c).join(' ');
  }

  /** Notify developers if max depth level has been exceeded */
  private _warnIfDepthExceeded(): void {
    if (isDevMode() && console && console.warn && this._depthLevel > MAX_DEPTH &&
      !MAX_DEPTH_EXCEPTION_CLASSESS.some((c) => this._elementRef.nativeElement.classList.contains(c))
    ) {
      // tslint:disable-next-line:no-console
      console.warn(`The max supported depth level (${MAX_DEPTH}) of nested themes (dtTheme) has ` +
        `been exceeded. This could result in wrong styling unpredictable styling side effects.`);
    }
  }
}
