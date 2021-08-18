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

import {
  Component,
  ContentChild,
  ContentChildren,
  NgZone,
  QueryList,
} from '@angular/core';
import { FormGroupDirective } from '@angular/forms';
import { DtFormField } from '@dynatrace/barista-components/form-field';

import { Observable, of } from 'rxjs';
import { map, share, startWith, switchMap, take } from 'rxjs/operators';

@Component({
  selector: 'dt-tag-add-form',
  templateUrl: './tag-add-form.html',
  styleUrls: ['./tag-add-form.scss'],
})
export class DtTagAddForm {
  /** @internal ElementRef of Add Tag Input */
  @ContentChildren(DtFormField, { descendants: true })
  _inputs: QueryList<DtFormField<string>>;

  /** @internal The FormGroup of the custom form for adding tags */
  @ContentChild(FormGroupDirective) _form: FormGroupDirective;

  /** Emits whether the form input is valid based on a FormGroupDirective. */
  readonly valid$: Observable<boolean> = this._ngZone.onStable.pipe(
    take(1),
    switchMap(() =>
      (this._form?.statusChanges ?? of()).pipe(startWith(undefined)),
    ),
    map(() => this._form.valid ?? true),
    share(),
  );

  constructor(private readonly _ngZone: NgZone) {}

  /** @internal Resets the provided FormGroup */
  _reset(): void {
    this._form?.resetForm();
  }
}
