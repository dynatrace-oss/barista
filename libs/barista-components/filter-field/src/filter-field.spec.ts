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

// tslint:disable no-lifecycle-call no-use-before-declare no-magic-numbers
// tslint:disable no-any max-file-line-count no-unbound-method use-component-selector

import { BACKSPACE, DOWN_ARROW, ENTER, ESCAPE } from '@angular/cdk/keycodes';
import { OverlayContainer } from '@angular/cdk/overlay';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { Component, DebugElement, NgZone, ViewChild } from '@angular/core';
import {
  ComponentFixture,
  fakeAsync,
  flush,
  inject,
  TestBed,
  tick,
} from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import {
  DtFilterField,
  DtFilterFieldChangeEvent,
  DtFilterFieldDefaultDataSource,
  DtFilterFieldModule,
  dtRangeDef,
  DT_FILTER_FIELD_TYPING_DEBOUNCE,
  getDtFilterFieldRangeNoOperatorsError,
  DT_FILTER_VALUES_PARSER_CONFIG,
} from '@dynatrace/barista-components/filter-field';
import { DtIconModule } from '@dynatrace/barista-components/icon';
import {
  createComponent,
  dispatchFakeEvent,
  dispatchKeyboardEvent,
  MockNgZone,
  typeInElement,
  wrappedErrorMessage,
} from '@dynatrace/testing/browser';
import {
  FILTER_FIELD_TEST_DATA_ASYNC,
  FILTER_FIELD_TEST_DATA_SINGLE_DISTINCT,
  FILTER_FIELD_TEST_DATA_SINGLE_OPTION,
} from '@dynatrace/testing/fixtures';
import { defaultTagDataForFilterValuesParser } from './filter-field-util';
import {
  DtFilterValue,
  DtFilterFieldTagData,
  isDtAutocompleteValue,
} from './types';

const TEST_DATA_SUGGESTIONS = {
  autocomplete: [
    {
      name: 'Node',
      options: [
        {
          name: 'Custom Simple Option',
        },
        {
          name: 'Node Label',
          key: 'MyKey',
          suggestions: [{ name: 'some cool' }, { name: 'very weird' }],
          validators: [],
        },
      ],
    },
  ],
};

const TEST_DATA_RANGE = {
  autocomplete: [
    {
      name: 'Requests per minute',
      range: {
        operators: {
          range: true,
          equal: true,
          greaterThanEqual: true,
          lessThanEqual: true,
        },
        unit: 's',
      },
    },
  ],
};

