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

/* eslint-disable @typescript-eslint/no-non-null-assertion */

import { OverlayContainer } from '@angular/cdk/overlay';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { Component, DebugElement, NgZone, ViewChild } from '@angular/core';
import {
  ComponentFixture,
  fakeAsync,
  TestBed,
  inject,
} from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { DtIconModule } from '@dynatrace/barista-components/icon';
import {
  MockNgZone,
  createComponent,
  typeInElement,
} from '@dynatrace/testing/browser';
import { FILTER_FIELD_TEST_DATA_ASYNC } from '@dynatrace/testing/fixtures';
import { defaultTagDataForFilterValuesParser } from '../filter-field-util';
import { DtFilterField } from '../filter-field';
import { DT_FILTER_VALUES_PARSER_CONFIG } from '../filter-field-config';
import { DtFilterFieldDefaultDataSource } from '../filter-field-default-data-source';
import { DtFilterFieldModule } from '../filter-field-module';
import {
  DtFilterFieldTagData,
  DtFilterValue,
  isDtAutocompleteValue,
} from '../types';

export interface FilterFieldTestContext {
  fixture: ComponentFixture<TestApp>;
  filterField: DtFilterField;
  zone: MockNgZone;
  overlayContainer: OverlayContainer;
  overlayContainerElement: HTMLElement;
  advanceFilterfieldCycle: (
    simulateMicrotasks?: boolean,
    simulateZoneExit?: boolean,
  ) => void;
  getAndClickOption: (
    optionOverlayContainer: HTMLElement,
    nthOption: number,
  ) => void;
  typeIntoFilterElement: (inputString: string) => void;
}

export function setupFilterFieldTest(): FilterFieldTestContext {
  let fixture: ComponentFixture<TestApp> | undefined;
  let filterField: DtFilterField | undefined;
  let zone: MockNgZone | undefined;
  let overlayContainer: OverlayContainer | undefined;
  let overlayContainerElement: HTMLElement | undefined;

  const configureTestModule = fakeAsync(() => {
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
    filterField = fixture.debugElement.query(
      By.directive(DtFilterField),
    ).componentInstance;
  });
  configureTestModule();

  /**
   * Simulate zone steps and change detection to advance the
   * filter field to the next state.
   */
  function advanceFilterfieldCycle(
    simulateMicrotasks: boolean = true,
    simulateZoneExit: boolean = true,
  ): void {
    if (simulateMicrotasks) {
      zone!.simulateMicrotasksEmpty();
    }
    if (simulateZoneExit) {
      zone!.simulateZoneExit();
    }
    fixture!.detectChanges();
  }

  /**
   * Gets the nth option from the passed overlay container, clicks it and advances
   * the filter field cycle.
   */
  function getAndClickOption(
    optionOverlayContainer: HTMLElement,
    nthOption: number,
  ): void {
    const options = getOptions(optionOverlayContainer);
    const selectedOption = options[nthOption];
    selectedOption.click();
    advanceFilterfieldCycle();
  }

  /**
   * Types the passed value into the filter field input element
   */
  function typeIntoFilterElement(inputString: string): void {
    const inputEl = fixture!.debugElement.query(By.css('input')).nativeElement;
    typeInElement(inputString, inputEl);
  }

  return {
    fixture: fixture!,
    filterField: filterField!,
    zone: zone!,
    overlayContainer: overlayContainer!,
    overlayContainerElement: overlayContainerElement!,
    advanceFilterfieldCycle,
    getAndClickOption,
    typeIntoFilterElement,
  };
}

@Component({
  selector: 'dt-test-app',
  template: `
    <dt-filter-field
      [dataSource]="dataSource"
      [label]="label"
      [clearAllLabel]="clearAllLabel"
    ></dt-filter-field>
  `,
})
export class TestApp {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  dataSource = new DtFilterFieldDefaultDataSource(FILTER_FIELD_TEST_DATA_ASYNC);

  label = 'Filter by';
  clearAllLabel = 'Clear all';

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  @ViewChild(DtFilterField) filterField: DtFilterField<any>;
}

