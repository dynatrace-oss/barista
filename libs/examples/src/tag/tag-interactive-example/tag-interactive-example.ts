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
interface TagData {
  displayValue: string;
  value: string;
  key: string;
  title: string;
}

@Component({
  selector: 'dt-example-tag-interactive',
  templateUrl: './tag-interactive-example.html',
  styleUrls: ['./tag-interactive-example.scss'],
})
export class DtExampleTagInteractive {
  canRemove = false;
  showKey = false;

  tags: TagData[] = [
    {
      displayValue: 'Windows',
      value: 'My value 1',
      key: '[AWS]OSType:',
      title: 'My custom tooltip',
    },
    {
      displayValue: 'Managed',
      value: 'My value 2',
      key: '[AWS]Category:',
      title: 'Another custom tooltip',
    },
  ];

  // Keeps the removed tags, to be restored.
  removed: TagData[] = [];

  /**
   * Remove the passed element from the tags list and store it
   * in the removed array for restoration.
   */
  doRemove(tag: TagData): void {
    const selectedTag = this.tags.find((t) => t.value === tag.value);
    if (selectedTag) {
      this.removed.push(selectedTag);
      this.tags.splice(this.tags.indexOf(selectedTag), 1);
    }
  }

  /** Restores the removed tags, does not restore the order of the list though. */
  undoRemove(): void {
    const lastRemoved = this.removed.pop();
    if (lastRemoved) {
      this.tags.push(lastRemoved);
    }
  }
}
