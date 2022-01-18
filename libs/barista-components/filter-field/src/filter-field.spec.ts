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

import {
  BACKSPACE,
  DOWN_ARROW,
  ENTER,
  ESCAPE,
  LEFT_ARROW,
  RIGHT_ARROW,
} from '@angular/cdk/keycodes';
import { OverlayContainer } from '@angular/cdk/overlay';
import {
  ComponentFixture,
  fakeAsync,
  flush,
  inject,
  tick,
} from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import {
  createComponent,
  dispatchFakeEvent,
  dispatchKeyboardEvent,
  MockNgZone,
} from '@dynatrace/testing/browser';
import {
  FILTER_FIELD_TEST_DATA,
  FILTER_FIELD_TEST_DATA_ASYNC,
  FILTER_FIELD_TEST_DATA_SINGLE_DISTINCT,
  FILTER_FIELD_TEST_DATA_SINGLE_OPTION,
} from '@dynatrace/testing/fixtures';
import { DtFilterField, DtFilterFieldChangeEvent } from './filter-field';
import { EditionParserFunction } from './filter-field-config';
import { TEST_DATA_EDITMODE_ASYNC } from './filter-field-edit-mode.spec';
import {
  TEST_DATA_SUGGESTIONS,
  TEST_DATA_EDITMODE,
  TEST_DATA_RANGE,
  TEST_DATA_PLACEHOLDER,
  TEST_DATA_KEYBOARD_NAVIGATION,
  TEST_DEFAULT_SEARCH_UNIQUE,
} from './testing/filter-field-test-data';
import {
  TestApp,
  TestAppCustomParserConfig,
  TestAppCustomParserInput,
  getOptions,
  setupFilterFieldTest,
  getOptionGroups,
  getClearAll,
  getFilterTags,
  getInput,
  getTagButtons,
  isClearAllVisible,
  getPartialResultsHintPanel,
} from './testing/filter-field-test-helpers';
import { DtAutocompleteValue, DtFilterValue } from './types';