@Component({
  selector: 'dt-test-app',
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
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  dataSource = new DtFilterFieldDefaultDataSource(FILTER_FIELD_TEST_DATA_ASYNC);

  label = 'Filter by';
  clearAllLabel = 'Clear all';

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  @ViewChild(DtFilterField) filterField: DtFilterField<any>;
}

@Component({
  selector: 'dt-test-app',
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
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  dataSource = new DtFilterFieldDefaultDataSource(FILTER_FIELD_TEST_DATA_ASYNC);

  label = 'Filter by';
  clearAllLabel = 'Clear all';
  parserFn = customParser;

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  @ViewChild(DtFilterField) filterField: DtFilterField<any>;
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

export function getPartialResultsHintPanel(
  overlayContainerElement: HTMLElement,
): HTMLElement | null {
  return overlayContainerElement.querySelector('.dt-filter-field-hint-partial');
}

export function getOptions(
  overlayContainerElement: HTMLElement,
): HTMLElement[] {
  return Array.from(overlayContainerElement.querySelectorAll('.dt-option'));
}

export function getOptionGroups(
  overlayContainerElement: HTMLElement,
): HTMLElement[] {
  return Array.from(overlayContainerElement.querySelectorAll('.dt-optgroup'));
}

export function getFilterFieldRange(
  overlayContainerElement: HTMLElement,
): HTMLElement[] {
  return Array.from(
    overlayContainerElement.querySelectorAll('.dt-filter-field-range-panel'),
  );
}

export function getOperatorButtonGroupItems(
  overlayContainerElement: HTMLElement,
): HTMLElement[] {
  return Array.from(
    overlayContainerElement.querySelectorAll('dt-button-group-item'),
  );
}

export function getRangeInputFields(
  overlayContainerElement: HTMLElement,
): HTMLInputElement[] {
  return Array.from(
    overlayContainerElement.querySelectorAll('.dt-filter-field-range-input'),
  );
}

export function getRangeApplyButton(
  overlayContainerElement: HTMLElement,
): HTMLElement[] {
  return Array.from(
    overlayContainerElement.querySelectorAll('.dt-filter-field-range-apply'),
  );
}

export function getMultiSelectTrigger(
  overlayContainerElement: HTMLElement,
): HTMLElement[] {
  return Array.from(
    overlayContainerElement.querySelectorAll('input[dtFilterFieldMultiSelect]'),
  );
}

export function getMultiSelect(
  overlayContainerElement: HTMLElement,
): HTMLElement[] {
  return Array.from(
    overlayContainerElement.querySelectorAll(
      '.dt-filter-field-multi-select-panel',
    ),
  );
}

export function getMultiselectCheckboxLabels(
  overlayContainerElement: HTMLElement,
): HTMLInputElement[] {
  return Array.from(
    overlayContainerElement.querySelectorAll(
      '.dt-filter-field-multi-select-checkbox label',
    ),
  );
}

export function getMultiselectCheckboxInputs(
  overlayContainerElement: HTMLElement,
): HTMLInputElement[] {
  return Array.from(
    overlayContainerElement.querySelectorAll(
      '.dt-filter-field-multi-select-checkbox input',
    ),
  );
}

export function getMultiselectApplyButton(
  overlayContainerElement: HTMLElement,
): HTMLElement[] {
  return Array.from(
    overlayContainerElement.querySelectorAll(
      '.dt-filter-field-multi-select-apply',
    ),
  );
}

interface FilterTagTestData {
  ele: DebugElement;
  key: string;
  separator: string;
  value: string;
  removeButton: HTMLElement;
  deletable?: boolean;
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function getFilterTags(
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
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

export function getTagButtons(tag: FilterTagTestData): {
  label: HTMLButtonElement;
  deleteButton: HTMLButtonElement;
} {
  const tagNative = tag.ele.nativeElement;
  const label = tagNative.querySelector('.dt-filter-field-tag-label');
  const deleteButton = tagNative.querySelector('.dt-filter-field-tag-button');
  return { label, deleteButton };
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function getInput(fixture: ComponentFixture<any>): HTMLInputElement {
  return fixture.debugElement.query(By.css('.dt-filter-field-input'))
    .nativeElement;
}

/** Get the clearAll button. */
export function getClearAll(
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  fixture: ComponentFixture<any>,
): HTMLButtonElement | null {
  const dbgEl = fixture.debugElement.query(
    By.css('.dt-filter-field-clear-all-button'),
  );
  return dbgEl ? dbgEl.nativeElement : null;
}

/** Get the clearAll button and evaluate if it is visible or not. */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function isClearAllVisible(fixture: ComponentFixture<any>): boolean {
  const clearAll = getClearAll(fixture);
  return (
    clearAll !== null &&
    !clearAll.classList.contains('dt-filter-field-clear-all-button-hidden')
  );
}
