/**
 * @license
 * Copyright 2022 Dynatrace LLC
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
  AfterViewInit,
  Component,
  ElementRef,
  Input,
  OnDestroy,
  OnInit,
  ViewChild,
} from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { BaIcon } from '@dynatrace/shared/design-system/interfaces';
import { fromEvent, Subject } from 'rxjs';
import {
  debounceTime,
  distinctUntilChanged,
  map,
  takeUntil,
} from 'rxjs/operators';
import { DtInput } from '@dynatrace/barista-components/input';
import { Platform } from '@angular/cdk/platform';

@Component({
  selector: 'ba-icon-overview-content',
  templateUrl: 'icon-overview-content.html',
  styleUrls: ['icon-overview-content.scss'],
  // changeDetection: ChangeDetectionStrategy.OnPush,
})
export class BaIconOverviewContent implements OnInit, AfterViewInit, OnDestroy {
  /** The array of icons that should be displayed */
  @Input() icons: BaIcon[];

  /** @internal Filter input field */
  @ViewChild(DtInput, { static: true, read: ElementRef })
  _inputElement: ElementRef<HTMLInputElement>;

  /** @internal A list of filtered icons */
  _filteredIcons: BaIcon[] = [];

  /** Subject used for unsubscribing */
  private _destroy$ = new Subject<void>();

  constructor(
    private _platform: Platform,
    private _router: Router,
    private _activatedRoute: ActivatedRoute,
  ) {}

  ngOnInit(): void {
    this._activatedRoute.queryParamMap
      .pipe(
        map((queryParams) => queryParams.get('iconFilter') || ''),
        takeUntil(this._destroy$),
      )
      .subscribe((value) => {
        if (value.length) {
          this._inputElement.nativeElement.value = value;
        }

        this._filteredIcons = filterIcons(this.icons, value);
      });
  }

  ngAfterViewInit(): void {
    fromEvent(this._inputElement.nativeElement, 'keyup')
      .pipe(
        debounceTime(200),
        map((event: any) => event.target.value.toLowerCase()),
        distinctUntilChanged(),
        takeUntil(this._destroy$),
      )
      .subscribe((value: string) => {
        this._filteredIcons = filterIcons(this.icons, value);
        // remove or add the query param if we have a filter value
        if (this._platform.isBrowser) {
          if (value.length) {
            // we need to push the query change state without calling the angulars
            // router navigate, because navigating would trigger the angular-routers
            // scrollPositionRestoration, which will remove the focus from the current
            // element and scroll back to top.
            window.history.pushState(
              {},
              '',
              `${window.location.origin}${window.location.pathname}?iconFilter=${value}`,
            );
          } else {
            window.history.pushState(
              {},
              '',
              `${window.location.origin}${window.location.pathname}`,
            );
          }
        } else {
          const queryParams = value.length ? { iconFilter: value } : {};
          this._router.navigate([], {
            queryParams,
            relativeTo: this._activatedRoute,
          });
        }
      });
  }

  ngOnDestroy(): void {
    this._destroy$.next();
    this._destroy$.complete();
  }

  _trackByMethod(index: number): number {
    return index;
  }
}

/**
 * Filters icons based on the given value and its occurrence in
 * the icon's name or in the list of tags.
 */
export function filterIcons(icons: BaIcon[], filterValue: string): BaIcon[] {
  if (!filterValue.length) {
    return icons;
  }

  return icons.filter(({ name, tags }) => {
    const nameMatch = stringIncludes(name, filterValue);
    const tagMatch =
      tags
        .filter(Boolean)
        .findIndex((tag) => stringIncludes(tag, filterValue)) > -1;
    return nameMatch || tagMatch;
  });
}

/** Searches for a substring inside a string ignoring the case */
const stringIncludes = (haystack: string, needle: string) =>
  haystack.toLowerCase().indexOf(needle) > -1;
