import {
  AfterViewInit,
  ChangeDetectionStrategy,
  Component,
  ContentChildren,
  Directive,
  Input,
  QueryList,
  ViewEncapsulation,
  OnDestroy,
} from '@angular/core';
import { takeUntil } from 'rxjs/operators';
import { DtSecondaryNavSection } from './section/secondary-nav-section';
import { coerceBooleanProperty } from '@angular/cdk/coercion';
import { Subscription, Subject, merge } from 'rxjs';

@Directive({
  selector: '[dtSecondaryNavLink]',
  host: {
    class: 'dt-secondary-nav-link',
  },
  exportAs: 'dtSecondaryNavLink',
})
export class DtSecondaryNavLink {}

@Directive({
  selector: 'dt-secondary-nav-title',
  host: {
    class: 'dt-secondary-nav-title',
  },
  exportAs: 'dtSecondaryNavTitle',
})
export class DtSecondaryNavTitle {}

@Component({
  moduleId: module.id,
  selector: 'dt-secondary-nav',
  exportAs: 'dtSecondaryNav',
  templateUrl: 'secondary-nav.html',
  styleUrls: ['secondary-nav.scss'],
  host: {
    class: 'dt-secondary-nav',
    '[attr.aria-label]': 'ariaLabel',
  },
  preserveWhitespaces: false,
  changeDetection: ChangeDetectionStrategy.OnPush,
  // View encapsulation disabled in order to style directives.
  // tslint:disable-next-line:use-view-encapsulation
  encapsulation: ViewEncapsulation.None,
})
export class DtSecondaryNav implements AfterViewInit, OnDestroy {
  /** Accessibility label describing the nav. */
  @Input('aria-label') ariaLabel: string;

  /** Whether the nav has multi section support. */
  @Input()
  get multi(): boolean {
    return this._multi;
  }
  set multi(value: boolean) {
    this._multi = coerceBooleanProperty(value);
  }
  private _multi = false;

  /** @internal List of all children. */
  @ContentChildren(DtSecondaryNavSection)
  private _sections: QueryList<DtSecondaryNavSection>;

  /** @internal Manages _section expandChange subscriptions to be destroyed. */
  private _destroy$: Subject<void> = new Subject();

  /** @internal Manages angular 'changes.subscribe' subscriptions to be destroyed. */
  private _sectionSubscription$ = Subscription.EMPTY;

  ngAfterViewInit(): void {
    // Start by subscribing to existing sections
    this._subscriptionSetup();
    // Clear subscriptions then re-subscribe to all sections after changes
    this._sectionSubscription$ = this._sections.changes.subscribe(() => {
      this._subscriptionSetup();
    });
  }

  ngOnDestroy(): void {
    this._destroy$.next();
    this._destroy$.complete();
    this._sectionSubscription$.unsubscribe();
  }

  /** @internal Setup subscriptions to listen for toggle change. */
  private _subscriptionSetup(): void {
    this._sections.forEach((section: DtSecondaryNavSection) => {
      section._sectionExpandChange$
        .pipe(takeUntil(merge(this._destroy$, this._sections.changes)))
        .subscribe((emittedSection: DtSecondaryNavSection) => {
          // Close all other sections if 'multi' option is false
          if (!this.multi) {
            this._closeAllSections(emittedSection);
          }
          emittedSection.expanded = !emittedSection.expanded;
        });
    });
  }

  /** @internal Close all sections except for the one that was toggled. */
  private _closeAllSections(emittedSection: DtSecondaryNavSection): void {
    this._sections.forEach((section: DtSecondaryNavSection) => {
      if (section !== emittedSection) {
        section.expanded = false;
      }
    });
  }
}
