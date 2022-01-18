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

// eslint-disable  @angular-eslint/no-lifecycle-call, no-use-before-define, @typescript-eslint/no-use-before-define, no-magic-numbers
// eslint-disable  @typescript-eslint/no-explicit-any, max-lines, @typescript-eslint/unbound-method, @angular-eslint/use-component-selector

import { ESCAPE } from '@angular/cdk/keycodes';
import { OverlayContainer } from '@angular/cdk/overlay';
import {
  ComponentFixture,
  fakeAsync,
  inject,
  tick,
} from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import {
  dispatchFakeEvent,
  dispatchKeyboardEvent,
} from '@dynatrace/testing/browser';
import { FILTER_FIELD_TEST_DATA_SINGLE_OPTION } from '@dynatrace/testing/fixtures';
import { DtFilterField, DtFilterFieldChangeEvent } from '../filter-field';
import {
  TEST_DATA_MULTI_SELECT,
  TEST_DATA_MULTI_SELECT_EDIT_MODE,
} from '../testing/filter-field-test-data';
import {
  getFilterFieldRange,
  getFilterTags,
  getInput,
  getMultiSelect,
  getMultiselectApplyButton,
  getMultiselectCheckboxInputs,
  getMultiselectCheckboxLabels,
  getOptions,
  setupFilterFieldTest,
  TestApp,
} from '../testing/filter-field-test-helpers';

