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
import { Component, ViewChild } from '@angular/core';
import '@dynatrace/fluid-elements/button';
import '@dynatrace/fluid-elements/popover';
// tslint:disable-next-line: no-duplicate-imports
import { FluidPopoverOffset } from '@dynatrace/fluid-elements/popover';

@Component({
  selector: 'fluid-popover-page',
  templateUrl: 'popover-page.component.html',
  styleUrls: ['popover-page.component.scss'],
})
export class FluidPopoverPage {
  @ViewChild('anchor1') anchor1: HTMLParagraphElement;
  @ViewChild('anchor2') anchor2: HTMLParagraphElement;
  @ViewChild('anchor3') anchor3: HTMLParagraphElement;
  @ViewChild('anchor4') anchor4: HTMLParagraphElement;
  @ViewChild('anchor4') anchor5: HTMLParagraphElement;

  open1 = false;
  open2 = false;
  open3 = false;
  open4 = false;
  open5 = false;

  customOffsetFn: FluidPopoverOffset = ({ placement }) => {
    if (placement === `left-end`) {
      return [30, -30];
    }

    if (placement === `right-start`) {
      return [undefined, -50];
    }

    if (placement === `top-end`) {
      return [-100, 10];
    }

    return [0, 20];
  };
}
