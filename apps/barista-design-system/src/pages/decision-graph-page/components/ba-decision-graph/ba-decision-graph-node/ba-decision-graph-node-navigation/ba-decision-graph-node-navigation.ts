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

import { Component, Input, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'ba-decision-graph-node-nav',
  templateUrl: 'ba-decision-graph-node-navigation.html',
  styleUrls: ['ba-decision-graph-node-navigation.scss'],
})
export class BaDecisiongraphNodeNavigation {
  /** Whether the show back button should be displayed */
  @Input()
  showBackButton = false;

  /** Whether navigation is in a tasknode */
  @Input()
  inTasknode = false;

  /** Eventemitter which undos last step */
  @Output()
  undoLastStep = new EventEmitter<void>();

  /** Eventemitter for resetting to initial state */
  @Output()
  resetToInitial = new EventEmitter<void>();

  /** Emits an event which undos last step */
  undoLastStepEmitter(): void {
    this.undoLastStep.emit();
  }

  /** Emits an event which resets to initial state */
  resetToInitialEmitter(): void {
    this.resetToInitial.emit();
  }
}
