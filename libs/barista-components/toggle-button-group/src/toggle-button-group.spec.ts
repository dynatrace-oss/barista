/**
 * @license
 * Copyright 2021 Dynatrace LLC
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
import {
  ComponentFixture,
  TestBed,
  fakeAsync,
  waitForAsync,
} from '@angular/core/testing';
import { By } from '@angular/platform-browser';

import { DtToggleButtonGroupModule } from './toggle-button-group-module';

import { createComponent } from '@dynatrace/testing/browser';
import { DtToggleButtonGroup } from './toggle-button-group';
import { DtToggleButtonItem } from './toggle-button-item';

describe('DtToggleButtonGroup', () => {
  beforeEach(
    waitForAsync(() => {
      TestBed.configureTestingModule({
        imports: [DtToggleButtonGroupModule],
        declarations: [
          SimpleToggleButtonGroupTestApp,
          OneSelectedToggleButtonGroupTestApp,
          OneDisabledToggleButtonGroupTestApp,
          PropertybindingToggleButtonGroupTestApp,
          AriaAttributesToggleButtonGroupTestApp,
          DynamicButtonsToggleButtonGroupTestApp,
        ],
      });

      TestBed.compileComponents();
    }),
  );

  describe('with basic behavior', () => {
    let fixture: ComponentFixture<SimpleToggleButtonGroupTestApp>;
    let element: HTMLElement;
    let component: DtToggleButtonGroup<string>;
    let itemElements: DebugElement[];
    let itemComponents: Array<DtToggleButtonItem<string>>;

    beforeEach(() => {
      fixture = createComponent(SimpleToggleButtonGroupTestApp);
      fixture.detectChanges();
      element = fixture.nativeElement;
      component = fixture.debugElement.query(
        By.css('.dt-toggle-button-group'),
      ).componentInstance;
      itemElements = fixture.debugElement.queryAll(
        By.css('.dt-toggle-button-item'),
      );
      itemComponents = itemElements.map((debugEl) => debugEl.componentInstance);
    });

    it('should exist', () => {
      expect(element).toBeTruthy();
    });

    it('should the correct number of items', () => {
      expect(itemComponents).toBeTruthy();
      expect(itemComponents.length).toBe(2);
    });

    it('should not have a selected item initially', () => {
      expect(component.selectedItem).toBe(null);
    });

    it('should not have a value initially', () => {
      expect(component.value).toBe(null);
    });

    it('should have a value after an element has been clicked', () => {
      const item = fixture.debugElement.queryAll(
        By.css('.dt-toggle-button-item'),
      )[0];
      item.nativeElement.click();
      fixture.detectChanges();

      expect(component.value).toBe('One');
      expect(item.nativeElement.hasAttribute('aria-checked')).toBeTruthy();
      expect(item.nativeElement.getAttribute('aria-checked')).toBe('true');
    });

    it('should have no value after an element has been clicked twice', () => {
      const item = fixture.debugElement.queryAll(
        By.css('.dt-toggle-button-item'),
      )[0];
      item.nativeElement.click();
      fixture.detectChanges();
      item.nativeElement.click();
      fixture.detectChanges();

      expect(component.value).toBe(null);
      expect(item.nativeElement.hasAttribute('aria-checked')).toBeTruthy();
      expect(item.nativeElement.getAttribute('aria-checked')).toBe('false');
    });

    it('should have one item selected after calling it programmatically', () => {
      const item = fixture.debugElement.queryAll(
        By.css('.dt-toggle-button-item'),
      )[0];
      item.componentInstance.select();
      fixture.detectChanges();

      expect(component.value).toBe('One');
      expect(item.nativeElement.hasAttribute('aria-checked')).toBeTruthy();
    });

    it('should have no item selected after calling deselect on selected item programmatically', () => {
      const item = fixture.debugElement.queryAll(
        By.css('.dt-toggle-button-item'),
      )[0];
      item.componentInstance.select();
      fixture.detectChanges();

      item.componentInstance.deselect();
      fixture.detectChanges();

      expect(component.value).toBe(null);
      expect(item.nativeElement.hasAttribute('aria-checked')).toBeTruthy();
      expect(item.nativeElement.getAttribute('aria-checked')).toBe('false');
    });

    it('should have only one item selected after selecting an item programmatically', () => {
      const items = fixture.debugElement.queryAll(
        By.css('.dt-toggle-button-item'),
      );
      items[0].componentInstance.select();
      fixture.detectChanges();

      const selected = items
        .map((item) =>
          item.nativeElement.classList.contains(
            'dt-toggle-button-item-selected',
          ),
        )
        .filter(Boolean);
      expect(selected.length).toBe(1);
    });

    it('should have only one item selected after selecting another than the selected item via interaction', () => {
      const items = fixture.debugElement.queryAll(
        By.css('.dt-toggle-button-item'),
      );
      items[0].nativeElement.click();
      fixture.detectChanges();

      items[1].nativeElement.click();
      fixture.detectChanges();

      const selected = items
        .map((item) =>
          item.nativeElement.classList.contains(
            'dt-toggle-button-item-selected',
          ),
        )
        .filter(Boolean);
      expect(selected.length).toBe(1);
    });

    it('should have only one item selected after selecting another than the selected item programmatically', () => {
      const items = fixture.debugElement.queryAll(
        By.css('.dt-toggle-button-item'),
      );
      items[0].componentInstance.select();
      fixture.detectChanges();

      items[1].componentInstance.select();
      fixture.detectChanges();

      const selected = items
        .map((item) =>
          item.nativeElement.classList.contains(
            'dt-toggle-button-item-selected',
          ),
        )
        .filter(Boolean);
      expect(selected.length).toBe(1);
    });

    it('should reflect the value of the selected item after selecting an item other than the currently selected', () => {
      const items = fixture.debugElement.queryAll(
        By.css('.dt-toggle-button-item'),
      );
      items[0].componentInstance.select();
      fixture.detectChanges();

      items[1].componentInstance.select();
      fixture.detectChanges();

      expect(component.value).toBe('Two');
    });
  });

  describe('with a preselected item', () => {
    let fixture: ComponentFixture<OneSelectedToggleButtonGroupTestApp>;
    let component: DtToggleButtonGroup<string>;

    beforeEach(() => {
      fixture = createComponent(OneSelectedToggleButtonGroupTestApp);
      fixture.detectChanges();
      component = fixture.debugElement.query(
        By.css('.dt-toggle-button-group'),
      ).componentInstance;
    });

    it('should have a value on the group already', () => {
      expect(component.value).toBe('One');
    });

    it('should have a selectedItem on the group already', fakeAsync(() => {
      expect(component.selectedItem).not.toBe(null);
    }));
  });

  describe('with dynamically added/removed items', () => {
    let fixture: ComponentFixture<DynamicButtonsToggleButtonGroupTestApp>;
    let component: DtToggleButtonGroup<string>;

    beforeEach(() => {
      fixture = createComponent(DynamicButtonsToggleButtonGroupTestApp);
      fixture.detectChanges();
      component = fixture.debugElement.query(
        By.css('.dt-toggle-button-group'),
      ).componentInstance;
    });

    it('should have a value on the group already', () => {
      expect(component.value).toBe(null);
    });

    it('should have a selectedItem on the group already', () => {
      expect(component.selectedItem).toBe(null);
    });

    it('should leave value unchanged if unselected item is added', () => {
      fixture.componentInstance.showsButton = true;
      fixture.detectChanges();
      expect(component.value).toBe(null);
    });

    it('should set value to the correctly when a selected item is added', () => {
      fixture.componentInstance.showsButton = true;
      fixture.componentInstance.isSelected = true;
      fixture.detectChanges();
      expect(component.value).toBe('One');
    });

    it('should reset value to null if selected item is removed', () => {
      fixture.componentInstance.showsButton = true;
      fixture.componentInstance.isSelected = true;
      fixture.detectChanges();
      fixture.componentInstance.showsButton = false;
      fixture.detectChanges();
      expect(component.value).toBe(null);
    });
  });

  describe('with disabled set in the template', () => {
    let fixture: ComponentFixture<OneDisabledToggleButtonGroupTestApp>;
    let component: DtToggleButtonGroup<string>;

    beforeEach(() => {
      fixture = createComponent(OneDisabledToggleButtonGroupTestApp);
      fixture.detectChanges();
      component = fixture.debugElement.query(
        By.css('.dt-toggle-button-group'),
      ).componentInstance;
    });

    it('should disable the first item', () => {
      const item = fixture.debugElement.queryAll(
        By.css('.dt-toggle-button-item'),
      )[0];
      expect(item.nativeElement.hasAttribute('disabled')).toBeTruthy();
    });

    it('should disable the second item', () => {
      const item = fixture.debugElement.queryAll(
        By.css('.dt-toggle-button-item'),
      )[1];
      expect(item.nativeElement.hasAttribute('disabled')).toBeFalsy();
    });

    it('should not mark a disabled item as selected', () => {
      const item = fixture.debugElement.queryAll(
        By.css('.dt-toggle-button-item'),
      )[0];
      item.nativeElement.click();
      fixture.detectChanges();
      expect(item.nativeElement.hasAttribute('aria-checked')).toBeTruthy();
      expect(item.nativeElement.getAttribute('aria-checked')).toBe('false');
      expect(component.value).toBe(null);
    });

    it('should not mark a disabled item as selected (programmatically)', () => {
      const item = fixture.debugElement.queryAll(
        By.css('.dt-toggle-button-item'),
      )[0];
      item.componentInstance.select();
      fixture.detectChanges();
      expect(item.nativeElement.hasAttribute('aria-checked')).toBeTruthy();
      expect(item.nativeElement.getAttribute('aria-checked')).toBe('false');
      expect(component.value).toBe(null);
    });

    it('should not focus a disabled item', () => {
      const item = fixture.debugElement.queryAll(
        By.css('.dt-toggle-button-item'),
      )[0];
      expect(document.activeElement).not.toBe(item.nativeElement);

      item.nativeElement.click();
      fixture.detectChanges();

      expect(document.activeElement).not.toBe(item.nativeElement);
    });

    it('should not focus a disabled item (programmatically)', () => {
      const item = fixture.debugElement.queryAll(
        By.css('.dt-toggle-button-item'),
      )[0];
      expect(document.activeElement).not.toBe(item.nativeElement);

      item.componentInstance.focus();
      fixture.detectChanges();

      expect(document.activeElement).not.toBe(item.nativeElement);
    });
  });

  describe('with bound properties', () => {
    let fixture: ComponentFixture<PropertybindingToggleButtonGroupTestApp>;
    let component: DtToggleButtonGroup<string>;

    beforeEach(() => {
      fixture = createComponent(PropertybindingToggleButtonGroupTestApp);
      fixture.detectChanges();
      component = fixture.debugElement.query(
        By.css('.dt-toggle-button-group'),
      ).componentInstance;
    });

    it('should have the second item disabled on bound property initially', () => {
      const item = fixture.debugElement.queryAll(
        By.css('.dt-toggle-button-item'),
      )[1];
      expect(item.nativeElement.hasAttribute('disabled')).toBeTruthy();
    });

    it('should have the second item enabled after bound property is set to false', () => {
      const item = fixture.debugElement.queryAll(
        By.css('.dt-toggle-button-item'),
      )[1];
      fixture.componentInstance.testAppDisabled = false;
      fixture.detectChanges();
      expect(item.nativeElement.hasAttribute('disabled')).toBeFalsy();
    });

    it('should have the first item marked as selected', () => {
      const item = fixture.debugElement.queryAll(
        By.css('.dt-toggle-button-item'),
      )[0];

      expect(item.nativeElement.hasAttribute('aria-checked')).toBeTruthy();
      expect(item.nativeElement.getAttribute('aria-checked')).toBe('true');
      expect(component.value).toBe('One');
      expect(component.selectedItem).not.toBe(null);
    });
  });

  describe('with aria attributes', () => {
    let fixture: ComponentFixture<AriaAttributesToggleButtonGroupTestApp>;

    beforeEach(() => {
      fixture = createComponent(AriaAttributesToggleButtonGroupTestApp);
      fixture.detectChanges();
    });

    it('should have aria-label reflected on the item', () => {
      const item = fixture.debugElement.queryAll(
        By.css('.dt-toggle-button-item'),
      )[0];
      expect(item.nativeElement.hasAttribute('aria-label')).toBeTruthy();
      expect(item.nativeElement.getAttribute('aria-label')).toBe(
        'This is the label for one',
      );
    });

    it('should not reflect aria-label if it is not set', () => {
      const item = fixture.debugElement.queryAll(
        By.css('.dt-toggle-button-item'),
      )[1];
      expect(item.nativeElement.hasAttribute('aria-label')).toBeFalsy();
    });

    it('should have aria-labelledby reflected on the item', () => {
      const item = fixture.debugElement.queryAll(
        By.css('.dt-toggle-button-item'),
      )[1];
      expect(item.nativeElement.hasAttribute('aria-labelledby')).toBeTruthy();
      expect(item.nativeElement.getAttribute('aria-labelledby')).toBe(
        'labelfortwo',
      );
    });

    it('should not reflect aria-labelledby if it is not set', () => {
      const item = fixture.debugElement.queryAll(
        By.css('.dt-toggle-button-item'),
      )[0];
      expect(item.nativeElement.hasAttribute('aria-labelledby')).toBeFalsy();
    });

    it('should have aria-describedby reflected on the item', () => {
      const item = fixture.debugElement.queryAll(
        By.css('.dt-toggle-button-item'),
      )[2];
      expect(item.nativeElement.hasAttribute('aria-describedby')).toBeTruthy();
      expect(item.nativeElement.getAttribute('aria-describedby')).toBe(
        'descriptionforthree',
      );
    });

    it('should not reflect aria-describedby if it is not set', () => {
      const item = fixture.debugElement.queryAll(
        By.css('.dt-toggle-button-item'),
      )[0];
      expect(item.nativeElement.hasAttribute('aria-describedby')).toBeFalsy();
    });
  });

  describe('with focus management', () => {
    let fixture: ComponentFixture<SimpleToggleButtonGroupTestApp>;

    beforeEach(() => {
      fixture = createComponent(SimpleToggleButtonGroupTestApp);
      fixture.detectChanges();
    });

    it('should let the item be focussable', () => {
      const item = fixture.debugElement.queryAll(
        By.css('.dt-toggle-button-item'),
      )[0];
      expect(document.activeElement).not.toBe(item.nativeElement);

      item.componentInstance.focus();
      fixture.detectChanges();

      expect(document.activeElement).toBe(item.nativeElement);
    });
  });
});

/** Test component that contains an DtToggleButtonGroup. */
@Component({
  selector: 'dt-simple-toggle-button-group-test-app',
  template: `
    <dt-toggle-button-group>
      <button dt-toggle-button-item value="One">One</button>
      <button dt-toggle-button-item value="Two">Two</button>
    </dt-toggle-button-group>
  `,
})
class SimpleToggleButtonGroupTestApp {}

