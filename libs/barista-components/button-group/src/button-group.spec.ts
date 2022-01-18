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

import { Component, DebugElement } from '@angular/core';
import { TestBed, waitForAsync } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { DtButtonGroupModule } from './button-group-module';
import { createComponent } from '@dynatrace/testing/browser';
import { DtButtonGroup, DtButtonGroupItem } from './button-group';

describe('DtButtonGroup', () => {
  beforeEach(
    waitForAsync(() => {
      TestBed.configureTestingModule({
        imports: [DtButtonGroupModule],
        declarations: [
          TestAppButtonGroup,
          TestAppButtonGroupWithSelection,
          TestAppButtonGroupWithSelection2,
        ],
      });

      TestBed.compileComponents();
    }),
  );

  describe('button-group', () => {
    let fixture;
    let groupDebugElement: DebugElement;

    let groupInstance: DtButtonGroup<string>;
    let itemInstances: Array<DtButtonGroupItem<string>>;

    let itemDebugElements: DebugElement[];
    let itemHtmlElements: HTMLElement[];

    beforeEach(
      waitForAsync(() => {
        fixture = createComponent(TestAppButtonGroup);

        groupDebugElement = fixture.debugElement.query(
          By.css('.dt-button-group'),
        );
        groupInstance = groupDebugElement.componentInstance;

        itemDebugElements = fixture.debugElement.queryAll(
          By.css('.dt-button-group-item'),
        );
        itemHtmlElements = itemDebugElements.map(
          (debugEl: DebugElement) => debugEl.nativeElement,
        );
        itemInstances = itemDebugElements.map(
          (debugEl: DebugElement) => debugEl.componentInstance,
        );
      }),
    );

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
        'dt-button-group-item:nth-child(2)',
      );
      item.click();

      expect(groupInstance.value).toBe('Connectivity');
      expect(itemInstances[1].checked).toBe(true);
    });

    it('should have item selected', () => {
      expect(itemInstances[1].checked).toBe(false);

      groupInstance.value = 'Connectivity';
      expect(itemInstances[1].checked).toBe(true);
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

      expect(itemInstances[1].checked).toBe(false);
    });

    it('should fire valueChange event', () => {
      const spy = jest.fn();
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
      expect(itemInstances[1].checked).toBe(true);
    });
  });

  describe('button-group-with-selection', () => {
    let fixture;

    let groupDebugElement: DebugElement;

    let groupInstance: DtButtonGroup<string>;
    let itemInstances: Array<DtButtonGroupItem<string>>;

    let itemDebugElements: DebugElement[];

    beforeEach(
      waitForAsync(() => {
        fixture = createComponent(TestAppButtonGroupWithSelection);

        groupDebugElement = fixture.debugElement.query(
          By.css('.dt-button-group'),
        );
        groupInstance =
          groupDebugElement.injector.get<DtButtonGroup<string>>(DtButtonGroup);

        itemDebugElements = fixture.debugElement.queryAll(
          By.css('.dt-button-group-item'),
        );
        itemInstances = itemDebugElements.map(
          (debugEl: DebugElement) => debugEl.componentInstance,
        );
      }),
    );

    it('should have a value', () => {
      fixture.detectChanges();
      expect(groupInstance.value).toBe('Connectivity');
    });

    it('should have item selected', () => {
      expect(itemInstances[1].checked).toBe(true);
    });
  });

  describe('button-group-with-selection2', () => {
    let fixture;

    let groupDebugElement: DebugElement;

    let groupInstance: DtButtonGroup<string>;
    let itemInstances: Array<DtButtonGroupItem<string>>;

    beforeEach(
      waitForAsync(() => {
        fixture = createComponent(TestAppButtonGroupWithSelection2);

        groupDebugElement = fixture.debugElement.query(
          By.directive(DtButtonGroup),
        );
        groupInstance =
          groupDebugElement.injector.get<DtButtonGroup<string>>(DtButtonGroup);

        const itemDebugElements = fixture.debugElement.queryAll(
          By.directive(DtButtonGroupItem),
        );
        itemInstances = itemDebugElements.map(
          (debugEl: DebugElement) => debugEl.componentInstance,
        );
      }),
    );

    it('should have a value', () => {
      expect(groupInstance.value).toBe('Connectivity');
    });

    it('should have item selected', () => {
      fixture.detectChanges();
      expect(itemInstances[1].checked).toBe(true);
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
      <dt-button-group-item [checked]="false" value="Performance">
        Performance
      </dt-button-group-item>
      <dt-button-group-item [checked]="true" value="Connectivity">
        Connectivity
      </dt-button-group-item>
      <dt-button-group-item [checked]="false" value="Failure rate">
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
