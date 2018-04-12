import {async, TestBed} from '@angular/core/testing';
import {Component, DebugElement} from '@angular/core';
import {By} from '@angular/platform-browser';
import {DtButtonToggle, DtButtonToggleItem, DtButtonToggleModule} from '@dynatrace/angular-components/button-toggle';

describe('DtButtonToggle', () => {

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [DtButtonToggleModule],
      declarations: [TestAppButtonToggle, TestAppButtonToggleWithSelection, TestAppButtonToggleWithSelection2],
    });

    TestBed.compileComponents();
  }));

  describe('button-toggle', () => {

    let fixture;
    let testComponent: TestAppButtonToggle;

    let groupDebugElement: DebugElement;

    let groupInstance: DtButtonToggle<string>;
    let itemInstances: DtButtonToggleItem<string>[];

    let itemDebugElements: DebugElement[];
    let itemHtmlElements: HTMLElement[];

    beforeEach(async(() => {
      fixture = TestBed.createComponent(TestAppButtonToggle);
      fixture.detectChanges();

      testComponent = fixture.debugElement.componentInstance;

      groupDebugElement = fixture.debugElement.query(By.directive(DtButtonToggle));
      groupInstance = groupDebugElement.injector.get<DtButtonToggle<string>>(DtButtonToggle);

      itemDebugElements = fixture.debugElement.queryAll(By.directive(DtButtonToggleItem));
      itemHtmlElements = itemDebugElements.map(debugEl => debugEl.nativeElement);
      itemInstances = itemDebugElements.map(debugEl => debugEl.componentInstance);
    }));

    it('should exist', () => {
      expect(groupInstance).toBeTruthy();
    });

    it('has items', () => {
      expect(itemInstances).toBeTruthy();
      expect(itemInstances.length).toBeGreaterThan(1);
    });

    it('should set individual button names based on the template name', () => {

      let i = 0;
      itemInstances.forEach((item, i) =>
        expect(item.value).toBe(testComponent.values[i][0])
      );
    });

    it('should have a value after selections', () => {

      expect(groupInstance.value).toBe(undefined);

      let item = fixture.debugElement.nativeElement.querySelector('dt-button-toggle-item:nth-child(2)');
      item.click();

      expect(groupInstance.value).toBe(testComponent.values[1][0]);
      expect(itemInstances[1].selected).toBe(true);
    });

    it('should have item selected', () => {
      expect(itemInstances[1].selected).toBe(false);

      groupInstance.selectValue(testComponent.values[1][0]);
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

      const spy = jasmine.createSpy('onChangeSpy 0 for ${groupInstance}');
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
      groupInstance.selectValue(testComponent.values[1][0]);
      expect(itemInstances[1].selected).toBe(true);

      groupInstance.clearSelection();
      expect(itemInstances[1].selected).toBe(false);
    });
    it('should find value with compareWith',() => {
      groupInstance.selectValue('F');
      expect(groupInstance.value).toBe(undefined);

      groupInstance.compareWith = (s1: string, s2: string) => s1.startsWith(s2) || s2.startsWith(s1);
      groupInstance.selectValue('F');
      expect(groupInstance.value).toBe('Failure rate');
    });
  });

  describe('button-toggle-with-selection', () => {
    let fixture;
    let testComponent: TestAppButtonToggleWithSelection;

    let groupDebugElement: DebugElement;

    let groupInstance: DtButtonToggle<string>;
    let itemInstances: DtButtonToggleItem<string>[];

    let itemDebugElements: DebugElement[];

    beforeEach(async(() => {
      fixture = TestBed.createComponent(TestAppButtonToggleWithSelection);
      fixture.detectChanges();

      testComponent = fixture.debugElement.componentInstance;

      groupDebugElement = fixture.debugElement.query(By.directive(DtButtonToggle));
      groupInstance = groupDebugElement.injector.get<DtButtonToggle<string>>(DtButtonToggle);

      itemDebugElements = fixture.debugElement.queryAll(By.directive(DtButtonToggleItem));
      itemInstances = itemDebugElements.map(debugEl => debugEl.componentInstance);
    }));

    it('should have a value',() => {
      expect(groupInstance.value).toBe('Connectivity');
    });
    it('should have item selected', () => {
      expect(itemInstances[1].selected).toBe(true);
    });
  });

  describe('button-toggle-with-selection2', () => {
    let fixture;
    let testComponent: TestAppButtonToggleWithSelection2;

    let groupDebugElement: DebugElement;

    let groupInstance: DtButtonToggle<string>;
    let itemInstances: DtButtonToggleItem<string>[];

    beforeEach(async(() => {
      fixture = TestBed.createComponent(TestAppButtonToggleWithSelection2);
      fixture.detectChanges();

      testComponent = fixture.debugElement.componentInstance;

      groupDebugElement = fixture.debugElement.query(By.directive(DtButtonToggle));
      groupInstance = groupDebugElement.injector.get<DtButtonToggle<string>>(DtButtonToggle);

      const itemDebugElements = fixture.debugElement.queryAll(By.directive(DtButtonToggleItem));
      itemInstances = itemDebugElements.map(debugEl => debugEl.componentInstance);
    }));

    it('should have a value',() => {
      expect(groupInstance.value).toBe('Connectivity');
    });
    it('should have item selected', () => {
      expect(itemInstances[1].selected).toBe(true);
    });
  });
});

const values : [string, boolean][] = [['Performance', false], ['Connectivity', true], ['Failure rate', false]];

@Component({
  selector: 'dt-test-app',
  template: `
    <dt-button-toggle>
      <dt-button-toggle-item *ngFor="let value of values" [value]="value[0]">{{value[0]}}</dt-button-toggle-item>
    </dt-button-toggle>
  `
})
class TestAppButtonToggle {
  values = values;
}

@Component({
  selector: 'dt-test-app-selection',
  template: `
    <dt-button-toggle>
      <dt-button-toggle-item *ngFor="let value of values" [value]="value[0]" [selected]="value[1]">{{value[0]}}
      </dt-button-toggle-item>
    </dt-button-toggle>
  `
})
class TestAppButtonToggleWithSelection {
  values = values;
}

@Component({
  selector: 'dt-test-app-selection2',
  template: `
    <dt-button-toggle [value]="values[1][0]">
      <dt-button-toggle-item *ngFor="let value of values" [value]="value[0]">{{value[0]}}</dt-button-toggle-item>
    </dt-button-toggle>
  `
})
class TestAppButtonToggleWithSelection2 {
  values = values;
}
