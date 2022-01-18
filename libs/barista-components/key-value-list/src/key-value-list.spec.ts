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

import { Component } from '@angular/core';
import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { DtKeyValueListModule } from './key-value-list-module';

import { createComponent } from '@dynatrace/testing/browser';

describe('DtKeyValueList', () => {
  const getKeyElement = (element: HTMLElement) =>
    element.querySelector('.dt-key-value-list-item-key span');
  const getValueElement = (element: HTMLElement) =>
    element.querySelector('.dt-key-value-list-item-value span');

  beforeEach(
    waitForAsync(() => {
      TestBed.configureTestingModule({
        imports: [DtKeyValueListModule],
        declarations: [
          TestAppSingleColumn,
          TestAppTwoColumns,
          TestAppThreeColumns,
          TestAppSixColumns,
          TestAppTenColumns,
          TestAppFloatColumns,
          TestAppNegativColumns,
        ],
      });

      TestBed.compileComponents();
    }),
  );

  describe('key-value-list', () => {
    it('one column should be used', () => {
      const fixture = createComponent(TestAppSingleColumn);
      const tileNativeElement =
        fixture.debugElement.nativeElement.querySelector('dt-key-value-list');
      // Element not found
      expect(tileNativeElement).toBeDefined();
      // Key Value list must contain 1 column
      expect(tileNativeElement.getAttribute('dt-column') === '1').toBeTruthy();
    });

    it('two columns should be used', () => {
      const fixture = createComponent(TestAppTwoColumns);
      const tileNativeElement =
        fixture.debugElement.nativeElement.querySelector('dt-key-value-list');
      expect(tileNativeElement).toBeDefined();
      expect(tileNativeElement.getAttribute('dt-column') === '2').toBeTruthy();
    });
    it('three columns should be used', () => {
      const fixture = createComponent(TestAppThreeColumns);
      const tileNativeElement =
        fixture.debugElement.nativeElement.querySelector('dt-key-value-list');
      expect(tileNativeElement).toBeDefined();
      expect(tileNativeElement.getAttribute('dt-column') === '3').toBeTruthy();
    });

    it('six columns should be used', () => {
      const fixture = createComponent(TestAppSixColumns);
      const tileNativeElement =
        fixture.debugElement.nativeElement.querySelector('dt-key-value-list');
      expect(tileNativeElement).toBeDefined();
      expect(tileNativeElement.getAttribute('dt-column') === '6').toBeTruthy();
    });

    it('six columns should be used although columns is set to 10', () => {
      const fixture = createComponent(TestAppTenColumns);
      const tileNativeElement =
        fixture.debugElement.nativeElement.querySelector('dt-key-value-list');
      expect(tileNativeElement).toBeDefined();
      expect(tileNativeElement.getAttribute('dt-column') === '6').toBeTruthy();
    });

    it('three columns should be used although columns is set to 3.3', () => {
      const fixture = createComponent(TestAppFloatColumns);
      const tileNativeElement =
        fixture.debugElement.nativeElement.querySelector('dt-key-value-list');
      expect(tileNativeElement).toBeDefined();
      expect(tileNativeElement.getAttribute('dt-column') === '3').toBeTruthy();
    });

    it('single column should be used although columns is set to -6', () => {
      const fixture = createComponent(TestAppNegativColumns);
      const tileNativeElement =
        fixture.debugElement.nativeElement.querySelector('dt-key-value-list');
      expect(tileNativeElement).toBeDefined();
      expect(tileNativeElement.getAttribute('dt-column') === '1').toBeTruthy();
    });

    it('is changed during runtime to two columns', () => {
      const fixture = createComponent(TestAppSixColumns);
      const tileNativeElement =
        fixture.debugElement.nativeElement.querySelector('dt-key-value-list');
      fixture.componentInstance.colNo = 2;
      fixture.detectChanges();
      expect(tileNativeElement.getAttribute('dt-column') === '2').toBeTruthy();
    });

    it('is changed during runtime to two columns', () => {
      const fixture = createComponent(TestAppTwoColumns);
      const tileNativeElement =
        fixture.debugElement.nativeElement.querySelector('dt-key-value-list');
      expect(tileNativeElement.getAttribute('dt-column') === '2').toBeTruthy();
      fixture.componentInstance.items = new Array(20);
      fixture.detectChanges();
      expect(tileNativeElement.getAttribute('dt-column') === '3').toBeTruthy();
    });
  });

  describe('content key value', () => {
    let fixture: ComponentFixture<TestAppSingleColumn>;
    let items: HTMLElement[];

    beforeEach(() => {
      fixture = createComponent(TestAppSingleColumn);
      fixture.detectChanges();
      items = fixture.debugElement.nativeElement.querySelectorAll(
        '.dt-key-value-list-item',
      );
    });

    it('should display 1st item data properly', () => {
      expect(getKeyElement(items[0])!.textContent).toContain('Temp');
      expect(getValueElement(items[0])!.textContent).toContain('1');
    });

    it('should display 2nd item data properly', () => {
      expect(getKeyElement(items[1])!.textContent).toContain('Temp1');
      expect(getValueElement(items[1])!.textContent).toContain('13');
    });

    it('should display 3rd item data properly', () => {
      expect(getKeyElement(items[2])!.textContent).toContain('Temp2');
      expect(getValueElement(items[2])!.textContent).toContain('28');
    });
  });
});

