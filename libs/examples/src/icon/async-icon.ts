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
  Component,
  ChangeDetectionStrategy,
  OnDestroy,
  Input,
  ElementRef,
  ChangeDetectorRef,
} from '@angular/core';
import { DtIconType } from '@dynatrace/barista-icons';
import { Subscription } from 'rxjs';
import { Viewport } from './viewport';
import { take } from 'rxjs/operators';

@Component({
  selector: 'dt-example-icon-async',
  template: `
    <ng-container>
      <dt-icon [name]="name" *ngIf="_show"></dt-icon>
      <p>{{ name }}</p>
    </ng-container>
  `,
  styles: ['dt-icon { display: inline-block; width: 3rem; height: 3rem; }'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DtExampleSharedIconAsync implements OnDestroy {
  @Input() name: DtIconType;
  _show = false;

  private _viewportEnterSub: Subscription;

  constructor(
    viewport: Viewport,
    el: ElementRef,
    changeDetector: ChangeDetectorRef,
  ) {
    this._viewportEnterSub = viewport
      .elementEnter(el)
      .pipe(take(1))
      .subscribe(() => {
        this._show = true;
        changeDetector.detectChanges();
      });
  }

  ngOnDestroy(): void {
    if (this._viewportEnterSub) {
      this._viewportEnterSub.unsubscribe();
    }
  }
}
