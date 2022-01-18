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

import { ESCAPE } from '@angular/cdk/keycodes';
import { OverlayContainer } from '@angular/cdk/overlay';
import {
  ComponentFixture,
  fakeAsync,
  flush,
  inject,
} from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import {
  wrappedErrorMessage,
  typeInElement,
  dispatchKeyboardEvent,
} from '@dynatrace/testing/browser';
import { DtFilterField } from '../filter-field';
import { getDtFilterFieldRangeNoOperatorsError } from '../filter-field-errors';
import { TEST_DATA_RANGE } from '../testing/filter-field-test-data';
import {
  TestApp,
  setupFilterFieldTest,
  getFilterFieldRange,
  getOperatorButtonGroupItems,
  getRangeInputFields,
  getRangeApplyButton,
  getFilterTags,
  getOptions,
} from '../testing/filter-field-test-helpers';
import { dtRangeDef } from '../types';

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
});
