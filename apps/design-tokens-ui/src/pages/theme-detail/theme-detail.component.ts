/**
 * @license
 * Copyright 2020 Dynatrace LLC
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

import { Component, OnDestroy, ChangeDetectionStrategy } from '@angular/core';
import { Router } from '@angular/router';

import { Subject, Observable } from 'rxjs';
import { takeUntil, filter, shareReplay } from 'rxjs/operators';

import { PaletteSourceService } from '../../services/palette';
import { Theme } from '@dynatrace/design-tokens-ui/shared';

@Component({
  selector: 'design-tokens-ui-palette-detail',
  templateUrl: './theme-detail.component.html',
  styleUrls: ['./theme-detail.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ThemeDetailComponent implements OnDestroy {
  /** All palettes belonging to the current theme */
  _theme$: Observable<Theme>;

  /** @internal the user must click the delete button twice to confirm */
  _showDeletePaletteConfirmation = false;

  /** @internal Enable or disable gaps in the preview */
  _showGaps = false;

  private _destroy$ = new Subject<void>();

  constructor(
    private _paletteSourceService: PaletteSourceService,
    private _router: Router,
  ) {
    this._theme$ = _paletteSourceService.theme$.pipe(
      shareReplay(),
      filter<Theme>(Boolean),
      takeUntil(this._destroy$),
    );
  }

  ngOnDestroy(): void {
    this._destroy$.next();
    this._destroy$.complete();
  }

  /** @internal */
  _createGenerationOptions(): void {
    this._paletteSourceService.createGlobalGenerationOptions();
  }

  /** @internal */
  _toggleGaps(): void {
    this._showGaps = !this._showGaps;
  }

  /** @internal Saves changes and returns to the themes overview page */
  _saveChanges(): void {
    this._paletteSourceService.applyChanges();
    this._router.navigate(['/theme']);
  }
}
