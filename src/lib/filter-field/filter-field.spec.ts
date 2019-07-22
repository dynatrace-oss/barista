// tslint:disable no-lifecycle-call no-use-before-declare no-magic-numbers
// tslint:disable no-any max-file-line-count no-unbound-method use-component-selector

import { BACKSPACE, ENTER, ESCAPE } from '@angular/cdk/keycodes';
import { OverlayContainer } from '@angular/cdk/overlay';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { Component, NgZone, ViewChild } from '@angular/core';
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
  DT_FILTER_FIELD_TYPING_DEBOUNCE,
  DtFilterField,
  DtFilterFieldChangeEvent,
  DtFilterFieldDefaultDataSource,
  DtFilterFieldModule,
  dtRangeDef,
  getDtFilterFieldRangeNoOperatorsError,
} from '@dynatrace/angular-components/filter-field';
import { DtIconModule } from '@dynatrace/angular-components/icon';
import { typeInElement } from '../../testing/type-in-element';
import { MockNgZone } from '../../testing/mock-ng-zone';
import {
  dispatchKeyboardEvent,
  dispatchFakeEvent,
} from '../../testing/dispatch-events';
import { createComponent } from '../../testing/create-component';
import { wrappedErrorMessage } from '../../testing/wrapped-error-message';

const TEST_DATA = {
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
              options: ['Linz', 'Wels', 'Steyr'],
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
      autocomplete: ['Los Angeles', 'San Fran'],
    },
    {
      name: 'Free',
      suggestions: [],
    },
  ],
};

const TEST_DATA_SINGLE_DISTINCT = {
  autocomplete: [
    {
      name: 'AUT',
      distinct: true,
      autocomplete: [
        {
          name: 'Vienna',
        },
        {
          name: 'Linz',
        },
      ],
    },
  ],
};

const TEST_DATA_SINGLE_OPTION = {
  autocomplete: ['option'],
};

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
          suggestions: ['some cool', 'very weird'],
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
              options: ['Linz', 'Wels', 'Steyr'],
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
      autocomplete: ['Los Angeles', 'San Fran'],
    },
    {
      name: 'Free',
      suggestions: [],
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
  ],
};