/** Test component that contains an DtToggleButtonGroup where one item is preselected. */
@Component({
  selector: 'dt-oneselected-toggle-button-group-test-app',
  template: `
    <dt-toggle-button-group>
      <button dt-toggle-button-item value="One" selected>One</button>
      <button dt-toggle-button-item value="Two">Two</button>
    </dt-toggle-button-group>
  `,
})
class OneSelectedToggleButtonGroupTestApp {}

/** Test component that contains an DtToggleButtonGroup where one item is preselected. */
@Component({
  selector: 'dt-dynamicbuttons-toggle-button-group-test-app',
  template: `
    <dt-toggle-button-group>
      <button
        dt-toggle-button-item
        value="One"
        *ngIf="showsButton"
        [selected]="isSelected"
      >
        One
      </button>
    </dt-toggle-button-group>
  `,
})
class DynamicButtonsToggleButtonGroupTestApp {
  showsButton = false;
  isSelected = false;
}

/** Test component that contains an DtToggleButtonGroup where one item is disabled. */
@Component({
  selector: 'dt-onedisabled-toggle-button-group-test-app',
  template: `
    <dt-toggle-button-group>
      <button dt-toggle-button-item value="One" disabled>One</button>
      <button dt-toggle-button-item value="Two">Two</button>
    </dt-toggle-button-group>
  `,
})
class OneDisabledToggleButtonGroupTestApp {}

