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
  Input,
  Output,
  EventEmitter,
  ViewChild,
  ElementRef,
} from '@angular/core';
import { FocusableOption } from '@angular/cdk/a11y';

@Component({
  selector: 'ba-search-result-item',
  templateUrl: 'search-result-item.html',
  styleUrls: ['search-result-item.scss'],
  host: {
    class: 'ba-search-result-item',
  },
})
export class BaSearchResultItem implements FocusableOption {
  @ViewChild('buttonElement', { static: true })
  buttonElement: ElementRef<HTMLButtonElement>;

  focus(): void {
    this.buttonElement.nativeElement.focus();
  }
  disabled?: boolean | undefined;

  /** Title that should be displayed in the search result. */
  @Input() title: string;

  /** Tag that should be displayed in the search result. */
  @Input() tag: string;

  /** Event that is fired when a search result item is selected */
  @Output() activated = new EventEmitter<void>();

  /** @internal Called if the selected value is triggered */
  _activate(): void {
    this.activated.next();
  }
}
