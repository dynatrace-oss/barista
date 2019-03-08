import { TestBed, ComponentFixture, inject, fakeAsync, flushMicrotasks, flush, tick, discardPeriodicTasks } from '@angular/core/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { DtIconModule } from '@dynatrace/angular-components/icon';
import { DtFilterFieldModule, DtFilterFieldDefaultDataSource, DtFilterField } from '@dynatrace/angular-components/filter-field';
import { Component, NgZone } from '@angular/core';
import { By } from '@angular/platform-browser';
import { OverlayContainer } from '@angular/cdk/overlay';
import { typeInElement } from '../../testing/type-in-element';
import { MockNgZone } from '../../testing/mock-ng-zone';
import { dispatchKeyboardEvent } from '../../testing/dispatch-events';
import { ENTER, BACKSPACE } from '@angular/cdk/keycodes';

fdescribe('DtFilterField', () => {
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
      ]
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

    it('should emit the inputChange event when typing into the input field with autocomplete', () => {
      const spy = jasmine.createSpy('autocomplete input spy');
      const subscription = filterField.inputChange.subscribe(spy);
      const inputEl = fixture.debugElement.query(By.css('input')).nativeElement;

      typeInElement('x', inputEl);
      fixture.detectChanges();

      expect(spy).toHaveBeenCalledWith('x');

      typeInElement('xy', inputEl);
      fixture.detectChanges();

      expect(spy).toHaveBeenCalledWith('xy');
      subscription.unsubscribe();
    });

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

    it('should switch to the next autocomplete if the selected option is also an autocomplete', fakeAsync(() => {

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
    }));

    it('should focus the input element after selecting an option in autocomplete (autocomplete -> autocomplete)', fakeAsync(() => {
      filterField.focus();
      zone.simulateZoneExit();
      fixture.detectChanges();

      let options = getOptions(overlayContainerElement);
      options[0].click();
      zone.simulateMicrotasksEmpty();
      fixture.detectChanges();
      const inputEl = getInput(fixture);

      expect(document.activeElement).toBe(inputEl, 'input element should be focused again');
    }));

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

    it('should switch back to root if unfinished filter is deleted with BACKSPACE', fakeAsync(() => {
      filterField.focus();
      zone.simulateZoneExit();
      fixture.detectChanges();

      let options = getOptions(overlayContainerElement);

      const autOption = options[0];
      autOption.click();
      zone.simulateMicrotasksEmpty();
      fixture.detectChanges();

      zone.simulateZoneExit();

      const inputEl = getInput(fixture);
      dispatchKeyboardEvent(inputEl, 'keydown', BACKSPACE);
      tick();
      fixture.detectChanges();

      flush();
      fixture.detectChanges();

      const tags = getFilterTags(fixture);
      expect(tags.length).toBe(0);

      options = getOptions(overlayContainerElement);
      expect(options[0].innerText).toBe('AUT');
      expect(options[1].innerText).toBe('USA');
      expect(options[2].innerText).toBe('Free');

    }));

    it('should show option again after adding all possible options and removing this option from the filters', fakeAsync(() => {
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

      zone.simulateMicrotasksEmpty();
      fixture.detectChanges();

      options = getOptions(overlayContainerElement);
      expect(options[0].innerText).toBe('AUT');
      // we need to discard the periodic task here
      // because we have a delay for an observable and this causes some issues in fakeAsync tests
      discardPeriodicTasks();
    }));

    it('should switch back from root after deleting a unfinished freetext filter with BACKSPACE', fakeAsync(() => {
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
      tick();
      fixture.detectChanges();

      flush();
      fixture.detectChanges();

      zone.simulateMicrotasksEmpty();
      fixture.detectChanges();

      const tags = getFilterTags(fixture);
      expect(tags.length).toBe(0);

      options = getOptions(overlayContainerElement);
      expect(options[0].innerText).toBe('AUT');
      expect(options[1].innerText).toBe('USA');
      expect(options[2].innerText).toBe('Free');
    }));

    it('should remove an option from an autocomplete if it is distinct and the option was previously selected', fakeAsync(() => {
      fixture.componentInstance.dataSource.data = TEST_DATA_SINGLE_DISTINCT;
      fixture.detectChanges();
      filterField.focus();
      zone.simulateZoneExit();
      fixture.detectChanges();

      let options = getOptions(overlayContainerElement);

      let autOption = options[0];
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
      autOption = options[0];
      autOption.click();
      zone.simulateMicrotasksEmpty();
      fixture.detectChanges();

      zone.simulateZoneExit();

      options = getOptions(overlayContainerElement);
      const linzOption = options[0];
      expect(options.length).toBe(1);
      expect(linzOption.innerText).toBe('Linz');
    }));
  });
});

function getOptions(overlayContainerElement: HTMLElement): HTMLElement[] {
  return Array.from(overlayContainerElement.querySelectorAll('.dt-option'));
}

function getOptionGroups(overlayContainerElement: HTMLElement): HTMLElement[] {
  return Array.from(overlayContainerElement.querySelectorAll('.dt-optgroup'));
}

function getFilterTags(fixture: ComponentFixture<any>):
  Array<{ key: string; separator: string; value: string; removeButton: HTMLElement; }> {
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

function getInput(fixture: ComponentFixture<any>): HTMLInputElement {
  return fixture.debugElement.query(By.css('.dt-filter-field-input')).nativeElement;
}

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

  dataSource = new DtFilterFieldDefaultDataSource(TEST_DATA);

  label = 'Filter by';
}
