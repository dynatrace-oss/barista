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
import {
  ComponentFixture,
  TestBed,
  fakeAsync,
  inject,
  flush,
  tick,
} from '@angular/core/testing';
import {
  Component,
  ViewChild,
  //NgZone
} from '@angular/core';
import { OverlayContainer } from '@angular/cdk/overlay';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import {
  FormControl,
  FormGroup,
  FormGroupDirective,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { By } from '@angular/platform-browser';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { DtFormFieldModule } from '@dynatrace/barista-components/form-field';

import {
  createComponent,
  dispatchFakeEvent,
  //MockNgZone,
} from '@dynatrace/testing/browser';
import { DtCombobox } from './combobox';
import { DtComboboxModule } from './combobox-module';
import { CommonModule } from '@angular/common';
import { DtIconModule } from '@dynatrace/barista-components/icon';
import { Subject } from 'rxjs';

function focusInput(input: HTMLInputElement): void {
  dispatchFakeEvent(input, 'focusin');
  flush();
}

describe('Combobox', () => {
  let overlayContainer: OverlayContainer;
  let overlayContainerElement: HTMLElement;

  //let zone: MockNgZone;

  beforeEach(fakeAsync(() => {
    TestBed.configureTestingModule({
      imports: [
        NoopAnimationsModule,
        DtComboboxModule,
        DtFormFieldModule,
        CommonModule,
        ReactiveFormsModule,
        FormsModule,
        HttpClientTestingModule,
        DtIconModule.forRoot({ svgIconLocation: `{{name}}.svg` }),
      ],
      declarations: [
        TestComponent,
        TestLoadingComponent,
        ComboboxInsideFormGroup,
      ],
      providers: [
        //{ provide: NgZone, useFactory: () => (zone = new MockNgZone()) },
      ],
    }).compileComponents();
  }));

  beforeEach(inject([OverlayContainer], (oc: OverlayContainer) => {
    overlayContainer = oc;
    overlayContainerElement = oc.getContainerElement();
  }));

  afterEach(() => {
    overlayContainer.ngOnDestroy();
    (overlayContainer as any) = null;
    (overlayContainerElement as any) = null;
  });

  describe('Basic', () => {
    let fixture: ComponentFixture<TestComponent>;
    let input: HTMLInputElement;
    let trigger: HTMLDivElement;
    let combobox: DtCombobox<unknown>;

    beforeEach(() => {
      fixture = createComponent(TestComponent);
      combobox = fixture.debugElement.query(
        By.directive(DtCombobox),
      ).componentInstance;
      input = fixture.debugElement.query(
        By.css('.dt-combobox-input'),
      ).nativeElement;
      trigger = fixture.debugElement.query(
        By.css('.dt-combobox-trigger'),
      ).nativeElement;
    });

    it('should not open when the options are empty', fakeAsync(() => {
      focusInput(input);
      expect(trigger.classList.contains('dt-combobox-open')).toBeFalsy();
      expect(
        overlayContainerElement.querySelectorAll('dt-option').length,
      ).toEqual(0);
    }));

    it('should return true when options is an empty array', () => {
      expect(combobox.empty).toBeTruthy();
    });

    it('should emit an event when the panel is opened', fakeAsync(() => {
      // fixture.componentInstance.setOptions();
      // fixture.detectChanges();
      // focusInput(input);
      // expect(fixture.componentInstance.openedSpy).toHaveBeenCalled();
    }));

    it('should show options after setting them from a previously empty set of options', fakeAsync(() => {
      fixture.componentInstance.setOptions();
      fixture.detectChanges();
      focusInput(input);

      expect(trigger.classList.contains('dt-combobox-open')).toBeTruthy();
      expect(
        overlayContainerElement.querySelectorAll('dt-option').length,
      ).toEqual(3);
    }));

    it('should set the value in the input correctly if a value is set at runtime', fakeAsync(() => {
      fixture.componentInstance.setOptions();
      fixture.detectChanges();
      expect(input.value).toBe('');
      expect(input.placeholder).toBe('My placeholder');

      fixture.componentInstance.value$.next({
        name: 'Value 2',
        value: '[value: Value 2]',
      });
      fixture.detectChanges();
      expect(input.value).toBe('Value 2');
    }));

    it('should emit a filterChange event when the input value changes', fakeAsync(() => {
      fixture.componentInstance.setOptions();
      fixture.detectChanges();
      focusInput(input);

      jest.spyOn(combobox.filterChange, 'emit');

      input.value = 'espresso';
      dispatchFakeEvent(input, 'input');

      // Wait for debounce
      tick(200);

      expect(combobox.filterChange.emit).toHaveBeenCalledWith({
        filter: 'espresso',
        isResetEvent: false,
      });
    }));
  });

  describe('inside of a form group', () => {
    let fixture: ComponentFixture<ComboboxInsideFormGroup>;
    let testComponent: ComboboxInsideFormGroup;
    let combobox: HTMLElement;

    beforeEach(() => {
      fixture = createComponent(ComboboxInsideFormGroup);
      testComponent = fixture.componentInstance;
      combobox = fixture.debugElement.query(
        By.css('dt-combobox'),
      ).nativeElement;
    });

    it('should not set the invalid class on a clean combobox', fakeAsync(() => {
      expect(testComponent.formGroup.untouched).toBe(true);
      expect(testComponent.formControl.invalid).toBe(true);
      expect(combobox.classList).not.toContain('dt-combobox-invalid');
      expect(combobox.getAttribute('aria-invalid')).toBe('false');
    }));

    it('should appear as invalid if it becomes touched', fakeAsync(() => {
      expect(combobox.classList).not.toContain('dt-combobox-invalid');
      expect(combobox.getAttribute('aria-invalid')).toBe('false');

      testComponent.formControl.markAsDirty();
      fixture.detectChanges();

      expect(combobox.classList).toContain('dt-combobox-invalid');
      expect(combobox.getAttribute('aria-invalid')).toBe('true');
    }));

    it('should not have the invalid class when the combobox becomes valid', fakeAsync(() => {
      testComponent.formControl.markAsDirty();
      fixture.detectChanges();

      expect(combobox.classList).toContain('dt-combobox-invalid');
      expect(combobox.getAttribute('aria-invalid')).toBe('true');

      testComponent.formControl.setValue('value1');
      fixture.detectChanges();

      expect(combobox.classList).not.toContain('dt-combobox-invalid');
      expect(combobox.getAttribute('aria-invalid')).toBe('false');
    }));

    it('should appear as invalid when the parent form group is submitted', fakeAsync(() => {
      expect(combobox.classList).not.toContain('dt-combobox-invalid');
      expect(combobox.getAttribute('aria-invalid')).toBe('false');

      dispatchFakeEvent(
        fixture.debugElement.query(By.css('form')).nativeElement,
        'submit',
      );
      fixture.detectChanges();

      expect(combobox.classList).toContain('dt-combobox-invalid');
      expect(combobox.getAttribute('aria-invalid')).toBe('true');
    }));

    it('should render the error messages when the parent form is submitted', fakeAsync(() => {
      const debugEl = fixture.debugElement.nativeElement;

      expect(debugEl.querySelectorAll('dt-error').length).toBe(0);

      dispatchFakeEvent(
        fixture.debugElement.query(By.css('form')).nativeElement,
        'submit',
      );
      fixture.detectChanges();

      expect(debugEl.querySelectorAll('dt-error').length).toBe(1);
    }));
  });

  it('should not throw an error when loading is true initially', () => {
    let loadingFixture;
    try {
      loadingFixture = createComponent(TestLoadingComponent);
    } catch (e) {
      expect(e.message).toBeTruthy();
    } finally {
      expect.assertions(0);
      loadingFixture.destroy();
    }
  });
});

/** Test component */
@Component({
  selector: 'dt-test',
  template: `
    <dt-combobox
      (opened)="openedSpy()"
      (closed)="closedSpy()"
      [value]="(value$ | async)!"
      placeholder="My placeholder"
      [compareWith]="compareFn"
      [displayWith]="displayFn"
    >
      <dt-option *ngFor="let option of options" [value]="option">
        {{ option.name }}
      </dt-option>
    </dt-combobox>
  `,
})
class TestComponent {
  options: { name: string; value: string }[] = [];
  openedSpy = jest.fn();
  closedSpy = jest.fn();

  value$ = new Subject<{ name: string; value: string }>();

  compareFn(
    v1: { name: string; value: string },
    v2: { name: string; value: string },
  ): boolean {
    return v1.value === v2.value;
  }

  displayFn(val: { name: string; value: string }): string {
    return val.name;
  }

  setOptions(): void {
    this.options = [
      { name: 'Value 1', value: '[value: Value 1]' },
      { name: 'Value 2', value: '[value: Value 2]' },
      { name: 'Value 3', value: '[value: Value 3]' },
    ];
  }
}

@Component({
  selector: 'dt-test',
  template: `
    <dt-combobox [loading]="loading">
      <dt-option *ngFor="let option of options" [value]="option">
        {{ option.name }}
      </dt-option>
    </dt-combobox>
  `,
})
class TestLoadingComponent {
  options: { name: string; value: string }[] = [
    { name: 'Value 1', value: '[value: Value 1]' },
    { name: 'Value 2', value: '[value: Value 2]' },
    { name: 'Value 3', value: '[value: Value 3]' },
  ];
  loading = true;
}

@Component({
  template: `
    <form [formGroup]="formGroup">
      <dt-form-field>
        <dt-combobox formControlName="value">
          <dt-option *ngFor="let option of options" [value]="option.value">
            {{ option.name }}
          </dt-option>
        </dt-combobox>
        <dt-error>This field is required</dt-error>
      </dt-form-field>
    </form>
  `,
})
class ComboboxInsideFormGroup {
  options: { name: string; value: string }[] = [
    { name: 'Value 1', value: 'value1' },
    { name: 'Value 2', value: 'value2' },
    { name: 'Value 3', value: 'value3' },
  ];
  initialValue = this.options[0];
  @ViewChild(FormGroupDirective)
  formGroupDirective: FormGroupDirective;
  @ViewChild(DtCombobox) combobox: DtCombobox<any>;
  formControl = new FormControl(null, Validators.required);
  formGroup = new FormGroup({
    value: this.formControl,
  });
}
