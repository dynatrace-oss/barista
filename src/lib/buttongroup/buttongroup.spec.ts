import {async, TestBed} from '@angular/core/testing';
import {Component, DebugElement} from '@angular/core';
import {By} from '@angular/platform-browser';
import {DtButtongroup, DtButtongroupItem, DtButtongroupModule} from '@dynatrace/angular-components/buttongroup';

describe('DtButtongroup', () => {

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [DtButtongroupModule],
      declarations: [TestAppButtongroup, TestAppButtongroupWithSelection, TestAppButtongroupWithSelection2],
    });

    TestBed.compileComponents();
  }));

  describe('buttongroup', () => {

    let fixture;
    let testComponent: TestAppButtongroup;

    let groupDebugElement: DebugElement;

    let groupInstance: DtButtongroup<string>;
    let itemInstances: DtButtongroupItem<string>[];

    let itemDebugElements: DebugElement[];
    let itemHtmlElements: HTMLElement[];

    beforeEach(async(() => {
      fixture = TestBed.createComponent(TestAppButtongroup);
      fixture.detectChanges();

      testComponent = fixture.debugElement.componentInstance;

      groupDebugElement = fixture.debugElement.query(By.directive(DtButtongroup));
      groupInstance = groupDebugElement.injector.get<DtButtongroup<string>>(DtButtongroup);

      itemDebugElements = fixture.debugElement.queryAll(By.directive(DtButtongroupItem));
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
      for (const item of itemInstances) {
        expect(item.value).toBe(testComponent.values[i++][0]);
      }
    });

    it('should have a value after selections', () => {

      expect(groupInstance.value).toBe(undefined);
      itemInstances[1]._selectViaInteraction();
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
  });

  describe('buttongroup-with-selection', () => {
    let fixture;
    let testComponent: TestAppButtongroupWithSelection;

    let groupDebugElement: DebugElement;

    let groupInstance: DtButtongroup<string>;
    let itemInstances: DtButtongroupItem<string>[];

    let itemDebugElements: DebugElement[];
    let itemHtmlElements: HTMLElement[];

    beforeEach(async(() => {
      fixture = TestBed.createComponent(TestAppButtongroupWithSelection);
      fixture.detectChanges();

      testComponent = fixture.debugElement.componentInstance;

      groupDebugElement = fixture.debugElement.query(By.directive(DtButtongroup));
      groupInstance = groupDebugElement.injector.get<DtButtongroup<string>>(DtButtongroup);

      itemDebugElements = fixture.debugElement.queryAll(By.directive(DtButtongroupItem));
      itemHtmlElements = itemDebugElements.map(debugEl => debugEl.nativeElement);
      itemInstances = itemDebugElements.map(debugEl => debugEl.componentInstance);
    }));

    it('should have a value',() => {
      expect(groupInstance.value).toBe('Connectivity');
    });
    it('should have item selected', () => {
      expect(itemInstances[1].selected).toBe(true);
    });

  });

  describe('buttongroup-with-selection2', () => {
    let fixture;
    let testComponent: TestAppButtongroupWithSelection2;

    let groupDebugElement: DebugElement;

    let groupInstance: DtButtongroup<string>;
    let itemInstances: DtButtongroupItem<string>[];

    let itemDebugElements: DebugElement[];
    let itemHtmlElements: HTMLElement[];

    beforeEach(async(() => {
      fixture = TestBed.createComponent(TestAppButtongroupWithSelection2);
      fixture.detectChanges();

      testComponent = fixture.debugElement.componentInstance;

      groupDebugElement = fixture.debugElement.query(By.directive(DtButtongroup));
      groupInstance = groupDebugElement.injector.get<DtButtongroup<string>>(DtButtongroup);

      itemDebugElements = fixture.debugElement.queryAll(By.directive(DtButtongroupItem));
      itemHtmlElements = itemDebugElements.map(debugEl => debugEl.nativeElement);
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
  <dt-buttongroup>
    <dt-buttongroup-item *ngFor="let value of values" [value]="value[0]">{{value[0]}}</dt-buttongroup-item>
  </dt-buttongroup>
  `
})
class TestAppButtongroup {
  values = values;
}

@Component({
  selector: 'dt-test-app-selection',
  template: `
  <dt-buttongroup>
    <dt-buttongroup-item *ngFor="let value of values" [value]="value[0]" [selected]="value[1]">{{value[0]}}</dt-buttongroup-item>
  </dt-buttongroup>
  `
})
class TestAppButtongroupWithSelection {
  values = values;
}

@Component({
  selector: 'dt-test-app-selection2',
  template: `
  <dt-buttongroup [value]="values[1][0]">
    <dt-buttongroup-item *ngFor="let value of values" [value]="value[0]">{{value[0]}}</dt-buttongroup-item>
  </dt-buttongroup>
  `
})
class TestAppButtongroupWithSelection2 {
  values = values;
}
