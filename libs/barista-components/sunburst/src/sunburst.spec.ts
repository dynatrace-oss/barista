/**
 * @license
 * Copyright 2020 Dynatrace LLC
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

import { HttpClientTestingModule } from '@angular/common/http/testing';
import { Component, ViewChild } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { DtIconModule } from '@dynatrace/barista-components/icon';
import { createComponent } from '@dynatrace/testing/browser';
import { DtSunburst } from './sunburst';
import { sunburstMock } from './sunburst.mock';
import { DtSunburstModule } from './sunburst.module';
import {
  DtSunburstNode,
  DtSunburstSlice,
  DtSunburstValueMode,
  fillNodes,
} from './sunburst.util';

describe('DtSunburst', () => {
  let fixture: ComponentFixture<TestApp>;
  let rootComponent: TestApp;
  let component: DtSunburst;
  let renderSpy;
  let selectedChangeSpy;
  let selectSpy;

  const selectors = {
    slice: '.dt-slice',
    sliceLabel: '.dt-slice-label',
    sliceValue: '.dt-slice-value',
    selectedLabel: '.dt-selected-label',
    selectedValue: '.dt-slice-value',
  };

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [
        HttpClientTestingModule,
        DtIconModule.forRoot({ svgIconLocation: `{{name}}.svg` }),
        DtSunburstModule,
      ],
      declarations: [TestApp],
    });

    TestBed.compileComponents();

    fixture = createComponent(TestApp);
    rootComponent = fixture.componentInstance;
    component = fixture.debugElement.query(By.directive(DtSunburst))
      .componentInstance;

    renderSpy = jest.spyOn(component, 'render');
    selectedChangeSpy = jest.spyOn(component.selectedChange, 'emit');
    selectSpy = jest.spyOn(component, 'select');
  }));

  describe('Series', () => {
    it('should render after change', () => {
      rootComponent.series = sunburstMock;
      fixture.detectChanges();

      expect(renderSpy).toHaveBeenCalledTimes(1);
    });

    it('should fill the series', () => {
      rootComponent.series = sunburstMock;
      fixture.detectChanges();

      const filledSeries = fillNodes(sunburstMock);

      expect(component.filledSeries).toEqual(filledSeries);
    });
  });

  describe('Selected', () => {
    it('should have no selection by default', () => {
      expect(component._selected).toEqual([]);
    });

    it('should render after change', () => {
      rootComponent.selected = [sunburstMock[0]];
      fixture.detectChanges();

      expect(renderSpy).toHaveBeenCalledTimes(1);
    });

    it('should find filled nodes when input', () => {
      rootComponent.series = sunburstMock;
      rootComponent.selected = [sunburstMock[0]];
      fixture.detectChanges();

      expect(component._selected).toEqual([
        {
          children: [
            {
              color: '#fff29a',
              depth: 1,
              id: '0.0',
              label: 'Blue',
              value: 1,
              valueRelative: 0.125,
              origin: expect.any(Object),
            },
            {
              color: '#fff29a',
              depth: 1,
              id: '0.1',
              label: 'Red',
              value: 3,
              valueRelative: 0.375,
              origin: expect.any(Object),
            },
          ],
          color: '#fff29a',
          depth: 2,
          id: '0',
          label: 'Purple',
          value: 4,
          valueRelative: 0.5,
          origin: expect.any(Object),
        },
      ]);
    });
  });

  describe('Value Display Mode', () => {
    it('should be ABSOLUTE by default', () => {
      fixture.detectChanges();

      expect(component.labelAsAbsolute).toBeTruthy();
    });

    it('should render after change', () => {
      rootComponent.valueDisplayMode = DtSunburstValueMode.PERCENT;
      fixture.detectChanges();

      expect(component.labelAsAbsolute).toBeFalsy();
    });
  });

  describe('Select', () => {
    it('should emit empty selection', () => {
      component.select();

      expect(selectedChangeSpy).toHaveBeenCalledWith([]);
    });

    it('should emit selected nodes', () => {
      rootComponent.series = sunburstMock;
      fixture.detectChanges();

      const selected = {
        data: {
          origin: expect.any(Object),
          active: false,
          children: [],
          color: '',
          colorHover: '',
          depth: 1,
          id: '1.1',
          isCurrent: false,
          label: 'Yellow',
          showLabel: false,
          value: 3,
          valueRelative: 0.375,
          visible: true,
        },
        endAngle: 0,
        index: 0,
        labelPosition: [0, 0],
        padAngle: 0,
        path: '',
        showLabel: true,
        startAngle: 0,
        value: 3,
      } as DtSunburstSlice;
      const expected = [sunburstMock[1], sunburstMock[1].children[0]];

      component.select(undefined, selected);

      expect(selectedChangeSpy).toHaveBeenCalledWith(expected);
    });

    it('should render', () => {
      component.select();

      expect(renderSpy).toHaveBeenCalled();
    });

    it('should clean selection on click outside', () => {
      const event = { stopPropagation: () => {} } as MouseEvent;
      component.onClick(event);

      expect(selectSpy).toHaveBeenCalledWith(event);
    });
  });

  describe('Template', () => {
    beforeEach(function() {
      rootComponent.series = sunburstMock;
      fixture.detectChanges();
    });

    it('should show generic label when nothing selected', () => {
      const actual = fixture.debugElement.query(
        By.css(selectors.selectedLabel),
      );

      expect(actual.nativeElement.textContent.trim()).toBe('All');
    });

    it('should show specific label when selected', () => {
      rootComponent.selected = [sunburstMock[0]];
      fixture.detectChanges();
      const actual = fixture.debugElement.query(
        By.css(selectors.selectedLabel),
      );

      expect(actual.nativeElement.textContent.trim()).toBe('Purple');
    });

    it('should show slice label when nothing selected', () => {
      rootComponent.selected = [sunburstMock[0]];
      fixture.detectChanges();
      const actualLabel = fixture.debugElement.queryAll(
        By.css(selectors.sliceLabel),
      );
      const actualValue = fixture.debugElement.queryAll(
        By.css(selectors.sliceValue),
      );

      expect(actualLabel.length).toBe(sunburstMock.length);

      expect(actualValue.length).toBe(sunburstMock.length);
    });

    it('should show slice label when selected', () => {
      rootComponent.selected = [sunburstMock[0]];
      fixture.detectChanges();
      const actualLabel = fixture.debugElement.queryAll(
        By.css(selectors.sliceLabel),
      );
      const actualValue = fixture.debugElement.queryAll(
        By.css(selectors.sliceValue),
      );

      expect(actualLabel.length).toBe(2);

      expect(actualValue.length).toBe(2);
    });

    it('should show absolute values', () => {
      rootComponent.valueDisplayMode = DtSunburstValueMode.ABSOLUTE;
      fixture.detectChanges();
      const actualSelected = fixture.debugElement.query(
        By.css(selectors.selectedValue),
      );
      const actualSlice = fixture.debugElement.query(
        By.css(selectors.sliceValue),
      );

      expect(actualSelected.nativeElement.textContent).not.toContain('%');

      expect(actualSlice.nativeElement.textContent).not.toContain('%');
    });

    it('should show percent values', () => {
      rootComponent.valueDisplayMode = DtSunburstValueMode.PERCENT;
      fixture.detectChanges();
      const actualSelected = fixture.debugElement.query(
        By.css(selectors.selectedValue),
      );
      const actualSlice = fixture.debugElement.query(
        By.css(selectors.sliceValue),
      );

      expect(actualSelected.nativeElement.textContent).toContain('%');

      expect(actualSlice.nativeElement.textContent).toContain('%');
    });

    it('should show first level slices if nothing selected', () => {
      const actual = fixture.debugElement.queryAll(By.css(selectors.slice));

      expect(actual.length).toBe(sunburstMock.length);
    });

    it('should show slices when selected', () => {
      rootComponent.selected = [sunburstMock[0]];
      fixture.detectChanges();
      const actual = fixture.debugElement.queryAll(By.css(selectors.slice));

      expect(actual.length).toBe(4);
    });
  });
});

/** Test component that contains an DtSunburst. */
@Component({
  selector: 'dt-test-app',
  template: `
    <dt-sunburst
      [series]="series"
      [selected]="selected"
      [valueDisplayMode]="valueDisplayMode"
      [noSelectionLabel]="noSelectionLabel"
    ></dt-sunburst>
  `,
})
class TestApp {
  series: DtSunburstNode[] = [];
  selected: DtSunburstNode[] = [];
  noSelectionLabel = 'All';
  valueDisplayMode;

  @ViewChild(DtSunburst) sunburst: DtSunburst;
}
