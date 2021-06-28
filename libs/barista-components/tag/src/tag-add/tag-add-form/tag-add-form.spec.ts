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

import { Component } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import {
  FormControl,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { By } from '@angular/platform-browser';

import { DtTagAddForm } from './tag-add-form';

describe('DtTagAddForm', () => {
  let component: DtTagAddFormComponent;
  let fixture: ComponentFixture<DtTagAddFormComponent>;
  let addTagFormInstance: DtTagAddForm;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [DtTagAddForm, DtTagAddFormComponent],
      imports: [FormsModule, ReactiveFormsModule],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DtTagAddFormComponent);
    component = fixture.componentInstance;
    addTagFormInstance = fixture.debugElement.query(
      By.directive(DtTagAddForm),
    ).componentInstance;
    fixture.detectChanges();
  });

  it('should emit current validity and changes to the validity of a provided form-group', () => {
    const validSpy = jest.fn();
    const sub = addTagFormInstance.valid$.subscribe(validSpy);
    fixture.detectChanges();

    expect(validSpy).toHaveBeenCalledTimes(1);
    expect(validSpy).toHaveBeenLastCalledWith(false);

    component.keyFormControl.setValue('1234');

    expect(validSpy).toHaveBeenCalledTimes(2);
    expect(validSpy).toHaveBeenLastCalledWith(true);

    component.keyFormControl.setValue('123');

    expect(validSpy).toHaveBeenCalledTimes(3);
    expect(validSpy).toHaveBeenLastCalledWith(false);

    sub.unsubscribe();
  });
});

/** Test component that passes a form-group to dt-tag-add-form. */
@Component({
  selector: 'dt-test-app',
  template: `
    <dt-tag-add-form>
      <form [formGroup]="form" class="key-value-form">
        <input
          #key
          type="text"
          aria-label="Tag key"
          required
          formControlName="key"
        />
      </form>
    </dt-tag-add-form>
  `,
})
class DtTagAddFormComponent {
  readonly keyFormControl = new FormControl('', [
    // tslint:disable-next-line: no-unbound-method
    Validators.minLength(4),
  ]);

  readonly form = new FormGroup({
    key: this.keyFormControl,
  });
}