/** Test component that contains an DtKeyValueList. */

@Component({
  selector: 'dt-test-app',
  template: `
    <dt-key-value-list>
      <dt-key-value-list-item>
        <dt-key-value-list-key>Temp</dt-key-value-list-key>
        <dt-key-value-list-value>1</dt-key-value-list-value>
      </dt-key-value-list-item>
      <dt-key-value-list-item>
        <dt-key-value-list-key>Temp1</dt-key-value-list-key>
        <dt-key-value-list-value>13</dt-key-value-list-value>
      </dt-key-value-list-item>
      <dt-key-value-list-item>
        <dt-key-value-list-key>Temp2</dt-key-value-list-key>
        <dt-key-value-list-value>28</dt-key-value-list-value>
      </dt-key-value-list-item>
    </dt-key-value-list>
  `,
})
class TestAppSingleColumn {}

@Component({
  selector: 'dt-disabled-test-app',
  template: `
    <dt-key-value-list>
      <dt-key-value-list-item *ngFor="let item of items; let i = index">
        <dt-key-value-list-key>{{ i }}</dt-key-value-list-key>
        <dt-key-value-list-value>{{ i }}</dt-key-value-list-value>
      </dt-key-value-list-item>
    </dt-key-value-list>
  `,
})
class TestAppTwoColumns {
  items = new Array(15);
}

