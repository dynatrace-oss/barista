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

import { HttpClient } from '@angular/common/http';
import {
  ChangeDetectionStrategy,
  Component,
  ElementRef,
  OnDestroy,
  ViewChild,
} from '@angular/core';
import { BehaviorSubject, Observable, combineLatest } from 'rxjs';
import { debounceTime, map, tap } from 'rxjs/operators';

import { Viewport } from '../viewport';

@Component({
  selector: 'dt-example-icon-all',
  templateUrl: 'icon-all-example.html',
  styleUrls: ['icon-all-example.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [Viewport],
})
export class DtExampleIconAll implements OnDestroy {
  @ViewChild('input', { static: true }) _inputEl: ElementRef;
  _icons$: Observable<string[]>;
  private _filterValue = new BehaviorSubject<string>('');

  constructor(private _httpClient: HttpClient, viewport: Viewport) {
    this._icons$ = combineLatest([
      this._httpClient
        .get('/assets/icons/metadata.json')
        .pipe(map((res: { icons: string[] }) => res.icons || [])),
      this._filterValue.pipe(
        debounceTime(200),
        map((value) => value.toUpperCase()),
      ),
    ]).pipe(
      map(([icons, filterValue]) =>
        icons.filter(
          (icon) =>
            filterValue === '' ||
            icon.toUpperCase().indexOf(filterValue) !== -1,
        ),
      ),
      tap(() => {
        setTimeout(() => {
          viewport.refresh();
        }, 0);
      }),
    );
  }

  ngOnDestroy(): void {
    this._filterValue.complete();
  }

  _onInputChange(event: Event): void {
    // We always have to stop propagation on the change event.
    // Otherwise the change event, from the input element, will bubble up and
    // emit its event object to the `change` output.
    event.stopPropagation();
    this._filterValue.next(this._inputEl.nativeElement.value || '');
  }
}
