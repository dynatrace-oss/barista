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

// tslint:disable no-lifecycle-call no-use-before-declare no-magic-numbers
// tslint:disable no-any max-file-line-count no-unbound-method use-component-selector

import {
  ComponentFixture,
  TestBed,
  fakeAsync,
  tick,
} from '@angular/core/testing';
import {
  DtFilterFieldModule,
  DtFilterFieldTag,
} from '@dynatrace/barista-components/filter-field';

import { By } from '@angular/platform-browser';
import { Component } from '@angular/core';
import { DtFilterFieldTagData } from '../types';
import { DtIconModule } from '@dynatrace/barista-components/icon';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { createComponent } from '@dynatrace/barista-components/testing';

describe('DtFilterFieldTag', () => {
  let fixture: ComponentFixture<TestApp>;
  let filterFieldTag: DtFilterFieldTag;
  let filterFieldTagHost: HTMLElement;
  let editButton: HTMLButtonElement;
  let removeButton: HTMLButtonElement;

  beforeEach(fakeAsync(() => {
    TestBed.configureTestingModule({
      imports: [
        DtFilterFieldModule,
        HttpClientTestingModule,
        DtIconModule.forRoot({ svgIconLocation: `{{name}}.svg` }),
      ],
      declarations: [TestApp],
    }).compileComponents();

    fixture = createComponent(TestApp);
    filterFieldTag = fixture.debugElement.query(By.directive(DtFilterFieldTag))
      .componentInstance;
    filterFieldTagHost = fixture.debugElement.query(
      By.css('.dt-filter-field-tag'),
    ).nativeElement;
    editButton = fixture.debugElement.query(
      By.css('.dt-filter-field-tag-label'),
    ).nativeElement;
    removeButton = fixture.debugElement.query(
      By.css('.dt-filter-field-tag-button'),
    ).nativeElement;
  }));

  it('should handle disabled', () => {
    expect(filterFieldTag.disabled).toBe(false);
    expect(filterFieldTagHost.classList).not.toContain(
      'dt-filter-field-tag-disabled',
    );
    expect(editButton.getAttribute('disabled')).toBe(null);
    expect(removeButton.getAttribute('disabled')).toBe(null);

    filterFieldTag.disabled = true;
    fixture.detectChanges();

    expect(filterFieldTag.disabled).toBe(true);
    expect(filterFieldTagHost.classList).toContain(
      'dt-filter-field-tag-disabled',
    );
    expect(editButton.getAttribute('disabled')).toBeDefined();
    expect(removeButton.getAttribute('disabled')).toBeDefined();
  });

  it('should also accept string values to handle disabled', () => {
    expect(filterFieldTag.disabled).toBe(false);

    // tslint:disable-next-line:no-any
    filterFieldTag.disabled = 'disabled' as any;

    expect(filterFieldTag.disabled).toBe(true);
  });

  it('should emit the edit event when clicking the label', fakeAsync(() => {
    const editSpy = jest.fn();
    const editSubscription = filterFieldTag.edit.subscribe(editSpy);

    editButton.click();
    tick();

    expect(editSpy).toHaveBeenCalledTimes(1);

    editSubscription.unsubscribe();
  }));

  it('should emit the remove event when clicking the button', fakeAsync(() => {
    const removeSpy = jest.fn();
    const removeSubscription = filterFieldTag.remove.subscribe(removeSpy);

    removeButton.click();
    tick();

    expect(removeSpy).toHaveBeenCalledTimes(1);

    removeSubscription.unsubscribe();
  }));

  it('should not emit remove and edit events when disabled', fakeAsync(() => {
    const editSpy = jest.fn();
    const removeSpy = jest.fn();
    const editSubscription = filterFieldTag.edit.subscribe(editSpy);
    const removeSubscription = filterFieldTag.remove.subscribe(removeSpy);

    filterFieldTag.disabled = true;
    fixture.detectChanges();

    editButton.click();
    removeButton.click();

    tick();

    expect(editSpy).not.toHaveBeenCalled();
    expect(removeSpy).not.toHaveBeenCalled();

    editSubscription.unsubscribe();
    removeSubscription.unsubscribe();
  }));
});

@Component({
  selector: 'test-app',
  template: `
    <dt-filter-field-tag [data]="dummy"></dt-filter-field-tag>
  `,
})
export class TestApp {
  // we need to add this dummy data because the tags editable and deletable flags depend on the data being set
  dummy = new DtFilterFieldTagData('AUT', 'Linz', ':', false, []);
}
