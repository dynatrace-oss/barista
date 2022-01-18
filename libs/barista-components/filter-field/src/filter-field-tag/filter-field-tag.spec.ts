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

// eslint-disable  @angular-eslint/no-lifecycle-call, no-use-before-define, @typescript-eslint/no-use-before-define, no-magic-numbers
// eslint-disable  @typescript-eslint/no-explicit-any, max-lines, @typescript-eslint/unbound-method, @angular-eslint/use-component-selector

import { HttpClientTestingModule } from '@angular/common/http/testing';
import { Component, NgZone } from '@angular/core';
import {
  ComponentFixture,
  TestBed,
  fakeAsync,
  tick,
} from '@angular/core/testing';
import { By } from '@angular/platform-browser';

import { DtIconModule } from '@dynatrace/barista-components/icon';

import { Platform } from '@angular/cdk/platform';

import {
  createComponent,
  MockNgZone,
  mockGetComputedStyle,
} from '@dynatrace/testing/browser';

import { mockObjectProperty } from '@dynatrace/testing/node';

import { DtFilterFieldTagData } from '../types';
import { DtOverlayTrigger } from '@dynatrace/barista-components/overlay';
import { DtFilterFieldTag } from './filter-field-tag';
import { DtFilterFieldModule } from '../filter-field-module';

describe('DtFilterFieldTag', () => {
  let fixture: ComponentFixture<TestApp>;
  let filterFieldTag: DtFilterFieldTag;
  let filterFieldTagHost: HTMLElement;
  let editButton: HTMLButtonElement;
  let removeButton: HTMLButtonElement;
  let zone: MockNgZone;

  beforeEach(fakeAsync(() => {
    TestBed.configureTestingModule({
      imports: [
        DtFilterFieldModule,
        HttpClientTestingModule,
        DtIconModule.forRoot({ svgIconLocation: `{{name}}.svg` }),
      ],
      declarations: [TestApp],
      providers: [
        { provide: NgZone, useFactory: () => (zone = new MockNgZone()) },
        { provide: Platform, useValue: { isBrowser: true } },
      ],
    }).compileComponents();

    fixture = createComponent(TestApp);
    filterFieldTag = fixture.debugElement.query(
      By.directive(DtFilterFieldTag),
    ).componentInstance;
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

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
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

  describe('DtFilterTagOverlay', () => {
    /** Get the overlay trigger directive from the fixture. */
    function getOverlayTriggerDirective(
      passedFixture: ComponentFixture<TestApp>,
      // eslint-disable-next-line @typescript-eslint/ban-types
    ): DtOverlayTrigger<{}> {
      return passedFixture.debugElement
        .query(By.directive(DtOverlayTrigger))
        .injector.get(DtOverlayTrigger);
    }

    /** Mocks the scrollWidth property on the .dt-filter-field-tag-value element with a passed value. */
    function mockScrollWidth(
      passedFixture: ComponentFixture<TestApp>,
      mockedValue: number,
    ): void {
      const el: HTMLElement = passedFixture.debugElement.query(
        By.css('.dt-filter-field-tag-value'),
      ).nativeElement;
      mockObjectProperty(el, 'scrollWidth', mockedValue);
    }

    afterEach(() => {
      // Reset the getComputedStyle mock after each test.
      mockGetComputedStyle(undefined);
    });

    it('should disable the overlay when the text is short enough', fakeAsync(() => {
      // Setup the ComputedStyleMock.
      mockGetComputedStyle('300px');

      // Get the tag value element and mock the scroll width on it.
      mockScrollWidth(fixture, 250);

      // Simulate the zone exit and changeDetection.
      zone.simulateZoneExit();
      fixture.detectChanges();

      // Get the overlayTriggerDirective Instance
      const overlayTrigger = getOverlayTriggerDirective(fixture);

      expect(overlayTrigger.disabled).toBe(true);
    }));

    it('should enable the overlay when the text is too long', fakeAsync(() => {
      // Setup the ComputedStyleMock.
      mockGetComputedStyle('300px');

      // Get the tag value element and mock the scroll width on it.
      mockScrollWidth(fixture, 380);

      // Simulate the zone exit and changeDetection.
      zone.simulateZoneExit();
      fixture.detectChanges();

      // Get the overlayTriggerDirective Instance
      const overlayTrigger = getOverlayTriggerDirective(fixture);

      expect(overlayTrigger.disabled).toBe(false);
    }));

    it('should enable the overlay when the text is changed dynamically', fakeAsync(() => {
      // Setup the ComputedStyleMock.
      mockGetComputedStyle('300px');

      // Get the tag value element and mock the scroll width on it.
      mockScrollWidth(fixture, 290);

      // Simulate the zone exit and changeDetection.
      zone.simulateZoneExit();
      fixture.detectChanges();

      // Get the overlayTriggerDirective Instance
      const overlayTrigger = getOverlayTriggerDirective(fixture);

      // The overlay should now be disabled.
      expect(overlayTrigger.disabled).toBe(true);

      // Change the scrollWdith mock to fit the larger field value.
      mockScrollWidth(fixture, 500);

      // Set the larger field value dynamically without destroying the
      // tag component.
      fixture.componentInstance.dummy = new DtFilterFieldTagData(
        'AUT',
        'A larger value, value does not matter because scrollWidth is mocked',
        ':',
        false,
        [],
      );

      // Run change detection cycles.
      fixture.detectChanges();
      zone.simulateZoneExit();
      fixture.detectChanges();

      // The overlay should now be enabled.
      expect(overlayTrigger.disabled).toBe(false);
    }));

    it('should use the default value if the custom property is not set', fakeAsync(() => {
      // Setup the ComputedStyleMock.
      mockGetComputedStyle(undefined);

      // Get the tag value element and mock the scroll width on it.
      mockScrollWidth(fixture, 299);

      // Simulate the zone exit and changeDetection.
      zone.simulateZoneExit();
      fixture.detectChanges();

      // Get the overlayTriggerDirective Instance
      const overlayTrigger = getOverlayTriggerDirective(fixture);

      expect(overlayTrigger.disabled).toBe(true);
    }));

    it('should use the default value if the custom property is not set', fakeAsync(() => {
      // Setup the ComputedStyleMock.
      mockGetComputedStyle(undefined);

      // Get the tag value element and mock the scroll width on it.
      mockScrollWidth(fixture, 301);

      // Simulate the zone exit and changeDetection.
      zone.simulateZoneExit();
      fixture.detectChanges();

      // Get the overlayTriggerDirective Instance
      const overlayTrigger = getOverlayTriggerDirective(fixture);

      expect(overlayTrigger.disabled).toBe(false);
    }));
  });
});

@Component({
  selector: 'test-app',
  template: ` <dt-filter-field-tag [data]="dummy"></dt-filter-field-tag> `,
})
export class TestApp {
  // we need to add this dummy data because the tags editable and deletable flags depend on the data being set
  dummy = new DtFilterFieldTagData('AUT', 'Linz', ':', false, []);
}