const TEST_DATA_EDITMODE = {
  autocomplete: [
    {
      name: 'AUT',
      autocomplete: [
        {
          name: 'Upper Austria',
          distinct: true,
          autocomplete: [
            {
              name: 'Cities',
              options: [{ name: 'Linz' }, { name: 'Wels' }, { name: 'Steyr' }],
            },
          ],
        },
        {
          name: 'Vienna',
        },
      ],
    },
    {
      name: 'USA',
      autocomplete: [{ name: 'Los Angeles' }, { name: 'San Fran' }],
    },
    {
      name: 'Free',
      suggestions: [],
      validators: [],
    },
    {
      name: 'Requests per minute',
      range: {
        operators: {
          range: true,
          equal: true,
          greaterThanEqual: true,
          lessThanEqual: true,
        },
        unit: 's',
      },
    },
    {
      name: 'DE (async)',
      async: true,
      autocomplete: [],
    },
  ],
};

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
  let overlayContainer: OverlayContainer;
  let overlayContainerElement: HTMLElement;
  let filterField: DtFilterField<any>;
  let zone: MockNgZone;

  /**
   * Simulate zone steps and change detection to advance the
   * filter field to the next state.
   */
  function advanceFilterfieldCycle(
    simulateMicrotasks: boolean = true,
    simulateZoneExit: boolean = true,
  ): void {
    if (simulateMicrotasks) {
      zone.simulateMicrotasksEmpty();
    }
    if (simulateZoneExit) {
      zone.simulateZoneExit();
    }
    fixture.detectChanges();
  }

  /**
   * Gets the nth option from the passed overlay container, clicks it and advances
   * the filter field cycle.
   */
  function getAndClickOption(
    optionOverlayContainer: HTMLElement,
    nthOption: number,
  ): void {
    let options = getOptions(optionOverlayContainer);
    const selectedOption = options[nthOption];
    selectedOption.click();
    advanceFilterfieldCycle();
  }

  /**
   * Types the passed value into the filter field input element,
   * waits for the debounce time.
   */
  function typeIntoFilterElement(inputString: string): void {
    const inputEl = fixture.debugElement.query(By.css('input')).nativeElement;
    typeInElement(inputString, inputEl);
    tick(DT_FILTER_FIELD_TYPING_DEBOUNCE);
  }

  beforeEach(fakeAsync(() => {
    TestBed.configureTestingModule({
      imports: [
        HttpClientTestingModule,
        DtIconModule.forRoot({ svgIconLocation: `{{name}}.svg` }),
        DtFilterFieldModule,
      ],
      declarations: [
        TestApp,
        TestAppCustomParserConfig,
        TestAppCustomParserInput,
      ],
      providers: [
        { provide: NgZone, useFactory: () => (zone = new MockNgZone()) },
      ],
    }).compileComponents();

    inject([OverlayContainer], (oc: OverlayContainer) => {
      overlayContainer = oc;
      overlayContainerElement = oc.getContainerElement();
    })();

    fixture = createComponent(TestApp);
    filterField = fixture.debugElement.query(By.directive(DtFilterField))
      .componentInstance;
  }));

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
      const input = fixture.debugElement.query(By.css('.dt-filter-field-input'))
        .nativeElement;
      filterField.focus();
      expect(document.activeElement).toBe(input);
    });
  });

  describe('focus loss', () => {
    it('should clear the current input value', fakeAsync(() => {
      const input = fixture.debugElement.query(By.css('.dt-filter-field-input'))
        .nativeElement;

      filterField.focus();
      typeIntoFilterElement('foo');
      input.blur();
      tick();

      expect(input.value).toBe('');
    }));
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
      fixture.componentInstance.dataSource.data = FILTER_FIELD_TEST_DATA_SINGLE_DISTINCT;
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
      fixture.componentInstance.dataSource.data = FILTER_FIELD_TEST_DATA_SINGLE_DISTINCT;
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

  describe('overlay', () => {
    it('should create an autocomplete overlay when focus is called for autocomplete data', () => {
      filterField.focus();
      fixture.detectChanges();
      expect(overlayContainerElement).toBeDefined();
    });
  });

  describe('with autocomplete', () => {
    it('should open the autocomplete if filter field is focused', () => {
      expect(filterField._autocomplete.isOpen).toBe(false);
      filterField.focus();
      zone.simulateMicrotasksEmpty();
      expect(filterField._autocomplete.isOpen).toBe(true);
    });

    it('should emit the inputChange event when typing into the input field with autocomplete', fakeAsync(() => {
      const spy = jest.fn();
      const subscription = filterField.inputChange.subscribe(spy);

      typeIntoFilterElement('x');
      fixture.detectChanges();

      expect(spy).toHaveBeenCalledWith('x');

      typeIntoFilterElement('xy');
      fixture.detectChanges();

      expect(spy).toHaveBeenCalledWith('xy');
      subscription.unsubscribe();
    }));

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
      expect(options[0].textContent!.trim()).toBe('Los Angeles');
      expect(options[1].textContent!.trim()).toBe('San Fran');

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
      expect(options[0].textContent!.trim()).toBe('Upper Austria');
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

      let options = getOptions(overlayContainerElement);
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

      fixture.componentInstance.dataSource.data = FILTER_FIELD_TEST_DATA_SINGLE_OPTION;
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

      fixture.componentInstance.dataSource.data = FILTER_FIELD_TEST_DATA_SINGLE_OPTION;
      const sub = filterField.filterChanges.subscribe(
        (ev) => (filterChangeEvent = ev),
      );

      fixture.detectChanges();
      filterField.focus();
      advanceFilterfieldCycle();

      const options = getOptions(overlayContainerElement);
      options[0].click();

      tick();

      const tags = getFilterTags(fixture);
      tags[0].removeButton.click();

      tick();

      expect(filterChangeEvent).toBeDefined();
      expect(filterChangeEvent!.added.length).toBe(0);
      expect(filterChangeEvent!.removed.length).toBe(1);
      expect(filterChangeEvent!.filters.length).toBe(0);

      sub.unsubscribe();
    }));

    it('should switch to free text and on enter fire a filterChanges event and create a tag', fakeAsync(() => {
      const spy = jest.fn();
      const subscription = filterField.filterChanges.subscribe(spy);
      filterField.focus();
      advanceFilterfieldCycle();

      getAndClickOption(overlayContainerElement, 2);

      typeIntoFilterElement('abc');
      fixture.detectChanges();

      const inputEl = getInput(fixture);
      dispatchKeyboardEvent(inputEl, 'keydown', ENTER);

      tick(DT_FILTER_FIELD_TYPING_DEBOUNCE);
      fixture.detectChanges();

      const tags = getFilterTags(fixture);
      expect(tags.length).toBe(1);
      expect(tags[0].key).toBe('Free');
      expect(tags[0].separator).toBe('~');
      expect(tags[0].value).toBe('abc');
      expect(spy).toHaveBeenCalledTimes(1);
      subscription.unsubscribe();
    }));

    it('should switch to free text with keyboard interaction and on enter fire a filterChanges event and create a tag', fakeAsync(() => {
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

      tick(DT_FILTER_FIELD_TYPING_DEBOUNCE);
      fixture.detectChanges();

      const tags = getFilterTags(fixture);

      expect(tags.length).toBe(1);
      expect(tags[0].key).toBe('Free');
      expect(tags[0].separator).toBe('~');
      expect(tags[0].value).toBe('abc');
      expect(spy).toHaveBeenCalledTimes(1);
      subscription.unsubscribe();
    }));

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
      fixture.componentInstance.dataSource.data = FILTER_FIELD_TEST_DATA_SINGLE_DISTINCT;
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
      expect(options[0].textContent).toMatch(/^\s*AUT\s*$/);
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
      expect(options[0].textContent).toMatch(/^\s*AUT\s*$/);
      expect(options[1].textContent).toMatch(/^\s*USA\s*$/);
      expect(options[2].textContent).toMatch(/^\s*Free\s*$/);
    });

    it('should remove a parent from an autocomplete if it is distinct and an option has been selected', () => {
      fixture.componentInstance.dataSource.data = FILTER_FIELD_TEST_DATA_SINGLE_DISTINCT;
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

    it('should have the correct prefix when a filter is set and gets deleted in flight', () => {
      filterField.focus();
      advanceFilterfieldCycle();

      // Set a filter first
      getAndClickOption(overlayContainerElement, 1);
      advanceFilterfieldCycle();
      getAndClickOption(overlayContainerElement, 0);
      advanceFilterfieldCycle();

      // Get in flight of the next filter
      getAndClickOption(overlayContainerElement, 0);
      advanceFilterfieldCycle();

      let category = fixture.debugElement.query(
        By.css('.dt-filter-field-category'),
      );
      expect(category.nativeElement.textContent.trim()).toEqual('AUT');

      // While in flight, delete the first tag
      const tags = getFilterTags(fixture);
      const { deleteButton } = getTagButtons(tags[0]);
      deleteButton.click();
      advanceFilterfieldCycle();

      // Expect the category to still be there.
      category = fixture.debugElement.query(
        By.css('.dt-filter-field-category'),
      );
      expect(category).not.toBe(null);
      expect(category.nativeElement.textContent.trim()).toEqual('AUT');

      // Expect the options to be the same.
      const options = getOptions(overlayContainerElement);
      expect(options).toHaveLength(2);
      expect(options[0].textContent).toContain('Upper Austria');
      expect(options[1].textContent).toContain('Vienna');
    });

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

  describe('with range option', () => {
    beforeEach(() => {
      fixture.componentInstance.dataSource.data = TEST_DATA_RANGE;
      fixture.detectChanges();

      // Focus the filter field.
      filterField.focus();
      advanceFilterfieldCycle();
    });

    it('should open the range overlay if the range option is selected', () => {
      let filterFieldRangeElements = getFilterFieldRange(
        overlayContainerElement,
      );
      expect(filterFieldRangeElements.length).toBe(0);

      getAndClickOption(overlayContainerElement, 0);

      filterFieldRangeElements = getFilterFieldRange(overlayContainerElement);

      expect(filterFieldRangeElements.length).toBe(1);
    });

    it('should have only range and greater-equal operators enabled', () => {
      // Change the datasource at runtime
      fixture.componentInstance.dataSource.data = {
        autocomplete: [
          {
            name: 'Requests per minute',
            range: {
              operators: {
                range: true,
                greaterThanEqual: true,
              },
              unit: 's',
            },
          },
        ],
      };
      fixture.detectChanges();

      // open the range overlay
      filterField.focus();
      advanceFilterfieldCycle();
      const options = getOptions(overlayContainerElement);
      options[0].click();

      advanceFilterfieldCycle();

      const operatorButtonElements = getOperatorButtonGroupItems(
        overlayContainerElement,
      );
      expect(operatorButtonElements.length).toBe(2);
      expect(operatorButtonElements[0].textContent).toBe('Range');
      expect(operatorButtonElements[1].textContent).toBe('≥');
    });

    it('should have only one operator enabled', () => {
      // Change the datasource at runtime
      fixture.componentInstance.dataSource.data = {
        autocomplete: [
          {
            name: 'Requests per minute',
            range: {
              operators: {
                greaterThanEqual: true,
              },
              unit: 's',
            },
          },
        ],
      };
      fixture.detectChanges();

      // open the range overlay
      filterField.focus();
      advanceFilterfieldCycle();

      getAndClickOption(overlayContainerElement, 0);

      const operatorButtonElements = getOperatorButtonGroupItems(
        overlayContainerElement,
      );
      expect(operatorButtonElements.length).toBe(1);
      expect(operatorButtonElements[0].textContent).toBe('≥');
    });

    describe('opened', () => {
      beforeEach(() => {
        // Open the filter-field-range overlay.
        getAndClickOption(overlayContainerElement, 0);
      });

      it('should set the focus onto the first button-group-item by default', () => {
        const firstButtonElement = overlayContainerElement.querySelector(
          'dt-button-group-item',
        );
        expect(document.activeElement).toBe(firstButtonElement);
      });

      it('should have all operators enabled', () => {
        const operatorButtonElements = getOperatorButtonGroupItems(
          overlayContainerElement,
        );
        expect(operatorButtonElements.length).toBe(4);
      });

      it('should throw an error if there is no operator defined', fakeAsync(() => {
        // Change the datasource at runtime
        expect(() => {
          fixture.componentInstance.dataSource.data = {
            autocomplete: [
              {
                name: 'Requests per minute',
                range: {
                  operators: {},
                  unit: 's',
                },
              },
            ],
          };
          flush();
        }).toThrowError(
          wrappedErrorMessage(getDtFilterFieldRangeNoOperatorsError()),
        );
      }));

      it('should throw', () => {
        expect(() => {
          dtRangeDef({}, null, false, false, false, false, 's', false);
        }).toThrowError(
          wrappedErrorMessage(getDtFilterFieldRangeNoOperatorsError()),
        );
      });

      it('should show two input fields when operator range is selected', () => {
        const inputFieldsElements = getRangeInputFields(
          overlayContainerElement,
        );
        expect(inputFieldsElements.length).toBe(2);
      });

      it('should show only one input field when the operator is not range', () => {
        const operatorButtonElements = getOperatorButtonGroupItems(
          overlayContainerElement,
        );
        operatorButtonElements[2].click();
        fixture.detectChanges();

        const inputFieldsElements = getRangeInputFields(
          overlayContainerElement,
        );
        expect(inputFieldsElements.length).toBe(1);
      });

      it('should keep the apply button disabled until both entries are valid', () => {
        const inputFieldsElements = getRangeInputFields(
          overlayContainerElement,
        );

        let rangeApplyButton = getRangeApplyButton(overlayContainerElement)[0];
        expect(rangeApplyButton.getAttribute('disabled')).toBeDefined();

        typeInElement('15', inputFieldsElements[0]);
        fixture.detectChanges();

        rangeApplyButton = getRangeApplyButton(overlayContainerElement)[0];
        expect(rangeApplyButton.getAttribute('disabled')).toBeDefined();

        typeInElement('25', inputFieldsElements[1]);
        fixture.detectChanges();

        rangeApplyButton = getRangeApplyButton(overlayContainerElement)[0];
        expect(rangeApplyButton.getAttribute('disabled')).toBeNull();
      });

      it('should keep the apply button disabled until the one required is valid', () => {
        const operatorButtonElements = getOperatorButtonGroupItems(
          overlayContainerElement,
        );

        operatorButtonElements[2].click();
        fixture.detectChanges();

        const inputFieldsElements = getRangeInputFields(
          overlayContainerElement,
        );

        let rangeApplyButton = getRangeApplyButton(overlayContainerElement)[0];
        expect(rangeApplyButton.getAttribute('disabled')).toBeDefined();

        typeInElement('15', inputFieldsElements[0]);
        fixture.detectChanges();

        rangeApplyButton = getRangeApplyButton(overlayContainerElement)[0];
        expect(rangeApplyButton.getAttribute('disabled')).toBeNull();
      });

      it('should close the range after the range-filter is submitted', () => {
        const inputFieldsElements = getRangeInputFields(
          overlayContainerElement,
        );

        typeInElement('15', inputFieldsElements[0]);
        typeInElement('25', inputFieldsElements[1]);
        fixture.detectChanges();

        const rangeApplyButton = getRangeApplyButton(
          overlayContainerElement,
        )[0];
        rangeApplyButton.click();

        const rangeOverlay = getFilterFieldRange(overlayContainerElement);
        expect(rangeOverlay.length).toBe(0);
      });

      it('should have the tag-filter committed in the filterfield and formatted for range', () => {
        const inputFieldsElements = getRangeInputFields(
          overlayContainerElement,
        );

        typeInElement('15', inputFieldsElements[0]);
        typeInElement('25', inputFieldsElements[1]);
        fixture.detectChanges();

        const rangeApplyButton = getRangeApplyButton(
          overlayContainerElement,
        )[0];
        rangeApplyButton.click();
        fixture.detectChanges();

        const tags = getFilterTags(fixture);
        expect(tags[0].key).toBe('Requests per minute');
        expect(tags[0].separator).toBe(':');
        expect(tags[0].value.trim()).toBe('15s - 25s');
      });

      it('should have the tag-filter committed in the filterfield and formatted for greater-than operator', () => {
        const operatorButtonElements = getOperatorButtonGroupItems(
          overlayContainerElement,
        );

        operatorButtonElements[2].click();
        fixture.detectChanges();

        const inputFieldsElements = getRangeInputFields(
          overlayContainerElement,
        );

        typeInElement('15', inputFieldsElements[0]);
        fixture.detectChanges();

        const rangeApplyButton = getRangeApplyButton(
          overlayContainerElement,
        )[0];
        rangeApplyButton.click();
        fixture.detectChanges();

        const tags = getFilterTags(fixture);
        expect(tags[0].key).toBe('Requests per minute');
        expect(tags[0].separator).toBe('≥');
        expect(tags[0].value.trim()).toBe('15s');
      });

      it('should close the filter-range when using the keyboard ESC', () => {
        const operatorButtonElements = getOperatorButtonGroupItems(
          overlayContainerElement,
        );
        dispatchKeyboardEvent(operatorButtonElements[0], 'keydown', ESCAPE);
        fixture.detectChanges();

        const rangeOverlay = getFilterFieldRange(overlayContainerElement);
        expect(rangeOverlay.length).toBe(0);
      });

      it('should reapply previously set range operator and values when editing a range filter', () => {
        const inputFieldsElements = getRangeInputFields(
          overlayContainerElement,
        );

        typeInElement('15', inputFieldsElements[0]);
        typeInElement('25', inputFieldsElements[1]);
        fixture.detectChanges();

        const rangeApplyButton = getRangeApplyButton(
          overlayContainerElement,
        )[0];
        rangeApplyButton.click();
        fixture.detectChanges();

        const tagLabel = fixture.debugElement.queryAll(
          By.css('.dt-filter-field-tag-label'),
        )[0];
        tagLabel.nativeElement.click();

        advanceFilterfieldCycle();

        // expect the range to open again
        const filterFieldRangeElements = getFilterFieldRange(
          overlayContainerElement,
        );
        expect(filterFieldRangeElements.length).toBe(1);

        // expect the values to be filled
        expect(filterField._filterfieldRange._selectedOperator).toEqual(
          'range',
        );
        expect(filterField._filterfieldRange._valueFrom).toEqual('15');
        expect(filterField._filterfieldRange._valueTo).toEqual('25');
      });

      it('should reapply previously set greater-equal operator and value when editing a range filter', () => {
        const operatorButtonElements = getOperatorButtonGroupItems(
          overlayContainerElement,
        );
        operatorButtonElements[2].click();
        fixture.detectChanges();

        const inputFieldsElements = getRangeInputFields(
          overlayContainerElement,
        );
        typeInElement('27', inputFieldsElements[0]);
        fixture.detectChanges();

        const rangeApplyButton = getRangeApplyButton(
          overlayContainerElement,
        )[0];
        rangeApplyButton.click();
        fixture.detectChanges();

        const tagLabel = fixture.debugElement.queryAll(
          By.css('.dt-filter-field-tag-label'),
        )[0];
        tagLabel.nativeElement.click();

        advanceFilterfieldCycle();

        // expect the range to open again
        const filterFieldRangeElements = getFilterFieldRange(
          overlayContainerElement,
        );
        expect(filterFieldRangeElements.length).toBe(1);

        // expect the values to be filled
        expect(filterField._filterfieldRange._selectedOperator).toEqual(
          'greater-equal',
        );
        expect(filterField._filterfieldRange._valueFrom).toEqual('27');
      });
    });
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
      const freeTextFilter = [
        TEST_DATA_EDITMODE.autocomplete[2],
        'Custom free text',
      ];

      const rangeFilter = [
        TEST_DATA_EDITMODE.autocomplete[3],
        { operator: 'range', unit: 's', range: [15, 80] },
      ];

      // Set filters as a starting point
      filterField.filters = [autocompleteFilter, freeTextFilter, rangeFilter];
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
      // Range filter should have set only the root filter (range def)
      expect(filterField.filters[2]).toHaveLength(1);
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

      expect(tags.length).toBe(3);

      tags[0].nativeElement.click();
      advanceFilterfieldCycle();

      const inputEl = getInput(fixture);
      dispatchKeyboardEvent(inputEl, 'keydown', BACKSPACE);
      fixture.detectChanges();
      tags = fixture.debugElement.queryAll(
        By.css('.dt-filter-field-tag-label'),
      );

      expect(tags.length).toBe(2);

      dispatchFakeEvent(document, 'click');
      fixture.detectChanges();
      tags = fixture.debugElement.queryAll(
        By.css('.dt-filter-field-tag-label'),
      );

      expect(tags.length).toBe(2);
    });

    it('should emit a filterchange event when the edit of a range is completed', () => {
      let filterChangeEvent: DtFilterFieldChangeEvent<any> | undefined;

      fixture.componentInstance.dataSource.data = FILTER_FIELD_TEST_DATA_SINGLE_OPTION;
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
      expect(deleteButton.disabled).toBeTruthy();
    });

    it('should disable the entire tag when disabled is set to true', () => {
      const tagInst = filterField.getTagForFilter(autocompleteFilter);
      tagInst!.disabled = true;
      fixture.detectChanges();
      const tags = getFilterTags(fixture);
      const { label, deleteButton } = getTagButtons(tags[0]);
      expect(label.disabled).toBeTruthy();
      expect(deleteButton.disabled).toBeTruthy();
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
      const {
        label: autoLabel,
        deleteButton: autoDeleteButton,
      } = getTagButtons(tags[0]);
      expect(autoLabel.disabled).toBeTruthy();
      expect(autoDeleteButton.disabled).toBeFalsy();

      const {
        label: freeTextLabel,
        deleteButton: freeTextDeleteButton,
      } = getTagButtons(tags[0]);
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
      const {
        label: autoLabel,
        deleteButton: autoDeleteButton,
      } = getTagButtons(tags[0]);
      expect(autoLabel.disabled).toBeTruthy();
      expect(autoDeleteButton.disabled).toBeFalsy();

      const {
        label: freeTextLabel,
        deleteButton: freeTextDeleteButton,
      } = getTagButtons(tags[0]);
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
  });

  describe('data-source switching', () => {
    it('should cancel the edit mode if the data source is switched', () => {
      filterField.focus();
      advanceFilterfieldCycle();

      const options = getOptions(overlayContainerElement);
      options[0].click();
      advanceFilterfieldCycle();

      let category = fixture.debugElement.query(
        By.css('.dt-filter-field-category'),
      );

      expect(category.nativeElement.textContent.trim()).toBe('AUT');
      expect(filterField.filters.length).toBe(1);
      expect(filterField.filters[0][0].name).toBe('AUT');

      fixture.componentInstance.dataSource.data = TEST_DATA_EDITMODE;
      advanceFilterfieldCycle();

      category = fixture.debugElement.query(
        By.css('.dt-filter-field-category'),
      );

      expect(category).toBeNull();
      expect(filterField.filters.length).toBe(0);
    });

    it('should not remove the current filter if the data is changed when the filterChanges event fires', () => {
      const filterChangesSubscription = filterField.filterChanges.subscribe(
        () => {
          fixture.componentInstance.dataSource.data = FILTER_FIELD_TEST_DATA_ASYNC;
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
});

function getOptions(overlayContainerElement: HTMLElement): HTMLElement[] {
  return Array.from(overlayContainerElement.querySelectorAll('.dt-option'));
}

function getOptionGroups(overlayContainerElement: HTMLElement): HTMLElement[] {
  return Array.from(overlayContainerElement.querySelectorAll('.dt-optgroup'));
}

function getFilterFieldRange(
  overlayContainerElement: HTMLElement,
): HTMLElement[] {
  return Array.from(
    overlayContainerElement.querySelectorAll('.dt-filter-field-range-panel'),
  );
}

function getOperatorButtonGroupItems(
  overlayContainerElement: HTMLElement,
): HTMLElement[] {
  return Array.from(
    overlayContainerElement.querySelectorAll('dt-button-group-item'),
  );
}

function getRangeInputFields(
  overlayContainerElement: HTMLElement,
): HTMLInputElement[] {
  return Array.from(
    overlayContainerElement.querySelectorAll('.dt-filter-field-range-input'),
  );
}

function getRangeApplyButton(
  overlayContainerElement: HTMLElement,
): HTMLElement[] {
  return Array.from(
    overlayContainerElement.querySelectorAll('.dt-filter-field-range-apply'),
  );
}

interface FilterTagTestData {
  ele: DebugElement;
  key: string;
  separator: string;
  value: string;
  removeButton: HTMLElement;
}

// tslint:disable-next-line:no-any
function getFilterTags(
  fixture: ComponentFixture<any>,
): Array<FilterTagTestData> {
  return Array.from(
    fixture.debugElement.queryAll(By.css('.dt-filter-field-tag')),
  ).map((ele) => {
    const key: HTMLElement = ele.nativeElement.querySelector(
      '.dt-filter-field-tag-key',
    );
    const separator =
      key && key.getAttribute('data-separator')
        ? key.getAttribute('data-separator')!
        : '';

    // Get the value of the filter element, if no filter value element is rendered
    // assume an empty string.
    const valueElement = ele.nativeElement.querySelector(
      '.dt-filter-field-tag-value',
    );
    const value = valueElement ? valueElement.textContent : '';

    return {
      ele,
      key: key && key.textContent ? key.textContent : '',
      separator,
      value,
      removeButton: ele.nativeElement.querySelector(
        '.dt-filter-field-tag-button',
      ),
    };
  });
}

function getTagButtons(
  tag: FilterTagTestData,
): { label: HTMLButtonElement; deleteButton: HTMLButtonElement } {
  const tagNative = tag.ele.nativeElement;
  const label = tagNative.querySelector('.dt-filter-field-tag-label');
  const deleteButton = tagNative.querySelector('.dt-filter-field-tag-button');
  return { label, deleteButton };
}

function getInput(fixture: ComponentFixture<any>): HTMLInputElement {
  return fixture.debugElement.query(By.css('.dt-filter-field-input'))
    .nativeElement;
}

/** Get the clearAll button. */
function getClearAll(fixture: ComponentFixture<any>): HTMLButtonElement | null {
  const dbgEl = fixture.debugElement.query(
    By.css('.dt-filter-field-clear-all-button'),
  );
  return dbgEl ? dbgEl.nativeElement : null;
}

/** Get the clearAll button and evaluate if it is visible or not. */
function isClearAllVisible(fixture: ComponentFixture<any>): boolean {
  const clearAll = getClearAll(fixture);
  return (
    clearAll !== null &&
    !clearAll.classList.contains('dt-filter-field-clear-all-button-hidden')
  );
}

export function customParser(
  filterValues: DtFilterValue[],
  editable?: boolean,
  deletable?: boolean,
): DtFilterFieldTagData | null {
  const tagData = defaultTagDataForFilterValuesParser(
    filterValues,
    editable,
    deletable,
  );
  if (tagData) {
    let isFirstValue = true;
    for (const filterValue of filterValues) {
      if (isDtAutocompleteValue(filterValue)) {
        if (isFirstValue && filterValues.length > 1) {
          tagData.key = filterValue.option.viewValue;
        } else if (filterValue.autocomplete && filterValues.length > 1) {
          tagData.key = tagData.key + '.' + filterValue.option.viewValue;
        }
        isFirstValue = false;
      }
    }
  }
  return tagData;
}

@Component({
  selector: 'test-app',
  template: `
    <dt-filter-field
      [dataSource]="dataSource"
      [label]="label"
      [clearAllLabel]="clearAllLabel"
    ></dt-filter-field>
  `,
})
export class TestApp {
  // tslint:disable-next-line:no-any
  dataSource = new DtFilterFieldDefaultDataSource(FILTER_FIELD_TEST_DATA_ASYNC);

  label = 'Filter by';
  clearAllLabel = 'Clear all';

  @ViewChild(DtFilterField) filterField: DtFilterField<any>;
}

@Component({
  selector: 'test-app',
  template: `
    <dt-filter-field
      [dataSource]="dataSource"
      [label]="label"
      [clearAllLabel]="clearAllLabel"
    ></dt-filter-field>
  `,
  providers: [
    {
      provide: DT_FILTER_VALUES_PARSER_CONFIG,
      useValue: customParser,
    },
  ],
})
export class TestAppCustomParserConfig {
  // tslint:disable-next-line:no-any
  dataSource = new DtFilterFieldDefaultDataSource(FILTER_FIELD_TEST_DATA_ASYNC);

  label = 'Filter by';
  clearAllLabel = 'Clear all';

  @ViewChild(DtFilterField) filterField: DtFilterField<any>;
}

@Component({
  selector: 'test-app',
  template: `
    <dt-filter-field
      [dataSource]="dataSource"
      [label]="label"
      [clearAllLabel]="clearAllLabel"
      [customTagParser]="parserFn"
    ></dt-filter-field>
  `,
})
export class TestAppCustomParserInput {
  // tslint:disable-next-line:no-any
  dataSource = new DtFilterFieldDefaultDataSource(FILTER_FIELD_TEST_DATA_ASYNC);

  label = 'Filter by';
  clearAllLabel = 'Clear all';
  parserFn = customParser;

  @ViewChild(DtFilterField) filterField: DtFilterField<any>;
}
