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

import { Component } from '@angular/core';

@Component({
  selector: 'dt-example-tag-removable',
  templateUrl: './tag-removable-example.html',
})
export class DtExampleTagRemovable {
  // Tags array
  tags: string[] = ['This is a removable tag 0'];

  // Counter to differentiate the tags visually.
  private counter = 1;

  // Demo behaviour that will add a new tag to the list.
  addTags(): void {
    this.tags.push(`This is a removable tag ${this.counter}`);
    this.counter++;
  }

  // Remove tag function, that will remove the passed tag from the
  // tags array.
  removeTag(tag: string): void {
    this.tags.splice(this.tags.indexOf(tag), 1);
  }
}
