/**
 * @license
 * Copyright 2019 Dynatrace LLC
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

import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'tag-list-barista-example',
  template: `
    <dt-tag-list>
      <dt-tag *ngFor="let tag of tags">{{ tag }}</dt-tag>
      <dt-tag-add
        placeholder="insert tag name here"
        aria-label="tag input"
        (tagAdded)="addTag($event)"
      ></dt-tag-add>
    </dt-tag-list>
  `,
})
export class TagListWithTagAddExample implements OnInit {
  tags = new Set<string>();

  ngOnInit(): void {
    this.tags.add('window');
    this.tags.add('deploy');
    this.tags.add('.NetTest');
    this.tags.add('193.168.4.3:80');
    this.tags.add('loadtest');
    this.tags.add('sdk-showroom');
    this.tags.add('requests');
    this.tags.add('cluster');
    this.tags.add('server');
    this.tags.add('node');
  }

  addTag(tag: string): void {
    this.tags.add(tag);
  }
}