describe('DtFilterField', () => {
  let fixture: ComponentFixture<TestApp>;
  let overlayContainer: OverlayContainer;
  let overlayContainerElement: HTMLElement;
  let filterField: DtFilterField<any>;
  let zone: MockNgZone;

  beforeEach(fakeAsync(() => {
    TestBed.configureTestingModule({
      imports: [
        HttpClientTestingModule,
        DtIconModule.forRoot({ svgIconLocation: `{{name}}.svg` }),
        DtFilterFieldModule,
      ],
      declarations: [TestApp],
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

  it('should focus the input field when focusing the host', () => {
    const input = fixture.debugElement.query(By.css('.dt-filter-field-input'))
      .nativeElement;
    filterField.focus();
    expect(document.activeElement).toBe(input);
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
      expect(label.nativeElement.innerText).toEqual('Filter by');
    });

    it('should update the label', () => {
      fixture.componentInstance.label = 'Something else';
      fixture.detectChanges();
      const label = fixture.debugElement.query(
        By.css('.dt-filter-field-label'),
      );
      expect(label.nativeElement.innerText).toEqual('Something else');
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
      expect(filterField._autocomplete.isOpen).toBe(true);
    });

    it('should emit the inputChange event when typing into the input field with autocomplete', fakeAsync(() => {
      const spy = jasmine.createSpy('autocomplete input spy');
      const subscription = filterField.inputChange.subscribe(spy);
      const inputEl = fixture.debugElement.query(By.css('input')).nativeElement;

      typeInElement('x', inputEl);
      tick(DT_FILTER_FIELD_TYPING_DEBOUNCE);
      fixture.detectChanges();

      expect(spy).toHaveBeenCalledWith('x');

      typeInElement('xy', inputEl);
      tick(DT_FILTER_FIELD_TYPING_DEBOUNCE);
      fixture.detectChanges();

      expect(spy).toHaveBeenCalledWith('xy');
      subscription.unsubscribe();
    }));

    it('should create the correct options and option groups', () => {
      filterField.focus();
      fixture.detectChanges();
      zone.simulateZoneExit();

      const options = getOptions(overlayContainerElement);
      const optionGroups = getOptionGroups(overlayContainerElement);
      expect(options.length).toBe(3);
      expect(optionGroups.length).toBe(0);
      expect(options[0].innerText).toBe('AUT');
      expect(options[1].innerText).toBe('USA');
      expect(options[2].innerText).toBe('Free');
    });

    it('should switch to the next autocomplete if the selected option is also an autocomplete', () => {
      filterField.focus();
      zone.simulateZoneExit();
      fixture.detectChanges();

      let options = getOptions(overlayContainerElement);
      expect(options[0].innerText).toBe('AUT');
      expect(options[1].innerText).toBe('USA');
      expect(options[2].innerText).toBe('Free');

      const autOption = options[0];
      autOption.click();
      zone.simulateMicrotasksEmpty();
      fixture.detectChanges();

      options = getOptions(overlayContainerElement);
      let optionGroups = getOptionGroups(overlayContainerElement);
      expect(optionGroups.length).toBe(0);
      expect(options.length).toBe(2);
      expect(options[0].innerText).toBe('Upper Austria');
      expect(options[1].innerText).toBe('Vienna');

      zone.simulateZoneExit();

      const upperAustriaOption = options[0];
      upperAustriaOption.click();
      zone.simulateMicrotasksEmpty();
      fixture.detectChanges();

      options = getOptions(overlayContainerElement);
      optionGroups = getOptionGroups(overlayContainerElement);

      expect(optionGroups.length).toBe(1);
      expect(optionGroups[0].innerText).toContain('Cities');
      expect(options[0].innerText).toBe('Linz');
      expect(options[1].innerText).toBe('Wels');
      expect(options[2].innerText).toBe('Steyr');
    });

    it('should clear the filtered string from the input when selecting an option', fakeAsync(() => {
      filterField.focus();
      zone.simulateZoneExit();
      fixture.detectChanges();

      const inputEl = getInput(fixture);
      typeInElement('US', inputEl);
      tick(DT_FILTER_FIELD_TYPING_DEBOUNCE);

      zone.simulateMicrotasksEmpty();
      fixture.detectChanges();

      let options = getOptions(overlayContainerElement);
      const usOption = options[0];
      usOption.click();
      zone.simulateMicrotasksEmpty();
      fixture.detectChanges();

      options = getOptions(overlayContainerElement);
      expect(options.length).toBe(2);
      expect(options[0].innerText).toBe('Los Angeles');
      expect(options[1].innerText).toBe('San Fran');

      zone.simulateZoneExit();
    }));

    it('should switch to the next autocomplete if the selected option is also a freetext with suggestions', () => {
      fixture.componentInstance.dataSource.data = TEST_DATA_SUGGESTIONS;
      filterField.focus();
      zone.simulateZoneExit();
      fixture.detectChanges();

      let options = getOptions(overlayContainerElement);
      expect(options[0].innerText).toBe('Custom Simple Option');
      expect(options[1].innerText).toBe('Node Label');

      const nodeLabelOption = options[1];
      nodeLabelOption.click();
      zone.simulateMicrotasksEmpty();
      fixture.detectChanges();

      options = getOptions(overlayContainerElement);
      const optionGroups = getOptionGroups(overlayContainerElement);
      expect(optionGroups.length).toBe(0);
      expect(options.length).toBe(2);
      expect(options[0].innerText).toBe('some cool');
      expect(options[1].innerText).toBe('very weird');

      zone.simulateZoneExit();
    });

    it('should focus the input element after selecting an option in autocomplete (autocomplete -> autocomplete)', () => {
      filterField.focus();
      fixture.detectChanges();

      const options = getOptions(overlayContainerElement);
      options[0].click();
      fixture.detectChanges();
      const inputEl = getInput(fixture);

      expect(document.activeElement).toBe(
        inputEl,
        'input element should be focused again',
      );
    });

    it('should fire filterChanges and create a tag after an option that has no children is clicked', fakeAsync(() => {
      const spy = jasmine.createSpy('filterChange spy');
      const subscription = filterField.filterChanges.subscribe(spy);
      filterField.focus();
      zone.simulateZoneExit();
      fixture.detectChanges();

      let options = getOptions(overlayContainerElement);
      expect(options[0].innerText).toBe('AUT');
      expect(options[1].innerText).toBe('USA');

      const usaOption = options[1];
      usaOption.click();
      zone.simulateMicrotasksEmpty();
      fixture.detectChanges();

      zone.simulateZoneExit();

      options = getOptions(overlayContainerElement);

      const sfOption = options[0];
      sfOption.click();
      zone.simulateMicrotasksEmpty();
      fixture.detectChanges();

      const tags = getFilterTags(fixture);
      expect(tags.length).toBe(1);
      expect(tags[0].key).toBe('USA');
      expect(tags[0].separator).toBe(':');
      expect(tags[0].value).toBe('Los Angeles');

      expect(spy).toHaveBeenCalledTimes(1);
      subscription.unsubscribe();
    }));

    it('should emit filterChanges when adding an option', fakeAsync(() => {
      let filterChangeEvent: DtFilterFieldChangeEvent<any> | undefined;

      fixture.componentInstance.dataSource.data = TEST_DATA_SINGLE_OPTION;
      const sub = filterField.filterChanges.subscribe(
        ev => (filterChangeEvent = ev),
      );

      fixture.detectChanges();
      filterField.focus();
      zone.simulateZoneExit();
      fixture.detectChanges();

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

      fixture.componentInstance.dataSource.data = TEST_DATA_SINGLE_OPTION;
      const sub = filterField.filterChanges.subscribe(
        ev => (filterChangeEvent = ev),
      );

      fixture.detectChanges();
      filterField.focus();
      zone.simulateZoneExit();
      fixture.detectChanges();

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
      const spy = jasmine.createSpy('filterChange spy');
      const subscription = filterField.filterChanges.subscribe(spy);
      filterField.focus();
      zone.simulateZoneExit();
      fixture.detectChanges();

      const options = getOptions(overlayContainerElement);

      const freeTextOption = options[2];
      freeTextOption.click();
      zone.simulateMicrotasksEmpty();
      fixture.detectChanges();

      const inputEl = getInput(fixture);
      typeInElement('abc', inputEl);
      tick(DT_FILTER_FIELD_TYPING_DEBOUNCE);

      fixture.detectChanges();
      dispatchKeyboardEvent(inputEl, 'keyup', ENTER);
      fixture.detectChanges();

      const tags = getFilterTags(fixture);
      expect(tags.length).toBe(1);
      expect(tags[0].key).toBe('Free');
      expect(tags[0].separator).toBe('~');
      expect(tags[0].value).toBe('abc');
      expect(spy).toHaveBeenCalledTimes(1);
      subscription.unsubscribe();
    }));

    it('should switch back to root if unfinished filter is deleted with BACKSPACE', () => {
      filterField.focus();
      fixture.detectChanges();

      let options = getOptions(overlayContainerElement);

      const autOption = options[0];
      autOption.click();
      fixture.detectChanges();

      const inputEl = getInput(fixture);
      dispatchKeyboardEvent(inputEl, 'keydown', BACKSPACE);
      fixture.detectChanges();

      const tags = getFilterTags(fixture);
      expect(tags.length).toBe(0);

      options = getOptions(overlayContainerElement);
      expect(options[0].innerText).toBe('AUT');
      expect(options[1].innerText).toBe('USA');
      expect(options[2].innerText).toBe('Free');
    });

    it('should show option again after adding all possible options and removing this option from the filters', () => {
      fixture.componentInstance.dataSource.data = TEST_DATA_SINGLE_DISTINCT;
      fixture.detectChanges();

      filterField.focus();
      zone.simulateZoneExit();
      fixture.detectChanges();

      let options = getOptions(overlayContainerElement);

      const autOption = options[0];
      autOption.click();
      zone.simulateMicrotasksEmpty();
      fixture.detectChanges();

      zone.simulateZoneExit();
      options = getOptions(overlayContainerElement);
      const viennaOption = options[0];
      expect(viennaOption.innerText).toBe('Vienna');

      viennaOption.click();
      zone.simulateMicrotasksEmpty();
      fixture.detectChanges();

      const tags = getFilterTags(fixture);
      expect(tags.length).toBe(1);

      expect(tags[0].key).toBe('AUT');
      expect(tags[0].separator).toBe(':');
      expect(tags[0].value).toBe('Vienna');

      tags[0].removeButton.click();

      filterField.focus();
      zone.simulateMicrotasksEmpty();
      fixture.detectChanges();

      options = getOptions(overlayContainerElement);
      expect(options[0].innerText).toBe('AUT');
    });

    it('should switch back from root after deleting a unfinished freetext filter with BACKSPACE', () => {
      filterField.focus();
      zone.simulateZoneExit();
      fixture.detectChanges();

      let options = getOptions(overlayContainerElement);

      const freeTextOpt = options[2];
      freeTextOpt.click();
      zone.simulateMicrotasksEmpty();
      fixture.detectChanges();

      zone.simulateZoneExit();

      const inputEl = getInput(fixture);
      dispatchKeyboardEvent(inputEl, 'keydown', BACKSPACE);
      zone.simulateMicrotasksEmpty();
      fixture.detectChanges();

      const tags = getFilterTags(fixture);
      expect(tags.length).toBe(0);

      options = getOptions(overlayContainerElement);
      expect(options[0].innerText).toBe('AUT');
      expect(options[1].innerText).toBe('USA');
      expect(options[2].innerText).toBe('Free');
    });

    it('should remove a parent from an autocomplete if it is distinct and an option has been selected', () => {
      fixture.componentInstance.dataSource.data = TEST_DATA_SINGLE_DISTINCT;
      fixture.detectChanges();
      filterField.focus();
      zone.simulateZoneExit();
      fixture.detectChanges();

      let options = getOptions(overlayContainerElement);

      const autOption = options[0];
      autOption.click();
      zone.simulateMicrotasksEmpty();
      fixture.detectChanges();

      zone.simulateZoneExit();

      options = getOptions(overlayContainerElement);
      const viennaOption = options[0];
      expect(viennaOption.innerText).toBe('Vienna');

      viennaOption.click();
      zone.simulateMicrotasksEmpty();
      fixture.detectChanges();

      zone.simulateZoneExit();

      options = getOptions(overlayContainerElement);
      expect(options.length).toBe(0);
    });

    it('should close the panel when pressing escape', fakeAsync(() => {
      const trigger = filterField._autocompleteTrigger;
      const input = getInput(fixture);

      input.focus();
      flush();
      fixture.detectChanges();

      expect(document.activeElement).toBe(input);
      expect(trigger.panelOpen).toBe(true);

      dispatchKeyboardEvent(input, 'keydown', ESCAPE);
      flush();
      fixture.detectChanges();

      expect(document.activeElement).toBe(input);
      expect(trigger.panelOpen).toBe(false);
    }));
  });

  describe('with range option', () => {
    beforeEach(() => {
      fixture.componentInstance.dataSource.data = TEST_DATA_RANGE;
      fixture.detectChanges();

      // Focus the filter field.
      filterField.focus();
      zone.simulateZoneExit();
      fixture.detectChanges();
    });

    it('should open the range overlay if the range option is selected', () => {
      let filterFieldRangeElements = getFilterFieldRange(
        overlayContainerElement,
      );
      expect(filterFieldRangeElements.length).toBe(0);

      const options = getOptions(overlayContainerElement);
      options[0].click();

      zone.simulateMicrotasksEmpty();
      fixture.detectChanges();
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
      zone.simulateZoneExit();
      fixture.detectChanges();
      const options = getOptions(overlayContainerElement);
      options[0].click();

      zone.simulateMicrotasksEmpty();
      fixture.detectChanges();

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
      zone.simulateZoneExit();
      fixture.detectChanges();

      const options = getOptions(overlayContainerElement);
      options[0].click();

      zone.simulateMicrotasksEmpty();
      fixture.detectChanges();

      const operatorButtonElements = getOperatorButtonGroupItems(
        overlayContainerElement,
      );
      expect(operatorButtonElements.length).toBe(1);
      expect(operatorButtonElements[0].textContent).toBe('≥');
    });

    describe('opened', () => {
      beforeEach(() => {
        // Open the filter-field-range overlay.
        const options = getOptions(overlayContainerElement);
        options[0].click();

        zone.simulateMicrotasksEmpty();
        fixture.detectChanges();
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
          dtRangeDef(false, false, false, false, 's', {}, null);
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
        expect(tags[0].value).toBe('15s - 25s');
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
        expect(tags[0].value).toBe('15s');
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

        zone.simulateMicrotasksEmpty();
        fixture.detectChanges();

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

        zone.simulateMicrotasksEmpty();
        fixture.detectChanges();

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
      zone.simulateZoneExit();
      fixture.detectChanges();

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
      // Set filters as a starting point
      filterField.filters = [autocompleteFilter, freeTextFilter];
      fixture.detectChanges();

      // TODO: Change this to a programmatic setting of the range filter, as soon as ***REMOVED***/***REMOVED*** is done.
      filterField.focus();
      zone.simulateZoneExit();
      fixture.detectChanges();

      // Open the filter-field-range overlay.
      const options = getOptions(overlayContainerElement);
      options[3].click();

      zone.simulateMicrotasksEmpty();
      fixture.detectChanges();

      const inputFieldsElements = getRangeInputFields(overlayContainerElement);

      typeInElement('15', inputFieldsElements[0]);
      typeInElement('80', inputFieldsElements[1]);
      fixture.detectChanges();

      const rangeApplyButton = getRangeApplyButton(overlayContainerElement)[0];
      rangeApplyButton.click();
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
      fixture.detectChanges();
      zone.simulateZoneExit();

      let options = getOptions(overlayContainerElement);
      // Make sure that the autocomplete actually opened.
      expect(options.length).toBe(2);

      dispatchFakeEvent(document, 'click');
      fixture.detectChanges();
      zone.simulateMicrotasksEmpty();
      zone.simulateZoneExit();

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
      fixture.detectChanges();
      zone.simulateZoneExit();

      let options = getOptions(overlayContainerElement);
      // Make sure that the autocomplete actually opened.
      expect(options.length).toBe(2);

      // Cancel editmode with keyboard
      const inputfield = getInput(fixture);
      dispatchKeyboardEvent(inputfield, 'keydown', ESCAPE);
      fixture.detectChanges();
      zone.simulateZoneExit();

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
      fixture.detectChanges();
      zone.simulateZoneExit();
      zone.simulateMicrotasksEmpty();

      dispatchFakeEvent(document, 'click');
      fixture.detectChanges();
      zone.simulateMicrotasksEmpty();
      zone.simulateZoneExit();

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

    it('should reset the freetext filter when not changing anything and cancelling by keyboard', () => {
      const tags = fixture.debugElement.queryAll(
        By.css('.dt-filter-field-tag-label'),
      );
      tags[1].nativeElement.click();
      fixture.detectChanges();
      zone.simulateZoneExit();

      // Cancel editmode with keyboard
      const inputfield = getInput(fixture);
      dispatchKeyboardEvent(inputfield, 'keydown', ESCAPE);
      fixture.detectChanges();
      zone.simulateZoneExit();

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
      fixture.detectChanges();
      zone.simulateMicrotasksEmpty();
      zone.simulateZoneExit();

      // Expect the range filter to be open
      let filterfield = getFilterFieldRange(overlayContainerElement);
      expect(filterfield.length).toBe(1);

      dispatchFakeEvent(document, 'click');
      fixture.detectChanges();
      zone.simulateMicrotasksEmpty();
      zone.simulateZoneExit();

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
      fixture.detectChanges();
      zone.simulateMicrotasksEmpty();
      zone.simulateZoneExit();

      // Expect the range filter to be open
      let filterfield = getFilterFieldRange(overlayContainerElement);
      expect(filterfield.length).toBe(1);

      // Cancel editmode with keyboard
      const inputfields = getRangeInputFields(overlayContainerElement);
      dispatchKeyboardEvent(inputfields[0], 'keydown', ESCAPE);

      fixture.detectChanges();
      zone.simulateMicrotasksEmpty();
      zone.simulateZoneExit();

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

    it('should make the edit to the first tag', () => {
      const tags = fixture.debugElement.queryAll(
        By.css('.dt-filter-field-tag-label'),
      );
      tags[0].nativeElement.click();
      fixture.detectChanges();
      zone.simulateZoneExit();

      const options = getOptions(overlayContainerElement);
      // Make sure that the autocomplete actually opened.
      expect(options.length).toBe(2);

      // Select Vienna
      options[1].click();
      zone.simulateMicrotasksEmpty();
      fixture.detectChanges();
      zone.simulateZoneExit();

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

// tslint:disable-next-line:no-any
function getFilterTags(
  fixture: ComponentFixture<any>,
): Array<{
  key: string;
  separator: string;
  value: string;
  removeButton: HTMLElement;
}> {
  return Array.from(
    fixture.debugElement.queryAll(By.css('.dt-filter-field-tag')),
  ).map(ele => {
    const key: HTMLElement = ele.nativeElement.querySelector(
      '.dt-filter-field-tag-key',
    );
    const separator =
      key && key.getAttribute('data-separator')
        ? key.getAttribute('data-separator')!
        : '';
    const value = ele.nativeElement.querySelector('.dt-filter-field-tag-value')
      .innerText;

    return {
      key: key && key.innerText ? key.innerText : '',
      separator,
      value,
      removeButton: ele.nativeElement.querySelector(
        '.dt-filter-field-tag-button',
      ),
    };
  });
}

// tslint:disable-next-line:no-any
function getInput(fixture: ComponentFixture<any>): HTMLInputElement {
  return fixture.debugElement.query(By.css('.dt-filter-field-input'))
    .nativeElement;
}

@Component({
  selector: 'test-app',
  template: `
    <dt-filter-field
      [dataSource]="dataSource"
      [label]="label"
    ></dt-filter-field>
  `,
})
export class TestApp {
  // tslint:disable-next-line:no-any
  dataSource = new DtFilterFieldDefaultDataSource<any>(TEST_DATA);

  label = 'Filter by';

  @ViewChild(DtFilterField, { static: false }) filterField: DtFilterField<any>;
}