@Component({
  selector: 'dt-test-app3',
  template: `
    <dt-key-value-list>
      <dt-key-value-list-item>
        <dt-key-value-list-key></dt-key-value-list-key>
        Temp
        <dt-key-value-list-value>1</dt-key-value-list-value>
      </dt-key-value-list-item>
      <dt-key-value-list-item>
        <dt-key-value-list-key></dt-key-value-list-key>
        Temp1
        <dt-key-value-list-value>13</dt-key-value-list-value>
      </dt-key-value-list-item>
      <dt-key-value-list-item>
        <dt-key-value-list-key></dt-key-value-list-key>
        Temp2
        <dt-key-value-list-value>24</dt-key-value-list-value>
      </dt-key-value-list-item>
      <dt-key-value-list-item>
        <dt-key-value-list-key></dt-key-value-list-key>
        Temp3
        <dt-key-value-list-value>28</dt-key-value-list-value>
      </dt-key-value-list-item>
      <dt-key-value-list-item>
        <dt-key-value-list-key></dt-key-value-list-key>
        Temp4
        <dt-key-value-list-value>25</dt-key-value-list-value>
      </dt-key-value-list-item>
      <dt-key-value-list-item>
        <dt-key-value-list-key></dt-key-value-list-key>
        Temp5
        <dt-key-value-list-value>28</dt-key-value-list-value>
      </dt-key-value-list-item>
      <dt-key-value-list-item>
        <dt-key-value-list-key></dt-key-value-list-key>
        Temp6
        <dt-key-value-list-value>20</dt-key-value-list-value>
      </dt-key-value-list-item>
      <dt-key-value-list-item>
        <dt-key-value-list-key></dt-key-value-list-key>
        Temp7
        <dt-key-value-list-value>24</dt-key-value-list-value>
      </dt-key-value-list-item>
      <dt-key-value-list-item>
        <dt-key-value-list-key></dt-key-value-list-key>
        Temp8
        <dt-key-value-list-value>22</dt-key-value-list-value>
      </dt-key-value-list-item>
      <dt-key-value-list-item>
        <dt-key-value-list-key></dt-key-value-list-key>
        Temp9
        <dt-key-value-list-value>28</dt-key-value-list-value>
      </dt-key-value-list-item>
      <dt-key-value-list-item>
        <dt-key-value-list-key></dt-key-value-list-key>
        Temp10
        <dt-key-value-list-value>27</dt-key-value-list-value>
      </dt-key-value-list-item>
      <dt-key-value-list-item>
        <dt-key-value-list-key></dt-key-value-list-key>
        Temp11
        <dt-key-value-list-value>28</dt-key-value-list-value>
      </dt-key-value-list-item>
      <dt-key-value-list-item>
        <dt-key-value-list-key></dt-key-value-list-key>
        Temp12
        <dt-key-value-list-value>26</dt-key-value-list-value>
      </dt-key-value-list-item>
      <dt-key-value-list-item>
        <dt-key-value-list-key></dt-key-value-list-key>
        Temp13
        <dt-key-value-list-value>28</dt-key-value-list-value>
      </dt-key-value-list-item>
      <dt-key-value-list-item>
        <dt-key-value-list-key></dt-key-value-list-key>
        Temp14
        <dt-key-value-list-value>28</dt-key-value-list-value>
      </dt-key-value-list-item>
      <dt-key-value-list-item>
        <dt-key-value-list-key></dt-key-value-list-key>
        Temp15
        <dt-key-value-list-value>21</dt-key-value-list-value>
      </dt-key-value-list-item>
      <dt-key-value-list-item>
        <dt-key-value-list-key></dt-key-value-list-key>
        Temp16
        <dt-key-value-list-value>23</dt-key-value-list-value>
      </dt-key-value-list-item>
      <dt-key-value-list-item>
        <dt-key-value-list-key></dt-key-value-list-key>
        Temp17
        <dt-key-value-list-value>28</dt-key-value-list-value>
      </dt-key-value-list-item>
      <dt-key-value-list-item>
        <dt-key-value-list-key></dt-key-value-list-key>
        Temp18
        <dt-key-value-list-value>27</dt-key-value-list-value>
      </dt-key-value-list-item>
      <dt-key-value-list-item>
        <dt-key-value-list-key></dt-key-value-list-key>
        Temp19
        <dt-key-value-list-value>28</dt-key-value-list-value>
      </dt-key-value-list-item>
      <dt-key-value-list-item>
        <dt-key-value-list-key></dt-key-value-list-key>
        Temp20
        <dt-key-value-list-value>29</dt-key-value-list-value>
      </dt-key-value-list-item>
    </dt-key-value-list>
  `,
})
class TestAppThreeColumns {}

