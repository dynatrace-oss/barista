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

export const TO_REPLACE_GETSET_ACCESSORS = [
  `
  @Input('aria-label-close')
  get depAriaLabelClose(): string {
    return this._ariaLabelClose;
  }
  set depAriaLabelClose(value: string) {
    this._ariaLabelClose = value;
  }`,
  `
  @Input('aria-label-left-handle')
  get depAriaLabelLeftHandle(): string {
    return this._ariaLabelLeftHandle;
  }
  set depAriaLabelLeftHandle(value: string) {
    this._ariaLabelLeftHandle = value;
  }`,
  `
  @Input('aria-label-right-handle')
  get depAriaLabelRightHandle(): string {
    return this._ariaLabelClose;
  }
  set depAriaLabelRightHandle(value: string) {
    this._ariaLabelClose = value;
  }`,
  `
  @Input('aria-label-selected-area')
  get depAriaLabelSelectedArea(): string {
    return this._ariaLabelSelectedArea;
  }
  set depAriaLabelSelectedArea(value: string) {
    this._ariaLabelSelectedArea = value;
  }`,
  `
  @Input('aria-label-selected')
  get depAriaLabelSelected(): string {
    return this._ariaLabelSelected;
  }
  set depAriaLabelSelected(value: string) {
    this._ariaLabelSelected = value;
  }`,
  `
  @Input('aria-label-save')
  get depAriaLabelSave(): string {
    return this._ariaLabelSave;
  }
  set depAriaLabelSave(value: string) {
    this._ariaLabelSave = value;
  }`,
  `
  @Input('aria-label-cancel')
  get depAriaLabelCancel(): string {
    return this._ariaLabelCancel;
  }
  set depAriaLabelCancel(value: string) {
    this._ariaLabelCancel = value;
  }`,
];

export const TO_REPLACE_TEMPLATE_ARIA_ATTRIBUTES = [
  {
    from: 'aria-label=',
    to: 'attr.aria-label=',
  },
  {
    from: 'aria-label-close',
    to: 'ariaLabelClose',
  },
  {
    from: 'aria-label-left-handle',
    to: 'ariaLabelLeftHandle',
  },
  {
    from: 'aria-label-right-handle',
    to: 'ariaLabelRightHandle',
  },
  {
    from: 'aria-label-selected-area',
    to: 'ariaLabelSelectedArea',
  },
  {
    from: 'aria-label-selected',
    to: 'ariaLabelSelected',
  },
  {
    from: 'aria-label-save',
    to: 'ariaLabelSave',
  },
  {
    from: 'aria-label-cancel',
    to: 'ariaLabelCancel',
  },
  {
    from: 'aria-label-previous',
    to: 'ariaLabelPrevious',
  },
  {
    from: 'aria-label-next',
    to: 'ariaLabelNext',
  },
  {
    from: 'aria-label-ellipses',
    to: 'ariaLabelEllipses',
  },
  {
    from: 'aria-label-page',
    to: 'ariaLabelPage',
  },
  {
    from: 'aria-label-current',
    to: 'ariaLabelCurrent',
  },
  {
    from: 'aria-label-next',
    to: 'ariaLabelNext',
  },
  {
    from: 'aria-label-next',
    to: 'ariaLabelNext',
  },
];
