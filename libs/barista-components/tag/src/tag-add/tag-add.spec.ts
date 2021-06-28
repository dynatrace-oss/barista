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

// tslint:disable no-lifecycle-call no-use-before-declare no-magic-numbers
// tslint:disable no-any max-file-line-count no-unbound-method use-component-selector

import { ESCAPE } from '@angular/cdk/keycodes';
import { OverlayContainer } from '@angular/cdk/overlay';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { Component, DebugElement, OnInit, Type } from '@angular/core';
import {
  ComponentFixture,
  TestBed,
  fakeAsync,
  flush,
  inject,
} from '@angular/core/testing';
import { By } from '@angular/platform-browser';

import { DtIconModule } from '@dynatrace/barista-components/icon';
import { DtTagAdd, DtTagModule } from '@dynatrace/barista-components/tag';
import { DtInputModule } from '@dynatrace/barista-components/input';
import {
  createComponent,
  dispatchKeyboardEvent,
} from '@dynatrace/testing/browser';
import {
  DT_UI_TEST_CONFIG,
  DtUiTestConfiguration,
} from '@dynatrace/barista-components/core';
import {
  FormControl,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';

describe('DtTagAdd', () => {
  let instanceDebugElement: DebugElement;
  let addTagNativeElement: HTMLElement;
  let addTagInstance: DtTagAdd;

  let overlayContainer: OverlayContainer;
  let overlayContainerElement: HTMLElement;
  const overlayConfig: DtUiTestConfiguration = {
    attributeName: 'dt-ui-test-id',
    constructOverlayAttributeValue(attributeName: string): string {
      return `${attributeName}-overlay`;
    },
  };

  const configureTestingModule = <T>(
    componentType: Type<T>,
  ): ComponentFixture<T> => {
    TestBed.configureTestingModule({
      imports: [
        HttpClientTestingModule,
        DtIconModule.forRoot({ svgIconLocation: `{{name}}.svg` }),
        DtTagModule,
        FormsModule,
        ReactiveFormsModule,
        DtInputModule,
      ],
      declarations: [componentType],
      providers: [{ provide: DT_UI_TEST_CONFIG, useValue: overlayConfig }],
    });

    TestBed.compileComponents();

    const componentFixture = createComponent(componentType);
    instanceDebugElement = componentFixture.debugElement.query(
      By.directive(DtTagAdd),
    );
    addTagInstance = instanceDebugElement.injector.get<DtTagAdd>(DtTagAdd);
    addTagNativeElement = instanceDebugElement.nativeElement;

    inject([OverlayContainer], (oc: OverlayContainer) => {
      overlayContainer = oc;
      overlayContainerElement = oc.getContainerElement();
    })();

    return componentFixture;
  };

  describe('with default add-form', () => {
    let fixture: ComponentFixture<DtTagComponent>;

    beforeEach(() => {
      fixture = configureTestingModule(DtTagComponent);
    });

    afterEach(() => {
      overlayContainer.ngOnDestroy();
    });

    it('should add the `dt-tag-add` class', () => {
      expect(addTagNativeElement.classList).toContain('dt-tag-add');
    });

    it('should open panel when showOverlay is true', () => {
      addTagInstance.open();
      fixture.detectChanges();

      const panel = overlayContainerElement.querySelector(
        '.dt-tag-add-overlay',
      ) as HTMLDivElement;

      expect(addTagInstance._showOverlay).toBeTruthy();
      expect(panel).not.toBeNull();
    });

    it('should add tags when submit is called, but only if valid', fakeAsync(() => {
      const addSpy = jest.fn();
      const sub = addTagInstance.tagAdded.subscribe(addSpy);

      addTagInstance.open();
      fixture.detectChanges();
      flush();

      const panelInput = overlayContainerElement.querySelector(
        '.dt-tag-add-input',
      ) as HTMLInputElement;

      panelInput.value = '';
      addTagInstance._onTagValueChange();
      addTagInstance.submit();
      expect(addSpy).not.toHaveBeenCalled();

      panelInput.value = 'valid-tag';
      addTagInstance._onTagValueChange();
      addTagInstance.submit();
      expect(addSpy).toHaveBeenCalledTimes(1);

      sub.unsubscribe();
    }));

    it('should add tag to tags when submit() is called', fakeAsync(() => {
      addTagInstance.open();
      fixture.detectChanges();
      flush();

      const panelInput = overlayContainerElement.querySelector(
        '.dt-tag-add-input',
      ) as HTMLInputElement;

      expect(fixture.componentInstance.tags.size).toBe(3);
      panelInput.value = 'Health';
      addTagInstance._onTagValueChange();
      addTagInstance.submit();
      expect(fixture.componentInstance.tags.size).toBe(4);
    }));

    it('should add tag when `add` button in dt-tag-add is clicked', fakeAsync(() => {
      const spy = jest.fn();
      const sub = addTagInstance.tagAdded.subscribe(spy);

      addTagInstance.open();
      fixture.detectChanges();
      flush();

      const panelAddButton = overlayContainerElement.querySelector(
        '.dt-tag-add-submit-button',
      ) as HTMLButtonElement;
      const panelInput = overlayContainerElement.querySelector(
        '.dt-tag-add-input',
      ) as HTMLInputElement;
      panelInput.value = 'test';
      addTagInstance._onTagValueChange();
      fixture.detectChanges();
      panelAddButton.click();
      fixture.detectChanges();
      flush();

      const tag = (
        (
          fixture.debugElement.nativeElement.querySelectorAll(
            'dt-tag',
          ) as HTMLCollection
        ).item(3) as HTMLElement
      ).innerHTML;
      expect(tag).toContain('test');
      expect(spy).toHaveBeenCalled();
      expect(fixture.componentInstance.tags.size).toBe(4);

      sub.unsubscribe();
    }));

    it('should open Overlay when `add-tag` button is pressed', () => {
      const addTagBtn =
        fixture.debugElement.nativeElement.querySelector('button');
      let panel = overlayContainerElement.querySelector('.dt-tag-add-overlay');

      expect(panel).toBeNull();

      addTagBtn.click();
      fixture.detectChanges();
      panel = overlayContainerElement.querySelector('.dt-tag-add-overlay');

      expect(panel).not.toBeNull();
    });

    it('should close Overlay when backdrop is clicked', fakeAsync(() => {
      addTagInstance.open();
      fixture.detectChanges();
      flush();
      expect(addTagInstance._showOverlay).toBe(true);

      const backdrop = overlayContainerElement.querySelector(
        '.cdk-overlay-backdrop',
      ) as HTMLElement;
      backdrop.click();

      fixture.detectChanges();
      flush();

      expect(addTagInstance._showOverlay).toBe(false);
    }));

    it('should propagate attribute to overlay if `dt-ui-test-id` is provided', fakeAsync(() => {
      addTagInstance.open();
      fixture.detectChanges();
      flush();

      expect(addTagInstance._showOverlay).toBe(true);
      expect(overlayContainerElement.innerHTML).toContain('dt-ui-test-id');
    }));

    describe('keyevent tests', () => {
      it('should close Overlay when ESCAPE is pressed', () => {
        addTagInstance.open();
        fixture.detectChanges();
        const panel = overlayContainerElement.querySelector(
          '.dt-tag-add-overlay',
        ) as HTMLDivElement;
        expect(panel).not.toBeNull();
        dispatchKeyboardEvent(panel, 'keydown', ESCAPE);
        fixture.detectChanges();

        expect(addTagInstance._showOverlay).toBeFalsy();
      });
    });
  });

  describe('with custom dt-tag-add-form', () => {
    let fixture: ComponentFixture<DtTagCustomFormComponent>;

    beforeEach(() => {
      fixture = configureTestingModule(DtTagCustomFormComponent);
    });

    afterEach(() => {
      overlayContainer.ngOnDestroy();
    });

    it('should add tags when submit is called, but only if valid', () => {
      const addSpy = jest.fn();
      const sub = addTagInstance.tagAdded.subscribe(addSpy);

      addTagInstance.open();
      fixture.detectChanges();

      fixture.componentInstance.keyFormControl.setValue('123');
      fixture.detectChanges();
      addTagInstance.submit();
      expect(addSpy).not.toHaveBeenCalled();

      fixture.componentInstance.keyFormControl.setValue('1234');
      fixture.detectChanges();
      addTagInstance.submit();
      expect(addSpy).toHaveBeenCalledTimes(1);

      sub.unsubscribe();
    });

    it('should disable/enable add button based on the validity of the form', () => {
      addTagInstance.open();
      fixture.detectChanges();

      const panelAddButton = overlayContainerElement.querySelector(
        '.dt-tag-add-submit-button',
      ) as HTMLButtonElement;

      fixture.componentInstance.keyFormControl.setValue('123');
      fixture.detectChanges();
      expect(panelAddButton.disabled).toBe(true);

      fixture.componentInstance.keyFormControl.setValue('1234');
      fixture.detectChanges();
      expect(panelAddButton.disabled).toBe(false);
    });
  });
});

/** Test component that contains an DtTagAdd. */
@Component({
  selector: 'dt-test-app',
  template: `
    <dt-tag *ngFor="let tag of tags">{{ tag }}</dt-tag>
    <dt-tag-add
      placeholder="insert tag here"
      (tagAdded)="addTag($event)"
      dt-ui-test-id="tag-add"
    ></dt-tag-add>
  `,
})
class DtTagComponent implements OnInit {
  tags = new Set<string>();

  ngOnInit(): void {
    this.tags.add('Window').add('Managed').add('Errors');
  }

  addTag(tag: string): void {
    this.tags.add(tag);
  }
}

/** Test component that contains an DtTagAdd. */
@Component({
  selector: 'dt-test-app',
  template: `
    <dt-tag *ngFor="let tag of tags">{{ tag }}</dt-tag>
    <dt-tag-add
      placeholder="insert tag here"
      (tagAdded)="addTag($event)"
      dt-ui-test-id="tag-add"
    >
      <dt-tag-add-form>
        <form [formGroup]="form" class="key-value-form">
          <input
            #key
            type="text"
            dtInput
            aria-label="Tag key"
            required
            formControlName="key"
          />
        </form>
      </dt-tag-add-form>
    </dt-tag-add>
  `,
})
class DtTagCustomFormComponent implements OnInit {
  readonly tags = new Set<string>();

  readonly keyFormControl = new FormControl('', [
    // tslint:disable-next-line: no-unbound-method
    Validators.minLength(4),
  ]);

  readonly form = new FormGroup({
    key: this.keyFormControl,
  });

  ngOnInit(): void {
    this.tags.add('Window').add('Managed').add('Errors');
  }

  addTag(tag: string): void {
    this.tags.add(tag);
    this.form.reset();
  }
}
