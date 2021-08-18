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

import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { DtComboboxFilterChange } from '@dynatrace/barista-components/experimental/combobox';
import { timer } from 'rxjs';
import { take } from 'rxjs/operators';

interface Tag {
  key: string;
  value?: string;
}

@Component({
  selector: 'tag-dev-app-demo',
  templateUrl: './tag-demo.component.html',
  styleUrls: ['./tag-demo.component.scss'],
})
export class TagDemo implements OnInit {
  readonly tags = new Set<Tag>();

  userSuggestions: string[] = [];
  userSuggestionsLoading = false;

  usernameFormControl = new FormControl('', Validators.required);
  inputForm = new FormGroup({
    value: this.usernameFormControl,
  });

  constructor(private _changeDetectorRef: ChangeDetectorRef) {}

  ngOnInit(): void {
    this.addTag('.NetTest');
    this.addTag('193.168.4.3:80');
    this.addTag('window', '[b00m]');
    this.addTag('deploy', 'my-key');
  }

  addTag(key: string, value?: string): void {
    console.log(key, value);
    this.tags.add({ key, value });
  }

  comboboxFilterChanged(event: DtComboboxFilterChange) {
    if (event.isResetEvent) {
      return;
    }
    this.loadUserSuggestions(event.filter);
  }

  private loadUserSuggestions(filter: string) {
    if (filter.length <= 0) {
      return;
    }
    this.userSuggestionsLoading = true;
    this.userSuggestions = [];

    timer(500)
      .pipe(take(1))
      .subscribe(() => {
        this.userSuggestionsLoading = false;
        this.userSuggestions.push('user1');
        this.userSuggestions.push('user2');
        this.userSuggestions.push('user3');
        this._changeDetectorRef.markForCheck();
      });
  }
}
