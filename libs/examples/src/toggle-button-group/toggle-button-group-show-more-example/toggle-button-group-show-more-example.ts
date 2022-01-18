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

/* eslint-disable */

import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'dt-example-toggle-button-group-show-more',
  templateUrl: 'toggle-button-group-show-more-example.html',
  styleUrls: ['toggle-button-group-show-more-example.scss'],
})
export class DtExampleToggleButtonGroupShowMore implements OnInit {
  buttonGroupNames = new Set<string>();

  ngOnInit(): void {
    this.buttonGroupNames.add('1 CDN domain contacted');
    this.buttonGroupNames.add('6 3rd party resources');
    this.buttonGroupNames.add('1 CDN resource');
    this.buttonGroupNames.add('2 files downloaded');
    this.buttonGroupNames.add('725 1st party resources');
  }

  loadMore(): void {
    this.buttonGroupNames.add('4 CDN domains contacted');
    this.buttonGroupNames.add('64 3rd party resources');
  }
}