describe('DtFilterField', () => {
  let fixture: ComponentFixture<TestApp>;
  let overlayContainer: OverlayContainer;
  let overlayContainerElement: HTMLElement;
  let filterField: DtFilterField<any>;
  let zone: MockNgZone;
  let advanceFilterfieldCycle: (
    simulateMicrotasks?: boolean,
    simulateZoneExit?: boolean,
  ) => void;
  let getAndClickOption: (
    optionOverlayContainer: HTMLElement,
    nthOption: number,
  ) => void;
  let typeIntoFilterElement: (inputString: string) => void;

  beforeEach(() => {
    ({
      fixture,
      filterField,
      zone,
      overlayContainer,
      overlayContainerElement,
      advanceFilterfieldCycle,
      getAndClickOption,
      typeIntoFilterElement,
    } = setupFilterFieldTest());

    inject([OverlayContainer], (oc: OverlayContainer) => {
      overlayContainer = oc;
      overlayContainerElement = oc.getContainerElement();
    })();
  });

  afterEach(inject(
    [OverlayContainer],
    (currentOverlayContainer: OverlayContainer) => {
      // Since we're resetting the testing module in some of the tests,
      // we can potentially have multiple overlay containers.
      currentOverlayContainer.ngOnDestroy();
      overlayContainer.ngOnDestroy();
    },
  ));

  describe('focus on input', () => {
    it('should focus the input field when focusing the host', () => {
      const input = fixture.debugElement.query(
        By.css('.dt-filter-field-input'),
      ).nativeElement;
      filterField.focus();
      expect(document.activeElement).toBe(input);
    });
  });

  describe('disabled', () => {
    it('should disable the input if filter field is disabled', () => {
      // when
      filterField.disabled = true;
      fixture.detectChanges();

      // then
      const input = fixture.debugElement.query(
        By.css('.dt-filter-field-disabled'),
      ).nativeElement;
      expect(input).toBeTruthy();
    });

    it('should disable all tags if filter field is disabled', fakeAsync(() => {
      // given
      fixture.componentInstance.dataSource.data =
        FILTER_FIELD_TEST_DATA_SINGLE_DISTINCT;
      fixture.detectChanges();

      filterField.focus();
      advanceFilterfieldCycle();

      // Get option AUT and click it.
      getAndClickOption(overlayContainerElement, 0);

      // Get option vienna and click it.
      getAndClickOption(overlayContainerElement, 0);

      // when
      filterField.disabled = true;
      fixture.detectChanges();

      // then
      const subscription = filterField.currentTags.subscribe((tags) => {
        for (const dtFilterFieldTag of tags) {
          expect(dtFilterFieldTag.disabled).toBeTruthy();
        }
      });
      tick();
      subscription.unsubscribe();
    }));

    it('should restore the previous state of tags if filter field gets enabled', fakeAsync(() => {
      // given
      fixture.componentInstance.dataSource.data = FILTER_FIELD_TEST_DATA_ASYNC;
      fixture.detectChanges();

      // Add filter "AUT - Vienna"
      filterField.focus();
      advanceFilterfieldCycle();

      // Get option AUT and click it.
      getAndClickOption(overlayContainerElement, 0);

      // Get option vienna and click it.
      getAndClickOption(overlayContainerElement, 1);

      // Add filter "USA - Los Angeles"
      filterField.focus();
      advanceFilterfieldCycle();

      // Get option US and click it.
      getAndClickOption(overlayContainerElement, 1);

      // Get option Los Angeles and click it.
      getAndClickOption(overlayContainerElement, 0);

      // Disable filter "AUT - Vienna"
      const sub1 = filterField.currentTags.subscribe(
        (tags) => (tags[0].disabled = true),
      );
      tick();
      sub1.unsubscribe();

      // when
      filterField.disabled = true;
      filterField.disabled = false;
      fixture.detectChanges();

      // then
      const sub2 = filterField.currentTags.subscribe((tags) => {
        expect(tags[0].disabled).toBeTruthy();
        expect(tags[1].disabled).toBeFalsy();
      });
      tick();
      sub2.unsubscribe();
    }));

    it('should disable programmatically set tags when they are set during a disabled state', fakeAsync(() => {
      // given
      fixture.componentInstance.dataSource.data =
        FILTER_FIELD_TEST_DATA_SINGLE_DISTINCT;
      fixture.detectChanges();

      // when
      filterField.disabled = true;
      const filters = [
        [
          FILTER_FIELD_TEST_DATA_SINGLE_DISTINCT.autocomplete[0],
          FILTER_FIELD_TEST_DATA_SINGLE_DISTINCT.autocomplete[0]
            .autocomplete[0],
        ],
      ];
      fixture.detectChanges();
      advanceFilterfieldCycle(true, true);
      filterField.filters = filters;
      fixture.detectChanges();
      advanceFilterfieldCycle(true, true);
      const tags = getFilterTags(fixture);
      expect(tags[0].ele.nativeElement.getAttribute('class')).toContain(
        'dt-filter-field-tag-disabled',
      );
    }));
  });

  describe('labeling', () => {
    it('should create an label with an filter icon', () => {
      const label = fixture.debugElement.query(
        By.css('.dt-filter-field-label'),
      );
      const icon = label.query(By.css('dt-icon'));
      expect(icon.componentInstance.name).toEqual('filter');
    });

    it('should use the label passed to the component', () => {
      const label = fixture.debugElement.query(
        By.css('.dt-filter-field-label'),
      );
      expect(label.nativeElement.textContent).toEqual('Filter by');
    });

    it('should update the label', () => {
      fixture.componentInstance.label = 'Something else';
      fixture.detectChanges();
      const label = fixture.debugElement.query(
        By.css('.dt-filter-field-label'),
      );
      expect(label.nativeElement.textContent).toEqual('Something else');
    });
  });

  describe('keyboard navigation', () => {
    beforeEach(() => {
      fixture.componentInstance.dataSource.data = TEST_DATA_KEYBOARD_NAVIGATION;
      advanceFilterfieldCycle();
    });

    describe('with deletable', () => {
      it('should focus first editButton. Focus: Input -> LEFT_ARROW x2', fakeAsync(() => {
        const autocompleteFilter = [
          TEST_DATA_KEYBOARD_NAVIGATION.autocomplete[0],
          TEST_DATA_KEYBOARD_NAVIGATION.autocomplete[0].autocomplete[0],
        ];
        filterField.filters = [autocompleteFilter];
        fixture.detectChanges();

        filterField.focus();
        const inputEl = getInput(fixture);
        tick();
        fixture.detectChanges();

        dispatchKeyboardEvent(inputEl, 'keyup', LEFT_ARROW);
        tick();
        fixture.detectChanges();

        const tags = getFilterTags(fixture);
        const tag = getTagButtons(tags[0]);

        dispatchKeyboardEvent(tag.deleteButton, 'keyup', LEFT_ARROW);
        tick();
        fixture.detectChanges();

        expect(document.activeElement).toBe(tag.label);
      }));

      it('should keep focus on first editButton. Focus: Input -> LEFT_ARROW x3', fakeAsync(() => {
        const autocompleteFilter = [
          TEST_DATA_KEYBOARD_NAVIGATION.autocomplete[0],
          TEST_DATA_KEYBOARD_NAVIGATION.autocomplete[0].autocomplete[0],
        ];
        filterField.filters = [autocompleteFilter];
        fixture.detectChanges();

        filterField.focus();
        const inputEl = getInput(fixture);
        tick();
        fixture.detectChanges();

        dispatchKeyboardEvent(inputEl, 'keyup', LEFT_ARROW);
        tick();
        fixture.detectChanges();

        const tags = getFilterTags(fixture);
        const tag = getTagButtons(tags[0]);

        dispatchKeyboardEvent(tag.deleteButton, 'keyup', LEFT_ARROW);
        tick();
        fixture.detectChanges();

        dispatchKeyboardEvent(tag.label, 'keyup', LEFT_ARROW);
        tick();
        fixture.detectChanges();

        expect(document.activeElement).toBe(tag.label);
      }));

      it('should focus second editButton. Focus: Input -> LEFT_ARROW x4', fakeAsync(() => {
        const autocompleteFilterUA = [
          TEST_DATA_KEYBOARD_NAVIGATION.autocomplete[0],
          TEST_DATA_KEYBOARD_NAVIGATION.autocomplete[0].autocomplete[0],
        ];
        const autocompleteFilterLA = [
          TEST_DATA_KEYBOARD_NAVIGATION.autocomplete[0],
          TEST_DATA_KEYBOARD_NAVIGATION.autocomplete[0].autocomplete[1],
        ];
        filterField.filters = [autocompleteFilterUA, autocompleteFilterLA];
        fixture.detectChanges();

        filterField.focus();
        const inputEl = getInput(fixture);
        tick();
        fixture.detectChanges();

        dispatchKeyboardEvent(inputEl, 'keyup', LEFT_ARROW);
        tick();
        fixture.detectChanges();

        const tags = getFilterTags(fixture);
        const tagLA = getTagButtons(tags[1]);
        const tagUA = getTagButtons(tags[0]);

        dispatchKeyboardEvent(tagLA.deleteButton, 'keyup', LEFT_ARROW);
        tick();
        fixture.detectChanges();

        dispatchKeyboardEvent(tagLA.label, 'keyup', LEFT_ARROW);
        tick();
        fixture.detectChanges();

        dispatchKeyboardEvent(tagUA.deleteButton, 'keyup', LEFT_ARROW);
        tick();
        fixture.detectChanges();

        expect(document.activeElement).toBe(tagUA.label);
      }));

      it('should focus input element. Focus: Input -> LEFT_ARROW -> RIGHT_ARROW', fakeAsync(() => {
        const autocompleteFilter = [
          TEST_DATA_KEYBOARD_NAVIGATION.autocomplete[0],
          TEST_DATA_KEYBOARD_NAVIGATION.autocomplete[0].autocomplete[0],
        ];
        filterField.filters = [autocompleteFilter];
        fixture.detectChanges();

        const inputEl = getInput(fixture);
        const tags = getFilterTags(fixture);
        const tag = getTagButtons(tags[0]);

        filterField.focus();
        tick();
        fixture.detectChanges();

        dispatchKeyboardEvent(inputEl, 'keyup', LEFT_ARROW);
        tick();
        fixture.detectChanges();

        dispatchKeyboardEvent(tag.deleteButton, 'keyup', RIGHT_ARROW);
        tick();
        fixture.detectChanges();

        expect(document.activeElement).toBe(inputEl);
      }));

      it('should focus input element. Focus: Input -> LEFT_ARROW x3 -> RIGHT_ARROW x3', fakeAsync(() => {
        const autocompleteFilterUA = [
          TEST_DATA_KEYBOARD_NAVIGATION.autocomplete[0],
          TEST_DATA_KEYBOARD_NAVIGATION.autocomplete[0].autocomplete[0],
        ];
        const autocompleteFilterLA = [
          TEST_DATA_KEYBOARD_NAVIGATION.autocomplete[0],
          TEST_DATA_KEYBOARD_NAVIGATION.autocomplete[0].autocomplete[1],
        ];
        filterField.filters = [autocompleteFilterUA, autocompleteFilterLA];
        fixture.detectChanges();

        const inputEl = getInput(fixture);
        const tags = getFilterTags(fixture);
        const tagUA = getTagButtons(tags[0]);
        const tagLA = getTagButtons(tags[1]);

        filterField.focus();
        tick();
        fixture.detectChanges();

        dispatchKeyboardEvent(inputEl, 'keyup', LEFT_ARROW);
        tick();
        fixture.detectChanges();

        dispatchKeyboardEvent(tagUA.deleteButton, 'keyup', LEFT_ARROW);
        tick();
        fixture.detectChanges();
        dispatchKeyboardEvent(tagUA.label, 'keyup', LEFT_ARROW);
        tick();
        fixture.detectChanges();

        dispatchKeyboardEvent(tagLA.deleteButton, 'keyup', RIGHT_ARROW);
        tick();
        fixture.detectChanges();

        dispatchKeyboardEvent(tagUA.label, 'keyup', RIGHT_ARROW);
        tick();
        fixture.detectChanges();

        dispatchKeyboardEvent(tagUA.deleteButton, 'keyup', RIGHT_ARROW);
        tick();
        fixture.detectChanges();

        expect(document.activeElement).toBe(inputEl);
      }));
    });

    describe('without deletable', () => {
      it('should focus first editButton. Focus: Input -> LEFT_ARROW', fakeAsync(() => {
        const autocompleteFilter = [
          TEST_DATA_KEYBOARD_NAVIGATION.autocomplete[0],
          TEST_DATA_KEYBOARD_NAVIGATION.autocomplete[0].autocomplete[0],
        ];
        filterField.filters = [autocompleteFilter];
        filterField.tagData[0].deletable = false;
        fixture.detectChanges();

        const inputEl = getInput(fixture);
        const tags = getFilterTags(fixture);
        const tag = getTagButtons(tags[0]);

        filterField.focus();
        tick();
        fixture.detectChanges();

        dispatchKeyboardEvent(inputEl, 'keyup', LEFT_ARROW);
        tick();
        fixture.detectChanges();

        expect(document.activeElement).toBe(tag.label);
      }));

      it('should keep focus on first editButton. Focus: Input -> LEFT_ARROW x2', fakeAsync(() => {
        const autocompleteFilter = [
          TEST_DATA_KEYBOARD_NAVIGATION.autocomplete[0],
          TEST_DATA_KEYBOARD_NAVIGATION.autocomplete[0].autocomplete[0],
        ];
        filterField.filters = [autocompleteFilter];
        filterField.tagData[0].deletable = false;
        fixture.detectChanges();

        const inputEl = getInput(fixture);
        const tags = getFilterTags(fixture);
        const tag = getTagButtons(tags[0]);

        filterField.focus();
        tick();
        fixture.detectChanges();

        dispatchKeyboardEvent(inputEl, 'keyup', LEFT_ARROW);
        tick();
        fixture.detectChanges();

        dispatchKeyboardEvent(tag.label, 'keyup', LEFT_ARROW);
        tick();
        fixture.detectChanges();

        expect(document.activeElement).toBe(tag.label);
      }));

      it('should focus second editButton. Focus: Input -> LEFT_ARROW x2', fakeAsync(() => {
        const autocompleteFilterUA = [
          TEST_DATA_KEYBOARD_NAVIGATION.autocomplete[0],
          TEST_DATA_KEYBOARD_NAVIGATION.autocomplete[0].autocomplete[0],
        ];
        const autocompleteFilterLA = [
          TEST_DATA_KEYBOARD_NAVIGATION.autocomplete[0],
          TEST_DATA_KEYBOARD_NAVIGATION.autocomplete[0].autocomplete[1],
        ];
        filterField.filters = [
          [...autocompleteFilterUA],
          [...autocompleteFilterLA],
        ];
        filterField.tagData[0].deletable = false;
        filterField.tagData[1].deletable = false;
        fixture.detectChanges();

        const inputEl = getInput(fixture);
        const tags = getFilterTags(fixture);
        const tagUA = getTagButtons(tags[0]);
        const tagLA = getTagButtons(tags[1]);

        filterField.focus();
        tick();
        fixture.detectChanges();

        dispatchKeyboardEvent(inputEl, 'keyup', LEFT_ARROW);
        tick();
        fixture.detectChanges();

        dispatchKeyboardEvent(tagUA.label, 'keyup', LEFT_ARROW);
        tick();
        fixture.detectChanges();

        expect(document.activeElement).toBe(tagLA.label);
      }));

      it('should focus input element. Focus: Input -> LEFT_ARROW -> RIGHT_ARROW', fakeAsync(() => {
        const autocompleteFilter = [
          TEST_DATA_KEYBOARD_NAVIGATION.autocomplete[0],
          TEST_DATA_KEYBOARD_NAVIGATION.autocomplete[0].autocomplete[0],
        ];
        filterField.filters = [autocompleteFilter];
        filterField.tagData[0].deletable = false;
        fixture.detectChanges();

        const inputEl = getInput(fixture);
        const tags = getFilterTags(fixture);
        const tag = getTagButtons(tags[0]);

        filterField.focus();
        tick();
        fixture.detectChanges();

        dispatchKeyboardEvent(inputEl, 'keyup', LEFT_ARROW);
        tick();
        fixture.detectChanges();

        dispatchKeyboardEvent(tag.label, 'keyup', RIGHT_ARROW);
        tick();
        fixture.detectChanges();

        expect(document.activeElement).toBe(inputEl);
      }));

      it('should focus input element. Focus: Input -> LEFT_ARROW x2 -> RIGHT_ARROW x2', fakeAsync(() => {
        const autocompleteFilterUA = [
          TEST_DATA_KEYBOARD_NAVIGATION.autocomplete[0],
          TEST_DATA_KEYBOARD_NAVIGATION.autocomplete[0].autocomplete[0],
        ];
        const autocompleteFilterLA = [
          TEST_DATA_KEYBOARD_NAVIGATION.autocomplete[0],
          TEST_DATA_KEYBOARD_NAVIGATION.autocomplete[0].autocomplete[1],
        ];
        filterField.filters = [
          [...autocompleteFilterUA],
          [...autocompleteFilterLA],
        ];
        filterField.tagData[0].deletable = false;
        filterField.tagData[1].deletable = false;
        fixture.detectChanges();

        const inputEl = getInput(fixture);
        const tags = getFilterTags(fixture);
        const firstTag = getTagButtons(tags[0]);
        const secondTag = getTagButtons(tags[1]);

        filterField.focus();
        tick();
        fixture.detectChanges();

        dispatchKeyboardEvent(inputEl, 'keyup', LEFT_ARROW);
        tick();
        fixture.detectChanges();

        dispatchKeyboardEvent(firstTag.label, 'keyup', LEFT_ARROW);
        tick();
        fixture.detectChanges();

        dispatchKeyboardEvent(secondTag.label, 'keyup', RIGHT_ARROW);
        tick();
        fixture.detectChanges();

        dispatchKeyboardEvent(firstTag.label, 'keyup', RIGHT_ARROW);
        tick();
        fixture.detectChanges();

        expect(document.activeElement).toBe(inputEl);
      }));
    });
  });

  describe('overlay', () => {
    it('should create an autocomplete overlay when focus is called for autocomplete data', () => {
      filterField.focus();
      fixture.detectChanges();
      expect(overlayContainerElement).toBeDefined();
    });
  });

  describe('interaction state', () => {
    it('should emit true when focused', fakeAsync(() => {
      fixture.componentInstance.dataSource.data = FILTER_FIELD_TEST_DATA;
      fixture.detectChanges();

      filterField.focus();
      advanceFilterfieldCycle();

      expect(filterField.interactionState).toBeTruthy();
    }));

    it('should emit true when the filterField is focused', fakeAsync(() => {
      fixture.componentInstance.dataSource.data = TEST_DATA_RANGE;
      fixture.detectChanges();

      const spy = jest.fn();
      const subscription = filterField.interactionStateChange.subscribe(spy);

      filterField.focus();
      advanceFilterfieldCycle();

      expect(spy).toHaveBeenCalledTimes(1);

      subscription.unsubscribe();
    }));
  });

  describe('with autocomplete', () => {
    it('should open the autocomplete if filter field is focused', () => {
      expect(filterField._autocomplete.isOpen).toBe(false);
      filterField.focus();
      zone.simulateMicrotasksEmpty();
      expect(filterField._autocomplete.isOpen).toBe(true);
    });

    it('should emit the inputChange event when typing into the input field with autocomplete', () => {
      const spy = jest.fn();
      const subscription = filterField.inputChange.subscribe(spy);

      typeIntoFilterElement('x');
      fixture.detectChanges();

      expect(spy).toHaveBeenCalledWith('x');

      typeIntoFilterElement('xy');
      fixture.detectChanges();

      expect(spy).toHaveBeenCalledWith('xy');
      subscription.unsubscribe();
    });

    it('should create the correct options and option groups', () => {
      filterField.focus();
      advanceFilterfieldCycle();

      const options = getOptions(overlayContainerElement);
      const optionGroups = getOptionGroups(overlayContainerElement);
      expect(options.length).toBe(4);
      expect(optionGroups.length).toBe(0);
      expect(options[0].textContent).toContain('AUT');
      expect(options[1].textContent).toContain('USA');
      expect(options[2].textContent).toContain('Free');
    });

    it('should switch to the next autocomplete if the selected option is also an autocomplete', () => {
      filterField.focus();
      advanceFilterfieldCycle();

      let options = getOptions(overlayContainerElement);
      expect(options[0].textContent).toContain('AUT');
      expect(options[1].textContent).toContain('USA');
      expect(options[2].textContent).toContain('Free');

      getAndClickOption(overlayContainerElement, 0);
      advanceFilterfieldCycle();

      options = getOptions(overlayContainerElement);
      let optionGroups = getOptionGroups(overlayContainerElement);
      expect(optionGroups.length).toBe(0);
      expect(options.length).toBe(2);
      expect(options[0].textContent).toContain('Upper Austria');
      expect(options[1].textContent).toContain('Vienna');

      zone.simulateZoneExit();

      const upperAustriaOption = options[0];
      upperAustriaOption.click();
      advanceFilterfieldCycle();

      options = getOptions(overlayContainerElement);
      optionGroups = getOptionGroups(overlayContainerElement);

      expect(optionGroups.length).toBe(1);
      expect(optionGroups[0].textContent).toContain('Cities');
      expect(options[0].textContent).toContain('Linz');
      expect(options[1].textContent).toContain('Wels');
      expect(options[2].textContent).toContain('Steyr');
    });

    it('should clear the filtered string from the input when selecting an option', fakeAsync(() => {
      filterField.focus();
      advanceFilterfieldCycle();

      typeIntoFilterElement('US');
      advanceFilterfieldCycle(true, false);

      // We cannot use the common getAndClick option helper here,
      // because it triggers advanceFilterfieldCycle which will break this test.
      let options = getOptions(overlayContainerElement);
      const usOption = options[0];
      usOption.click();
      advanceFilterfieldCycle(true, false);

      options = getOptions(overlayContainerElement);
      expect(options.length).toBe(2);
      // We use contain in favor of toBe as the text has to be inside twice due to the highlight
      // The second occurrence is hidden by display:none
      expect(options[0].textContent).toContain('Los Angeles');
      expect(options[1].textContent).toContain('San Fran');

      zone.simulateZoneExit();
    }));

    it('should highlight & filter the correct options with the same character after resetting', fakeAsync(() => {
      filterField.focus();
      advanceFilterfieldCycle();

      typeIntoFilterElement('t');
      advanceFilterfieldCycle(true, false);

      // We cannot use the common getAndClick option helper here,
      // because it triggers advanceFilterfieldCycle which will break this test.
      let options = getOptions(overlayContainerElement);
      const autOption = options[0];
      autOption.click();
      advanceFilterfieldCycle(true, false);

      typeIntoFilterElement('t');
      advanceFilterfieldCycle(true, false);

      options = getOptions(overlayContainerElement);
      expect(options.length).toBe(1);
      // We use contain in favor of toBe as the text has to be inside twice due to the highlight
      // The second occurrence is hidden by display:none
      expect(options[0].textContent).toContain('Upper Austria');
      tick();
    }));

    it('should switch to the next autocomplete if the selected option is also a free text with suggestions', () => {
      fixture.componentInstance.dataSource.data = TEST_DATA_SUGGESTIONS;
      filterField.focus();
      advanceFilterfieldCycle();

      let options = getOptions(overlayContainerElement);
      expect(options[0].textContent).toContain('Custom Simple Option');
      expect(options[1].textContent).toContain('Node Label');

      getAndClickOption(overlayContainerElement, 1);

      options = getOptions(overlayContainerElement);
      const optionGroups = getOptionGroups(overlayContainerElement);
      expect(optionGroups.length).toBe(0);
      expect(options.length).toBe(2);
      expect(options[0].textContent).toContain('some cool');
      expect(options[1].textContent).toContain('very weird');

      zone.simulateZoneExit();
    });

    it('should focus the input element after selecting an option in autocomplete (autocomplete -> autocomplete)', () => {
      filterField.focus();
      advanceFilterfieldCycle(true, false);

      getAndClickOption(overlayContainerElement, 0);
      const inputEl = getInput(fixture);

      expect(document.activeElement).toBe(inputEl);
    });

    it('should fire filterChanges and create a tag after an option that has no children is clicked', fakeAsync(() => {
      const spy = jest.fn();
      const subscription = filterField.filterChanges.subscribe(spy);
      filterField.focus();
      advanceFilterfieldCycle();

      const options = getOptions(overlayContainerElement);
      expect(options[0].textContent).toContain('AUT');
      expect(options[1].textContent).toContain('USA');

      // Click the USA option
      getAndClickOption(overlayContainerElement, 1);

      // Click the San Francisco option
      getAndClickOption(overlayContainerElement, 0);

      const tags = getFilterTags(fixture);
      expect(tags.length).toBe(1);
      expect(tags[0].key).toBe('USA');
      expect(tags[0].separator).toBe(':');
      expect(tags[0].value.trim()).toBe('Los Angeles');

      expect(spy).toHaveBeenCalledTimes(1);
      subscription.unsubscribe();
    }));

    it('should emit filterChanges when adding an option', fakeAsync(() => {
      let filterChangeEvent: DtFilterFieldChangeEvent<any> | undefined;

      fixture.componentInstance.dataSource.data =
        FILTER_FIELD_TEST_DATA_SINGLE_OPTION;
      const sub = filterField.filterChanges.subscribe(
        (ev) => (filterChangeEvent = ev),
      );

      fixture.detectChanges();
      filterField.focus();
      advanceFilterfieldCycle();

      const options = getOptions(overlayContainerElement);
      options[0].click();

      tick();

      expect(filterChangeEvent).toBeDefined();
      expect(filterChangeEvent!.added.length).toBe(1);
      expect(filterChangeEvent!.removed.length).toBe(0);
      expect(filterChangeEvent!.filters.length).toBe(1);

      sub.unsubscribe();
    }));

    it('should emit filterChanges when removing an option', fakeAsync(() => {
      let filterChangeEvent: DtFilterFieldChangeEvent<any> | undefined;

      fixture.componentInstance.dataSource.data =
        FILTER_FIELD_TEST_DATA_SINGLE_OPTION;
      const sub = filterField.filterChanges.subscribe(
        (ev) => (filterChangeEvent = ev),
      );

      fixture.detectChanges();
      filterField.focus();
      advanceFilterfieldCycle();

      const options = getOptions(overlayContainerElement);
      options[0].click();

      tick();
      fixture.detectChanges();

      const tags = getFilterTags(fixture);
      tags[0].removeButton.click();

      tick();

      expect(filterChangeEvent).toBeDefined();
      expect(filterChangeEvent!.added.length).toBe(0);
      expect(filterChangeEvent!.removed.length).toBe(1);
      expect(filterChangeEvent!.filters.length).toBe(0);

      sub.unsubscribe();
    }));

    it('should switch to free text and on enter fire a filterChanges event and create a tag', () => {
      const spy = jest.fn();
      const subscription = filterField.filterChanges.subscribe(spy);
      filterField.focus();
      advanceFilterfieldCycle();

      getAndClickOption(overlayContainerElement, 2);

      typeIntoFilterElement('abc');
      fixture.detectChanges();

      const inputEl = getInput(fixture);
      dispatchKeyboardEvent(inputEl, 'keydown', ENTER);

      fixture.detectChanges();

      const tags = getFilterTags(fixture);
      expect(tags.length).toBe(1);
      expect(tags[0].key).toBe('Free');
      expect(tags[0].separator).toBe('~');
      expect(tags[0].value).toBe('abc');
      expect(spy).toHaveBeenCalledTimes(1);
      subscription.unsubscribe();
    });

    it('should switch to free text with keyboard interaction and on enter fire a filterChanges event and create a tag', () => {
      const spy = jest.fn();
      const subscription = filterField.filterChanges.subscribe(spy);
      filterField.focus();
      advanceFilterfieldCycle();

      const inputEl = getInput(fixture);

      // Select the free text option with the keyboard and hit enter
      dispatchKeyboardEvent(inputEl, 'keydown', DOWN_ARROW);
      dispatchKeyboardEvent(inputEl, 'keydown', DOWN_ARROW);

      // Use keydown and keyup arrow, as this is what happens in the real world as well.
      dispatchKeyboardEvent(inputEl, 'keydown', ENTER);

      advanceFilterfieldCycle();
      typeIntoFilterElement('abc');
      fixture.detectChanges();

      dispatchKeyboardEvent(inputEl, 'keydown', ENTER);

      fixture.detectChanges();

      const tags = getFilterTags(fixture);

      expect(tags.length).toBe(1);
      expect(tags[0].key).toBe('Free');
      expect(tags[0].separator).toBe('~');
      expect(tags[0].value).toBe('abc');
      expect(spy).toHaveBeenCalledTimes(1);
      subscription.unsubscribe();
    });

    it('should fire currentFilterChanges when an option is selected', fakeAsync(() => {
      const spy = jest.fn();
      const subscription = filterField.currentFilterChanges.subscribe(spy);
      filterField.focus();
      advanceFilterfieldCycle();

      getAndClickOption(overlayContainerElement, 1);

      expect(spy).toHaveBeenCalledTimes(1);
      subscription.unsubscribe();
    }));

    it('should fire currentFilterChanges when the current is removed with the BACKSPACE key', fakeAsync(() => {
      filterField.focus();
      advanceFilterfieldCycle();

      getAndClickOption(overlayContainerElement, 1);

      const spy = jest.fn();
      const subscription = filterField.currentFilterChanges.subscribe(spy);

      const inputEl = getInput(fixture);
      dispatchKeyboardEvent(inputEl, 'keydown', BACKSPACE);
      fixture.detectChanges();
      flush();

      expect(spy).toHaveBeenCalledTimes(1);
      subscription.unsubscribe();
    }));

    it('should switch back to root if unfinished filter is deleted with BACKSPACE', () => {
      filterField.focus();
      advanceFilterfieldCycle(true, false);

      let options = getOptions(overlayContainerElement);

      // We cannot use the getAndClick option here, because it would trigger
      // an advancement of the filter field state with zoneExit
      // and this is not wanted here.
      const autOption = options[0];
      autOption.click();
      fixture.detectChanges();

      const inputEl = getInput(fixture);
      dispatchKeyboardEvent(inputEl, 'keydown', BACKSPACE);
      fixture.detectChanges();

      const tags = getFilterTags(fixture);
      expect(tags.length).toBe(0);

      options = getOptions(overlayContainerElement);
      expect(options[0].textContent).toContain('AUT');
      expect(options[1].textContent).toContain('USA');
      expect(options[2].textContent).toContain('Free');
    });

    it('should show option again after adding all possible options and removing this option from the filters', () => {
      fixture.componentInstance.dataSource.data =
        FILTER_FIELD_TEST_DATA_SINGLE_DISTINCT;
      fixture.detectChanges();

      filterField.focus();
      advanceFilterfieldCycle();

      // Click the AUT option
      getAndClickOption(overlayContainerElement, 0);

      let options = getOptions(overlayContainerElement);
      const viennaOption = options[0];
      expect(viennaOption.textContent).toContain('Vienna');

      viennaOption.click();
      advanceFilterfieldCycle();

      const tags = getFilterTags(fixture);
      expect(tags.length).toBe(1);

      expect(tags[0].key).toBe('AUT');
      expect(tags[0].separator).toBe(':');
      expect(tags[0].value.trim()).toBe('Vienna');

      tags[0].removeButton.click();

      filterField.focus();
      advanceFilterfieldCycle();

      options = getOptions(overlayContainerElement);
      // We use contain in favor of toBe as the text has to be inside twice due to the highlight
      // The second occurrence is hidden by display:none
      expect(options[0].textContent).toContain('AUT');
    });

    it('should switch back from root after deleting a unfinished freetext filter with BACKSPACE', () => {
      filterField.focus();
      advanceFilterfieldCycle();

      getAndClickOption(overlayContainerElement, 2);

      const inputEl = getInput(fixture);
      dispatchKeyboardEvent(inputEl, 'keydown', BACKSPACE);
      advanceFilterfieldCycle();

      const tags = getFilterTags(fixture);
      expect(tags.length).toBe(0);

      const options = getOptions(overlayContainerElement);
      // We use contain in favor of toBe as the text has to be inside twice due to the highlight
      // The second occurrence is hidden by display:none
      expect(options[0].textContent).toContain('AUT');
      expect(options[1].textContent).toContain('USA');
      expect(options[2].textContent).toContain('Free');
    });

    it('should remove a parent from an autocomplete if it is distinct and an option has been selected', () => {
      fixture.componentInstance.dataSource.data =
        FILTER_FIELD_TEST_DATA_SINGLE_DISTINCT;
      fixture.detectChanges();
      filterField.focus();
      advanceFilterfieldCycle();

      // Get AUT option
      getAndClickOption(overlayContainerElement, 0);

      // Get Vienna option
      getAndClickOption(overlayContainerElement, 0);

      const options = getOptions(overlayContainerElement);
      expect(options.length).toBe(0);
    });

    it('should close the panel when pressing escape', fakeAsync(() => {
      const trigger = filterField._autocompleteTrigger;
      const input = getInput(fixture);

      input.focus();
      flush();
      advanceFilterfieldCycle();

      expect(document.activeElement).toBe(input);
      expect(trigger.panelOpen).toBe(true);

      dispatchKeyboardEvent(input, 'keydown', ESCAPE);
      flush();
      fixture.detectChanges();

      expect(document.activeElement).toBe(input);
      expect(trigger.panelOpen).toBe(false);
    }));

    it('should not show options if the autocomplete is marked as async', fakeAsync(() => {
      filterField.focus();
      advanceFilterfieldCycle();

      getAndClickOption(overlayContainerElement, 3);

      const options = getOptions(overlayContainerElement);
      expect(options.length).toBe(0);
    }));

    it('should add partial update to the autocomplete', fakeAsync(() => {
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
            autocomplete: [],
          },
        ],
      };

      const DATA_PARTIAL = {
        name: 'CH (async, partial)',
        autocomplete: [
          { name: 'Zürich' },
          { name: 'Genf' },
          { name: 'Basel' },
          { name: 'Bern' },
        ],
        partial: true,
      };

      const DATA_PARTIAL_2 = {
        name: 'CH (async, partial)',
        autocomplete: [
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

      let hintPanel = getPartialResultsHintPanel(overlayContainerElement);
      expect(hintPanel).toBeNull();

      fixture.componentInstance.dataSource.data = DATA_PARTIAL;
      fixture.detectChanges();
      advanceFilterfieldCycle(true, true);
      tick();

      hintPanel = getPartialResultsHintPanel(overlayContainerElement);
      expect(hintPanel).not.toBeNull();

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

    it('should disable partial autocomplete option without a group', fakeAsync(() => {
      const DATA = {
        autocomplete: [
          {
            name: 'CH (async, partial)',
            async: true,
            autocomplete: [],
          },
        ],
      };

      const DATA_PARTIAL = {
        name: 'CH (async, partial)',
        autocomplete: [{ name: 'Zürich', disabled: true }],
        partial: true,
      };

      fixture.componentInstance.dataSource.data = DATA;
      fixture.detectChanges();
      filterField.focus();
      advanceFilterfieldCycle(true, true);

      getAndClickOption(overlayContainerElement, 0);

      let options = getOptions(overlayContainerElement);
      expect(options).toHaveLength(0);

      let hintPanel = getPartialResultsHintPanel(overlayContainerElement);
      expect(hintPanel).toBeNull();

      fixture.componentInstance.dataSource.data = DATA_PARTIAL;
      fixture.detectChanges();
      advanceFilterfieldCycle(true, true);
      tick();

      hintPanel = getPartialResultsHintPanel(overlayContainerElement);
      expect(hintPanel).not.toBeNull();

      options = getOptions(overlayContainerElement);
      expect(options).toHaveLength(1);

      // dt-option-disabled
      expect(options[0].getAttribute('class')).toContain('dt-option-disabled');
    }));

    it('should mark the input as readonly while loading async data', () => {
      const DATA = {
        autocomplete: [
          {
            name: 'AUT',
            async: true,
            autocomplete: [],
          },
        ],
      };
      const ASYNC_DATA = {
        name: 'AUT',
        autocomplete: [
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
  });

  describe('default search', () => {
    it('should not show the default search option when it is unique and used', fakeAsync(() => {
      fixture.componentInstance.dataSource.data = TEST_DEFAULT_SEARCH_UNIQUE;
      fixture.detectChanges();
      advanceFilterfieldCycle();

      filterField.focus();
      advanceFilterfieldCycle();

      let options = getOptions(overlayContainerElement);
      expect(options[0].innerHTML.includes('DE')).toBeTruthy();

      options[0].click();
      advanceFilterfieldCycle();

      options = getOptions(overlayContainerElement);

      zone.simulateZoneExit();

      options[0].click();
      advanceFilterfieldCycle();

      expect(filterField.filters.length).toBe(1);

      options = getOptions(overlayContainerElement);

      zone.simulateZoneExit();

      expect(options[0].innerHTML.includes('DE')).toBeFalsy();
    }));
  });

  describe('programmatic setting', () => {
    beforeEach(() => {
      fixture.componentInstance.dataSource.data = TEST_DATA_EDITMODE;
      advanceFilterfieldCycle();
    });

    it('should set the autocomplete filter programmatically', () => {
      // Autocomplete filter for AUT -> Upper Austria -> Cities -> Linz
      const autocompleteFilter = [
        TEST_DATA_EDITMODE.autocomplete[0],
        (TEST_DATA_EDITMODE as any).autocomplete[0].autocomplete[0],
        (TEST_DATA_EDITMODE as any).autocomplete[0].autocomplete[0]
          .autocomplete[0].options[0],
      ];
      filterField.filters = [autocompleteFilter];
      fixture.detectChanges();

      const tags = getFilterTags(fixture);
      expect(tags[0].key).toBe('AUT');
      expect(tags[0].separator).toBe(':');
      expect(tags[0].value).toBe('Linz');
    });

    it('should set the freetext filter programmatically', () => {
      // Custom free text for Free -> Custom free text
      const freeTextFilter = [
        TEST_DATA_EDITMODE.autocomplete[2],
        'Custom free text',
      ];
      filterField.filters = [freeTextFilter];
      fixture.detectChanges();

      const tags = getFilterTags(fixture);
      expect(tags[0].key).toBe('Free');
      expect(tags[0].separator).toBe('~');
      expect(tags[0].value).toBe('Custom free text');
    });

    it('should set the range filter programmatically (range operator)', () => {
      // Range filter preset with range operator, second unit and range from 15 to 80
      const rangeFilter = [
        TEST_DATA_EDITMODE.autocomplete[3],
        { operator: 'range', unit: 's', range: [15, 80] },
      ];
      filterField.filters = [rangeFilter];
      fixture.detectChanges();

      const tags = getFilterTags(fixture);
      expect(tags[0].key).toBe('Requests per minute');
      expect(tags[0].separator).toBe(':');
      expect(tags[0].value).toBe('15s - 80s');
    });

    it('should set the range filter programmatically (greater-equal operator)', () => {
      // Range filter preset with greater-equal operator, second unit and value of 75
      const rangeFilter = [
        TEST_DATA_EDITMODE.autocomplete[3],
        { operator: 'greater-equal', unit: 's', range: 75 },
      ];
      filterField.filters = [rangeFilter];
      fixture.detectChanges();

      const tags = getFilterTags(fixture);
      expect(tags[0].key).toBe('Requests per minute');
      expect(tags[0].separator).toBe('≥');
      expect(tags[0].value).toBe('75s');
    });

    it('should set a filter which has the same shape but a different reference', () => {
      filterField.filters = [
        [
          {
            name: 'USA',
            autocomplete: [{ name: 'Los Angeles' }, { name: 'San Fran' }],
          },
          { name: 'Los Angeles' },
        ],
      ];
      fixture.detectChanges();
      const tags = getFilterTags(fixture);
      expect(tags[0].key).toBe('USA');
      expect(tags[0].separator).toBe(':');
      expect(tags[0].value).toBe('Los Angeles');
    });

    it('should set a filter that is not part of the current data set', () => {
      filterField.filters = [
        [
          {
            name: 'Spain',
            autocomplete: [{ name: 'Madrid' }, { name: 'Barcelona' }],
          },
          { name: 'Madrid' },
        ],
      ];
      fixture.detectChanges();
      const tags = getFilterTags(fixture);
      expect(tags[0].key).toBe('Spain');
      expect(tags[0].separator).toBe(':');
      expect(tags[0].value).toBe('Madrid');
    });

    it('should set a filter that has async parts', () => {
      filterField.filters = [
        [
          TEST_DATA_EDITMODE.autocomplete[4],
          (TEST_DATA_EDITMODE_ASYNC as any).autocomplete[0],
        ],
      ];
      fixture.detectChanges();
      const tags = getFilterTags(fixture);
      expect(tags[0].key).toBe('DE (async)');
      expect(tags[0].separator).toBe(':');
      expect(tags[0].value).toBe('Berlin');
    });
  });

  describe('clear all', () => {
    beforeEach(() => {
      fixture.componentInstance.dataSource.data = TEST_DATA_EDITMODE;
      advanceFilterfieldCycle(false);
    });

    it('should not display the clear all button if no filters are set', () => {
      // Check if the clear all is initially not visible.
      expect(isClearAllVisible(fixture)).toBe(false);

      const autocompleteFilter = [
        TEST_DATA_EDITMODE.autocomplete[0],
        (TEST_DATA_EDITMODE as any).autocomplete[0].autocomplete[0],
        (TEST_DATA_EDITMODE as any).autocomplete[0].autocomplete[0]
          .autocomplete[0].options[0],
      ];
      filterField.filters = [autocompleteFilter];
      fixture.detectChanges();

      // After setting the filters, there should be a clear all button visible.
      expect(isClearAllVisible(fixture)).toBe(true);
    });

    // the user is in the edit mode of a filter
    it('should not display the clear all button if the filter field is focused', () => {
      const autocompleteFilter = [
        TEST_DATA_EDITMODE.autocomplete[0],
        (TEST_DATA_EDITMODE as any).autocomplete[0].autocomplete[0],
        (TEST_DATA_EDITMODE as any).autocomplete[0].autocomplete[0]
          .autocomplete[0].options[0],
      ];
      filterField.filters = [autocompleteFilter];
      fixture.detectChanges();

      filterField.focus();
      advanceFilterfieldCycle();

      expect(isClearAllVisible(fixture)).toBe(false);
    });

    // the user is in the edit mode of a filter
    it('should not display the clear all button if the current def is not the root def or a panel is open', () => {
      const autocompleteFilter = [
        TEST_DATA_EDITMODE.autocomplete[0],
        (TEST_DATA_EDITMODE as any).autocomplete[0].autocomplete[0],
        (TEST_DATA_EDITMODE as any).autocomplete[0].autocomplete[0]
          .autocomplete[0].options[0],
      ];
      filterField.filters = [autocompleteFilter];
      fixture.detectChanges();

      filterField.focus();
      advanceFilterfieldCycle();

      const options = getOptions(overlayContainerElement);
      const autOption = options[0];
      autOption.click();

      expect(isClearAllVisible(fixture)).toBe(false);
    });

    it('should not display the clear all button if no label is provided', () => {
      const autocompleteFilter = [
        TEST_DATA_EDITMODE.autocomplete[0],
        (TEST_DATA_EDITMODE as any).autocomplete[0].autocomplete[0],
        (TEST_DATA_EDITMODE as any).autocomplete[0].autocomplete[0]
          .autocomplete[0].options[0],
      ];
      filterField.filters = [autocompleteFilter];
      fixture.componentInstance.clearAllLabel = '';
      fixture.detectChanges();

      expect(isClearAllVisible(fixture)).toBe(false);
    });

    it('should reset the entire filter field', () => {
      // Autocomplete filter for AUT -> Upper Austria -> Cities -> Linz
      const autocompleteFilter = [
        TEST_DATA_EDITMODE.autocomplete[0],
        (TEST_DATA_EDITMODE as any).autocomplete[0].autocomplete[0],
        (TEST_DATA_EDITMODE as any).autocomplete[0].autocomplete[0]
          .autocomplete[0].options[0],
      ];
      filterField.filters = [autocompleteFilter];
      fixture.detectChanges();

      const tagsBefore = getFilterTags(fixture);
      expect(tagsBefore.length).toBe(1);
      expect(tagsBefore[0].key).toBe('AUT');
      expect(tagsBefore[0].separator).toBe(':');
      expect(tagsBefore[0].value).toBe('Linz');

      const clearAllButtonEl = getClearAll(fixture);
      clearAllButtonEl!.click();
      fixture.detectChanges();

      const tagsAfter = getFilterTags(fixture);
      expect(tagsAfter.length).toBe(0);
    });

    it('should emit a filter-changed event with all removed filters in the removed array', () => {
      const spy = jest.fn();
      const subscription = filterField.filterChanges.subscribe(spy);

      const autocompleteFilter = [
        TEST_DATA_EDITMODE.autocomplete[0],
        (TEST_DATA_EDITMODE as any).autocomplete[0].autocomplete[0],
        (TEST_DATA_EDITMODE as any).autocomplete[0].autocomplete[0]
          .autocomplete[0].options[0],
      ];
      filterField.filters = [autocompleteFilter];
      fixture.detectChanges();

      const clearAllButtonEl = getClearAll(fixture);
      clearAllButtonEl!.click();
      fixture.detectChanges();

      expect(spy).toHaveBeenNthCalledWith(1, {
        source: expect.any(DtFilterField),
        added: [],
        removed: [autocompleteFilter],
        filters: [],
      });

      subscription.unsubscribe();
    });

    it('should not remove filter where the corresponding tag has deletable set to false', () => {
      const autocompleteFilter = [
        TEST_DATA_EDITMODE.autocomplete[0],
        (TEST_DATA_EDITMODE as any).autocomplete[0].autocomplete[0],
        (TEST_DATA_EDITMODE as any).autocomplete[0].autocomplete[0]
          .autocomplete[0].options[0],
      ];
      filterField.filters = [autocompleteFilter];
      filterField.tagData[0].deletable = false;

      fixture.detectChanges();

      const clearAllButtonEl = getClearAll(fixture);
      clearAllButtonEl!.click();
      fixture.detectChanges();

      expect(filterField.filters.length).toBe(1);
    });

    it('should not emit a filter-changed event if every tag-data is set to non-deletable', () => {
      const spy = jest.fn();
      const subscription = filterField.filterChanges.subscribe(spy);

      const autocompleteFilter = [
        TEST_DATA_EDITMODE.autocomplete[0],
        (TEST_DATA_EDITMODE as any).autocomplete[0].autocomplete[0],
        (TEST_DATA_EDITMODE as any).autocomplete[0].autocomplete[0]
          .autocomplete[0].options[0],
      ];
      filterField.filters = [autocompleteFilter];
      filterField.tagData[0].deletable = false;

      fixture.detectChanges();

      const clearAllButtonEl = getClearAll(fixture);
      clearAllButtonEl!.click();
      fixture.detectChanges();

      expect(spy).not.toHaveBeenCalled();

      subscription.unsubscribe();
    });
  });

  describe('tags', () => {
    const autocompleteFilter = [
      TEST_DATA_EDITMODE.autocomplete[0],
      (TEST_DATA_EDITMODE as any).autocomplete[0].autocomplete[0],
      (TEST_DATA_EDITMODE as any).autocomplete[0].autocomplete[0]
        .autocomplete[0].options[0],
    ];
    beforeEach(() => {
      fixture.componentInstance.dataSource.data = TEST_DATA_EDITMODE;
      zone.simulateZoneExit();
      fixture.detectChanges();

      // Autocomplete filter for AUT -> Upper Austria -> Cities -> Linz

      filterField.filters = [autocompleteFilter];
      fixture.detectChanges();
    });

    it('should return a tag from a filter instance', () => {
      const tagInst = filterField.getTagForFilter(autocompleteFilter);
      expect(tagInst).toBeDefined();
      expect(tagInst!.data.key).toBe('AUT');
      expect(tagInst!.data.value).toBe('Linz');
    });

    it('should return null if no tag is found for the filter given', () => {
      const notIncludedAutocomplete = [
        {
          name: 'USA',
          autocomplete: [{ name: 'Los Angeles' }, { name: 'San Fran' }],
        },
        'Los Angeles',
      ];
      const tagInst = filterField.getTagForFilter(notIncludedAutocomplete);
      expect(tagInst).toBeNull();
    });

    it('should disable the edit button on the tag when editable is set to false', () => {
      const tagInst = filterField.getTagForFilter(autocompleteFilter);
      tagInst!.editable = false;
      fixture.detectChanges();
      const tags = getFilterTags(fixture);
      const { label, deleteButton } = getTagButtons(tags[0]);
      expect(label.disabled).toBeTruthy();
      expect(deleteButton.disabled).toBeFalsy();
    });

    it('should disable the delete button on the tag when deletable is set to false', () => {
      const tagInst = filterField.getTagForFilter(autocompleteFilter);
      tagInst!.deletable = false;
      fixture.detectChanges();
      const tags = getFilterTags(fixture);
      const { label, deleteButton } = getTagButtons(tags[0]);
      expect(label.disabled).toBeFalsy();
      expect(deleteButton).toBeNull();
    });

    it('should disable the entire tag when disabled is set to true', () => {
      const tagInst = filterField.getTagForFilter(autocompleteFilter);
      tagInst!.disabled = true;
      fixture.detectChanges();
      const tags = getFilterTags(fixture);
      const { label } = getTagButtons(tags[0]);
      expect(label.disabled).toBeTruthy();
    });

    it('should keep the deletable/editable flags on the tags when a tag is edited', () => {
      // Custom free text for Free -> Custom free text
      const freeTextFilter = [
        TEST_DATA_EDITMODE.autocomplete[2],
        'Custom free text',
      ];
      filterField.filters = [autocompleteFilter, freeTextFilter];
      fixture.detectChanges();

      const autoTagInst = filterField.getTagForFilter(autocompleteFilter);
      autoTagInst!.editable = false;
      const freeTextTagInst = filterField.getTagForFilter(freeTextFilter);
      freeTextTagInst!.deletable = false;
      fixture.detectChanges();
      const tags = getFilterTags(fixture);
      const { label: autoLabel, deleteButton: autoDeleteButton } =
        getTagButtons(tags[0]);
      expect(autoLabel.disabled).toBeTruthy();
      expect(autoDeleteButton.disabled).toBeFalsy();

      const { label: freeTextLabel, deleteButton: freeTextDeleteButton } =
        getTagButtons(tags[0]);
      expect(freeTextLabel.disabled).toBeTruthy();
      expect(freeTextDeleteButton.disabled).toBeFalsy();

      // enter editmode
      freeTextLabel.click();
      advanceFilterfieldCycle();

      // cancel editmode
      dispatchFakeEvent(document, 'click');
      advanceFilterfieldCycle();

      expect(autoLabel.disabled).toBeTruthy();
      expect(autoDeleteButton.disabled).toBeFalsy();

      expect(freeTextLabel.disabled).toBeTruthy();
      expect(freeTextDeleteButton.disabled).toBeFalsy();
    });

    it('should keep the deletable/editable flags on the tags when a tag is deleted', () => {
      // Custom free text for Free -> Custom free text
      const freeTextFilter = [
        TEST_DATA_EDITMODE.autocomplete[2],
        'Custom free text',
      ];
      filterField.filters = [autocompleteFilter, freeTextFilter];
      fixture.detectChanges();

      const autoTagInst = filterField.getTagForFilter(autocompleteFilter);
      autoTagInst!.editable = false;
      const freeTextTagInst = filterField.getTagForFilter(freeTextFilter);
      freeTextTagInst!.deletable = false;
      fixture.detectChanges();
      const tags = getFilterTags(fixture);
      const { label: autoLabel, deleteButton: autoDeleteButton } =
        getTagButtons(tags[0]);
      expect(autoLabel.disabled).toBeTruthy();
      expect(autoDeleteButton.disabled).toBeFalsy();

      const { label: freeTextLabel, deleteButton: freeTextDeleteButton } =
        getTagButtons(tags[0]);
      expect(freeTextLabel.disabled).toBeTruthy();
      expect(freeTextDeleteButton.disabled).toBeFalsy();

      // delete tag
      autoDeleteButton.click();
      advanceFilterfieldCycle();

      expect(freeTextLabel.disabled).toBeTruthy();
      expect(freeTextDeleteButton.disabled).toBeFalsy();
    });

    it('should not delete a non deletable tag when clicking the clear all', () => {
      const tagInst = filterField.getTagForFilter(autocompleteFilter);
      tagInst!.deletable = false;
      fixture.detectChanges();
      const clearAll = getClearAll(fixture);
      clearAll!.click();
      fixture.detectChanges();

      const tags = getFilterTags(fixture);
      expect(tags.length).toBe(1);
    });

    it('should not emit the filter change event when the edit button is clicked', fakeAsync(() => {
      const freeTextFilter = [
        TEST_DATA_EDITMODE.autocomplete[2],
        'Custom free text',
      ];
      filterField.filters = [autocompleteFilter, freeTextFilter];
      fixture.detectChanges();

      const tags = getFilterTags(fixture);
      const { label: freeTextLabel } = getTagButtons(tags[0]);
      const spy = jest.fn();
      const subscription = filterField.filterChanges.subscribe(spy);

      // enter editmode
      freeTextLabel.click();
      advanceFilterfieldCycle();
      filterField.focus();
      advanceFilterfieldCycle();

      tick();

      expect(spy).not.toHaveBeenCalled();

      subscription.unsubscribe();
    }));
  });

  describe('data-source switching', () => {
    it('should cancel the edit mode if the data source is switched', () => {
      filterField.filters = [
        [
          FILTER_FIELD_TEST_DATA_ASYNC.autocomplete[0], // AUT
          (FILTER_FIELD_TEST_DATA_ASYNC.autocomplete[0] as any).autocomplete[1], // Vienna
        ],
      ];
      filterField.focus();
      advanceFilterfieldCycle();

      const options = getOptions(overlayContainerElement);
      options[1].click(); // USA
      advanceFilterfieldCycle();

      let category = fixture.debugElement.query(
        By.css('.dt-filter-field-category'),
      );

      expect(category.nativeElement.textContent.trim()).toBe('USA');
      expect(filterField.filters.length).toBe(1);
      expect(filterField.filters[0][0].name).toBe('AUT');

      fixture.componentInstance.dataSource.data = TEST_DATA_EDITMODE;
      advanceFilterfieldCycle();

      category = fixture.debugElement.query(
        By.css('.dt-filter-field-category'),
      );

      expect(category).toBeNull();
      expect(filterField.filters.length).toBe(1);
    });

    it('should not remove the current filter if the data is changed when the filterChanges event fires', () => {
      const filterChangesSubscription = filterField.filterChanges.subscribe(
        () => {
          fixture.componentInstance.dataSource.data =
            FILTER_FIELD_TEST_DATA_ASYNC;
        },
      );

      filterField.focus();
      advanceFilterfieldCycle();

      let options = getOptions(overlayContainerElement);
      options[0].click();
      advanceFilterfieldCycle();

      options = getOptions(overlayContainerElement);

      zone.simulateZoneExit();

      options[1].click();
      advanceFilterfieldCycle();

      expect(filterField.filters.length).toBe(1);

      filterChangesSubscription.unsubscribe();
    });
  });

  describe('tag parser function override by injection token configuration', () => {
    // Autocomplete filter for AUT -> Upper Austria -> Cities -> Linz
    const autocompleteFilter = [
      TEST_DATA_EDITMODE.autocomplete[0],
      (TEST_DATA_EDITMODE as any).autocomplete[0].autocomplete[0],
      (TEST_DATA_EDITMODE as any).autocomplete[0].autocomplete[0]
        .autocomplete[0].options[0],
    ];

    let fixtureCustom: ComponentFixture<TestAppCustomParserConfig>;
    beforeEach(() => {
      fixtureCustom = createComponent(TestAppCustomParserConfig);
      filterField = fixtureCustom.debugElement.query(
        By.directive(DtFilterField),
      ).componentInstance;

      fixtureCustom.componentInstance.dataSource.data = TEST_DATA_EDITMODE;
      advanceFilterfieldCycle();

      // Set filters as a starting point
      filterField.filters = [autocompleteFilter];
      fixtureCustom.detectChanges();
    });

    it('should have the correct filters set as a starting point', () => {
      const tags = getFilterTags(fixtureCustom);
      expect(tags[0].key).toBe('AUT.Upper Austria');
      expect(tags[0].separator).toBe(':');
      expect(tags[0].value).toBe('Linz');
    });

    it('should be able to edit and reach one level of depth', () => {
      const tags = fixtureCustom.debugElement.queryAll(
        By.css('.dt-filter-field-tag-label'),
      );
      tags[0].nativeElement.click();
      advanceFilterfieldCycle();

      // Open first level of AUT (first tag)
      const options = getOptions(overlayContainerElement);
      // Make sure that the autocomplete actually opened.
      expect(options.length).toBe(2);

      // Select Vienna
      options[1].click();
      advanceFilterfieldCycle();

      // Read the filters again and make expectations
      const filterTags = getFilterTags(fixtureCustom);

      expect(filterTags[0].key).toBe('AUT');
      expect(filterTags[0].separator).toBe(':');
      expect(filterTags[0].value).toBe('Vienna');
    });

    it('should be able to edit and reach two levels of depth', () => {
      const tags = fixtureCustom.debugElement.queryAll(
        By.css('.dt-filter-field-tag-label'),
      );
      tags[0].nativeElement.click();
      advanceFilterfieldCycle();

      // Open first level of AUT (first tag)
      const options = getOptions(overlayContainerElement);
      // Make sure that the autocomplete actually opened.
      expect(options.length).toBe(2);

      // Select Upper Austria again
      options[0].click();
      advanceFilterfieldCycle();

      // Open cities of Upper Austria
      const cities = getOptions(overlayContainerElement);
      // Make sure that the autocomplete actually opened.
      expect(cities.length).toBe(3);

      // Select Wels
      cities[1].click();
      advanceFilterfieldCycle();

      // Read the filters again and make expectations
      const filterTags = getFilterTags(fixtureCustom);

      expect(filterTags[0].key).toBe('AUT.Upper Austria');
      expect(filterTags[0].separator).toBe(':');
      expect(filterTags[0].value).toBe('Wels');
    });
  });

  describe('tag parser function override by input', () => {
    // Autocomplete filter for AUT -> Upper Austria -> Cities -> Linz
    const autocompleteFilter = [
      TEST_DATA_EDITMODE.autocomplete[0],
      (TEST_DATA_EDITMODE as any).autocomplete[0].autocomplete[0],
      (TEST_DATA_EDITMODE as any).autocomplete[0].autocomplete[0]
        .autocomplete[0].options[0],
    ];

    let fixtureCustom: ComponentFixture<TestAppCustomParserInput>;
    beforeEach(() => {
      fixtureCustom = createComponent(TestAppCustomParserInput);
      filterField = fixtureCustom.debugElement.query(
        By.directive(DtFilterField),
      ).componentInstance;

      fixtureCustom.componentInstance.dataSource.data = TEST_DATA_EDITMODE;
      advanceFilterfieldCycle();

      // Set filters as a starting point
      filterField.filters = [autocompleteFilter];
      fixtureCustom.detectChanges();
    });

    it('should have the correct filters set as a starting point', () => {
      const tags = getFilterTags(fixtureCustom);
      expect(tags[0].key).toBe('AUT.Upper Austria');
      expect(tags[0].separator).toBe(':');
      expect(tags[0].value).toBe('Linz');
    });

    it('should be able to edit and reach one level of depth', () => {
      const tags = fixtureCustom.debugElement.queryAll(
        By.css('.dt-filter-field-tag-label'),
      );
      tags[0].nativeElement.click();
      advanceFilterfieldCycle();

      // Open first level of AUT (first tag)
      const options = getOptions(overlayContainerElement);
      // Make sure that the autocomplete actually opened.
      expect(options.length).toBe(2);

      // Select Vienna
      options[1].click();
      advanceFilterfieldCycle();

      // Read the filters again and make expectations
      const filterTags = getFilterTags(fixtureCustom);

      expect(filterTags[0].key).toBe('AUT');
      expect(filterTags[0].separator).toBe(':');
      expect(filterTags[0].value).toBe('Vienna');
    });

    it('should be able to edit and reach two levels of depth', () => {
      const tags = fixtureCustom.debugElement.queryAll(
        By.css('.dt-filter-field-tag-label'),
      );
      tags[0].nativeElement.click();
      advanceFilterfieldCycle();

      // Open first level of AUT (first tag)
      const options = getOptions(overlayContainerElement);
      // Make sure that the autocomplete actually opened.
      expect(options.length).toBe(2);

      // Select Upper Austria again
      options[0].click();
      advanceFilterfieldCycle();

      // Open cities of Upper Austria
      const cities = getOptions(overlayContainerElement);
      // Make sure that the autocomplete actually opened.
      expect(cities.length).toBe(3);

      // Select Wels
      cities[1].click();
      advanceFilterfieldCycle();

      // Read the filters again and make expectations
      const filterTags = getFilterTags(fixtureCustom);

      expect(filterTags[0].key).toBe('AUT.Upper Austria');
      expect(filterTags[0].separator).toBe(':');
      expect(filterTags[0].value).toBe('Wels');
    });
  });

  describe('placeholder parse label', () => {
    let fixtureCustom: ComponentFixture<TestAppCustomParserInput>;
    const placeholderElement = By.css('.dt-filter-field-infix');
    const selectFields = () => {
      filterField.focus();
      fixtureCustom.detectChanges();
      // Open first level
      const firstLevel = getOptions(overlayContainerElement);
      firstLevel[0].click();
      advanceFilterfieldCycle();
      tick();

      // Open second level
      const secondLevel = getOptions(overlayContainerElement);
      secondLevel[0].click();
      advanceFilterfieldCycle();

      // Open third level
      const thirdLevel = getOptions(overlayContainerElement);
      thirdLevel[0].click();
      advanceFilterfieldCycle();
    };

    beforeEach(() => {
      fixtureCustom = createComponent(TestAppCustomParserInput);
      filterField = fixtureCustom.debugElement.query(
        By.directive(DtFilterField),
      ).componentInstance;

      fixtureCustom.componentInstance.dataSource.data = TEST_DATA_PLACEHOLDER;
      advanceFilterfieldCycle();

      fixtureCustom.detectChanges();
    });
    it('should display a default (first iterator) value when placeholder is not overwritten', fakeAsync(() => {
      selectFields();

      const placeholder = (
        fixtureCustom.debugElement.query(placeholderElement)
          ?.nativeElement as HTMLDivElement
      )?.textContent;
      expect(placeholder).toBe(TEST_DATA_PLACEHOLDER.autocomplete[0].name);
    }));
    it('should display a correct value when placeholder is overwrite by input', fakeAsync(() => {
      const parser: EditionParserFunction | null = (
        _filterValues: DtFilterValue[],
      ) =>
        _filterValues
          ?.map(({ option }: DtAutocompleteValue<string>) => option.viewValue)
          .join('.');

      filterField.customEditionParser = parser;

      selectFields();

      const placeholder = (
        fixtureCustom.debugElement.query(placeholderElement)
          ?.nativeElement as HTMLDivElement
      )?.textContent;
      expect(placeholder).toBe('Locations.Linz');
    }));
  });
  describe('filters public api', () => {
    beforeEach(() => {
      fixture.componentInstance.dataSource.data = TEST_DATA_EDITMODE;
      advanceFilterfieldCycle();
      fixture.detectChanges();
    });

    it('should not contain filters currently edited', () => {
      const autocompleteFilter = [
        TEST_DATA_EDITMODE.autocomplete[0], // AUT
        (TEST_DATA_EDITMODE as any).autocomplete[0].autocomplete[1], // Vienna
      ];
      filterField.filters = [autocompleteFilter];

      fixture.detectChanges();

      expect(filterField.filters.length).toBe(1);

      const tags = getFilterTags(fixture);
      const { label: freeTextLabel } = getTagButtons(tags[0]);

      // enter editmode
      freeTextLabel.click();
      advanceFilterfieldCycle();

      expect(filterField.filters.length).toBe(0);

      // cancel editmode
      dispatchFakeEvent(document, 'click');
      advanceFilterfieldCycle();

      expect(filterField.filters.length).toBe(1);
    });
  });
});
