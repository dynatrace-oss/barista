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

import { coerceBooleanProperty } from '@angular/cdk/coercion';
import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  Directive,
  EventEmitter,
  Output,
  ViewEncapsulation,
  ContentChildren,
  AfterContentInit,
  QueryList,
  OnDestroy,
} from '@angular/core';
import { Subject, Observable } from 'rxjs';
import { filter } from 'rxjs/operators';
import { DtSecondaryNavLinkActive } from './secondary-nav-link';

@Directive({
  selector: 'dt-secondary-nav-section-title, [dtSecondaryNavSectionTitle]',
  host: {
    class: 'dt-secondary-nav-section-title',
  },
  exportAs: 'dtSecondaryNavSectionTitle',
})
export class DtSecondaryNavSectionTitle {}

@Directive({
  selector:
    'dt-secondary-nav-section-description, [dtSecondaryNavSectionDescription]',
  host: {
    class: 'dt-secondary-nav-section-description',
  },
  exportAs: 'dtSecondaryNavSectionDescription',
})
export class DtSecondaryNavSectionDescription {}

@Component({
  selector: 'dt-secondary-nav-section',
  exportAs: 'dtSecondaryNavSection',
  templateUrl: 'secondary-nav-section.html',
  host: {
    class: 'dt-secondary-nav-section',
    '[class.dt-secondary-nav-section-active]': '_active',
  },
  preserveWhitespaces: false,
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.Emulated,
})
export class DtSecondaryNavSection implements AfterContentInit, OnDestroy {
  /** Whether the section is open or closed. */
  get expanded(): boolean {
    return this._expanded;
  }
  set expanded(value: boolean) {
    const newValue = coerceBooleanProperty(value);
    // Only update expanded state if it actually changed.
    if (this._expanded !== newValue) {
      this._expanded = newValue;
      this.expandChange.emit(newValue);
      // Ensures that the animation will run when the value is set outside of an `@Input`.
      this._changeDetectorRef.markForCheck();
    }
  }
  /** Whether the section is expanded. */
  private _expanded = false;

  /** Destroy subject that fires when the component is destroyed. */
  private _destroy$ = new Subject<void>();

  /** @internal Whether the section is active. */
  _active = false;

  /** List of all active links within the section. */
  @ContentChildren(DtSecondaryNavLinkActive, { descendants: true })
  private _activeLinks: QueryList<DtSecondaryNavLinkActive>;

  /** Event emitted when the section's expandable state changes. */
  @Output() readonly expandChange = new EventEmitter<boolean>();

  /** @internal Event emitted when the section is expanded. */
  @Output('expanded')
  readonly _sectionExpand: Observable<boolean> = this.expandChange.pipe(
    filter((v) => v),
  );

  /** @internal Event emitted when the section is collapsed. */
  @Output('collapsed')
  readonly _sectionCollapse: Observable<boolean> = this.expandChange.pipe(
    filter((v) => !v),
  );

  /** @internal Subject used to communicate programmatic change of section opening and closing */
  _sectionExpandChange$: Subject<DtSecondaryNavSection> = new Subject();

  constructor(private readonly _changeDetectorRef: ChangeDetectorRef) {}

  ngAfterContentInit(): void {
    this._checkForActiveStates();
  }

  ngOnDestroy(): void {
    this._destroy$.next();
    this._destroy$.complete();
  }

  /** @internal Check if sections has any active links or groups with active links within them */
  _checkForActiveStates(): void {
    // Check if section has any active links, and activate + expand the entire section
    // Includes a setTimeout((), 0) because the RouterLinkActive directive uses Promise.resolve().then(())
    // https://github.com/angular/angular/blob/master/packages/router/src/directives/router_link_active.ts#L125
    setTimeout(() => {
      if (
        this._activeLinks.some(
          (activeLink) => activeLink.dtSecondaryNavLinkActive,
        )
      ) {
        this._activateAndExpandSection();
      }
      this._changeDetectorRef.markForCheck();
    }, 0);
  }

  /** @internal Enable active styling and expand section */
  _activateAndExpandSection(): void {
    this._active = true;
    this._expanded = true;
  }

  /** @internal Emit toggle change when section is clicked. */
  _sectionExpanded(): void {
    this._sectionExpandChange$.next(this);
  }
}