@Component({
  selector: 'dt-test-app4',
  template: `
    <dt-key-value-list [columns]="colNo">
      <dt-key-value-list-item>
        <dt-key-value-list-key></dt-key-value-list-key>
        Temp
        <dt-key-value-list-value>1</dt-key-value-list-value>
      </dt-key-value-list-item>
      <dt-key-value-list-item>
        <dt-key-value-list-key></dt-key-value-list-key>
        Temp1
        <dt-key-value-list-value>13</dt-key-value-list-value>
      </dt-key-value-list-item>
      <dt-key-value-list-item>
        <dt-key-value-list-key></dt-key-value-list-key>
        Temp2
        <dt-key-value-list-value>24</dt-key-value-list-value>
      </dt-key-value-list-item>
      <dt-key-value-list-item>
        <dt-key-value-list-key></dt-key-value-list-key>
        Temp3
        <dt-key-value-list-value>28</dt-key-value-list-value>
      </dt-key-value-list-item>
      <dt-key-value-list-item>
        <dt-key-value-list-key></dt-key-value-list-key>
        Temp4
        <dt-key-value-list-value>25</dt-key-value-list-value>
      </dt-key-value-list-item>
      <dt-key-value-list-item>
        <dt-key-value-list-key></dt-key-value-list-key>
        Temp5
        <dt-key-value-list-value>28</dt-key-value-list-value>
      </dt-key-value-list-item>
      <dt-key-value-list-item>
        <dt-key-value-list-key></dt-key-value-list-key>
        Temp6
        <dt-key-value-list-value>20</dt-key-value-list-value>
      </dt-key-value-list-item>
    </dt-key-value-list>
  `,
})
class TestAppSixColumns {
  colNo = 6;
}

@Component({
  selector: 'dt-test-app5',
  template: `
    <dt-key-value-list columns="10">
      <dt-key-value-list-item>
        <dt-key-value-list-key></dt-key-value-list-key>
        Temp
        <dt-key-value-list-value>1</dt-key-value-list-value>
      </dt-key-value-list-item>
      <dt-key-value-list-item>
        <dt-key-value-list-key></dt-key-value-list-key>
        Temp1
        <dt-key-value-list-value>13</dt-key-value-list-value>
      </dt-key-value-list-item>
      <dt-key-value-list-item>
        <dt-key-value-list-key></dt-key-value-list-key>
        Temp2
        <dt-key-value-list-value>24</dt-key-value-list-value>
      </dt-key-value-list-item>
      <dt-key-value-list-item>
        <dt-key-value-list-key></dt-key-value-list-key>
        Temp3
        <dt-key-value-list-value>28</dt-key-value-list-value>
      </dt-key-value-list-item>
      <dt-key-value-list-item>
        <dt-key-value-list-key></dt-key-value-list-key>
        Temp4
        <dt-key-value-list-value>25</dt-key-value-list-value>
      </dt-key-value-list-item>
      <dt-key-value-list-item>
        <dt-key-value-list-key></dt-key-value-list-key>
        Temp5
        <dt-key-value-list-value>28</dt-key-value-list-value>
      </dt-key-value-list-item>
      <dt-key-value-list-item>
        <dt-key-value-list-key></dt-key-value-list-key>
        Temp6
        <dt-key-value-list-value>20</dt-key-value-list-value>
      </dt-key-value-list-item>
      <dt-key-value-list-item>
        <dt-key-value-list-key></dt-key-value-list-key>
        Temp7
        <dt-key-value-list-value>24</dt-key-value-list-value>
      </dt-key-value-list-item>
      <dt-key-value-list-item>
        <dt-key-value-list-key></dt-key-value-list-key>
        Temp8
        <dt-key-value-list-value>22</dt-key-value-list-value>
      </dt-key-value-list-item>
    </dt-key-value-list>
  `,
})
class TestAppTenColumns {}

