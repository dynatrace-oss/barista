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
// eslint-disable @typescript-eslint/no-non-null-assertion

import {
  DOWN_ARROW,
  ENTER,
  ESCAPE,
  SPACE,
  TAB,
  UP_ARROW,
} from '@angular/cdk/keycodes';
import { OverlayContainer } from '@angular/cdk/overlay';
import {
  Component,
  NgZone,
  OnDestroy,
  Provider,
  QueryList,
  Type,
  ViewChild,
  ViewChildren,
  TemplateRef,
  ViewContainerRef,
  AfterViewInit,
} from '@angular/core';
import {
  ComponentFixture,
  TestBed,
  waitForAsync,
  fakeAsync,
  flush,
  inject,
  tick,
} from '@angular/core/testing';
import { FormControl, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { By } from '@angular/platform-browser';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { Observable, Subscription } from 'rxjs';
import { map, startWith } from 'rxjs/operators';

import {
  DtOption,
  DtOptionSelectionChange,
  DT_UI_TEST_CONFIG,
  DtUiTestConfiguration,
} from '@dynatrace/barista-components/core';
import {
  DtFormField,
  DtFormFieldModule,
} from '@dynatrace/barista-components/form-field';
import { DtInputModule } from '@dynatrace/barista-components/input';

import {
  dispatchEvent,
  dispatchFakeEvent,
  dispatchKeyboardEvent,
  createKeyboardEvent,
  MockNgZone,
  typeInElement,
} from '@dynatrace/testing/browser';
import { TemplatePortal } from '@angular/cdk/portal';
import { DtAutocompleteModule } from './autocomplete-module';
import {
  DtAutocomplete,
  DT_AUTOCOMPLETE_DEFAULT_OPTIONS,
} from './autocomplete';
import { DtAutocompleteTrigger } from './autocomplete-trigger';
import { getDtAutocompleteMissingPanelError } from './autocomplete-errors';

describe('DtAutocomplete', () => {
  let overlayContainer: OverlayContainer;
  let overlayContainerElement: HTMLElement;
  let zone: MockNgZone;

  const overlayConfig: DtUiTestConfiguration = {
    attributeName: 'dt-ui-test-id',
    constructOverlayAttributeValue(attributeName: string): string {
      return `${attributeName}-overlay`;
    },
  };

  // Creates a test component fixture.
  function createComponent<T>(
    component: Type<T>,
    providers: Provider[] = [],
  ): any {
    TestBed.configureTestingModule({
      imports: [
        DtAutocompleteModule,
        DtFormFieldModule,
        DtInputModule,
        FormsModule,
        ReactiveFormsModule,
        NoopAnimationsModule,
      ],
      declarations: [component],
      providers: [
        { provide: NgZone, useFactory: () => (zone = new MockNgZone()) },
        { provide: DT_UI_TEST_CONFIG, useValue: overlayConfig },
        ...providers,
      ],
    });

    TestBed.compileComponents();

    inject([OverlayContainer], (oc: OverlayContainer) => {
      overlayContainer = oc;
      overlayContainerElement = oc.getContainerElement();
    })();

    return TestBed.createComponent<T>(component);
  }

  afterEach(inject(
    [OverlayContainer],
    (currentOverlayContainer: OverlayContainer) => {
      // Since we're resetting the testing module in some of the tests,
      // we can potentially have multiple overlay containers.
      currentOverlayContainer.ngOnDestroy();
      overlayContainer.ngOnDestroy();
    },
  ));

  describe('panel toggling', () => {
    let fixture: ComponentFixture<SimpleAutocomplete>;
    let input: HTMLInputElement;

    beforeEach(() => {
      fixture = createComponent(SimpleAutocomplete);
      fixture.detectChanges();
      input = fixture.debugElement.query(By.css('input')).nativeElement;
    });

    it('should open the panel when the input is focused', () => {
      // Expected panel state to start out closed.
      expect(fixture.componentInstance.trigger.panelOpen).toBe(false);

      dispatchFakeEvent(input, 'focusin');
      fixture.detectChanges();

      expect(fixture.componentInstance.trigger.panelOpen).toBe(true);
      // Expected panel to display when input is focused.
      expect(overlayContainerElement.textContent).toContain('Alabama');
      expect(overlayContainerElement.textContent).toContain('California');
    });

    it('should not open the panel on focus if the input is readonly', fakeAsync(() => {
      const trigger = fixture.componentInstance.trigger;
      input.readOnly = true;
      fixture.detectChanges();

      // Expected panel state to start out closed.
      expect(trigger.panelOpen).toBe(false);
      dispatchFakeEvent(input, 'focusin');
      flush();

      fixture.detectChanges();
      // Expected panel to stay closed.
      expect(trigger.panelOpen).toBe(false);
    }));

    it('should not open using the arrow keys when the input is readonly', fakeAsync(() => {
      const trigger = fixture.componentInstance.trigger;
      input.readOnly = true;
      fixture.detectChanges();

      // Expected panel state to start out closed.
      expect(trigger.panelOpen).toBe(false);
      dispatchKeyboardEvent(input, 'keydown', DOWN_ARROW);
      flush();

      fixture.detectChanges();
      // Expected panel to stay closed.
      expect(trigger.panelOpen).toBe(false);
    }));

    it('should open the panel programmatically', () => {
      // Expected panel state to start out closed.
      expect(fixture.componentInstance.trigger.panelOpen).toBe(false);

      fixture.componentInstance.trigger.openPanel();
      fixture.detectChanges();

      // Expected panel state to read open when opened programmatically.
      expect(fixture.componentInstance.trigger.panelOpen).toBe(true);
      // Expected panel to display when opened programmatically.
      expect(overlayContainerElement.textContent).toContain('Alabama');
      // Expected panel to display when opened programmatically.
      expect(overlayContainerElement.textContent).toContain('California');
    });

    it(
      'should show the panel when the first open is after the initial zone stabilization',
      waitForAsync(() => {
        // Note that we're running outside the Angular zone, in order to be able
        // to test properly without the subscription from `_subscribeToClosingActions`
        // giving us a false positive.
        fixture.ngZone!.runOutsideAngular(() => {
          fixture.componentInstance.trigger.openPanel();

          Promise.resolve().then(() => {
            expect(fixture.componentInstance.panel.showPanel).toBe(true);
          });
        });
      }),
    );

    it('should close the panel when the user clicks away', fakeAsync(() => {
      dispatchFakeEvent(input, 'focusin');
      fixture.detectChanges();
      zone.simulateZoneExit();
      dispatchFakeEvent(document, 'click');

      expect(fixture.componentInstance.trigger.panelOpen).toBe(false);
      expect(overlayContainerElement.textContent).toEqual('');
    }));

    it('should close the panel when the user taps away on a touch device', fakeAsync(() => {
      dispatchFakeEvent(input, 'focus');
      fixture.detectChanges();
      flush();
      dispatchFakeEvent(document, 'touchend');

      // Expected tapping outside the panel to set its state to closed.
      expect(fixture.componentInstance.trigger.panelOpen).toBe(false);
      // Expected tapping outside the panel to close the panel.
      expect(overlayContainerElement.textContent).toEqual('');
    }));

    it('should close the panel when an option is clicked', fakeAsync(() => {
      dispatchFakeEvent(input, 'focusin');
      fixture.detectChanges();
      zone.simulateZoneExit();

      const option = overlayContainerElement.querySelector(
        'dt-option',
      ) as HTMLElement;
      option.click();
      fixture.detectChanges();

      // Expected clicking an option to set the panel state to closed.
      expect(fixture.componentInstance.trigger.panelOpen).toBe(false);
      // Expected clicking an option to close the panel.
      expect(overlayContainerElement.textContent).toEqual('');
    }));

    it('should close the panel when a newly created option is clicked', fakeAsync(() => {
      dispatchFakeEvent(input, 'focusin');
      fixture.detectChanges();
      zone.simulateZoneExit();

      // Filter down the option list to a subset of original options ('Alabama', 'California')
      typeInElement('al', input);
      fixture.detectChanges();
      tick();

      let options =
        overlayContainerElement.querySelectorAll<HTMLElement>('dt-option');
      options[0].click();

      // Changing value from 'Alabama' to 'al' to re-populate the option list,
      // ensuring that 'California' is created new.
      dispatchFakeEvent(input, 'focusin');
      typeInElement('al', input);
      fixture.detectChanges();
      tick();

      options =
        overlayContainerElement.querySelectorAll<HTMLElement>('dt-option');
      options[1].click();
      fixture.detectChanges();

      // Expected clicking a new option to set the panel state to closed.
      expect(fixture.componentInstance.trigger.panelOpen).toBe(false);
      // Expected clicking a new option to close the panel.
      expect(overlayContainerElement.textContent).toEqual('');
    }));

    it('should close the panel programmatically', () => {
      fixture.componentInstance.trigger.openPanel();
      fixture.detectChanges();

      fixture.componentInstance.trigger.closePanel();
      fixture.detectChanges();

      // Expected closing programmatically to set the panel state to closed.
      expect(fixture.componentInstance.trigger.panelOpen).toBe(false);
      // Expected closing programmatically to close the panel.
      expect(overlayContainerElement.textContent).toEqual('');
    });

    it('should not throw when attempting to close the panel of a destroyed autocomplete', () => {
      const trigger = fixture.componentInstance.trigger;

      trigger.openPanel();
      fixture.detectChanges();
      fixture.destroy();

      expect(() => {
        trigger.closePanel();
      }).not.toThrow();
    });

    it('should hide the panel when the options list is empty', fakeAsync(() => {
      dispatchFakeEvent(input, 'focusin');
      fixture.detectChanges();

      const panel = overlayContainerElement.querySelector(
        '.dt-autocomplete-panel',
      ) as HTMLElement;

      // Expected panel to start out visible.
      expect(panel.classList).toContain('dt-autocomplete-visible');

      // Filter down the option list such that no options match the value
      typeInElement('af', input);
      fixture.detectChanges();
      tick();
      fixture.detectChanges();

      // Expected panel to hide itself when empty.
      expect(panel.classList).toContain('dt-autocomplete-hidden');
    }));

    it('should not open the panel when the `input` event is invoked on a non-focused input', () => {
      // Expected panel state to start out closed.
      expect(fixture.componentInstance.trigger.panelOpen).toBe(false);

      input.value = 'Alabama';
      dispatchFakeEvent(input, 'input');
      fixture.detectChanges();

      // Expected panel state to stay closed.
      expect(fixture.componentInstance.trigger.panelOpen).toBe(false);
    });

    it('should toggle the visibility when typing and closing the panel', fakeAsync(() => {
      fixture.componentInstance.trigger.openPanel();
      tick();
      fixture.detectChanges();

      // Expected panel to be visible.
      expect(
        overlayContainerElement.querySelector('.dt-autocomplete-panel')!
          .classList,
      ).toContain('dt-autocomplete-visible');

      typeInElement('x', input);
      fixture.detectChanges();
      tick();
      fixture.detectChanges();

      // Expected panel to be hidden.
      expect(
        overlayContainerElement.querySelector('.dt-autocomplete-panel')!
          .classList,
      ).toContain('dt-autocomplete-hidden');

      fixture.componentInstance.trigger.closePanel();
      fixture.detectChanges();

      fixture.componentInstance.trigger.openPanel();
      fixture.detectChanges();

      typeInElement('al', input);
      fixture.detectChanges();
      tick();
      fixture.detectChanges();

      // Expected panel to be visible.
      expect(
        overlayContainerElement.querySelector('.dt-autocomplete-panel')!
          .classList,
      ).toContain('dt-autocomplete-visible');
    }));

    it('should provide the open state of the panel', fakeAsync(() => {
      // Expected the panel to be unopened initially.
      expect(fixture.componentInstance.panel.isOpen).toBeFalsy();

      dispatchFakeEvent(input, 'focusin');
      fixture.detectChanges();
      flush();
      // Expected the panel to be opened on focus.
      expect(fixture.componentInstance.panel.isOpen).toBeTruthy();
    }));

    it('should emit an event when the panel is opened', () => {
      fixture.componentInstance.trigger.openPanel();
      fixture.detectChanges();

      expect(fixture.componentInstance.openedSpy).toHaveBeenCalled();
    });

    it('should not emit the `opened` event when no options are being shown', () => {
      fixture.componentInstance.filteredStates =
        fixture.componentInstance.states = [];
      fixture.detectChanges();

      fixture.componentInstance.trigger.openPanel();
      fixture.detectChanges();

      expect(fixture.componentInstance.openedSpy).not.toHaveBeenCalled();
    });

    it('should not emit the opened event multiple times while typing', fakeAsync(() => {
      fixture.componentInstance.trigger.openPanel();
      fixture.detectChanges();

      expect(fixture.componentInstance.openedSpy).toHaveBeenCalledTimes(1);

      typeInElement('Alabam', input);
      fixture.detectChanges();
      tick();
      fixture.detectChanges();

      expect(fixture.componentInstance.openedSpy).toHaveBeenCalledTimes(1);
    }));

    it('should emit an event when the panel is closed', () => {
      fixture.componentInstance.trigger.openPanel();
      fixture.detectChanges();

      fixture.componentInstance.trigger.closePanel();
      fixture.detectChanges();

      expect(fixture.componentInstance.closedSpy).toHaveBeenCalled();
    });

    it('should not emit the `closed` event when no options were shown', () => {
      fixture.componentInstance.filteredStates =
        fixture.componentInstance.states = [];
      fixture.detectChanges();

      fixture.componentInstance.trigger.openPanel();
      fixture.detectChanges();

      fixture.componentInstance.trigger.closePanel();
      fixture.detectChanges();

      expect(fixture.componentInstance.closedSpy).not.toHaveBeenCalled();
    });

    it('should not be able to open the panel if the autocomplete is disabled', () => {
      expect(fixture.componentInstance.trigger.panelOpen).toBe(false);

      fixture.componentInstance.autocompleteDisabled = true;
      fixture.detectChanges();

      dispatchFakeEvent(input, 'focusin');
      fixture.detectChanges();

      expect(fixture.componentInstance.trigger.panelOpen).toBe(false);
    });
  });

  it('should be able to set a custom value for the `autocomplete` attribute', () => {
    const fixture = createComponent(
      AutocompleteWithNativeAutocompleteAttribute,
    );
    const input = fixture.nativeElement.querySelector('input');

    fixture.detectChanges();

    expect(input.getAttribute('autocomplete')).toBe('changed');
  });

  it('should not throw when typing in an element with a null and disabled autocomplete', () => {
    const fixture = createComponent(InputWithoutAutocompleteAndDisabled);
    fixture.detectChanges();

    expect(() => {
      dispatchKeyboardEvent(
        fixture.nativeElement.querySelector('input'),
        'keydown',
        SPACE,
      );
      fixture.detectChanges();
    }).not.toThrow();
  });

  describe('forms integration', () => {
    let fixture: ComponentFixture<SimpleAutocomplete>;
    let input: HTMLInputElement;

    beforeEach(() => {
      fixture = createComponent(SimpleAutocomplete);
      fixture.detectChanges();

      input = fixture.debugElement.query(By.css('input')).nativeElement;
    });

    it('should update control value as user types with input value', () => {
      fixture.componentInstance.trigger.openPanel();
      fixture.detectChanges();
      zone.simulateZoneExit();

      typeInElement('a', input);
      fixture.detectChanges();

      expect(fixture.componentInstance.stateCtrl.value).toEqual('a');

      typeInElement('al', input);
      fixture.detectChanges();

      expect(fixture.componentInstance.stateCtrl.value).toEqual('al');
    });

    it('should update control value when option is selected with option value', fakeAsync(() => {
      fixture.componentInstance.trigger.openPanel();
      fixture.detectChanges();
      zone.simulateZoneExit();

      const options =
        overlayContainerElement.querySelectorAll<HTMLElement>('dt-option');
      options[1].click();
      fixture.detectChanges();

      expect(fixture.componentInstance.stateCtrl.value).toEqual({
        code: 'CA',
        name: 'California',
      });
    }));

    it('should update the control back to a string if user types after an option is selected', fakeAsync(() => {
      fixture.componentInstance.trigger.openPanel();
      fixture.detectChanges();
      zone.simulateZoneExit();

      const options =
        overlayContainerElement.querySelectorAll<HTMLElement>('dt-option');
      options[1].click();
      fixture.detectChanges();

      typeInElement('Californi', input);
      fixture.detectChanges();
      tick();

      expect(fixture.componentInstance.stateCtrl.value).toEqual('Californi');
    }));

    it('should fill the text field with display value when an option is selected', fakeAsync(() => {
      fixture.componentInstance.trigger.openPanel();
      fixture.detectChanges();
      zone.simulateZoneExit();

      const options =
        overlayContainerElement.querySelectorAll<HTMLElement>('dt-option');
      options[1].click();
      fixture.detectChanges();

      expect(input.value).toContain('California');
    }));

    it('should fill the text field with value if displayWith is not set', fakeAsync(() => {
      fixture.componentInstance.trigger.openPanel();
      fixture.detectChanges();
      zone.simulateZoneExit();

      fixture.componentInstance.panel.displayWith = null;
      fixture.componentInstance.options.toArray()[1].value = 'test value';
      fixture.detectChanges();

      const options =
        overlayContainerElement.querySelectorAll<HTMLElement>('dt-option');
      options[1].click();

      fixture.detectChanges();
      expect(input.value).toContain('test value');
    }));

    it('should fill the text field correctly if value is set to obj programmatically', fakeAsync(() => {
      fixture.componentInstance.stateCtrl.setValue({
        code: 'AL',
        name: 'Alabama',
      });
      fixture.detectChanges();
      tick();
      fixture.detectChanges();

      expect(input.value).toContain('Alabama');
    }));

    it('should clear the text field if value is reset programmatically', fakeAsync(() => {
      typeInElement('Alabama', input);
      fixture.detectChanges();
      tick();

      fixture.componentInstance.stateCtrl.reset();
      tick();

      fixture.detectChanges();
      tick();

      expect(input.value).toEqual('');
    }));

    it('should disable input in view when disabled programmatically', () => {
      const formFieldElement = fixture.debugElement.query(
        By.css('.dt-form-field'),
      ).nativeElement;

      expect(input.disabled).toBe(false);
      expect(
        formFieldElement.classList.contains('dt-form-field-disabled'),
      ).toBe(false);

      fixture.componentInstance.stateCtrl.disable();
      fixture.detectChanges();

      expect(input.disabled).toBe(true);
      expect(
        formFieldElement.classList.contains('dt-form-field-disabled'),
      ).toBe(true);
    });

    it('should mark the autocomplete control as dirty as user types', () => {
      expect(fixture.componentInstance.stateCtrl.dirty).toBe(false);

      typeInElement('a', input);
      fixture.detectChanges();

      expect(fixture.componentInstance.stateCtrl.dirty).toBe(true);
    });

    it('should mark the autocomplete control as dirty when an option is selected', fakeAsync(() => {
      expect(fixture.componentInstance.stateCtrl.dirty).toBe(false);

      fixture.componentInstance.trigger.openPanel();
      fixture.detectChanges();
      zone.simulateZoneExit();

      const options =
        overlayContainerElement.querySelectorAll<HTMLElement>('dt-option');
      options[1].click();
      fixture.detectChanges();

      expect(fixture.componentInstance.stateCtrl.dirty).toBe(true);
    }));

    it('should not mark the control dirty when the value is set programmatically', () => {
      expect(fixture.componentInstance.stateCtrl.dirty).toBe(false);

      fixture.componentInstance.stateCtrl.setValue('AL');
      fixture.detectChanges();

      expect(fixture.componentInstance.stateCtrl.dirty).toBe(false);
    });

    it('should mark the autocomplete control as touched on blur', () => {
      fixture.componentInstance.trigger.openPanel();
      fixture.detectChanges();
      expect(fixture.componentInstance.stateCtrl.touched).toBe(false);

      dispatchFakeEvent(input, 'blur');
      fixture.detectChanges();
      fixture.componentInstance.trigger.closePanel();
      fixture.detectChanges();

      expect(fixture.componentInstance.stateCtrl.touched).toBe(true);
    });

    it('should mark the autocomplete control as touched on blur if the panel is closed', () => {
      expect(fixture.componentInstance.stateCtrl.touched).toBe(false);

      dispatchFakeEvent(input, 'blur');
      fixture.detectChanges();

      expect(fixture.componentInstance.stateCtrl.touched).toBe(true);
    });

    it('should not mark the autocomplete control as touched if the input was blurred while the panel is open', () => {
      fixture.componentInstance.trigger.openPanel();
      fixture.detectChanges();

      expect(fixture.componentInstance.stateCtrl.touched).toBe(false);

      dispatchFakeEvent(input, 'blur');
      fixture.detectChanges();

      expect(fixture.componentInstance.stateCtrl.touched).toBe(false);

      fixture.componentInstance.trigger.closePanel();
      fixture.detectChanges();

      expect(fixture.componentInstance.stateCtrl.touched).toBe(true);
    });

    it('should disable the input when used with a value accessor and without `dtInput`', () => {
      overlayContainer.ngOnDestroy();
      fixture.destroy();
      TestBed.resetTestingModule();

      const plainFixture = createComponent(
        PlainAutocompleteInputWithFormControl,
      );
      plainFixture.detectChanges();
      input = plainFixture.nativeElement.querySelector('input');

      expect(input.disabled).toBe(false);

      plainFixture.componentInstance.formControl.disable();
      plainFixture.detectChanges();

      expect(input.disabled).toBe(true);
    });
  });

  describe('keyboard events', () => {
    let fixture: ComponentFixture<SimpleAutocomplete>;
    let input: HTMLInputElement;
    let DOWN_ARROW_EVENT: KeyboardEvent;
    let UP_ARROW_EVENT: KeyboardEvent;
    let ENTER_EVENT: KeyboardEvent;

    beforeEach(() => {
      fixture = createComponent(SimpleAutocomplete);
      fixture.detectChanges();

      input = fixture.debugElement.query(By.css('input')).nativeElement;
      DOWN_ARROW_EVENT = createKeyboardEvent('keydown', DOWN_ARROW);
      UP_ARROW_EVENT = createKeyboardEvent('keydown', UP_ARROW);
      ENTER_EVENT = createKeyboardEvent('keydown', ENTER);

      fixture.componentInstance.trigger.openPanel();
      fixture.detectChanges();
      zone.simulateZoneExit();
    });

    it('should not focus the option when DOWN key is pressed', fakeAsync(() => {
      jest
        .spyOn(fixture.componentInstance.options.first, 'focus')
        .mockImplementation(() => {});

      fixture.componentInstance.trigger._handleKeydown(DOWN_ARROW_EVENT);

      expect(
        fixture.componentInstance.options.first.focus,
      ).not.toHaveBeenCalled();
    }));

    it('should not close the panel when DOWN key is pressed', () => {
      fixture.componentInstance.trigger._handleKeydown(DOWN_ARROW_EVENT);

      expect(fixture.componentInstance.trigger.panelOpen).toBe(true);
      expect(overlayContainerElement.textContent).toContain('Alabama');
      expect(overlayContainerElement.textContent).toContain('California');
    });

    it('should set the active item to the first option when DOWN key is pressed', () => {
      const componentInstance = fixture.componentInstance;
      const optionEls =
        overlayContainerElement.querySelectorAll<HTMLElement>('dt-option');

      expect(componentInstance.trigger.panelOpen).toBe(true);

      componentInstance.trigger._handleKeydown(DOWN_ARROW_EVENT);
      fixture.detectChanges();

      expect(
        componentInstance.trigger.activeOption ===
          componentInstance.options.first,
      ).toBe(true);
      expect(optionEls[0].classList).toContain('dt-option-active');
      expect(optionEls[1].classList).not.toContain('dt-option-active');

      componentInstance.trigger._handleKeydown(DOWN_ARROW_EVENT);
      fixture.detectChanges();

      expect(
        componentInstance.trigger.activeOption ===
          componentInstance.options.toArray()[1],
      ).toBe(true);
      expect(optionEls[0].classList).not.toContain('dt-option-active');
      expect(optionEls[1].classList).toContain('dt-option-active');
    });

    it('should set the active item to the last option when UP key is pressed', () => {
      const componentInstance = fixture.componentInstance;
      const optionEls =
        overlayContainerElement.querySelectorAll<HTMLElement>('dt-option');

      expect(componentInstance.trigger.panelOpen).toBe(true);

      componentInstance.trigger._handleKeydown(UP_ARROW_EVENT);
      fixture.detectChanges();

      expect(
        componentInstance.trigger.activeOption ===
          componentInstance.options.last,
      ).toBe(true);
      expect(optionEls[10].classList).toContain('dt-option-active');
      expect(optionEls[0].classList).not.toContain('dt-option-active');

      componentInstance.trigger._handleKeydown(DOWN_ARROW_EVENT);
      fixture.detectChanges();

      expect(
        componentInstance.trigger.activeOption ===
          componentInstance.options.first,
      ).toBe(true);
      expect(optionEls[0].classList).toContain('dt-option-active');
    });

    it('should set the active item properly after filtering', fakeAsync(() => {
      const componentInstance = fixture.componentInstance;

      componentInstance.trigger._handleKeydown(DOWN_ARROW_EVENT);
      tick();
      fixture.detectChanges();
    }));

    it('should set the active item properly after filtering', () => {
      const componentInstance = fixture.componentInstance;

      typeInElement('o', input);
      fixture.detectChanges();

      componentInstance.trigger._handleKeydown(DOWN_ARROW_EVENT);
      fixture.detectChanges();

      const optionEls =
        overlayContainerElement.querySelectorAll<HTMLElement>('dt-option');

      expect(
        componentInstance.trigger.activeOption ===
          componentInstance.options.first,
      ).toBe(true);
      expect(optionEls[0].classList).toContain('dt-option-active');
      expect(optionEls[1].classList).not.toContain('dt-option-active');
    });

    it('should fill the text field when an option is selected with ENTER', fakeAsync(() => {
      fixture.componentInstance.trigger._handleKeydown(DOWN_ARROW_EVENT);
      flush();
      fixture.detectChanges();

      fixture.componentInstance.trigger._handleKeydown(ENTER_EVENT);
      fixture.detectChanges();
      expect(input.value).toContain('Alabama');
    }));

    it('should prevent the default enter key action', fakeAsync(() => {
      fixture.componentInstance.trigger._handleKeydown(DOWN_ARROW_EVENT);
      flush();

      fixture.componentInstance.trigger._handleKeydown(ENTER_EVENT);

      expect(ENTER_EVENT.defaultPrevented).toBe(true);
    }));

    it('should not prevent the default enter action for a closed panel after a user action', () => {
      fixture.componentInstance.trigger._handleKeydown(UP_ARROW_EVENT);
      fixture.detectChanges();

      fixture.componentInstance.trigger.closePanel();
      fixture.detectChanges();
      fixture.componentInstance.trigger._handleKeydown(ENTER_EVENT);

      expect(ENTER_EVENT.defaultPrevented).toBe(false);
    });

    it('should fill the text field, not select an option, when SPACE is entered', () => {
      typeInElement('New', input);
      fixture.detectChanges();

      const SPACE_EVENT = createKeyboardEvent('keydown', SPACE);
      fixture.componentInstance.trigger._handleKeydown(DOWN_ARROW_EVENT);
      fixture.detectChanges();

      fixture.componentInstance.trigger._handleKeydown(SPACE_EVENT);
      fixture.detectChanges();

      expect(input.value).not.toContain('New York');
    });

    it('should mark the control dirty when selecting an option from the keyboard', fakeAsync(() => {
      expect(fixture.componentInstance.stateCtrl.dirty).toBe(false);

      fixture.componentInstance.trigger._handleKeydown(DOWN_ARROW_EVENT);
      flush();
      fixture.componentInstance.trigger._handleKeydown(ENTER_EVENT);
      fixture.detectChanges();

      expect(fixture.componentInstance.stateCtrl.dirty).toBe(true);
    }));

    it('should open the panel again when typing after making a selection', fakeAsync(() => {
      fixture.componentInstance.trigger._handleKeydown(DOWN_ARROW_EVENT);
      flush();
      fixture.componentInstance.trigger._handleKeydown(ENTER_EVENT);
      fixture.detectChanges();

      expect(fixture.componentInstance.trigger.panelOpen).toBe(false);
      expect(overlayContainerElement.textContent).toEqual('');

      dispatchFakeEvent(input, 'focusin');
      typeInElement('Alabama', input);
      fixture.detectChanges();
      tick();

      expect(fixture.componentInstance.trigger.panelOpen).toBe(true);
      expect(overlayContainerElement.textContent).toContain('Alabama');
    }));

    it('should not open the panel if the `input` event was dispatched with changing the value', fakeAsync(() => {
      const trigger = fixture.componentInstance.trigger;

      dispatchFakeEvent(input, 'focusin');
      typeInElement('A', input);
      fixture.detectChanges();
      tick();

      expect(trigger.panelOpen).toBe(true);

      trigger.closePanel();
      fixture.detectChanges();

      expect(trigger.panelOpen).toBe(false);

      // Dispatch the event without actually changing the value
      // to simulate what happen in some cases on IE.
      dispatchFakeEvent(input, 'input');
      fixture.detectChanges();
      tick();

      expect(trigger.panelOpen).toBe(false);
    }));

    it('should close the panel when pressing escape', fakeAsync(() => {
      const trigger = fixture.componentInstance.trigger;

      input.focus();
      flush();
      fixture.detectChanges();

      expect(document.activeElement).toBe(input);
      expect(trigger.panelOpen).toBe(true);

      dispatchKeyboardEvent(document.body, 'keydown', ESCAPE);
      fixture.detectChanges();

      expect(document.activeElement).toBe(input);
      expect(trigger.panelOpen).toBe(false);
    }));

    it('should prevent the default action when pressing escape', fakeAsync(() => {
      const escapeEvent = dispatchKeyboardEvent(input, 'keydown', ESCAPE);
      fixture.detectChanges();

      expect(escapeEvent.defaultPrevented).toBe(true);
    }));

    it('should close the panel when pressing ALT + UP_ARROW', fakeAsync(() => {
      const trigger = fixture.componentInstance.trigger;
      const upArrowEvent = createKeyboardEvent('keydown', UP_ARROW);
      Object.defineProperty(upArrowEvent, 'altKey', { get: () => true });

      input.focus();
      flush();
      fixture.detectChanges();

      expect(document.activeElement).toBe(input);
      expect(trigger.panelOpen).toBe(true);

      dispatchEvent(document.body, upArrowEvent);
      fixture.detectChanges();

      expect(document.activeElement).toBe(input);
      expect(trigger.panelOpen).toBe(false);
    }));

    it('should close the panel when tabbing away from a trigger without results', fakeAsync(() => {
      fixture.componentInstance.states = [];
      fixture.componentInstance.filteredStates = [];
      fixture.detectChanges();
      input.focus();
      flush();

      expect(
        overlayContainerElement.querySelector('.dt-autocomplete-panel'),
      ).toBeTruthy();

      dispatchKeyboardEvent(input, 'keydown', TAB);
      fixture.detectChanges();

      expect(
        overlayContainerElement.querySelector('.dt-autocomplete-panel'),
      ).toBeFalsy();
    }));

    it('should reset the active option when closing with the escape key', fakeAsync(() => {
      const trigger = fixture.componentInstance.trigger;

      trigger.openPanel();
      fixture.detectChanges();
      tick();

      expect(trigger.panelOpen).toBe(true);
      expect(!!trigger.activeOption).toBe(false);

      // Press the down arrow a few times.
      [1, 2, 3].forEach(() => {
        trigger._handleKeydown(DOWN_ARROW_EVENT);
        tick();
        fixture.detectChanges();
      });

      expect(!!trigger.activeOption).toBe(true);

      dispatchKeyboardEvent(document.body, 'keydown', ESCAPE);
      tick();

      expect(!!trigger.activeOption).toBe(false);
    }));

    it('should reset the active option when closing by selecting with enter', fakeAsync(() => {
      const trigger = fixture.componentInstance.trigger;

      trigger.openPanel();
      fixture.detectChanges();
      tick();

      expect(trigger.panelOpen).toBe(true);
      expect(!!trigger.activeOption).toBe(false);

      // Press the down arrow a few times.
      [1, 2, 3].forEach(() => {
        trigger._handleKeydown(DOWN_ARROW_EVENT);
        tick();
        fixture.detectChanges();
      });

      // Note that this casts to a boolean, in order to prevent jest
      // from crashing when trying to stringify the option if the test fails.
      expect(!!trigger.activeOption).toBe(true);

      trigger._handleKeydown(ENTER_EVENT);
      tick();

      expect(!!trigger.activeOption).toBe(false);
    }));
  });

  describe('aria', () => {
    let fixture: ComponentFixture<SimpleAutocomplete>;
    let input: HTMLInputElement;

    beforeEach(() => {
      fixture = createComponent(SimpleAutocomplete);
      fixture.detectChanges();

      input = fixture.debugElement.query(By.css('input')).nativeElement;
    });

    it('should set role of input to combobox', () => {
      expect(input.getAttribute('role')).toEqual('combobox');
    });

    it('should set role of autocomplete panel to listbox', () => {
      fixture.componentInstance.trigger.openPanel();
      fixture.detectChanges();

      const panel = fixture.debugElement.query(
        By.css('.dt-autocomplete-panel'),
      ).nativeElement;

      expect(panel.getAttribute('role')).toEqual('listbox');
    });

    it('should set aria-autocomplete to list', () => {
      expect(input.getAttribute('aria-autocomplete')).toEqual('list');
    });

    it('should set aria-activedescendant based on the active option', fakeAsync(() => {
      fixture.componentInstance.trigger.openPanel();
      fixture.detectChanges();

      expect(input.hasAttribute('aria-activedescendant')).toBe(false);

      const DOWN_ARROW_EVENT = createKeyboardEvent('keydown', DOWN_ARROW);

      fixture.componentInstance.trigger._handleKeydown(DOWN_ARROW_EVENT);
      tick();
      fixture.detectChanges();

      expect(input.getAttribute('aria-activedescendant')).toEqual(
        fixture.componentInstance.options.first.id,
      );

      fixture.componentInstance.trigger._handleKeydown(DOWN_ARROW_EVENT);
      tick();
      fixture.detectChanges();

      expect(input.getAttribute('aria-activedescendant')).toEqual(
        fixture.componentInstance.options.toArray()[1].id,
      );
    }));

    it('should set aria-expanded based on whether the panel is open', () => {
      expect(input.getAttribute('aria-expanded')).toBe('false');

      fixture.componentInstance.trigger.openPanel();
      fixture.detectChanges();

      expect(input.getAttribute('aria-expanded')).toBe('true');

      fixture.componentInstance.trigger.closePanel();
      fixture.detectChanges();

      expect(input.getAttribute('aria-expanded')).toBe('false');
    });

    it('should set aria-expanded properly when the panel is hidden', fakeAsync(() => {
      fixture.componentInstance.trigger.openPanel();
      fixture.detectChanges();
      expect(input.getAttribute('aria-expanded')).toBe('true');

      typeInElement('zz', input);
      fixture.detectChanges();
      tick();
      fixture.detectChanges();

      expect(input.getAttribute('aria-expanded')).toBe('false');
    }));

    it('should set aria-owns based on the attached autocomplete', () => {
      fixture.componentInstance.trigger.openPanel();
      fixture.detectChanges();

      const panel = fixture.debugElement.query(
        By.css('.dt-autocomplete-panel'),
      ).nativeElement;

      expect(input.getAttribute('aria-owns')).toBe(panel.getAttribute('id'));
    });

    it('should not set aria-owns while the autocomplete is closed', () => {
      expect(input.getAttribute('aria-owns')).toBeFalsy();

      fixture.componentInstance.trigger.openPanel();
      fixture.detectChanges();

      expect(input.getAttribute('aria-owns')).toBeTruthy();
    });

    it('should restore focus to the input when clicking to select a value', fakeAsync(() => {
      fixture.componentInstance.trigger.openPanel();
      fixture.detectChanges();
      zone.simulateZoneExit();

      const option = overlayContainerElement.querySelector(
        'dt-option',
      ) as HTMLElement;

      // Focus the option manually since the synthetic click may not do it.
      option.focus();
      option.click();
      fixture.detectChanges();

      expect(document.activeElement).toBe(input);
    }));

    it('should remove autocomplete-specific aria attributes when autocomplete is disabled', () => {
      fixture.componentInstance.autocompleteDisabled = true;
      fixture.detectChanges();

      expect(input.getAttribute('role')).toBeFalsy();
      expect(input.getAttribute('aria-autocomplete')).toBeFalsy();
      expect(input.getAttribute('aria-expanded')).toBeFalsy();
      expect(input.getAttribute('aria-owns')).toBeFalsy();
    });
  });

  describe('Option selection', () => {
    let fixture: ComponentFixture<SimpleAutocomplete>;

    beforeEach(() => {
      fixture = createComponent(SimpleAutocomplete);
      fixture.detectChanges();
    });

    it('should deselect any other selected option', fakeAsync(() => {
      fixture.componentInstance.trigger.openPanel();
      fixture.detectChanges();

      let options =
        overlayContainerElement.querySelectorAll<HTMLElement>('dt-option');
      options[0].click();
      fixture.detectChanges();
      zone.simulateZoneExit();
      fixture.detectChanges();

      const componentOptions = fixture.componentInstance.options.toArray();
      expect(componentOptions[0].selected).toBe(true);

      options =
        overlayContainerElement.querySelectorAll<HTMLElement>('dt-option');
      options[1].click();
      fixture.detectChanges();

      expect(componentOptions[0].selected).toBe(false);
      expect(componentOptions[1].selected).toBe(true);
    }));

    it('should call deselect only on the previous selected option', fakeAsync(() => {
      fixture.componentInstance.trigger.openPanel();
      fixture.detectChanges();

      let options =
        overlayContainerElement.querySelectorAll<HTMLElement>('dt-option');
      options[0].click();
      fixture.detectChanges();
      zone.simulateZoneExit();
      fixture.detectChanges();

      const componentOptions = fixture.componentInstance.options.toArray();
      componentOptions.forEach((option) => jest.spyOn(option, 'deselect'));

      expect(componentOptions[0].selected).toBe(true);

      options =
        overlayContainerElement.querySelectorAll<HTMLElement>('dt-option');
      options[1].click();
      fixture.detectChanges();

      expect(componentOptions[0].deselect).toHaveBeenCalled();
      componentOptions
        .slice(1)
        .forEach((option) => expect(option.deselect).not.toHaveBeenCalled());
    }));

    it('should be able to preselect the first option', fakeAsync(() => {
      fixture.componentInstance.trigger.autocomplete.autoActiveFirstOption =
        true;
      fixture.componentInstance.trigger.openPanel();
      fixture.detectChanges();
      zone.simulateZoneExit();
      fixture.detectChanges();

      expect(
        overlayContainerElement.querySelectorAll('dt-option')[0].classList,
      ).toContain('dt-option-active');
    }));

    it('should be able to preselect the first option on focus', fakeAsync(() => {
      const input = fixture.debugElement.query(By.css('input')).nativeElement;
      fixture.componentInstance.trigger.autocomplete.autoActiveFirstOption =
        true;
      fixture.detectChanges();

      dispatchFakeEvent(input, 'focusin');
      zone.simulateZoneExit();

      expect(
        overlayContainerElement.querySelectorAll('dt-option')[0].classList,
      ).toContain('dt-option-active');
    }));

    it('should be able to configure preselecting the first option globally', fakeAsync(() => {
      overlayContainer.ngOnDestroy();
      fixture.destroy();
      TestBed.resetTestingModule();
      fixture = createComponent(SimpleAutocomplete, [
        {
          provide: DT_AUTOCOMPLETE_DEFAULT_OPTIONS,
          useValue: { autoActiveFirstOption: true },
        },
      ]);

      fixture.detectChanges();
      fixture.componentInstance.trigger.openPanel();
      fixture.detectChanges();
      zone.simulateZoneExit();
      fixture.detectChanges();

      expect(
        overlayContainerElement.querySelectorAll('dt-option')[0].classList,
      ).toContain('dt-option-active');
    }));

    it('should emit to `optionSelections` if the list of options changes', () => {
      const spied = jest.spyOn(
        fixture.componentInstance.trigger.optionSelections,
        'subscribe',
      );

      const openAndSelectFirstOption = () => {
        fixture.detectChanges();
        fixture.componentInstance.trigger.openPanel();
        fixture.detectChanges();
        zone.simulateZoneExit();
        (
          overlayContainerElement.querySelector('dt-option') as HTMLElement
        ).click();
        fixture.detectChanges();
        zone.simulateZoneExit();
      };

      fixture.componentInstance.states = [{ code: 'OR', name: 'Oregon' }];
      fixture.detectChanges();

      openAndSelectFirstOption();
      expect(spied).toHaveBeenCalledTimes(1);

      fixture.componentInstance.states = [
        { code: 'WV', name: 'West Virginia' },
      ];
      fixture.detectChanges();

      openAndSelectFirstOption();
      expect(spied).toHaveBeenCalledTimes(2);
    });
  });

  describe('panel closing', () => {
    let fixture: ComponentFixture<SimpleAutocomplete>;
    let input: HTMLInputElement;
    let trigger: DtAutocompleteTrigger<any>;
    let closingActionSpy: any;
    let closingActionsSub: Subscription;

    beforeEach(fakeAsync(() => {
      fixture = createComponent(SimpleAutocomplete);
      fixture.detectChanges();

      input = fixture.debugElement.query(By.css('input')).nativeElement;

      fixture.componentInstance.trigger.openPanel();
      fixture.detectChanges();
      flush();

      trigger = fixture.componentInstance.trigger;

      closingActionSpy = jest.fn();
      closingActionsSub =
        trigger.panelClosingActions.subscribe(closingActionSpy);
    }));

    afterEach(() => {
      closingActionsSub.unsubscribe();
    });

    it('should emit panel close event when clicking away', () => {
      expect(closingActionSpy).not.toHaveBeenCalled();
      dispatchFakeEvent(document, 'click');
      expect(closingActionSpy).toHaveBeenCalledWith(null);
    });

    it('should emit panel close event when tabbing out', () => {
      const tabEvent = createKeyboardEvent('keydown', TAB);
      input.focus();

      expect(closingActionSpy).not.toHaveBeenCalled();
      trigger._handleKeydown(tabEvent);
      expect(closingActionSpy).toHaveBeenCalledWith(null);
    });

    it('should not emit when tabbing away from a closed panel', () => {
      const tabEvent = createKeyboardEvent('keydown', TAB);

      input.focus();
      zone.simulateZoneExit();

      trigger._handleKeydown(tabEvent);

      // Ensure that it emitted once while the panel was open.
      expect(closingActionSpy).toHaveBeenCalledTimes(1);

      trigger._handleKeydown(tabEvent);

      // Ensure that it didn't emit again when tabbing out again.
      expect(closingActionSpy).toHaveBeenCalledTimes(1);
    });

    it('should emit panel close event when selecting an option', () => {
      const option = overlayContainerElement.querySelector(
        'dt-option',
      ) as HTMLElement;

      expect(closingActionSpy).not.toHaveBeenCalled();
      option.click();
      expect(closingActionSpy).toHaveBeenCalledWith(
        expect.any(DtOptionSelectionChange),
      );
    });

    it('should close the panel when pressing escape', () => {
      expect(closingActionSpy).not.toHaveBeenCalled();
      dispatchKeyboardEvent(document.body, 'keydown', ESCAPE);
      expect(closingActionSpy).toHaveBeenCalledWith(null);
    });
  });

  describe('without dtInput', () => {
    let fixture: ComponentFixture<AutocompleteWithNativeInput>;

    beforeEach(() => {
      fixture = createComponent(AutocompleteWithNativeInput);
      fixture.detectChanges();
    });

    it('should not throw when clicking outside', fakeAsync(() => {
      dispatchFakeEvent(
        fixture.debugElement.query(By.css('input')).nativeElement,
        'focus',
      );
      fixture.detectChanges();
      flush();

      expect(() => dispatchFakeEvent(document, 'click')).not.toThrow();
    }));
  });

  describe('misc', () => {
    it('should allow basic use without any forms directives', () => {
      expect(() => {
        const fixture = createComponent(AutocompleteWithoutForms);
        fixture.detectChanges();

        const input = fixture.debugElement.query(By.css('input')).nativeElement;
        typeInElement('d', input);
        fixture.detectChanges();

        const options =
          overlayContainerElement.querySelectorAll<HTMLElement>('dt-option');
        expect(options.length).toBe(1);
      }).not.toThrowError();
    });

    it('should display an empty input when the value is undefined with ngModel', () => {
      const fixture = createComponent(AutocompleteWithNgModel);
      fixture.detectChanges();

      expect(
        fixture.debugElement.query(By.css('input')).nativeElement.value,
      ).toBe('');
    });

    it('should display the number when the selected option is the number zero', fakeAsync(() => {
      const fixture = createComponent(AutocompleteWithNumbers);

      fixture.componentInstance.selectedNumber = 0;
      fixture.detectChanges();
      tick();

      expect(
        fixture.debugElement.query(By.css('input')).nativeElement.value,
      ).toBe('0');
    }));

    it('should work when input is wrapped in ngIf', () => {
      const fixture = createComponent(NgIfAutocomplete);
      fixture.detectChanges();

      dispatchFakeEvent(
        fixture.debugElement.query(By.css('input')).nativeElement,
        'focusin',
      );
      fixture.detectChanges();
      expect(fixture.componentInstance.trigger.panelOpen).toBe(true);
      expect(overlayContainerElement.textContent).toContain('One');
      expect(overlayContainerElement.textContent).toContain('Two');
    });

    it('should filter properly with ngIf after setting the active item', () => {
      const fixture = createComponent(NgIfAutocomplete);
      fixture.detectChanges();

      fixture.componentInstance.trigger.openPanel();
      fixture.detectChanges();

      const DOWN_ARROW_EVENT = createKeyboardEvent('keydown', DOWN_ARROW);
      fixture.componentInstance.trigger._handleKeydown(DOWN_ARROW_EVENT);
      fixture.detectChanges();

      const input = fixture.debugElement.query(By.css('input')).nativeElement;
      typeInElement('o', input);
      fixture.detectChanges();

      expect(fixture.componentInstance.dtOptions.length).toBe(2);
    });

    it('should throw if the user attempts to open the panel too early', () => {
      const fixture = createComponent(AutocompleteWithoutPanel);
      fixture.detectChanges();

      expect(() => {
        fixture.componentInstance.trigger.openPanel();
      }).toThrow(getDtAutocompleteMissingPanelError());
    });

    it('should not throw on init, even if the panel is not defined', fakeAsync(() => {
      expect(() => {
        const fixture = createComponent(AutocompleteWithoutPanel);
        fixture.componentInstance.control.setValue('Something');
        fixture.detectChanges();
        tick();
      }).not.toThrow();
    }));

    it('should handle autocomplete being attached to number inputs', fakeAsync(() => {
      const fixture = createComponent(AutocompleteWithNumberInputAndNgModel);
      fixture.detectChanges();
      const input = fixture.debugElement.query(By.css('input')).nativeElement;

      typeInElement('1337', input);
      fixture.detectChanges();

      expect(fixture.componentInstance.selectedValue).toBe(1337);
    }));

    it('should work when dynamically changing the autocomplete', () => {
      const fixture = createComponent(DynamicallyChangingAutocomplete);
      fixture.detectChanges();
      const input = fixture.debugElement.query(By.css('input')).nativeElement;

      dispatchFakeEvent(input, 'focusin');
      fixture.detectChanges();

      expect(overlayContainerElement.textContent).toContain('First');
      expect(overlayContainerElement.textContent).not.toContain('Second');

      // close overlay
      dispatchFakeEvent(document, 'click');
      fixture.detectChanges();

      // Switch to second autocomplete
      fixture.componentInstance.trigger.autocomplete =
        fixture.componentInstance.autoTow;
      fixture.detectChanges();

      // reopen agian
      dispatchFakeEvent(input, 'focusin');
      fixture.detectChanges();

      expect(overlayContainerElement.textContent).not.toContain('First');
      expect(overlayContainerElement.textContent).toContain('Second');
    });

    it('should transfer the dt-autocomplete classes to the panel element', fakeAsync(() => {
      const fixture = createComponent(SimpleAutocomplete);
      fixture.detectChanges();

      fixture.componentInstance.trigger.openPanel();
      tick();
      fixture.detectChanges();

      const autocomplete =
        fixture.debugElement.nativeElement.querySelector('dt-autocomplete');
      const panel = overlayContainerElement.querySelector(
        '.dt-autocomplete-panel',
      )!;

      expect(autocomplete.classList).not.toContain('class-one');
      expect(autocomplete.classList).not.toContain('class-two');

      expect(panel.classList).toContain('class-one');
      expect(panel.classList).toContain('class-two');
    }));
  });
  describe('propagate attribute to overlay', () => {
    it('should propagate attribute to overlay when `dt-ui-test-id` is provided', () => {
      const fixture: ComponentFixture<PropagateAttribute> =
        createComponent(PropagateAttribute);
      fixture.detectChanges();
      const trigger = fixture.componentInstance.trigger;
      trigger.openPanel();
      const overlay = overlayContainerElement.querySelector(
        '.dt-autocomplete-panel',
      )!.parentElement;
      expect(overlay!.outerHTML).toContain(
        'dt-ui-test-id="autocomplete-overlay"',
      );
    });
  });
  describe('additional programmatic options', () => {
    it('should add the additional option at the end of the normal content projected options', () => {
      const fixture: ComponentFixture<PropagateAttribute> =
        createComponent(ProgrammaticOptions);
      fixture.detectChanges();
      const trigger = fixture.componentInstance.trigger;
      trigger.openPanel();
      fixture.detectChanges();
      expect(overlayContainerElement.textContent).toContain('First');
      expect(overlayContainerElement.textContent).toContain('Second');
    });
  });
});

@Component({
  template: `
    <dt-form-field [style.width.px]="width">
      <input
        dtInput
        placeholder="State"
        [dtAutocomplete]="auto"
        [dtAutocompleteDisabled]="autocompleteDisabled"
        [formControl]="stateCtrl"
      />
    </dt-form-field>
    <dt-autocomplete
      class="class-one class-two"
      #auto="dtAutocomplete"
      [displayWith]="displayFn"
      (opened)="openedSpy()"
      (closed)="closedSpy()"
    >
      <dt-option *ngFor="let state of filteredStates" [value]="state">
        <span>{{ state.code }}: {{ state.name }}</span>
      </dt-option>
    </dt-autocomplete>
  `,
})
class SimpleAutocomplete implements OnDestroy {
  stateCtrl = new FormControl();
  filteredStates: any[];
  valueSub: Subscription;
  width: number;
  autocompleteDisabled = false;
  openedSpy = jest.fn();
  closedSpy = jest.fn();

  @ViewChild(DtAutocompleteTrigger)
  trigger: DtAutocompleteTrigger<any>;
  @ViewChild(DtAutocomplete) panel: DtAutocomplete<any>;
  @ViewChild(DtFormField) formField: DtFormField<any>;
  @ViewChildren(DtOption) options: QueryList<DtOption<any>>;

  states = [
    { code: 'AL', name: 'Alabama' },
    { code: 'CA', name: 'California' },
    { code: 'FL', name: 'Florida' },
    { code: 'KS', name: 'Kansas' },
    { code: 'MA', name: 'Massachusetts' },
    { code: 'NY', name: 'New York' },
    { code: 'OR', name: 'Oregon' },
    { code: 'PA', name: 'Pennsylvania' },
    { code: 'TN', name: 'Tennessee' },
    { code: 'VA', name: 'Virginia' },
    { code: 'WY', name: 'Wyoming' },
  ];

  constructor() {
    this.filteredStates = this.states;
    this.valueSub = this.stateCtrl.valueChanges.subscribe((val) => {
      this.filteredStates = val
        ? this.states.filter((s) => s.name.match(new RegExp(val, 'gi')))
        : this.states;
    });
  }

  displayFn(value: any): string {
    return value ? value.name : value;
  }

  ngOnDestroy(): void {
    this.valueSub.unsubscribe();
  }
}

@Component({
  template: `
    <input autocomplete="changed" [(ngModel)]="value" [dtAutocomplete]="auto" />
    <dt-autocomplete #auto="dtAutocomplete"></dt-autocomplete>
  `,
})
class AutocompleteWithNativeAutocompleteAttribute {
  value: string;
}

@Component({
  template: '<input [dtAutocomplete]="null" dtAutocompleteDisabled>',
})
class InputWithoutAutocompleteAndDisabled {}

@Component({
  template: `
    <input [formControl]="formControl" [dtAutocomplete]="auto" />
    <dt-autocomplete #auto="dtAutocomplete"></dt-autocomplete>
  `,
})
class PlainAutocompleteInputWithFormControl {
  formControl = new FormControl();
}

@Component({
  template: `
    <input
      placeholder="Choose"
      [dtAutocomplete]="auto"
      [formControl]="optionCtrl"
    />
    <dt-autocomplete #auto="dtAutocomplete">
      <dt-option
        *ngFor="let option of filteredOptions | async"
        [value]="option"
      >
        {{ option }}
      </dt-option>
    </dt-autocomplete>
  `,
})
class AutocompleteWithNativeInput {
  optionCtrl = new FormControl();
  filteredOptions: Observable<any>;
  options = ['En', 'To', 'Tre', 'Fire', 'Fem'];

  @ViewChild(DtAutocompleteTrigger)
  trigger: DtAutocompleteTrigger<any>;
  @ViewChildren(DtOption) dtOptions: QueryList<DtOption<any>>;

  constructor() {
    this.filteredOptions = this.optionCtrl.valueChanges.pipe(
      startWith(null),
      map((val: string) =>
        val
          ? this.options.filter((option) => new RegExp(val, 'gi').test(option))
          : this.options.slice(),
      ),
    );
  }
}

@Component({
  template: `
    <dt-form-field>
      <input
        dtInput
        placeholder="State"
        [dtAutocomplete]="auto"
        (input)="onInput($event.target?.value)"
      />
    </dt-form-field>
    <dt-autocomplete #auto="dtAutocomplete">
      <dt-option *ngFor="let state of filteredStates" [value]="state">
        <span>{{ state }}</span>
      </dt-option>
    </dt-autocomplete>
  `,
})
class AutocompleteWithoutForms {
  filteredStates: any[];
  states = ['Alabama', 'California', 'Florida'];

  constructor() {
    this.filteredStates = this.states.slice();
  }

  onInput(value: any): void {
    this.filteredStates = this.states.filter((s) =>
      new RegExp(value, 'gi').test(s),
    );
  }
}

@Component({
  template: `
    <dt-form-field>
      <input
        dtInput
        placeholder="State"
        [dtAutocomplete]="auto"
        [(ngModel)]="selectedState"
        (ngModelChange)="onInput($event)"
      />
    </dt-form-field>
    <dt-autocomplete #auto="dtAutocomplete">
      <dt-option *ngFor="let state of filteredStates" [value]="state">
        <span>{{ state }}</span>
      </dt-option>
    </dt-autocomplete>
  `,
})
class AutocompleteWithNgModel {
  filteredStates: any[];
  selectedState: string;
  states = ['New York', 'Washington', 'Oregon'];

  constructor() {
    this.filteredStates = this.states.slice();
  }

  onInput(value: any): void {
    this.filteredStates = this.states.filter((s) =>
      new RegExp(value, 'gi').test(s),
    );
  }
}

@Component({
  template: `
    <dt-form-field>
      <input
        dtInput
        placeholder="Number"
        [dtAutocomplete]="auto"
        [(ngModel)]="selectedNumber"
      />
    </dt-form-field>
    <dt-autocomplete #auto="dtAutocomplete">
      <dt-option *ngFor="let number of numbers" [value]="number">
        <span>{{ number }}</span>
      </dt-option>
    </dt-autocomplete>
  `,
})
class AutocompleteWithNumbers {
  selectedNumber: number;
  numbers = [0, 1, 2];
}

@Component({
  template: `
    <dt-form-field *ngIf="isVisible">
      <input
        dtInput
        placeholder="Choose"
        [dtAutocomplete]="auto"
        [formControl]="optionCtrl"
      />
    </dt-form-field>
    <dt-autocomplete #auto="dtAutocomplete">
      <dt-option
        *ngFor="let option of filteredOptions | async"
        [value]="option"
      >
        {{ option }}
      </dt-option>
    </dt-autocomplete>
  `,
})
class NgIfAutocomplete {
  optionCtrl = new FormControl();
  filteredOptions: Observable<any>;
  isVisible = true;
  options = ['One', 'Two', 'Three'];

  @ViewChild(DtAutocompleteTrigger)
  trigger: DtAutocompleteTrigger<any>;
  @ViewChildren(DtOption) dtOptions: QueryList<DtOption<any>>;

  constructor() {
    this.filteredOptions = this.optionCtrl.valueChanges.pipe(
      startWith(null),
      map((val: string) =>
        val
          ? this.options.filter((option) => new RegExp(val, 'gi').test(option))
          : this.options.slice(),
      ),
    );
  }
}

@Component({
  template: `
    <input
      placeholder="Choose"
      [dtAutocomplete]="auto"
      [formControl]="control"
    />
  `,
})
class AutocompleteWithoutPanel {
  @ViewChild(DtAutocompleteTrigger)
  trigger: DtAutocompleteTrigger<any>;
  control = new FormControl();
}

@Component({
  template: `
    <dt-form-field>
      <input
        type="number"
        dtInput
        [dtAutocomplete]="auto"
        [(ngModel)]="selectedValue"
      />
    </dt-form-field>
    <dt-autocomplete #auto="dtAutocomplete">
      <dt-option *ngFor="let value of values" [value]="value">
        {{ value }}
      </dt-option>
    </dt-autocomplete>
  `,
})
class AutocompleteWithNumberInputAndNgModel {
  selectedValue: number;
  values = [1, 2, 3];
}

@Component({
  template: `
    <input type="number" dtInput [dtAutocomplete]="autoOne" />
    <dt-autocomplete #autoOne>
      <dt-option [value]="0">First</dt-option>
    </dt-autocomplete>
    <dt-autocomplete #autoTow>
      <dt-option [value]="1">Second</dt-option>
    </dt-autocomplete>
  `,
})
class DynamicallyChangingAutocomplete {
  @ViewChild('autoOne') autoOne: DtAutocomplete<any>;
  @ViewChild('autoTow') autoTow: DtAutocomplete<any>;
  @ViewChild(DtAutocompleteTrigger)
  trigger: DtAutocompleteTrigger<any>;
}

@Component({
  template: `
    <input
      #input
      dt-ui-test-id="autocomplete"
      class="test"
      type="number"
      dtInput
      [dtAutocomplete]="auto"
    />
    <dt-autocomplete #auto>
      <dt-option [value]="0">First</dt-option>
    </dt-autocomplete>
  `,
})
class PropagateAttribute {
  @ViewChild(DtAutocompleteTrigger, { static: false })
  trigger: DtAutocompleteTrigger<any>;
}

@Component({
  template: `
    <input
      #input
      dt-ui-test-id="autocomplete"
      class="test"
      type="text"
      dtInput
      [dtAutocomplete]="auto"
    />
    <dt-autocomplete #auto>
      <dt-option [value]="0">First</dt-option>
    </dt-autocomplete>

    <ng-template>
      <dt-option [value]="1">Second</dt-option>
    </ng-template>
  `,
})
class ProgrammaticOptions implements AfterViewInit {
  @ViewChild(DtAutocompleteTrigger, { static: false })
  trigger: DtAutocompleteTrigger<any>;

  @ViewChild(TemplateRef) templateRef: TemplateRef<unknown>;

  @ViewChild(DtAutocomplete, { static: true })
  autocomplete: DtAutocomplete<number>;

  @ViewChildren(DtOption) options: QueryList<DtOption<any>>;

  constructor(private _viewContainerRef: ViewContainerRef) {}

  ngAfterViewInit(): void {
    this.autocomplete._additionalPortal = new TemplatePortal(
      this.templateRef,
      this._viewContainerRef,
    );
    this.autocomplete._additionalOptions = [this.options.last];
  }
}
