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
import {
  AfterViewInit,
  ChangeDetectionStrategy,
  Component,
  ContentChildren,
  Directive,
  Input,
  OnDestroy,
  QueryList,
  ViewEncapsulation,
} from '@angular/core';
import { Subject, Subscription, merge } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

import { DtSecondaryNavSection } from './section/secondary-nav-section';

@Directive({
  selector: 'dt-secondary-nav-title, [dtSecondaryNavTitle]',
  host: {
    class: 'dt-secondary-nav-title',
  },
  exportAs: 'dtSecondaryNavTitle',
})
export class DtSecondaryNavTitle {}

@Component({
  selector: 'dt-secondary-nav',
  exportAs: 'dtSecondaryNav',
  templateUrl: 'secondary-nav.html',
  styleUrls: ['secondary-nav.scss'],
  host: {
    class: 'dt-secondary-nav',
  },
  preserveWhitespaces: false,
  changeDetection: ChangeDetectionStrategy.OnPush,
  // View encapsulation disabled in order to style directives.
  // eslint-disable-next-line
  encapsulation: ViewEncapsulation.None,
})
export class DtSecondaryNav implements AfterViewInit, OnDestroy {
  /** Whether the nav has multi section support. */
  @Input()
  get multi(): boolean {
    return this._multi;
  }
  set multi(value: boolean) {
    this._multi = coerceBooleanProperty(value);
  }
  private _multi = false;
  static ngAcceptInputType_multi: BooleanInput;

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