@Component({
  selector: 'dt-test-app6',
  template: `
    <dt-key-value-list columns="3.3">
      <dt-key-value-list-item>
        <dt-key-value-list-key></dt-key-value-list-key>
        Temp
        <dt-key-value-list-value>1</dt-key-value-list-value>
      </dt-key-value-list-item>
      <dt-key-value-list-item>
        <dt-key-value-list-key></dt-key-value-list-key>
        Temp1
        <dt-key-value-list-value>13</dt-key-value-list-value>
      </dt-key-value-list-item>
      <dt-key-value-list-item>
        <dt-key-value-list-key></dt-key-value-list-key>
        Temp2
        <dt-key-value-list-value>24</dt-key-value-list-value>
      </dt-key-value-list-item>
      <dt-key-value-list-item>
        <dt-key-value-list-key></dt-key-value-list-key>
        Temp3
        <dt-key-value-list-value>28</dt-key-value-list-value>
      </dt-key-value-list-item>
      <dt-key-value-list-item>
        <dt-key-value-list-key></dt-key-value-list-key>
        Temp4
        <dt-key-value-list-value>25</dt-key-value-list-value>
      </dt-key-value-list-item>
      <dt-key-value-list-item>
        <dt-key-value-list-key></dt-key-value-list-key>
        Temp5
        <dt-key-value-list-value>28</dt-key-value-list-value>
      </dt-key-value-list-item>
      <dt-key-value-list-item>
        <dt-key-value-list-key></dt-key-value-list-key>
        Temp6
        <dt-key-value-list-value>20</dt-key-value-list-value>
      </dt-key-value-list-item>
      <dt-key-value-list-item>
        <dt-key-value-list-key></dt-key-value-list-key>
        Temp7
        <dt-key-value-list-value>24</dt-key-value-list-value>
      </dt-key-value-list-item>
      <dt-key-value-list-item>
        <dt-key-value-list-key></dt-key-value-list-key>
        Temp8
        <dt-key-value-list-value>22</dt-key-value-list-value>
      </dt-key-value-list-item>
    </dt-key-value-list>
  `,
})
class TestAppFloatColumns {}
@Component({
  selector: 'dt-test-app7',
  template: `
    <dt-key-value-list columns="-6">
      <dt-key-value-list-item>
        <dt-key-value-list-key></dt-key-value-list-key>
        Temp
        <dt-key-value-list-value>1</dt-key-value-list-value>
      </dt-key-value-list-item>
      <dt-key-value-list-item>
        <dt-key-value-list-key></dt-key-value-list-key>
        Temp1
        <dt-key-value-list-value>13</dt-key-value-list-value>
      </dt-key-value-list-item>
      <dt-key-value-list-item>
        <dt-key-value-list-key></dt-key-value-list-key>
        Temp2
        <dt-key-value-list-value>24</dt-key-value-list-value>
      </dt-key-value-list-item>
      <dt-key-value-list-item>
        <dt-key-value-list-key></dt-key-value-list-key>
        Temp3
        <dt-key-value-list-value>28</dt-key-value-list-value>
      </dt-key-value-list-item>
      <dt-key-value-list-item>
        <dt-key-value-list-key></dt-key-value-list-key>
        Temp4
        <dt-key-value-list-value>25</dt-key-value-list-value>
      </dt-key-value-list-item>
      <dt-key-value-list-item>
        <dt-key-value-list-key></dt-key-value-list-key>
        Temp5
        <dt-key-value-list-value>28</dt-key-value-list-value>
      </dt-key-value-list-item>
      <dt-key-value-list-item>
        <dt-key-value-list-key></dt-key-value-list-key>
        Temp6
        <dt-key-value-list-value>20</dt-key-value-list-value>
      </dt-key-value-list-item>
      <dt-key-value-list-item>
        <dt-key-value-list-key></dt-key-value-list-key>
        Temp7
        <dt-key-value-list-value>24</dt-key-value-list-value>
      </dt-key-value-list-item>
      <dt-key-value-list-item>
        <dt-key-value-list-key></dt-key-value-list-key>
        Temp8
        <dt-key-value-list-value>22</dt-key-value-list-value>
      </dt-key-value-list-item>
    </dt-key-value-list>
  `,
})
class TestAppNegativColumns {}
