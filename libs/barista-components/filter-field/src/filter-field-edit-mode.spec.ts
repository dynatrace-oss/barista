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

import { BACKSPACE, ESCAPE } from '@angular/cdk/keycodes';
import { ComponentFixture } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import {
  dispatchFakeEvent,
  dispatchKeyboardEvent,
  typeInElement,
} from '@dynatrace/testing/browser';
import { FILTER_FIELD_TEST_DATA_SINGLE_OPTION } from '@dynatrace/testing/fixtures';
import { DtFilterField, DtFilterFieldChangeEvent } from './filter-field';
import { TEST_DATA_EDITMODE } from './testing/filter-field-test-data';
import {
  getFilterFieldRange,
  getFilterTags,
  getInput,
  getOptions,
  getRangeApplyButton,
  getRangeInputFields,
  setupFilterFieldTest,
  TestApp,
} from './testing/filter-field-test-helpers';

export const TEST_DATA_EDITMODE_ASYNC = {
  name: 'DE (async)',
  autocomplete: [
    { name: 'Berlin' },
    {
      name: 'München',
      suggestions: [],
      validators: [],
    },
  ],
};

describe('DtFilterField', () => {
  let fixture: ComponentFixture<TestApp>;
  let overlayContainerElement: HTMLElement;
  let filterField: DtFilterField<any>;
  let advanceFilterfieldCycle: (
    simulateMicrotasks?: boolean,
    simulateZoneExit?: boolean,
  ) => void;

  beforeEach(() => {
    ({
      fixture,
      filterField,
      overlayContainerElement,
      advanceFilterfieldCycle,
    } = setupFilterFieldTest());
  });

  describe('edit mode', () => {
    beforeEach(() => {
      fixture.componentInstance.dataSource.data = TEST_DATA_EDITMODE;
      advanceFilterfieldCycle();

      // Autocomplete filter for AUT -> Upper Austria -> Cities -> Linz
      const autocompleteFilter = [
        TEST_DATA_EDITMODE.autocomplete[0],
        (TEST_DATA_EDITMODE as any).autocomplete[0].autocomplete[0],
        (TEST_DATA_EDITMODE as any).autocomplete[0].autocomplete[0]
          .autocomplete[0].options[0],
      ];
      // Custom free text for Free -> Custom free text
      const firstLayerfreeTextFilter = [
        TEST_DATA_EDITMODE.autocomplete[2],
        'Custom free text',
      ];

      const secondLayerFreeTextFilter = [
        TEST_DATA_EDITMODE.autocomplete[1],
        (TEST_DATA_EDITMODE as any).autocomplete[1].autocomplete[0],
        'Custom free text',
      ];

      const rangeFilter = [
        TEST_DATA_EDITMODE.autocomplete[3],
        { operator: 'range', unit: 's', range: [15, 80] },
      ];

      // Set filters as a starting point
      filterField.filters = [
        autocompleteFilter,
        firstLayerfreeTextFilter,
        rangeFilter,
        secondLayerFreeTextFilter,
      ];
      fixture.detectChanges();
    });

    it('should have the correct filters set as a starting point', () => {
      const tags = getFilterTags(fixture);

      expect(tags[0].key).toBe('AUT');
      expect(tags[0].separator).toBe(':');
      expect(tags[0].value).toBe('Linz');

      expect(tags[1].key).toBe('Free');
      expect(tags[1].separator).toBe('~');
      expect(tags[1].value).toBe('Custom free text');

      expect(tags[2].key).toBe('Requests per minute');
      expect(tags[2].separator).toBe(':');
      expect(tags[2].value).toBe('15s - 80s');
    });

    it('should reset the autocomplete filter when not changing anything and cancelling by mouse', () => {
      const tags = fixture.debugElement.queryAll(
        By.css('.dt-filter-field-tag-label'),
      );
      tags[0].nativeElement.click();
      advanceFilterfieldCycle();

      let options = getOptions(overlayContainerElement);
      // Make sure that the autocomplete actually opened.
      expect(options.length).toBe(2);

      dispatchFakeEvent(document, 'click');
      advanceFilterfieldCycle();

      // Make sure the autocomplete closed again.
      options = getOptions(overlayContainerElement);
      expect(options.length).toBe(0);

      // Read the filters again and make expectations
      const filterTags = getFilterTags(fixture);

      expect(filterTags[0].key).toBe('AUT');
      expect(filterTags[0].separator).toBe(':');
      expect(filterTags[0].value).toBe('Linz');

      expect(filterTags[1].key).toBe('Free');
      expect(filterTags[1].separator).toBe('~');
      expect(filterTags[1].value).toBe('Custom free text');

      expect(filterTags[2].key).toBe('Requests per minute');
      expect(filterTags[2].separator).toBe(':');
      expect(filterTags[2].value).toBe('15s - 80s');
    });

    it('should reset the autocomplete filter when not changing anything and cancelling by keyboard', () => {
      const tags = fixture.debugElement.queryAll(
        By.css('.dt-filter-field-tag-label'),
      );
      tags[0].nativeElement.click();
      advanceFilterfieldCycle();

      let options = getOptions(overlayContainerElement);
      // Make sure that the autocomplete actually opened.
      expect(options.length).toBe(2);

      // Cancel editmode with keyboard
      const inputfield = getInput(fixture);
      dispatchKeyboardEvent(inputfield, 'keydown', ESCAPE);
      advanceFilterfieldCycle();

      // Make sure the autocomplete closed again.
      options = getOptions(overlayContainerElement);
      expect(options.length).toBe(0);

      // Read the filters again and make expectations
      const filterTags = getFilterTags(fixture);

      expect(filterTags[0].key).toBe('AUT');
      expect(filterTags[0].separator).toBe(':');
      expect(filterTags[0].value).toBe('Linz');

      expect(filterTags[1].key).toBe('Free');
      expect(filterTags[1].separator).toBe('~');
      expect(filterTags[1].value).toBe('Custom free text');

      expect(filterTags[2].key).toBe('Requests per minute');
      expect(filterTags[2].separator).toBe(':');
      expect(filterTags[2].value).toBe('15s - 80s');
    });

    it('should reset the freetext filter when not changing anything and cancelling by mouse', () => {
      const tags = fixture.debugElement.queryAll(
        By.css('.dt-filter-field-tag-label'),
      );
      tags[1].nativeElement.click();
      advanceFilterfieldCycle();

      dispatchFakeEvent(document, 'click');
      advanceFilterfieldCycle();

      // Read the filters again and make expectations
      const filterTags = getFilterTags(fixture);

      expect(filterTags[0].key).toBe('AUT');
      expect(filterTags[0].separator).toBe(':');
      expect(filterTags[0].value).toBe('Linz');

      expect(filterTags[1].key).toBe('Free');
      expect(filterTags[1].separator).toBe('~');
      expect(filterTags[1].value).toBe('Custom free text');

      expect(filterTags[2].key).toBe('Requests per minute');
      expect(filterTags[2].separator).toBe(':');
      expect(filterTags[2].value).toBe('15s - 80s');
    });

    it('should reset the input value when editing the freetext, typing something (but not commiting the filter) and then cancelling', () => {
      const tags = fixture.debugElement.queryAll(
        By.css('.dt-filter-field-tag-label'),
      );
      tags[1].nativeElement.click();
      advanceFilterfieldCycle();

      const inputfield = getInput(fixture);
      typeInElement('something else', inputfield);
      fixture.detectChanges();

      dispatchFakeEvent(document, 'click');
      advanceFilterfieldCycle();

      // Read the filters again and make expectations
      const filterTags = getFilterTags(fixture);

      expect(filterTags[0].key).toBe('AUT');
      expect(filterTags[0].separator).toBe(':');
      expect(filterTags[0].value).toBe('Linz');

      expect(filterTags[1].key).toBe('Free');
      expect(filterTags[1].separator).toBe('~');
      expect(filterTags[1].value).toBe('Custom free text');

      expect(filterTags[2].key).toBe('Requests per minute');
      expect(filterTags[2].separator).toBe(':');
      expect(filterTags[2].value).toBe('15s - 80s');

      expect(inputfield.value).toBe('');
    });

    it('should reset the freetext filter when not changing anything and cancelling by keyboard', () => {
      const tags = fixture.debugElement.queryAll(
        By.css('.dt-filter-field-tag-label'),
      );
      tags[1].nativeElement.click();
      advanceFilterfieldCycle();

      // Cancel editmode with keyboard
      const inputfield = getInput(fixture);
      dispatchKeyboardEvent(inputfield, 'keydown', ESCAPE);
      advanceFilterfieldCycle();

      // Read the filters again and make expectations
      const filterTags = getFilterTags(fixture);

      expect(filterTags[0].key).toBe('AUT');
      expect(filterTags[0].separator).toBe(':');
      expect(filterTags[0].value).toBe('Linz');

      expect(filterTags[1].key).toBe('Free');
      expect(filterTags[1].separator).toBe('~');
      expect(filterTags[1].value).toBe('Custom free text');

      expect(filterTags[2].key).toBe('Requests per minute');
      expect(filterTags[2].separator).toBe(':');
      expect(filterTags[2].value).toBe('15s - 80s');
    });

    it('should reset the range filter when not changing anything and cancelling by mouse', () => {
      const tags = fixture.debugElement.queryAll(
        By.css('.dt-filter-field-tag-label'),
      );
      tags[2].nativeElement.click();
      advanceFilterfieldCycle();

      // Expect the range filter to be open
      let filterfield = getFilterFieldRange(overlayContainerElement);
      expect(filterfield.length).toBe(1);

      dispatchFakeEvent(document, 'click');
      advanceFilterfieldCycle();

      // Expect the range filter to be closed again
      filterfield = getFilterFieldRange(overlayContainerElement);
      expect(filterfield.length).toBe(0);

      // Read the filters again and make expectations
      const filterTags = getFilterTags(fixture);

      expect(filterTags[0].key).toBe('AUT');
      expect(filterTags[0].separator).toBe(':');
      expect(filterTags[0].value).toBe('Linz');

      expect(filterTags[1].key).toBe('Free');
      expect(filterTags[1].separator).toBe('~');
      expect(filterTags[1].value).toBe('Custom free text');

      expect(filterTags[2].key).toBe('Requests per minute');
      expect(filterTags[2].separator).toBe(':');
      expect(filterTags[2].value).toBe('15s - 80s');
    });

    it('should reset the range filter when not changing anything and cancelling by keyboard', () => {
      const tags = fixture.debugElement.queryAll(
        By.css('.dt-filter-field-tag-label'),
      );
      tags[2].nativeElement.click();
      advanceFilterfieldCycle();

      // Expect the range filter to be open
      let filterfield = getFilterFieldRange(overlayContainerElement);
      expect(filterfield.length).toBe(1);

      // Cancel editmode with keyboard
      const inputfields = getRangeInputFields(overlayContainerElement);
      dispatchKeyboardEvent(inputfields[0], 'keydown', ESCAPE);

      advanceFilterfieldCycle();

      // Expect the range filter to be closed again
      filterfield = getFilterFieldRange(overlayContainerElement);
      expect(filterfield.length).toBe(0);

      // Read the filters again and make expectations
      const filterTags = getFilterTags(fixture);

      expect(filterTags[0].key).toBe('AUT');
      expect(filterTags[0].separator).toBe(':');
      expect(filterTags[0].value).toBe('Linz');

      expect(filterTags[1].key).toBe('Free');
      expect(filterTags[1].separator).toBe('~');
      expect(filterTags[1].value).toBe('Custom free text');

      expect(filterTags[2].key).toBe('Requests per minute');
      expect(filterTags[2].separator).toBe(':');
      expect(filterTags[2].value).toBe('15s - 80s');
    });

    it('should not reset the range filter when focusing the range input element', () => {
      const tags = fixture.debugElement.queryAll(
        By.css('.dt-filter-field-tag-label'),
      );
      tags[2].nativeElement.click();
      advanceFilterfieldCycle();

      const inputfields = getRangeInputFields(overlayContainerElement);
      inputfields[0].click();
      advanceFilterfieldCycle();

      expect(filterField.filters).toHaveLength(3);
    });

    it('should make the edit to the first tag', () => {
      const tags = fixture.debugElement.queryAll(
        By.css('.dt-filter-field-tag-label'),
      );
      tags[0].nativeElement.click();
      advanceFilterfieldCycle();

      const options = getOptions(overlayContainerElement);
      // Make sure that the autocomplete actually opened.
      expect(options.length).toBe(2);

      // Select Vienna
      options[1].click();
      advanceFilterfieldCycle();

      // Read the filters again and make expectations
      const filterTags = getFilterTags(fixture);
      expect(filterTags[0].key).toBe('AUT');
      expect(filterTags[0].separator).toBe(':');
      expect(filterTags[0].value).toBe('Vienna');

      expect(filterTags[1].key).toBe('Free');
      expect(filterTags[1].separator).toBe('~');
      expect(filterTags[1].value).toBe('Custom free text');

      expect(filterTags[2].key).toBe('Requests per minute');
      expect(filterTags[2].separator).toBe(':');
      expect(filterTags[2].value).toBe('15s - 80s');
    });

    it('should not reset anything when a filter is deleted in edit mode and an outside click is triggered', () => {
      let tags = fixture.debugElement.queryAll(
        By.css('.dt-filter-field-tag-label'),
      );

      expect(tags.length).toBe(4);

      tags[0].nativeElement.click();
      advanceFilterfieldCycle();

      const inputEl = getInput(fixture);
      dispatchKeyboardEvent(inputEl, 'keydown', BACKSPACE);
      fixture.detectChanges();
      tags = fixture.debugElement.queryAll(
        By.css('.dt-filter-field-tag-label'),
      );

      expect(tags.length).toBe(3);

      dispatchFakeEvent(document, 'click');
      fixture.detectChanges();
      tags = fixture.debugElement.queryAll(
        By.css('.dt-filter-field-tag-label'),
      );

      expect(tags.length).toBe(3);
    });

    it('should emit a filterchange event when the edit of a range is completed', () => {
      let filterChangeEvent: DtFilterFieldChangeEvent<any> | undefined;

      fixture.componentInstance.dataSource.data =
        FILTER_FIELD_TEST_DATA_SINGLE_OPTION;
      const sub = filterField.filterChanges.subscribe(
        (ev) => (filterChangeEvent = ev),
      );

      const tags = fixture.debugElement.queryAll(
        By.css('.dt-filter-field-tag-label'),
      );

      tags[2].nativeElement.click();
      advanceFilterfieldCycle();

      const applyButton = getRangeApplyButton(overlayContainerElement)[0];
      applyButton.click();
      fixture.detectChanges();

      expect(filterChangeEvent).toBeDefined();
      expect(filterChangeEvent!.added.length).toBe(1);
      expect(filterChangeEvent!.removed.length).toBe(0);

      sub.unsubscribe();
    });

    it('should prefill the input on edit of a first layer free-text filter', () => {
      const tags = fixture.debugElement.queryAll(
        By.css('.dt-filter-field-tag-label'),
      );
      tags[1].nativeElement.click();
      advanceFilterfieldCycle();

      const inputField = getInput(fixture);

      expect(inputField.value).toBe('Custom free text');
    });

    it('should not prefill the input on edit of a second layer free-text filter', () => {
      const tags = fixture.debugElement.queryAll(
        By.css('.dt-filter-field-tag-label'),
      );
      tags[3].nativeElement.click();
      advanceFilterfieldCycle();

      const inputField = getInput(fixture);

      expect(inputField.value).toBe('');
    });
  });
});