/** Test component that contains an DtToggleButtonGroup where selected and disabled are bound properties. */
@Component({
  selector: 'dt-propertybinding-toggle-button-group-test-app',
  template: `
    <dt-toggle-button-group>
      <button dt-toggle-button-item value="One" [selected]="testAppSelected">
        One
      </button>
      <button dt-toggle-button-item value="Two" [disabled]="testAppDisabled">
        Two
      </button>
    </dt-toggle-button-group>
  `,
})
class PropertybindingToggleButtonGroupTestApp {
  testAppSelected = true;
  testAppDisabled = true;
}

/** Test component that contains an DtToggleButtonGroup where aria-label, aria-labelledby and aria-describedby are reflected. */
@Component({
  selector: 'dt-aria-attributes-toggle-button-group-test-app',
  template: `
    <span id="labelfortwo">This is the label for two</span>
    <span id="descriptionforthree">This is the description for three</span>
    <dt-toggle-button-group>
      <button
        dt-toggle-button-item
        value="One"
        aria-label="This is the label for one"
      >
        One
      </button>
      <button dt-toggle-button-item value="Two" aria-labelledby="labelfortwo">
        Two
      </button>
      <button
        dt-toggle-button-item
        value="Three"
        aria-describedby="descriptionforthree"
      >
        Three
      </button>
    </dt-toggle-button-group>
  `,
})
class AriaAttributesToggleButtonGroupTestApp {}
