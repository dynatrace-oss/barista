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

import { Component, OnInit } from '@angular/core';
import { DSPageService } from '@dynatrace/shared/data-access-strapi';
import { NextPage } from '@dynatrace/shared/next-definitions';
import { SafeHtml, DomSanitizer } from '@angular/platform-browser';

@Component({
  selector: 'next-error-page',
  templateUrl: './next-error-page.html',
  styleUrls: ['./next-error-page.scss'],
  host: {
    class: 'next-page',
  },
})
export class NextErrorPage implements OnInit {
  page = this._pageService._getCurrentPage();
  content: SafeHtml;

  constructor(
    private _pageService: DSPageService<NextPage>,
    private _sanitizer: DomSanitizer,
  ) {}

  ngOnInit(): void {
    if (this.page?.content) {
      this.content = this._sanitizer.bypassSecurityTrustHtml(this.page.content);
    }
  }
}