describe('DtFilterField', () => {
  let fixture: ComponentFixture<TestApp>;
  let overlayContainerElement: HTMLElement;
  let filterField: DtFilterField<any>;
  let advanceFilterfieldCycle: (
    simulateMicrotasks?: boolean,
    simulateZoneExit?: boolean,
  ) => void;
  let getAndClickOption: (
    optionOverlayContainer: HTMLElement,
    nthOption: number,
  ) => void;

  beforeEach(() => {
    ({
      fixture,
      filterField,
      overlayContainerElement,
      advanceFilterfieldCycle,
      getAndClickOption,
    } = setupFilterFieldTest());

    inject([OverlayContainer], (oc: OverlayContainer) => {
      overlayContainerElement = oc.getContainerElement();
    })();
  });

  describe('with multiselect', () => {
    beforeEach(() => {
      fixture.componentInstance.dataSource.data = TEST_DATA_MULTI_SELECT;
      fixture.detectChanges();

      // Focus the filter field.
      filterField.focus();
      advanceFilterfieldCycle();
    });

    it('should open the multiSelect overlay if the multiSelect option is selected', () => {
      let filterFieldMultiSelectElements = getMultiSelect(
        overlayContainerElement,
      );
      expect(filterFieldMultiSelectElements.length).toBe(0);

      getAndClickOption(overlayContainerElement, 0);

      filterFieldMultiSelectElements = getMultiSelect(overlayContainerElement);

      expect(filterFieldMultiSelectElements.length).toBe(1);
    });

    describe('opened', () => {
      beforeEach(() => {
        // Open the filter-field-multiSelect overlay.
        getAndClickOption(overlayContainerElement, 0);
      });

      it('should have groups and options', () => {
        const checkboxes = getMultiselectCheckboxLabels(
          overlayContainerElement,
        );
        const applyButton = getMultiselectApplyButton(overlayContainerElement);

        expect(checkboxes.length).toBe(5);
        expect(checkboxes[0].textContent?.trim()).toBe('NoneNone');
        expect(checkboxes[1].textContent?.trim()).toBe('KetchupKetchup');
        expect(checkboxes[2].textContent?.trim()).toBe('MustardMustard');
        expect(checkboxes[3].textContent?.trim()).toBe('MayoMayo');
        expect(applyButton).toBeDefined();
      });

      it('should have set a checkbox as "disabled"', () => {
        const checkboxInputs = getMultiselectCheckboxInputs(
          overlayContainerElement,
        );
        const checkboxLabels = getMultiselectCheckboxLabels(
          overlayContainerElement,
        );
        const applyButton = getMultiselectApplyButton(overlayContainerElement);

        expect(checkboxLabels[4].textContent?.trim()).toBe('ImportedImported');
        expect(checkboxInputs[4].disabled).toBeTruthy();
        expect(applyButton).toBeDefined();
      });

      it('should set the focus onto the first checkbox by default', () => {
        const firstOption = getOptions(overlayContainerElement)[0];

        expect(firstOption.className).toContain('dt-option-active');
      });

      it('should keep the apply button disabled until something is selected', () => {
        const checkboxes = getMultiselectCheckboxInputs(
          overlayContainerElement,
        );
        const applyButton = getMultiselectApplyButton(overlayContainerElement);

        expect(applyButton[0].getAttribute('disabled')).toBeDefined();
        // select
        checkboxes[0].click();
        fixture.detectChanges();

        expect(applyButton[0].getAttribute('disabled')).toBeNull();

        // unselect
        checkboxes[0].click();
        fixture.detectChanges();

        expect(applyButton[0].getAttribute('disabled')).toBeDefined();
      });

      it('should close the multiSelect after the multi-select-filter is submitted', () => {
        const checkboxes = getMultiselectCheckboxInputs(
          overlayContainerElement,
        );
        const applyButton = getMultiselectApplyButton(overlayContainerElement);

        checkboxes[0].click();
        advanceFilterfieldCycle();

        applyButton[0].click();
        advanceFilterfieldCycle();

        const multiSelectOverlay = getMultiSelect(overlayContainerElement);

        expect(multiSelectOverlay.length).toBe(0);
      });

      it('should have the tag-filter committed in the filterfield with a single value for multiSelect', () => {
        const checkboxes = getMultiselectCheckboxInputs(
          overlayContainerElement,
        );
        const applyButton = getMultiselectApplyButton(overlayContainerElement);

        checkboxes[0].click();
        fixture.detectChanges();
        applyButton[0].click();
        fixture.detectChanges();

        const tags = getFilterTags(fixture);
        expect(tags[0].key).toBe('Seasoning');
        expect(tags[0].separator).toBe(':');
        expect(tags[0].value.trim()).toBe('None');
      });

      it('should have the tag-filter committed in the filterfield with multiple values for multiSelect', () => {
        const checkboxes = getMultiselectCheckboxInputs(
          overlayContainerElement,
        );
        const applyButton = getMultiselectApplyButton(overlayContainerElement);

        checkboxes[1].click();
        checkboxes[2].click();
        checkboxes[3].click();
        fixture.detectChanges();
        applyButton[0].click();
        fixture.detectChanges();

        const tags = getFilterTags(fixture);
        expect(tags[0].key).toBe('Seasoning');
        expect(tags[0].separator).toBe(':');
        expect(tags[0].value.trim()).toBe('Ketchup, Mustard, Mayo');
      });

      it('should close the filter-multiSelect when using the keyboard ESC', () => {
        const multiSelect = getMultiSelect(overlayContainerElement);

        // Expect the multiSelect filter to be open
        expect(multiSelect.length).toBe(1);

        dispatchKeyboardEvent(multiSelect[0], 'keydown', ESCAPE);
        fixture.detectChanges();

        const multiSelectOverlay = getFilterFieldRange(overlayContainerElement);
        expect(multiSelectOverlay.length).toBe(0);
      });

      it('should reapply previously set multiSelect values when editing a multiSelect filter', () => {
        const checkboxes = getMultiselectCheckboxInputs(
          overlayContainerElement,
        );
        const applyButton = getMultiselectApplyButton(
          overlayContainerElement,
        )[0];

        checkboxes[1].click();
        fixture.detectChanges();
        applyButton.click();
        fixture.detectChanges();

        const tagLabel = fixture.debugElement.queryAll(
          By.css('.dt-filter-field-tag-label'),
        )[0];
        tagLabel.nativeElement.click();

        advanceFilterfieldCycle();

        // expect the multiSelect to open again
        const multiSelect = getMultiSelect(overlayContainerElement);
        expect(multiSelect.length).toBe(1);

        // expect the values to be filled
        expect(checkboxes[1].checked).toBeTruthy();
      });

      it('should mark the input as readonly while loading async data', () => {
        const DATA = {
          autocomplete: [
            {
              name: 'AUT',
              multiOptions: [],
              async: true,
            },
          ],
        };
        const ASYNC_DATA = {
          name: 'AUT',
          multiOptions: [
            {
              name: 'Linz',
            },
          ],
        };

        const input = getInput(fixture);

        fixture.componentInstance.dataSource.data = DATA;
        fixture.detectChanges();
        filterField.focus();
        advanceFilterfieldCycle();

        // No readonly attribute should be present at the beginning.
        expect(input.readOnly).toBeFalsy();

        getAndClickOption(overlayContainerElement, 0);

        // readonly should be added while waiting for the data to be loaded
        expect(input.readOnly).toBeTruthy();

        fixture.componentInstance.dataSource.data = ASYNC_DATA;
        fixture.detectChanges();
        advanceFilterfieldCycle(true, true);

        // readonly should be removed after the async data is loaded
        expect(input.readOnly).toBeFalsy();
      });

      it('should load data for async fields', () => {
        const DATA = {
          autocomplete: [
            {
              name: 'AUT',
              multiOptions: [],
              async: true,
            },
          ],
        };
        const ASYNC_DATA = {
          name: 'AUT',
          multiOptions: [
            {
              name: 'Linz',
            },
          ],
        };

        fixture.componentInstance.dataSource.data = DATA;
        fixture.detectChanges();
        filterField.focus();
        advanceFilterfieldCycle();

        let options = getMultiselectCheckboxInputs(overlayContainerElement);

        // TODO
        expect(options.length).toBe(0);

        getAndClickOption(overlayContainerElement, 0);

        fixture.componentInstance.dataSource.data = ASYNC_DATA;
        fixture.detectChanges();
        advanceFilterfieldCycle(true, true);

        options = getMultiselectCheckboxInputs(overlayContainerElement);

        // TODO
        expect(options.length).toBe(1);
      });

      it('should keep checked already selected options for async fields', () => {
        const DATA = {
          autocomplete: [
            {
              name: 'AUT',
              multiOptions: [],
              async: true,
            },
          ],
        };
        const ASYNC_DATA = {
          name: 'AUT',
          multiOptions: [
            {
              name: 'Linz',
            },
            {
              name: 'Vienna',
            },
          ],
        };

        fixture.componentInstance.dataSource.data = DATA;
        fixture.detectChanges();
        filterField.focus();
        advanceFilterfieldCycle();

        let options = getMultiselectCheckboxInputs(overlayContainerElement);

        getAndClickOption(overlayContainerElement, 0);

        // Fetching data
        fixture.componentInstance.dataSource.data = ASYNC_DATA;
        fixture.detectChanges();
        advanceFilterfieldCycle();

        options = getMultiselectCheckboxInputs(overlayContainerElement);

        // Check the first option
        options[0].click();

        expect(options[0].checked).toBe(true);

        // Close multiselect overlay
        dispatchFakeEvent(document, 'click');
        advanceFilterfieldCycle();

        let multiSelect = getMultiSelect(overlayContainerElement);
        expect(multiSelect.length).toBe(0);

        // Fetching the same data
        fixture.componentInstance.dataSource.data = ASYNC_DATA;
        fixture.detectChanges();
        filterField.focus();
        advanceFilterfieldCycle(true, true);

        multiSelect = getMultiSelect(overlayContainerElement);

        // Multiselect overlay must be open
        expect(multiSelect.length).toBe(1);

        options = getMultiselectCheckboxInputs(overlayContainerElement);

        // Previosly selected option should be kept selected
        expect(options[0].checked).toBe(true);
      });

      it('should apply multiselect values after a selecting a complex filter field', () => {
        const DATA = {
          name: 'State',
          autocomplete: [
            {
              name: 'Oberösterreich',
              multiOptions: [
                { name: 'Linz' },
                { name: 'Wels' },
                { name: 'Steyr' },
                { name: 'Leonding' },
                { name: 'Traun' },
                { name: 'Vöcklabruck' },
              ],
            },
          ],
        };

        fixture.componentInstance.dataSource.data = DATA;
        fixture.detectChanges();
        filterField.focus();
        advanceFilterfieldCycle();

        getAndClickOption(overlayContainerElement, 0);

        // Fetching data
        fixture.detectChanges();
        advanceFilterfieldCycle();

        getAndClickOption(overlayContainerElement, 0);

        // Fetching data
        fixture.detectChanges();
        advanceFilterfieldCycle();

        const options = getMultiselectCheckboxInputs(overlayContainerElement);
        const applyButton = getMultiselectApplyButton(overlayContainerElement);

        // Apply firs
        Array.of(1, 2, 3).forEach((_, index) => {
          options[index].click();
          expect(options[index].checked).toBe(true);
        });

        fixture.detectChanges();
        applyButton[0].click();
        fixture.detectChanges();

        const tags = getFilterTags(fixture);

        expect(tags[0].key).toBe('Oberösterreich');
        expect(tags[0].separator).toBe(':');
        expect(tags[0].value.trim()).toBe('Linz, Wels, Steyr');

        expect(options[0].checked).toBe(true);
      });
    });

    it('should add partial update to the multiOptions', fakeAsync(() => {
      const DATA = {
        autocomplete: [
          {
            name: 'AUT',
            autocomplete: [
              { name: 'Linz' },
              { name: 'Vienna' },
              { name: 'Graz' },
            ],
          },
          {
            name: 'CH (async, partial)',
            async: true,
            multiOptions: [],
          },
        ],
      };

      const DATA_PARTIAL = {
        name: 'CH (async, partial)',
        multiOptions: [
          { name: 'Zürich' },
          { name: 'Genf' },
          { name: 'Basel' },
          { name: 'Bern' },
        ],
        partial: true,
      };

      const DATA_PARTIAL_2 = {
        name: 'CH (async, partial)',
        multiOptions: [
          { name: 'Zug' },
          { name: 'Schaffhausen' },
          { name: 'Luzern' },
          { name: 'St. Gallen' },
        ],
        partial: true,
      };

      fixture.componentInstance.dataSource.data = DATA;
      fixture.detectChanges();
      filterField.focus();
      advanceFilterfieldCycle(true, true);

      getAndClickOption(overlayContainerElement, 1);

      let options = getOptions(overlayContainerElement);
      expect(options).toHaveLength(0);

      fixture.componentInstance.dataSource.data = DATA_PARTIAL;
      fixture.detectChanges();
      advanceFilterfieldCycle(true, true);
      tick();

      options = getOptions(overlayContainerElement);
      expect(options).toHaveLength(4);
      expect(options[0].textContent).toContain('Zürich');
      expect(options[1].textContent).toContain('Genf');
      expect(options[2].textContent).toContain('Basel');
      expect(options[3].textContent).toContain('Bern');

      fixture.componentInstance.dataSource.data = DATA_PARTIAL_2;
      fixture.detectChanges();
      advanceFilterfieldCycle(true, true);
      tick();

      options = getOptions(overlayContainerElement);
      expect(options).toHaveLength(4);
      expect(options[0].textContent).toContain('Zug');
      expect(options[1].textContent).toContain('Schaffhausen');
      expect(options[2].textContent).toContain('Luzern');
      expect(options[3].textContent).toContain('St. Gallen');
    }));

    describe('edit mode', () => {
      beforeEach(() => {
        fixture.componentInstance.dataSource.data =
          TEST_DATA_MULTI_SELECT_EDIT_MODE;
        advanceFilterfieldCycle();

        const multiSelectFilter = [
          TEST_DATA_MULTI_SELECT_EDIT_MODE.autocomplete[0],
          (TEST_DATA_MULTI_SELECT_EDIT_MODE as any).autocomplete[0]
            .multiOptions[1].options[0],
          (TEST_DATA_MULTI_SELECT_EDIT_MODE as any).autocomplete[0]
            .multiOptions[1].options[1],
        ];

        // Set filters as a starting point
        filterField.filters = [multiSelectFilter];
        fixture.detectChanges();
      });

      it('should have the correct filters set as a starting point', () => {
        const tags = getFilterTags(fixture);

        expect(tags[0].key).toBe('Seasoning');
        expect(tags[0].separator).toBe(':');
        expect(tags[0].value).toBe('Ketchup, Mustard');
      });

      it('should reset the multiSelect filter when not changing anything and cancelling by mouse', () => {
        const tags = fixture.debugElement.queryAll(
          By.css('.dt-filter-field-tag-label'),
        );
        tags[0].nativeElement.click();
        advanceFilterfieldCycle();

        // Expect the multiSelect filter to be open
        let filterfield = getMultiSelect(overlayContainerElement);
        expect(filterfield.length).toBe(1);

        dispatchFakeEvent(document, 'click');
        advanceFilterfieldCycle();

        // Expect the multiSelect filter to be closed again
        filterfield = getMultiSelect(overlayContainerElement);
        expect(filterfield.length).toBe(0);

        // Read the filters again and make expectations
        const filterTags = getFilterTags(fixture);

        expect(filterTags[0].key).toBe('Seasoning');
        expect(filterTags[0].separator).toBe(':');
        expect(filterTags[0].value).toBe('Ketchup, Mustard');
      });

      it('should reset the multiSelect filter when not changing anything and cancelling by keyboard', () => {
        const tags = fixture.debugElement.queryAll(
          By.css('.dt-filter-field-tag-label'),
        );
        tags[0].nativeElement.click();
        advanceFilterfieldCycle();

        // Expect the multiSelect filter to be open
        let multiSelect = getMultiSelect(overlayContainerElement);
        expect(multiSelect.length).toBe(1);

        // Cancel editmode with keyboard
        dispatchKeyboardEvent(multiSelect[0], 'keydown', ESCAPE);

        advanceFilterfieldCycle();

        // Expect the multiSelect filter to be closed again
        multiSelect = getMultiSelect(overlayContainerElement);
        expect(multiSelect.length).toBe(0);

        // Read the filters again and make expectations
        const filterTags = getFilterTags(fixture);

        expect(filterTags[0].key).toBe('Seasoning');
        expect(filterTags[0].separator).toBe(':');
        expect(filterTags[0].value).toBe('Ketchup, Mustard');
      });

      it('should reset the multiSelect filter when not changing anything and clicking on apply', () => {
        const tags = fixture.debugElement.queryAll(
          By.css('.dt-filter-field-tag-label'),
        );
        tags[0].nativeElement.click();
        advanceFilterfieldCycle();

        // Expect the multiSelect filter to be open
        let multiSelect = getMultiSelect(overlayContainerElement);
        expect(multiSelect.length).toBe(1);

        // Click the apply button
        const applyButton = getMultiselectApplyButton(
          overlayContainerElement,
        )[0];
        applyButton.click();
        fixture.detectChanges();

        // Expect the multiSelect filter to be closed again
        multiSelect = getMultiSelect(overlayContainerElement);
        expect(multiSelect.length).toBe(0);

        // Read the filters again and make expectations
        const filterTags = getFilterTags(fixture);

        expect(filterTags[0].key).toBe('Seasoning');
        expect(filterTags[0].separator).toBe(':');
        expect(filterTags[0].value).toBe('Ketchup, Mustard');
      });

      it('should make the edit to the first tag', () => {
        const tags = fixture.debugElement.queryAll(
          By.css('.dt-filter-field-tag-label'),
        );
        tags[0].nativeElement.click();
        advanceFilterfieldCycle();

        const options = getMultiselectCheckboxInputs(overlayContainerElement);
        // Make sure that the autocomplete actually opened.
        expect(options.length).toBe(5);

        // Unselect Ketchup
        options[1].click();
        advanceFilterfieldCycle();

        const applyButton = getMultiselectApplyButton(
          overlayContainerElement,
        )[0];
        applyButton.click();
        fixture.detectChanges();

        // Read the filters again and make expectations
        const filterTags = getFilterTags(fixture);

        expect(filterTags[0].key).toBe('Seasoning');
        expect(filterTags[0].separator).toBe(':');
        expect(filterTags[0].value).toBe('Ketchup, Mustard');
      });

      it('should emit a filterchange event when the edit of a multiSelect is completed', () => {
        let filterChangeEvent: DtFilterFieldChangeEvent<any> | undefined;

        fixture.componentInstance.dataSource.data =
          FILTER_FIELD_TEST_DATA_SINGLE_OPTION;
        const sub = filterField.filterChanges.subscribe(
          (ev) => (filterChangeEvent = ev),
        );

        const tags = fixture.debugElement.queryAll(
          By.css('.dt-filter-field-tag-label'),
        );

        tags[0].nativeElement.click();
        advanceFilterfieldCycle();

        const options = getMultiselectCheckboxInputs(overlayContainerElement);
        // Make sure that the autocomplete actually opened.
        expect(options.length).toBe(5);

        // Unselect ketchup
        options[1].click();
        advanceFilterfieldCycle();

        const applyButton = getMultiselectApplyButton(
          overlayContainerElement,
        )[0];
        applyButton.click();
        fixture.detectChanges();

        expect(filterChangeEvent).toBeDefined();
        expect(filterChangeEvent!.added.length).toBe(1);
        expect(filterChangeEvent!.removed.length).toBe(0);

        sub.unsubscribe();
      });
    });

    describe('programmatic setting', () => {
      beforeEach(() => {
        fixture.componentInstance.dataSource.data =
          TEST_DATA_MULTI_SELECT_EDIT_MODE;
        advanceFilterfieldCycle();
      });

      it('should set the multiSelect filter programmatically', () => {
        const multiSelectFilter = [
          TEST_DATA_MULTI_SELECT_EDIT_MODE.autocomplete[0],
          { name: 'Mustard' },
          { name: 'Mayo' },
        ];
        filterField.filters = [multiSelectFilter];
        fixture.detectChanges();

        const tags = getFilterTags(fixture);
        expect(tags[0].key).toBe('Seasoning');
        expect(tags[0].separator).toBe(':');
        expect(tags[0].value).toBe('Mustard, Mayo');
      });
    });
  });
});
