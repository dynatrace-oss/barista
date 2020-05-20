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

import { CanActivate, CanDeactivate } from '@angular/router';
import { ThemeDetailComponent } from './theme-detail.component';
import { Injectable } from '@angular/core';
import { PaletteSourceService } from '../../services/palette';

@Injectable({
  providedIn: 'root',
})
export class ThemeDetailGuard
  implements CanActivate, CanDeactivate<ThemeDetailComponent> {
  constructor(private _paletteSourceService: PaletteSourceService) {}

  canActivate(): boolean {
    // Save a snapshot when we start editing
    this._paletteSourceService.pushState();
    return true;
  }

  canDeactivate(): boolean {
    // Restore the snapshot if we leave the page without saving
    if (this._paletteSourceService.hasPendingChanges) {
      if (
        !confirm(
          'There are unsaved changes. Are you sure you want to leave this page?',
        )
      ) {
        return false;
      }
    }

    this._paletteSourceService.revertChanges();
    return true;
  }
}
