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

import { Component, OnInit } from '@angular/core';

import { DtTag } from '@dynatrace/barista-components/tag';

@Component({
  selector: 'tag-dev-app-demo',
  templateUrl: './tag-demo.component.html',
  styleUrls: ['./tag-demo.component.scss'],
})
export class TagDemo implements OnInit {
  tags = new Set<string>();
  users = new Set<string>();

  value1 = 'My value 1';
  value2 = 'My value 2';
  value3 = 'My value 3';
  isDisabled = false;
  canRemove = false;
  hasKey = false;

  ngOnInit(): void {
    this.tags
      .add('Jelly')
      .add('Fish')
      .add('Pear')
      .add('Oreo')
      .add('KitKat')
      .add('Beer')
      .add('Raphaelo')
      .add('Bean')
      .add('Bean1')
      .add('Bean2')
      .add('Bean3')
      .add('Bean4')
      .add('Bean5')
      .add('Bean6')
      .add('Bean7')
      .add('Bean8')
      .add('Bean9')
      .add('Bean12')
      .add('Bean23')
      .add('Bean34')
      .add('Pine')
      .add('Pine1')
      .add('Pine2')
      .add('Pine3')
      .add('Pine4')
      .add('Pine5')
      .add('Pine6')
      .add('Pine7')
      .add('Pine8')
      .add('Pine9')
      .add('Pine0')
      .add('Pine11')
      .add('Pine22')
      .add('Pine33')
      .add('Pine44')
      .add('Pine55')
      .add('Pine66')
      .add('Pine77')
      .add('Pine88')
      .add('Pine99')
      .add('Pine00')
      .add('Pine111')
      .add('Pine222')
      .add('Pine343')
      .add('Pine456')
      .add('Pine421')
      .add('Pine1233');

    this.users.add('John').add('Jane').add('Max');
  }

  addTag(tag: string): void {
    this.tags.add(tag);
  }

  addUser(event: { tag: string }): void {
    this.users.add(event.tag);
  }

  doRemove(tag: DtTag<string>): void {
    window.alert(`Tag removed: ${tag.value}`);
  }
}
