// tslint:disable:no-use-before-declare i18n newline-per-chained-call no-floating-promises no-magic-numbers

import { Component, NgZone, ViewChild } from '@angular/core';
import { By } from '@angular/platform-browser';
import { OverlayContainer } from '@angular/cdk/overlay';
import { ENTER, BACKSPACE, ESCAPE } from '@angular/cdk/keycodes';
import { TestBed, ComponentFixture, inject, fakeAsync, tick, flush } from '@angular/core/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { DtIconModule } from '@dynatrace/angular-components/icon';
import {
  DtFilterFieldModule,
  DtFilterFieldDefaultDataSource,
  DtFilterField,
  DT_FILTER_FIELD_TYPING_DEBOUNCE,
  DtFilterFieldChangeEvent
} from '@dynatrace/angular-components/filter-field';
import { typeInElement } from '../../testing/type-in-element';
import { MockNgZone } from '../../testing/mock-ng-zone';
import { dispatchKeyboardEvent } from '../../testing/dispatch-events';

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
              options: [
                'Linz',
                'Wels',
                'Steyr',
              ],
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
      autocomplete: [
        'Los Angeles',
        'San Fran',
      ],
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

describe('DtFilterField', () => {
  let fixture: ComponentFixture<TestApp>;
  let overlayContainer: OverlayContainer;
  let overlayContainerElement: HTMLElement;
  let filterField: DtFilterField;
  let zone: MockNgZone;

  beforeEach(fakeAsync(() => {
    TestBed.configureTestingModule({
      imports: [
        HttpClientTestingModule,
        DtIconModule.forRoot({ svgIconLocation: `{{name}}.svg` }),
        DtFilterFieldModule,
      ],
      declarations: [
        TestApp,
      ],
      providers: [
        { provide: NgZone, useFactory: () => zone = new MockNgZone() },
      ],
    }).compileComponents();

    inject([OverlayContainer], (oc: OverlayContainer) => {
      overlayContainer = oc;
      overlayContainerElement = oc.getContainerElement();
    })();

    fixture = TestBed.createComponent(TestApp);
    fixture.detectChanges();
    filterField = fixture.debugElement.query(By.directive(DtFilterField)).componentInstance;
  }));

  afterEach(inject([OverlayContainer], (currentOverlayContainer: OverlayContainer) => {
    // Since we're resetting the testing module in some of the tests,
    // we can potentially have multiple overlay containers.
    currentOverlayContainer.ngOnDestroy();
    overlayContainer.ngOnDestroy();
  }));

  it('should focus the input field when focusing the host', () => {
    const input = fixture.debugElement.query(By.css('.dt-filter-field-input')).nativeElement;
    filterField.focus();
    expect(document.activeElement).toBe(input);
  });

  describe('labeling', () => {
    it('should create an label with an filter icon', () => {
      const label = fixture.debugElement.query(By.css('.dt-filter-field-label'));
      const icon = label.query(By.css('dt-icon'));
      expect(icon.componentInstance.name).toEqual('filter');
    });

    it('should use the label passed to the component', () => {
      const label = fixture.debugElement.query(By.css('.dt-filter-field-label'));
      expect(label.nativeElement.innerText).toEqual('Filter by');
    });

    it('should update the label', () => {
      fixture.componentInstance.label = 'Something else';
      fixture.detectChanges();
      const label = fixture.debugElement.query(By.css('.dt-filter-field-label'));
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

    it('should focus the input element after selecting an option in autocomplete (autocomplete -> autocomplete)', () => {
      filterField.focus();
      fixture.detectChanges();

      const options = getOptions(overlayContainerElement);
      options[0].click();
      fixture.detectChanges();
      const inputEl = getInput(fixture);

      expect(document.activeElement).toBe(inputEl, 'input element should be focused again');
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
      let filterChangeEvent: DtFilterFieldChangeEvent | undefined;

      fixture.componentInstance.dataSource.data = TEST_DATA_SINGLE_OPTION;
      const sub = filterField.filterChanges.subscribe((ev) => filterChangeEvent = ev);

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
      let filterChangeEvent: DtFilterFieldChangeEvent | undefined;

      fixture.componentInstance.dataSource.data = TEST_DATA_SINGLE_OPTION;
      const sub = filterField.filterChanges.subscribe((ev) => filterChangeEvent = ev);

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
      expect(tags[0].value).toBe('"abc"');
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
});

function getOptions(overlayContainerElement: HTMLElement): HTMLElement[] {
  return Array.from(overlayContainerElement.querySelectorAll('.dt-option'));
}

function getOptionGroups(overlayContainerElement: HTMLElement): HTMLElement[] {
  return Array.from(overlayContainerElement.querySelectorAll('.dt-optgroup'));
}
// tslint:disable-next-line:no-any
function getFilterTags(fixture: ComponentFixture<any>):
  Array<{ key: string; separator: string; value: string; removeButton: HTMLElement }> {
  return Array.from(fixture.debugElement.queryAll(By.css('.dt-filter-field-tag'))).map((ele) => {
    const key: HTMLElement = ele.nativeElement.querySelector('.dt-filter-field-tag-key');
    const separator = key && key.getAttribute('data-separator') ? key.getAttribute('data-separator')! : '';
    const value = ele.nativeElement.querySelector('.dt-filter-field-tag-value').innerText;

    return {
      key: key && key.innerText ? key.innerText : '',
      separator,
      value,
      removeButton: ele.nativeElement.querySelector('.dt-filter-field-tag-button'),
    };
  });
}

// tslint:disable-next-line:no-any
function getInput(fixture: ComponentFixture<any>): HTMLInputElement {
  return fixture.debugElement.query(By.css('.dt-filter-field-input')).nativeElement;
}

@Component({
  selector: 'test-app',
  template: `
  <dt-filter-field
    [dataSource]="dataSource"
    [label]="label">
  </dt-filter-field>
`,
})
export class TestApp {

  // tslint:disable-next-line:no-any
  dataSource = new DtFilterFieldDefaultDataSource<any>(TEST_DATA);

  label = 'Filter by';

  @ViewChild(DtFilterField) filterField: DtFilterField;
}
