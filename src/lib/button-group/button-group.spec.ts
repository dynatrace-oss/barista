// tslint:disable no-lifecycle-call no-use-before-declare no-magic-numbers
// tslint:disable no-any max-file-line-count no-unbound-method use-component-selector

import { Component, DebugElement } from '@angular/core';
import { async, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import {
  DtButtonGroup,
  DtButtonGroupItem,
  DtButtonGroupModule,
} from '@dynatrace/angular-components';
import { createComponent } from '../../testing/create-component';

describe('DtButtonGroup', () => {
  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [DtButtonGroupModule],
      declarations: [
        TestAppButtonGroup,
        TestAppButtonGroupWithSelection,
        TestAppButtonGroupWithSelection2,
      ],
    });

    TestBed.compileComponents();
  }));

  describe('button-group', () => {
    let fixture;
    let groupDebugElement: DebugElement;

    let groupInstance: DtButtonGroup<string>;
    let itemInstances: Array<DtButtonGroupItem<string>>;

    let itemDebugElements: DebugElement[];
    let itemHtmlElements: HTMLElement[];

    beforeEach(async(() => {
      fixture = createComponent(TestAppButtonGroup);

      groupDebugElement = fixture.debugElement.query(
        By.css('.dt-button-group')
      );
      groupInstance = groupDebugElement.componentInstance;

      itemDebugElements = fixture.debugElement.queryAll(
        By.css('.dt-button-group-item')
      );
      itemHtmlElements = itemDebugElements.map(
        (debugEl: DebugElement) => debugEl.nativeElement
      );
      itemInstances = itemDebugElements.map(
        (debugEl: DebugElement) => debugEl.componentInstance
      );
    }));

    it('should exist', () => {
      expect(groupInstance).toBeTruthy();
    });

    it('has items', () => {
      expect(itemInstances).toBeTruthy();
      expect(itemInstances.length).toBeGreaterThan(1);
    });

    it('should set individual button names based on the template name', () => {
      expect(itemInstances[0].value).toBe('Performance');
      expect(itemInstances[1].value).toBe('Connectivity');
      expect(itemInstances[2].value).toBe('Failure rate');
    });

    it('should have a default selection', () => {
      expect(groupInstance.value).toBe('Performance');
    });

    it('should have a value after selections', () => {
      const item = fixture.debugElement.nativeElement.querySelector(
        'dt-button-group-item:nth-child(2)'
      );
      item.click();

      expect(groupInstance.value).toBe('Connectivity');
      expect(itemInstances[1].selected).toBe(true);
    });

    it('should have item selected', () => {
      expect(itemInstances[1].selected).toBe(false);

      groupInstance.value = 'Connectivity';
      expect(itemInstances[1].selected).toBe(true);
    });

    it('should have item disabled when group disabled', () => {
      expect(itemInstances[1].disabled).toBe(false);
      groupInstance.disabled = true;

      expect(itemInstances[1].disabled).toBe(true);
    });

    it('should disable click interaction when the group is disabled', () => {
      groupInstance.disabled = true;

      itemHtmlElements[1].click();
      fixture.detectChanges();

      expect(itemInstances[1].selected).toBe(false);
    });

    it('should fire valueChange event', () => {
      const spy = jasmine.createSpy(`onChangeSpy 0 for ${groupInstance}`);
      groupInstance.valueChange.subscribe(spy);

      itemHtmlElements[1].click();
      fixture.detectChanges();

      expect(spy).toHaveBeenCalled();

      itemHtmlElements[1].click();
      fixture.detectChanges();

      // To match the native radio button behavior, the change event shouldn't
      // be triggered when the radio got unselected.
      expect(spy).toHaveBeenCalledTimes(1);
    });

    it('should clear selections when clearing the group', () => {
      groupInstance.value = 'Connectivity';
      expect(itemInstances[1].selected).toBe(true);
    });
  });

  describe('button-group-with-selection', () => {
    let fixture;

    let groupDebugElement: DebugElement;

    let groupInstance: DtButtonGroup<string>;
    let itemInstances: Array<DtButtonGroupItem<string>>;

    let itemDebugElements: DebugElement[];

    beforeEach(async(() => {
      fixture = createComponent(TestAppButtonGroupWithSelection);

      groupDebugElement = fixture.debugElement.query(
        By.css('.dt-button-group')
      );
      groupInstance = groupDebugElement.injector.get<DtButtonGroup<string>>(
        DtButtonGroup
      );

      itemDebugElements = fixture.debugElement.queryAll(
        By.css('.dt-button-group-item')
      );
      itemInstances = itemDebugElements.map(
        (debugEl: DebugElement) => debugEl.componentInstance
      );
    }));

    it('should have a value', () => {
      fixture.detectChanges();
      expect(groupInstance.value).toBe('Connectivity');
    });

    it('should have item selected', () => {
      expect(itemInstances[1].selected).toBe(true);
    });
  });

  describe('button-group-with-selection2', () => {
    let fixture;

    let groupDebugElement: DebugElement;

    let groupInstance: DtButtonGroup<string>;
    let itemInstances: Array<DtButtonGroupItem<string>>;

    beforeEach(async(() => {
      fixture = createComponent(TestAppButtonGroupWithSelection2);

      groupDebugElement = fixture.debugElement.query(
        By.directive(DtButtonGroup)
      );
      groupInstance = groupDebugElement.injector.get<DtButtonGroup<string>>(
        DtButtonGroup
      );

      const itemDebugElements = fixture.debugElement.queryAll(
        By.directive(DtButtonGroupItem)
      );
      itemInstances = itemDebugElements.map(
        (debugEl: DebugElement) => debugEl.componentInstance
      );
    }));

    it('should have a value', () => {
      expect(groupInstance.value).toBe('Connectivity');
    });

    it('should have item selected', () => {
      fixture.detectChanges();
      expect(itemInstances[1].selected).toBe(true);
    });
  });
});

@Component({
  selector: 'dt-test-app',
  template: `
    <dt-button-group>
      <dt-button-group-item value="Performance">
        Performance
      </dt-button-group-item>
      <dt-button-group-item value="Connectivity">
        Connectivity
      </dt-button-group-item>
      <dt-button-group-item value="Failure rate">
        Failure rate
      </dt-button-group-item>
    </dt-button-group>
  `,
})
class TestAppButtonGroup {}

@Component({
  selector: 'dt-test-app-selection',
  template: `
    <dt-button-group>
      <dt-button-group-item [selected]="false" value="Performance">
        Performance
      </dt-button-group-item>
      <dt-button-group-item [selected]="true" value="Connectivity">
        Connectivity
      </dt-button-group-item>
      <dt-button-group-item [selected]="false" value="Failure rate">
        Failure rate
      </dt-button-group-item>
    </dt-button-group>
  `,
})
class TestAppButtonGroupWithSelection {}

@Component({
  selector: 'dt-test-app-selection2',
  template: `
    <dt-button-group [value]="'Connectivity'">
      <dt-button-group-item value="Performance">
        Performance
      </dt-button-group-item>
      <dt-button-group-item value="Connectivity">
        Connectivity
      </dt-button-group-item>
      <dt-button-group-item value="Failure rate">
        Failure rate
      </dt-button-group-item>
    </dt-button-group>
  `,
})
class TestAppButtonGroupWithSelection2 {}
