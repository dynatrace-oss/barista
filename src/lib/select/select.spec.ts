// tslint:disable no-lifecycle-call no-use-before-declare no-magic-numbers
// tslint:disable no-any max-file-line-count no-unbound-method use-component-selector

import { async, ComponentFixture, TestBed, inject, fakeAsync, flush, tick } from '@angular/core/testing';
import { Component, ViewChild, QueryList, ViewChildren, ChangeDetectionStrategy } from '@angular/core';
import { By } from '@angular/platform-browser';
import { DtSelectModule, DtSelect, DtFormFieldModule, DtOption, DtIconModule, DtOptionSelectionChange, getDtSelectNonFunctionValueError, ErrorStateMatcher } from '@dynatrace/angular-components';
import { FormControl, FormsModule, ReactiveFormsModule, FormGroupDirective, FormGroup, Validators } from '@angular/forms';
import { OverlayContainer } from '@angular/cdk/overlay';
import { Subscription } from 'rxjs';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { Platform } from '@angular/cdk/platform';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { DOWN_ARROW, UP_ARROW, RIGHT_ARROW, LEFT_ARROW, SPACE, ENTER, HOME, TAB, END } from '@angular/cdk/keycodes';
import { dispatchKeyboardEvent, dispatchEvent, dispatchFakeEvent } from '../../testing/dispatch-events';
import { createKeyboardEvent } from '../../testing/event-objects';
import { map } from 'rxjs/operators';
import { wrappedErrorMessage } from '../../testing/wrapped-error-message';

// tslint:disable:no-any i18n no-magic-numbers max-file-line-count

describe('DtSelect', () => {
  let overlayContainer: OverlayContainer;
  let overlayContainerElement: HTMLElement;

  function configureDtSelectTestingModule(declarations: any[]): void {
    TestBed.configureTestingModule({
      imports: [
        DtFormFieldModule,
        DtSelectModule,
        ReactiveFormsModule,
        FormsModule,
        NoopAnimationsModule,
        HttpClientTestingModule,
        DtIconModule.forRoot({ svgIconLocation: `{{name}}.svg` }),
      ],
      declarations,
    }).compileComponents();

    inject([OverlayContainer, Platform], (oc: OverlayContainer, p: Platform) => {
      overlayContainer = oc;
      overlayContainerElement = oc.getContainerElement();
      // platform = p;
    })();
  }

  afterEach(() => {
    overlayContainer.ngOnDestroy();
  });

  describe('core', () => {
    beforeEach(async(() => {
      configureDtSelectTestingModule([
        BasicSelect,
        SelectWithGroups,
        SelectWithGroupsAndNgContainer,
        SelectWithFormFieldLabel,
        SelectWithOptionValueZero,
      ]);
    }));

    describe('accessibility', () => {
      describe('for select', () => {
        let fixture: ComponentFixture<BasicSelect>;
        let select: HTMLElement;

        beforeEach(fakeAsync(() => {
          fixture = TestBed.createComponent(BasicSelect);
          fixture.detectChanges();
          select = fixture.debugElement.query(By.css('dt-select')).nativeElement;
        }));

        it('should set the role of the select to listbox', fakeAsync(() => {
          expect(select.getAttribute('role')).toEqual('listbox');
        }));

        it('should set the aria label of the select to the placeholder', fakeAsync(() => {
          expect(select.getAttribute('aria-label')).toEqual('Food');
        }));

        it('should support setting a custom aria-label', fakeAsync(() => {
          fixture.componentInstance.ariaLabel = 'Custom Label';
          fixture.detectChanges();

          expect(select.getAttribute('aria-label')).toEqual('Custom Label');
        }));

        it('should not set an aria-label if aria-labelledby is specified', fakeAsync(() => {
          fixture.componentInstance.ariaLabelledby = 'myLabelId';
          fixture.detectChanges();

          expect(select.getAttribute('aria-label')).toBeFalsy('Expected no aria-label to be set.');
          expect(select.getAttribute('aria-labelledby')).toBe('myLabelId');
        }));

        it('should not have aria-labelledby in the DOM if it`s not specified', fakeAsync(() => {
          fixture.detectChanges();
          expect(select.hasAttribute('aria-labelledby')).toBeFalsy();
        }));

        it('should set the tabindex of the select to 0 by default', fakeAsync(() => {
          expect(select.getAttribute('tabindex')).toEqual('0');
        }));

        it('should be able to override the tabindex', fakeAsync(() => {
          fixture.componentInstance.tabIndexOverride = 3;
          fixture.detectChanges();

          expect(select.getAttribute('tabindex')).toBe('3');
        }));

        it('should set aria-required for required selects', fakeAsync(() => {
          expect(select.getAttribute('aria-required'))
            .toEqual('false', `Expected aria-required attr to be false for normal selects.`);

          fixture.componentInstance.isRequired = true;
          fixture.detectChanges();

          expect(select.getAttribute('aria-required'))
            .toEqual('true', `Expected aria-required attr to be true for required selects.`);
        }));

        it('should set the dt-select-required class for required selects', fakeAsync(() => {
          expect(select.classList).not.toContain(
            'dt-select-required', `Expected the dt-select-required class not to be set.`);

          fixture.componentInstance.isRequired = true;
          fixture.detectChanges();

          expect(select.classList).toContain(
            'dt-select-required', `Expected the dt-select-required class to be set.`);
        }));

        it('should set aria-invalid for selects that are invalid and touched', fakeAsync(() => {
          expect(select.getAttribute('aria-invalid'))
            .toEqual('false', `Expected aria-invalid attr to be false for valid selects.`);

          fixture.componentInstance.isRequired = true;
          fixture.componentInstance.control.markAsDirty();
          fixture.detectChanges();

          expect(select.getAttribute('aria-invalid'))
            .toEqual('true', `Expected aria-invalid attr to be true for invalid selects.`);
        }));

        it('should set aria-disabled for disabled selects', fakeAsync(() => {
          expect(select.getAttribute('aria-disabled')).toEqual('false');

          fixture.componentInstance.control.disable();
          fixture.detectChanges();

          expect(select.getAttribute('aria-disabled')).toEqual('true');
        }));

        it('should set the tabindex of the select to -1 if disabled', fakeAsync(() => {
          fixture.componentInstance.control.disable();
          fixture.detectChanges();
          expect(select.getAttribute('tabindex')).toEqual('-1');

          fixture.componentInstance.control.enable();
          fixture.detectChanges();
          expect(select.getAttribute('tabindex')).toEqual('0');
        }));

        it('should set `aria-labelledby` to form field label if there is no placeholder', () => {
          fixture.destroy();

          const labelFixture = TestBed.createComponent(SelectWithFormFieldLabel);
          labelFixture.detectChanges();
          select = labelFixture.debugElement.query(By.css('dt-select')).nativeElement;

          expect(select.getAttribute('aria-labelledby')).toBeTruthy();
          expect(select.getAttribute('aria-labelledby'))
            .toBe(labelFixture.nativeElement.querySelector('label').getAttribute('id'));
        });

        it('should not set `aria-labelledby` if there is a placeholder', () => {
          fixture.destroy();

          const labelFixture = TestBed.createComponent(SelectWithFormFieldLabel);
          labelFixture.componentInstance.placeholder = 'Thing selector';
          labelFixture.detectChanges();
          select = labelFixture.debugElement.query(By.css('dt-select')).nativeElement;

          expect(select.getAttribute('aria-labelledby')).toBeFalsy();
        });

        it('should select options via the UP/DOWN arrow keys on a closed select', fakeAsync(() => {
          const formControl = fixture.componentInstance.control;
          const options = fixture.componentInstance.options.toArray();

          expect(formControl.value).toBeFalsy('Expected no initial value.');

          dispatchKeyboardEvent(select, 'keydown', DOWN_ARROW);

          expect(options[0].selected).toBe(true, 'Expected first option to be selected.');
          expect(formControl.value).toBe(options[0].value, 'Expected value from first option to have been set on the model.');

          dispatchKeyboardEvent(select, 'keydown', DOWN_ARROW);
          dispatchKeyboardEvent(select, 'keydown', DOWN_ARROW);

          // Note that the third option is skipped, because it is disabled.
          expect(options[3].selected).toBe(true, 'Expected fourth option to be selected.');
          expect(formControl.value).toBe(options[3].value, 'Expected value from fourth option to have been set on the model.');

          dispatchKeyboardEvent(select, 'keydown', UP_ARROW);

          expect(options[1].selected).toBe(true, 'Expected second option to be selected.');
          expect(formControl.value).toBe(options[1].value, 'Expected value from second option to have been set on the model.');
        }));

        it('should resume focus from selected item after selecting via click', fakeAsync(() => {
          const formControl = fixture.componentInstance.control;
          const options = fixture.componentInstance.options.toArray();

          expect(formControl.value).toBeFalsy('Expected no initial value.');

          fixture.componentInstance.select.open();
          fixture.detectChanges();
          flush();

          (overlayContainerElement.querySelectorAll('dt-option')[3] as HTMLElement).click();
          fixture.detectChanges();
          flush();

          expect(formControl.value).toBe(options[3].value);

          dispatchKeyboardEvent(select, 'keydown', DOWN_ARROW);
          fixture.detectChanges();

          expect(formControl.value).toBe(options[4].value);
        }));

        it('should select options via LEFT/RIGHT arrow keys on a closed select', fakeAsync(() => {
          const formControl = fixture.componentInstance.control;
          const options = fixture.componentInstance.options.toArray();

          expect(formControl.value).toBeFalsy('Expected no initial value.');

          dispatchKeyboardEvent(select, 'keydown', RIGHT_ARROW);

          expect(options[0].selected).toBe(true, 'Expected first option to be selected.');
          expect(formControl.value).toBe(options[0].value, 'Expected value from first option to have been set on the model.');

          dispatchKeyboardEvent(select, 'keydown', RIGHT_ARROW);
          dispatchKeyboardEvent(select, 'keydown', RIGHT_ARROW);

          // Note that the third option is skipped, because it is disabled.
          expect(options[3].selected).toBe(true, 'Expected fourth option to be selected.');
          expect(formControl.value).toBe(options[3].value, 'Expected value from fourth option to have been set on the model.');

          dispatchKeyboardEvent(select, 'keydown', LEFT_ARROW);

          expect(options[1].selected).toBe(true, 'Expected second option to be selected.');
          expect(formControl.value).toBe(options[1].value, 'Expected value from second option to have been set on the model.');
        }));

        it('should open a single-selection select using ALT + DOWN_ARROW', fakeAsync(() => {
          const { control: formControl, select: selectInstance } = fixture.componentInstance;

          expect(selectInstance.panelOpen).toBe(false, 'Expected select to be closed.');
          expect(formControl.value).toBeFalsy('Expected no initial value.');

          const event = createKeyboardEvent('keydown', DOWN_ARROW);
          Object.defineProperty(event, 'altKey', { get: () => true });

          dispatchEvent(select, event);

          expect(selectInstance.panelOpen).toBe(true, 'Expected select to be open.');
          expect(formControl.value).toBeFalsy('Expected value not to have changed.');
        }));

        it('should open a single-selection select using ALT + UP_ARROW', fakeAsync(() => {
          const { control: formControl, select: selectInstance } = fixture.componentInstance;

          expect(selectInstance.panelOpen).toBe(false, 'Expected select to be closed.');
          expect(formControl.value).toBeFalsy('Expected no initial value.');

          const event = createKeyboardEvent('keydown', UP_ARROW);
          Object.defineProperty(event, 'altKey', { get: () => true });

          dispatchEvent(select, event);

          expect(selectInstance.panelOpen).toBe(true, 'Expected select to be open.');
          expect(formControl.value).toBeFalsy('Expected value not to have changed.');
        }));

        it('should should close when pressing ALT + DOWN_ARROW', fakeAsync(() => {
          const { select: selectInstance } = fixture.componentInstance;

          selectInstance.open();
          fixture.detectChanges();

          expect(selectInstance.panelOpen).toBe(true, 'Expected select to be open.');

          const event = createKeyboardEvent('keydown', DOWN_ARROW);
          Object.defineProperty(event, 'altKey', { get: () => true });

          dispatchEvent(select, event);

          expect(selectInstance.panelOpen).toBe(false, 'Expected select to be closed.');
          expect(event.defaultPrevented).toBe(true, 'Expected default action to be prevented.');
        }));

        it('should should close when pressing ALT + UP_ARROW', fakeAsync(() => {
          const { select: selectInstance } = fixture.componentInstance;

          selectInstance.open();
          fixture.detectChanges();

          expect(selectInstance.panelOpen).toBe(true, 'Expected select to be open.');

          const event = createKeyboardEvent('keydown', UP_ARROW);
          Object.defineProperty(event, 'altKey', { get: () => true });

          dispatchEvent(select, event);

          expect(selectInstance.panelOpen).toBe(false, 'Expected select to be closed.');
          expect(event.defaultPrevented).toBe(true, 'Expected default action to be prevented.');
        }));

        it('should be able to select options by typing on a closed select', fakeAsync(() => {
          const formControl = fixture.componentInstance.control;
          const options = fixture.componentInstance.options.toArray();

          expect(formControl.value).toBeFalsy('Expected no initial value.');

          dispatchEvent(select, createKeyboardEvent('keydown', 80, undefined, 'p'));
          tick(200);

          expect(options[1].selected).toBe(true, 'Expected second option to be selected.');
          expect(formControl.value).toBe(options[1].value, 'Expected value from second option to have been set on the model.');

          dispatchEvent(select, createKeyboardEvent('keydown', 69, undefined, 'e'));
          tick(200);

          expect(options[5].selected).toBe(true, 'Expected sixth option to be selected.');
          expect(formControl.value).toBe(options[5].value, 'Expected value from sixth option to have been set on the model.');
        }));

        it('should do nothing if the key manager did not change the active item', fakeAsync(() => {
          const formControl = fixture.componentInstance.control;

          expect(formControl.value).toBeNull('Expected form control value to be empty.');
          expect(formControl.pristine).toBe(true, 'Expected form control to be clean.');

          dispatchKeyboardEvent(select, 'keydown', 16); // Press a random key.
          expect(formControl.value).toBeNull('Expected form control value to stay empty.');
          expect(formControl.pristine).toBe(true, 'Expected form control to stay clean.');
        }));

        it('should continue from the selected option when the value is set programmatically', fakeAsync(() => {
          const formControl = fixture.componentInstance.control;

          formControl.setValue('eggs-5');
          fixture.detectChanges();

          dispatchKeyboardEvent(select, 'keydown', DOWN_ARROW);

          expect(formControl.value).toBe('pasta-6');
          expect(fixture.componentInstance.options.toArray()[6].selected).toBe(true);
        }));

        it('should not cycle through the options if the control is disabled', fakeAsync(() => {
          const formControl = fixture.componentInstance.control;

          formControl.setValue('eggs-5');
          formControl.disable();

          dispatchKeyboardEvent(select, 'keydown', DOWN_ARROW);

          expect(formControl.value).toBe('eggs-5', 'Expected value to remain unchaged.');
        }));

        it('should not wrap selection after reaching the end of the options', fakeAsync(() => {
          const lastOption = fixture.componentInstance.options.last;

          fixture.componentInstance.options.forEach(() => {
            dispatchKeyboardEvent(select, 'keydown', DOWN_ARROW);
          });

          expect(lastOption.selected).toBe(true, 'Expected last option to be selected.');

          dispatchKeyboardEvent(select, 'keydown', DOWN_ARROW);

          expect(lastOption.selected).toBe(true, 'Expected last option to stay selected.');
        }));

        it('should prevent the default action when pressing space', fakeAsync(() => {
          const event = dispatchKeyboardEvent(select, 'keydown', SPACE);
          expect(event.defaultPrevented).toBe(true);
        }));

        it('should consider the selection a result of a user action when closed', fakeAsync(() => {
          const option = fixture.componentInstance.options.first;
          const spy = jasmine.createSpy('option selection spy');
          const subscription = option.selectionChange.pipe(map((e) => e.isUserInput)).subscribe(spy);

          dispatchKeyboardEvent(select, 'keydown', DOWN_ARROW);
          expect(spy).toHaveBeenCalledWith(true);

          subscription.unsubscribe();
        }));

        it('should be able to focus the select trigger', fakeAsync(() => {
          document.body.focus(); // ensure that focus isn't on the trigger already
          fixture.componentInstance.select.focus();

          expect(document.activeElement).toBe(select, 'Expected select element to be focused.');
        }));

        // Having `aria-hidden` on the trigger avoids issues where
        // screen readers read out the wrong amount of options.
        it('should set aria-hidden on the trigger element', fakeAsync(() => {
          const trigger = fixture.debugElement.query(By.css('.dt-select-trigger')).nativeElement;

          expect(trigger.getAttribute('aria-hidden'))
            .toBe('true', 'Expected aria-hidden to be true when the select is open.');
        }));

        it('should set aria-activedescendant only while the panel is open', fakeAsync(() => {
          fixture.componentInstance.control.setValue('chips-4');
          fixture.detectChanges();

          const host = fixture.debugElement.query(By.css('dt-select')).nativeElement;

          expect(host.hasAttribute('aria-activedescendant'))
            .toBe(false, 'Expected no aria-activedescendant on init.');

          fixture.componentInstance.select.open();
          fixture.detectChanges();
          flush();

          const options = overlayContainerElement.querySelectorAll('dt-option');

          expect(host.getAttribute('aria-activedescendant'))
            .toBe(options[4].id, 'Expected aria-activedescendant to match the active option.');

          fixture.componentInstance.select.close();
          fixture.detectChanges();
          flush();

          expect(host.hasAttribute('aria-activedescendant'))
            .toBe(false, 'Expected no aria-activedescendant when closed.');
        }));

        it('should set aria-activedescendant based on the focused option', fakeAsync(() => {
          const host = fixture.debugElement.query(By.css('dt-select')).nativeElement;

          fixture.componentInstance.select.open();
          fixture.detectChanges();
          flush();

          const options = overlayContainerElement.querySelectorAll('dt-option');

          expect(host.getAttribute('aria-activedescendant')).toBe(options[0].id);

          [1, 2, 3].forEach(() => {
            dispatchKeyboardEvent(host, 'keydown', DOWN_ARROW);
            fixture.detectChanges();
          });

          expect(host.getAttribute('aria-activedescendant')).toBe(options[4].id);

          dispatchKeyboardEvent(host, 'keydown', UP_ARROW);
          fixture.detectChanges();

          expect(host.getAttribute('aria-activedescendant')).toBe(options[3].id);
        }));

        it('should not change the aria-activedescendant using the horizontal arrow keys', fakeAsync(() => {
          const host = fixture.debugElement.query(By.css('dt-select')).nativeElement;

          fixture.componentInstance.select.open();
          fixture.detectChanges();
          flush();

          const options = overlayContainerElement.querySelectorAll('dt-option');

          expect(host.getAttribute('aria-activedescendant')).toBe(options[0].id);

          [1, 2, 3].forEach(() => {
            dispatchKeyboardEvent(host, 'keydown', RIGHT_ARROW);
            fixture.detectChanges();
          });

          expect(host.getAttribute('aria-activedescendant')).toBe(options[0].id);
        }));
      });

      describe('for options', () => {
        let fixture: ComponentFixture<BasicSelect>;
        let trigger: HTMLElement;
        let options: NodeListOf<HTMLElement>;

        beforeEach(fakeAsync(() => {
          fixture = TestBed.createComponent(BasicSelect);
          fixture.detectChanges();
          trigger = fixture.debugElement.query(By.css('.dt-select-trigger')).nativeElement;
          trigger.click();
          fixture.detectChanges();

          options = overlayContainerElement.querySelectorAll('dt-option');
        }));

        it('should set the role of dt-option to option', fakeAsync(() => {
          expect(options[0].getAttribute('role')).toEqual('option');
          expect(options[1].getAttribute('role')).toEqual('option');
          expect(options[2].getAttribute('role')).toEqual('option');
        }));

        it('should set aria-selected on each option', fakeAsync(() => {
          expect(options[0].getAttribute('aria-selected')).toEqual('false');
          expect(options[1].getAttribute('aria-selected')).toEqual('false');
          expect(options[2].getAttribute('aria-selected')).toEqual('false');

          options[1].click();
          fixture.detectChanges();

          trigger.click();
          fixture.detectChanges();
          flush();

          expect(options[0].getAttribute('aria-selected')).toEqual('false');
          expect(options[1].getAttribute('aria-selected')).toEqual('true');
          expect(options[2].getAttribute('aria-selected')).toEqual('false');
        }));

        it('should set the tabindex of each option according to disabled state', fakeAsync(() => {
          expect(options[0].getAttribute('tabindex')).toEqual('0');
          expect(options[1].getAttribute('tabindex')).toEqual('0');
          expect(options[2].getAttribute('tabindex')).toEqual('-1');
        }));

        it('should set aria-disabled for disabled options', fakeAsync(() => {
          expect(options[0].getAttribute('aria-disabled')).toEqual('false');
          expect(options[1].getAttribute('aria-disabled')).toEqual('false');
          expect(options[2].getAttribute('aria-disabled')).toEqual('true');

          // tslint:disable-next-line:no-string-literal
          fixture.componentInstance.foods[2]['disabled'] = false;
          fixture.detectChanges();

          expect(options[0].getAttribute('aria-disabled')).toEqual('false');
          expect(options[1].getAttribute('aria-disabled')).toEqual('false');
          expect(options[2].getAttribute('aria-disabled')).toEqual('false');
        }));
      });

      describe('for option groups', () => {
        let fixture: ComponentFixture<SelectWithGroups>;
        let trigger: HTMLElement;
        let groups: NodeListOf<HTMLElement>;

        beforeEach(fakeAsync(() => {
          fixture = TestBed.createComponent(SelectWithGroups);
          fixture.detectChanges();
          trigger = fixture.debugElement.query(By.css('.dt-select-trigger')).nativeElement;
          trigger.click();
          fixture.detectChanges();
          groups = overlayContainerElement.querySelectorAll('dt-optgroup');
        }));

        it('should set the appropriate role', fakeAsync(() => {
          expect(groups[0].getAttribute('role')).toBe('group');
        }));

        it('should set the `aria-labelledby` attribute', fakeAsync(() => {
          const group = groups[0];
          const label = group.querySelector('label');

          expect(label.getAttribute('id')).toBeTruthy('Expected label to have an id.');
          expect(group.getAttribute('aria-labelledby'))
            .toBe(label.getAttribute('id'), 'Expected `aria-labelledby` to match the label id.');
        }));

        it('should set the `aria-disabled` attribute if the group is disabled', fakeAsync(() => {
          expect(groups[1].getAttribute('aria-disabled')).toBe('true');
        }));
      });
    });

    describe('overlay panel', () => {
      let fixture: ComponentFixture<BasicSelect>;
      let trigger: HTMLElement;

      beforeEach(fakeAsync(() => {
        fixture = TestBed.createComponent(BasicSelect);
        fixture.detectChanges();
        trigger = fixture.debugElement.query(By.css('.dt-select-trigger')).nativeElement;
      }));

      it('should not throw when attempting to open too early', () => {
        // Create component and then immediately open without running change detection
        fixture = TestBed.createComponent(BasicSelect);
        expect(() => fixture.componentInstance.select.open()).not.toThrow();
      });

      it('should open the panel when trigger is clicked', fakeAsync(() => {
        trigger.click();
        fixture.detectChanges();
        flush();

        expect(fixture.componentInstance.select.panelOpen).toBe(true);
        expect(overlayContainerElement.textContent).toContain('Steak');
        expect(overlayContainerElement.textContent).toContain('Pizza');
        expect(overlayContainerElement.textContent).toContain('Tacos');
      }));

      it('should close the panel when an item is clicked', fakeAsync(() => {
        trigger.click();
        fixture.detectChanges();
        flush();

        const option: HTMLElement = overlayContainerElement.querySelector('dt-option');
        option.click();
        fixture.detectChanges();
        flush();

        expect(overlayContainerElement.textContent).toEqual('');
        expect(fixture.componentInstance.select.panelOpen).toBe(false);
      }));

      it('should close the panel when a click occurs outside the panel', fakeAsync(() => {
        trigger.click();
        fixture.detectChanges();
        flush();

        const backdrop: HTMLElement = overlayContainerElement.querySelector('.cdk-overlay-backdrop');

        backdrop.click();
        fixture.detectChanges();
        flush();

        expect(overlayContainerElement.textContent).toEqual('');
        expect(fixture.componentInstance.select.panelOpen).toBe(false);
      }));

      it('should not attempt to open a select that does not have any options', fakeAsync(() => {
        fixture.componentInstance.foods = [];
        fixture.detectChanges();

        trigger.click();
        fixture.detectChanges();

        expect(fixture.componentInstance.select.panelOpen).toBe(false);
      }));

      it('should close the panel when tabbing out', fakeAsync(() => {
        trigger.click();
        fixture.detectChanges();
        flush();

        expect(fixture.componentInstance.select.panelOpen).toBe(true);

        dispatchKeyboardEvent(trigger, 'keydown', TAB);
        fixture.detectChanges();
        flush();

        expect(fixture.componentInstance.select.panelOpen).toBe(false);
      }));

      it('should restore focus to the host before tabbing away', fakeAsync(() => {
        const select = fixture.nativeElement.querySelector('.dt-select');

        trigger.click();
        fixture.detectChanges();
        flush();

        expect(fixture.componentInstance.select.panelOpen).toBe(true);

        // Use a spy since focus can be flaky in unit tests.
        spyOn(select, 'focus').and.callThrough();

        dispatchKeyboardEvent(trigger, 'keydown', TAB);
        fixture.detectChanges();
        flush();

        expect(select.focus).toHaveBeenCalled();
      }));

      it('should close when tabbing out from inside the panel', fakeAsync(() => {
        trigger.click();
        fixture.detectChanges();
        flush();

        expect(fixture.componentInstance.select.panelOpen).toBe(true);

        const panel = overlayContainerElement.querySelector('.dt-select-panel');
        dispatchKeyboardEvent(panel, 'keydown', TAB);
        fixture.detectChanges();
        flush();

        expect(fixture.componentInstance.select.panelOpen).toBe(false);
      }));

      it('should focus the first option when pressing HOME', fakeAsync(() => {
        fixture.componentInstance.control.setValue('pizza-1');
        fixture.detectChanges();

        trigger.click();
        fixture.detectChanges();
        flush();

        const event = dispatchKeyboardEvent(trigger, 'keydown', HOME);
        fixture.detectChanges();

        expect(fixture.componentInstance.select._keyManager.activeItemIndex).toBe(0);
        expect(event.defaultPrevented).toBe(true);
      }));

      it('should focus the last option when pressing END', fakeAsync(() => {
        fixture.componentInstance.control.setValue('pizza-1');
        fixture.detectChanges();

        trigger.click();
        fixture.detectChanges();
        flush();

        const event = dispatchKeyboardEvent(trigger, 'keydown', END);
        fixture.detectChanges();

        expect(fixture.componentInstance.select._keyManager.activeItemIndex).toBe(7);
        expect(event.defaultPrevented).toBe(true);
      }));

      it('should be able to set extra classes on the panel', fakeAsync(() => {
        trigger.click();
        fixture.detectChanges();

        const panel = overlayContainerElement.querySelector('.dt-select-panel');

        expect(panel.classList).toContain('custom-one');
        expect(panel.classList).toContain('custom-two');
      }));

      it('should prevent the default action when pressing SPACE on an option', fakeAsync(() => {
        trigger.click();
        fixture.detectChanges();

        const option = overlayContainerElement.querySelector('dt-option');
        const event = dispatchKeyboardEvent(option, 'keydown', SPACE);

        expect(event.defaultPrevented).toBe(true);
      }));

      it('should prevent the default action when pressing ENTER on an option', fakeAsync(() => {
        trigger.click();
        fixture.detectChanges();

        const option = overlayContainerElement.querySelector('dt-option');
        const event = dispatchKeyboardEvent(option, 'keydown', ENTER);

        expect(event.defaultPrevented).toBe(true);
      }));

      it('should be able to render options inside groups with an ng-container', fakeAsync(() => {
        fixture.destroy();

        const groupFixture = TestBed.createComponent(SelectWithGroupsAndNgContainer);
        groupFixture.detectChanges();
        trigger = groupFixture.debugElement.query(By.css('.dt-select-trigger')).nativeElement;
        trigger.click();
        groupFixture.detectChanges();

        expect(document.querySelectorAll('.cdk-overlay-container dt-option').length)
          .toBeGreaterThan(0, 'Expected at least one option to be rendered.');
      }));

      it('should not consider itself as blurred if the trigger loses focus while the panel is still open', fakeAsync(() => {
        const selectElement = fixture.nativeElement.querySelector('.dt-select');
        const selectInstance = fixture.componentInstance.select;

        dispatchFakeEvent(selectElement, 'focus');
        fixture.detectChanges();

        expect(selectInstance.focused).toBe(true, 'Expected select to be focused.');

        selectInstance.open();
        fixture.detectChanges();
        flush();
        dispatchFakeEvent(selectElement, 'blur');
        fixture.detectChanges();

        expect(selectInstance.focused).toBe(true, 'Expected select element to remain focused.');
      }));
    });

    describe('selection logic', () => {
      let fixture: ComponentFixture<BasicSelect>;
      let trigger: HTMLElement;

      beforeEach(fakeAsync(() => {
        fixture = TestBed.createComponent(BasicSelect);
        fixture.detectChanges();
        trigger = fixture.debugElement.query(By.css('.dt-select-trigger')).nativeElement;
      }));

      it('should focus the first option if no option is selected', fakeAsync(() => {
        trigger.click();
        fixture.detectChanges();
        flush();

        expect(fixture.componentInstance.select._keyManager.activeItemIndex).toEqual(0);
      }));

      it('should select an option when it is clicked', fakeAsync(() => {
        trigger.click();
        fixture.detectChanges();
        flush();

        let option: HTMLElement = overlayContainerElement.querySelector('dt-option');
        option.click();
        fixture.detectChanges();
        flush();

        trigger.click();
        fixture.detectChanges();
        flush();

        option = overlayContainerElement.querySelector('dt-option');

        expect(option.classList).toContain('dt-option-selected');
        expect(fixture.componentInstance.options.first.selected).toBe(true);
        expect(fixture.componentInstance.select.selected).toBe(fixture.componentInstance.options.first);
      }));

      it('should be able to select an option using the DtOption API', fakeAsync(() => {
        trigger.click();
        fixture.detectChanges();
        flush();

        const optionInstances = fixture.componentInstance.options.toArray();
        const optionNodes: NodeListOf<HTMLElement> = overlayContainerElement.querySelectorAll('dt-option');

        optionInstances[1].select();
        fixture.detectChanges();

        expect(optionNodes[1].classList).toContain('dt-option-selected');
        expect(optionInstances[1].selected).toBe(true);
        expect(fixture.componentInstance.select.selected).toBe(optionInstances[1]);
      }));

      it('should deselect other options when one is selected', fakeAsync(() => {
        trigger.click();
        fixture.detectChanges();
        flush();

        let options = overlayContainerElement.querySelectorAll('dt-option');

        (options[0] as HTMLElement).click();
        fixture.detectChanges();
        flush();

        trigger.click();
        fixture.detectChanges();
        flush();

        options = overlayContainerElement.querySelectorAll('dt-option');
        expect(options[1].classList).not.toContain('dt-option-selected');
        expect(options[2].classList).not.toContain('dt-option-selected');

        const optionInstances = fixture.componentInstance.options.toArray();
        expect(optionInstances[1].selected).toBe(false);
        expect(optionInstances[2].selected).toBe(false);
      }));

      it('should deselect other options when one is programmatically selected', fakeAsync(() => {
        const control = fixture.componentInstance.control;
        const foods = fixture.componentInstance.foods;

        trigger.click();
        fixture.detectChanges();
        flush();

        let options = overlayContainerElement.querySelectorAll('dt-option');

        (options[0] as HTMLElement).click();
        fixture.detectChanges();
        flush();

        control.setValue(foods[1].value);
        fixture.detectChanges();

        trigger.click();
        fixture.detectChanges();
        flush();

        options = overlayContainerElement.querySelectorAll('dt-option');

        expect(options[0].classList)
          .not.toContain('dt-option-selected', 'Expected first option to no longer be selected');
        expect(options[1].classList)
          .toContain('dt-option-selected', 'Expected second option to be selected');

        const optionInstances = fixture.componentInstance.options.toArray();

        expect(optionInstances[0].selected).toBe(false, 'Expected first option to no longer be selected');
        expect(optionInstances[1].selected).toBe(true, 'Expected second option to be selected');
      }));

      it('should remove selection if option has been removed', fakeAsync(() => {
        const select = fixture.componentInstance.select;

        trigger.click();
        fixture.detectChanges();
        flush();

        const firstOption = overlayContainerElement.querySelectorAll('dt-option')[0] as HTMLElement;

        firstOption.click();
        fixture.detectChanges();

        expect(select.selected).toBe(select.options.first, 'Expected first option to be selected.');

        fixture.componentInstance.foods = [];
        fixture.detectChanges();
        flush();

        expect(select.selected).toBeUndefined('Expected selection to be removed when option no longer exists.');
      }));

      it('should display the selected option in the trigger', fakeAsync(() => {
        trigger.click();
        fixture.detectChanges();
        flush();

        const option: HTMLElement = overlayContainerElement.querySelector('dt-option');
        option.click();
        fixture.detectChanges();
        flush();

        const value = fixture.debugElement.query(By.css('.dt-select-value')).nativeElement;

        expect(value.textContent).toContain('Steak');
      }));

      it('should focus the selected option if an option is selected', fakeAsync(() => {
        // must wait for initial writeValue promise to finish
        flush();

        fixture.componentInstance.control.setValue('pizza-1');
        fixture.detectChanges();

        trigger.click();
        fixture.detectChanges();
        flush();

        // must wait for animation to finish
        fixture.detectChanges();
        expect(fixture.componentInstance.select._keyManager.activeItemIndex).toEqual(1);
      }));

      it('should select an option that was added after initialization', fakeAsync(() => {
        fixture.componentInstance.foods.push({ viewValue: 'Potatoes', value: 'potatoes-8' });
        trigger.click();
        fixture.detectChanges();
        flush();

        const options = overlayContainerElement.querySelectorAll('dt-option');
        (options[8] as HTMLElement).click();
        fixture.detectChanges();
        flush();

        expect(trigger.textContent).toContain('Potatoes');
        expect(fixture.componentInstance.select.selected)
          .toBe(fixture.componentInstance.options.last);
      }));

      it('should update the trigger when the selected option label is changed', fakeAsync(() => {
        fixture.componentInstance.control.setValue('pizza-1');
        fixture.detectChanges();

        expect(trigger.textContent.trim()).toBe('Pizza');

        fixture.componentInstance.foods[1].viewValue = 'Calzone';
        fixture.detectChanges();

        expect(trigger.textContent.trim()).toBe('Calzone');
      }));

      it('should not select disabled options', fakeAsync(() => {
        trigger.click();
        fixture.detectChanges();

        const options = overlayContainerElement.querySelectorAll('dt-option');
        (options[2] as HTMLElement).click();
        fixture.detectChanges();

        expect(fixture.componentInstance.select.panelOpen).toBe(true);
        expect(options[2].classList).not.toContain('dt-option-selected');
        expect(fixture.componentInstance.select.selected).toBeUndefined();
      }));

      it('should not select options inside a disabled group', fakeAsync(() => {
        fixture.destroy();

        const groupFixture = TestBed.createComponent(SelectWithGroups);
        groupFixture.detectChanges();
        groupFixture.debugElement.query(By.css('.dt-select-trigger')).nativeElement.click();
        groupFixture.detectChanges();

        const disabledGroup = overlayContainerElement.querySelectorAll('dt-optgroup')[1];
        const options = disabledGroup.querySelectorAll('dt-option');

        (options[0] as HTMLElement).click();
        groupFixture.detectChanges();

        expect(groupFixture.componentInstance.select.panelOpen).toBe(true);
        expect(options[0].classList).not.toContain('dt-option-selected');
        expect(groupFixture.componentInstance.select.selected).toBeUndefined();
      }));

      it('should not throw if triggerValue accessed with no selected value', fakeAsync(() => {
        expect(() => fixture.componentInstance.select.triggerValue).not.toThrow();
      }));

      it('should emit to `optionSelectionChanges` when an option is selected', fakeAsync(() => {
        trigger.click();
        fixture.detectChanges();
        flush();

        const spy = jasmine.createSpy('option selection spy');
        const subscription = fixture.componentInstance.select.optionSelectionChanges.subscribe(spy);
        const option: HTMLElement = overlayContainerElement.querySelector('dt-option');
        option.click();
        fixture.detectChanges();
        flush();

        expect(spy).toHaveBeenCalledWith(jasmine.any(DtOptionSelectionChange));

        subscription.unsubscribe();
      }));

      it('should handle accessing `optionSelectionChanges` before the options are initialized', fakeAsync(() => {
        fixture.destroy();
        fixture = TestBed.createComponent(BasicSelect);

        const spy = jasmine.createSpy('option selection spy');
        let subscription: Subscription;

        expect(fixture.componentInstance.select.options).toBeFalsy();
        expect(() => {
          subscription = fixture.componentInstance.select.optionSelectionChanges.subscribe(spy);
        }).not.toThrow();

        fixture.detectChanges();
        trigger = fixture.debugElement.query(By.css('.dt-select-trigger')).nativeElement;

        trigger.click();
        fixture.detectChanges();
        flush();

        const option: HTMLElement = overlayContainerElement.querySelector('dt-option');
        option.click();
        fixture.detectChanges();
        flush();

        expect(spy).toHaveBeenCalledWith(jasmine.any(DtOptionSelectionChange));

        // tslint:disable-next-line:no-unnecessary-type-assertion
        subscription!.unsubscribe();
      }));
    });

    describe('valueChange events', () => {
      it('should emit `valueChange` when an option was selected', fakeAsync(() => {
        const fixture = TestBed.createComponent(BasicSelect);
        fixture.detectChanges();
        const trigger = fixture.debugElement.query(By.css('.dt-select-trigger')).nativeElement;

        trigger.click();
        fixture.detectChanges();
        flush();

        const spy = jasmine.createSpy('value change spy');
        const subscription = fixture.componentInstance.select.valueChange.subscribe(spy);

        const option: HTMLElement = overlayContainerElement.querySelector('dt-option');
        option.click();
        fixture.detectChanges();
        flush();

        expect(spy).toHaveBeenCalledTimes(1);

        subscription.unsubscribe();
      }));

      it('should emit `valueChange` when an option was selected', fakeAsync(() => {
        const fixture = TestBed.createComponent(SelectWithOptionValueZero);
        fixture.detectChanges();
        const trigger = fixture.debugElement.query(By.css('.dt-select-trigger')).nativeElement;

        trigger.click();
        fixture.detectChanges();
        flush();

        const spy = jasmine.createSpy('value change spy');
        const subscription = fixture.componentInstance.select.valueChange.subscribe(spy);

        const option: HTMLElement = overlayContainerElement.querySelector('dt-option');
        option.click();
        fixture.detectChanges();
        flush();

        expect(spy).toHaveBeenCalledWith(0);

        subscription.unsubscribe();
      }));
    });

    describe('forms integration', () => {
      let fixture: ComponentFixture<BasicSelect>;
      let trigger: HTMLElement;

      beforeEach(fakeAsync(() => {
        fixture = TestBed.createComponent(BasicSelect);
        fixture.detectChanges();
        trigger = fixture.debugElement.query(By.css('.dt-select-trigger')).nativeElement;
      }));

      it('should take an initial view value with reactive forms', fakeAsync(() => {
        fixture.componentInstance.control = new FormControl('pizza-1');
        fixture.detectChanges();

        const value = fixture.debugElement.query(By.css('.dt-select-value'));
        expect(value.nativeElement.textContent)
          .toContain('Pizza', `Expected trigger to be populated by the control's initial value.`);

        trigger = fixture.debugElement.query(By.css('.dt-select-trigger')).nativeElement;
        trigger.click();
        fixture.detectChanges();
        flush();

        const options = overlayContainerElement.querySelectorAll('dt-option');
        expect(options[1].classList)
          .toContain('dt-option-selected', `Expected option with the control's initial value to be selected.`);
      }));

      it('should set the view value from the form', fakeAsync(() => {
        let value = fixture.debugElement.query(By.css('.dt-select-value'));
        expect(value.nativeElement.textContent.trim()).toBe('Food');

        fixture.componentInstance.control.setValue('pizza-1');
        fixture.detectChanges();

        value = fixture.debugElement.query(By.css('.dt-select-value'));
        expect(value.nativeElement.textContent)
          .toContain('Pizza', `Expected trigger to be populated by the control's new value.`);

        trigger.click();
        fixture.detectChanges();
        flush();

        const options = overlayContainerElement.querySelectorAll('dt-option');
        expect(options[1].classList)
          .toContain('dt-option-selected', `Expected option with the control's new value to be selected.`);
      }));

      it('should update the form value when the view changes', fakeAsync(() => {
        expect(fixture.componentInstance.control.value)
          .toEqual(null, `Expected the control's value to be empty initially.`);

        trigger.click();
        fixture.detectChanges();
        flush();

        const option: HTMLElement = overlayContainerElement.querySelector('dt-option');
        option.click();
        fixture.detectChanges();
        flush();

        expect(fixture.componentInstance.control.value)
          .toEqual('steak-0', `Expected control's value to be set to the new option.`);
      }));

      it('should clear the selection when a nonexistent option value is selected', fakeAsync(() => {
        fixture.componentInstance.control.setValue('pizza-1');
        fixture.detectChanges();

        fixture.componentInstance.control.setValue('gibberish');
        fixture.detectChanges();

        const value = fixture.debugElement.query(By.css('.dt-select-value'));
        expect(value.nativeElement.textContent.trim())
          .toBe('Food', `Expected trigger to show the placeholder.`);
        expect(trigger.textContent)
          .not.toContain('Pizza', `Expected trigger is cleared when option value is not found.`);

        trigger.click();
        fixture.detectChanges();
        flush();

        const options =
          overlayContainerElement.querySelectorAll('dt-option');
        expect(options[1].classList)
          .not.toContain('dt-option-selected', `Expected option w/ the old value not to be selected.`);
      }));

      it('should clear the selection when the control is reset', fakeAsync(() => {
        fixture.componentInstance.control.setValue('pizza-1');
        fixture.detectChanges();

        fixture.componentInstance.control.reset();
        fixture.detectChanges();

        const value = fixture.debugElement.query(By.css('.dt-select-value'));
        expect(value.nativeElement.textContent.trim())
          .toBe('Food', `Expected trigger to show the placeholder.`);
        expect(trigger.textContent)
          .not.toContain('Pizza', `Expected trigger is cleared when option value is not found.`);

        trigger.click();
        fixture.detectChanges();
        flush();

        const options =
          overlayContainerElement.querySelectorAll('dt-option');
        expect(options[1].classList)
          .not.toContain('dt-option-selected', `Expected option w/ the old value not to be selected.`);
      }));

      it('should set the control to touched when the select is blurred', fakeAsync(() => {
        expect(fixture.componentInstance.control.touched)
          .toEqual(false, `Expected the control to start off as untouched.`);

        trigger.click();
        dispatchFakeEvent(trigger, 'blur');
        fixture.detectChanges();
        flush();

        expect(fixture.componentInstance.control.touched)
          .toEqual(false, `Expected the control to stay untouched when menu opened.`);

        const backdrop: HTMLElement = overlayContainerElement.querySelector('.cdk-overlay-backdrop');
        backdrop.click();
        dispatchFakeEvent(trigger, 'blur');
        fixture.detectChanges();
        flush();

        expect(fixture.componentInstance.control.touched)
          .toEqual(true, `Expected the control to be touched as soon as focus left the select.`);
      }));

      it('should set the control to touched when the panel is closed', fakeAsync(() => {
        expect(fixture.componentInstance.control.touched)
          .toBe(false, 'Expected the control to start off as untouched.');

        trigger.click();
        dispatchFakeEvent(trigger, 'blur');
        fixture.detectChanges();
        flush();

        expect(fixture.componentInstance.control.touched)
          .toBe(false, 'Expected the control to stay untouched when menu opened.');

        fixture.componentInstance.select.close();
        fixture.detectChanges();
        flush();

        expect(fixture.componentInstance.control.touched)
          .toBe(true, 'Expected the control to be touched when the panel was closed.');
      }));

      it('should not set touched when a disabled select is touched', fakeAsync(() => {
        expect(fixture.componentInstance.control.touched)
          .toBe(false, 'Expected the control to start off as untouched.');

        fixture.componentInstance.control.disable();
        dispatchFakeEvent(trigger, 'blur');

        expect(fixture.componentInstance.control.touched).toBe(false, 'Expected the control to stay untouched.');
      }));

      it('should set the control to dirty when the select value changes in DOM', fakeAsync(() => {
        expect(fixture.componentInstance.control.dirty).toEqual(false, `Expected control to start out pristine.`);

        trigger.click();
        fixture.detectChanges();
        flush();

        const option: HTMLElement = overlayContainerElement.querySelector('dt-option');
        option.click();
        fixture.detectChanges();
        flush();

        expect(fixture.componentInstance.control.dirty)
          .toEqual(true, `Expected control to be dirty after value was changed by user.`);
      }));

      it('should not set the control to dirty when the value changes programmatically', fakeAsync(() => {
        expect(fixture.componentInstance.control.dirty).toEqual(false, `Expected control to start out pristine.`);

        fixture.componentInstance.control.setValue('pizza-1');

        expect(fixture.componentInstance.control.dirty)
          .toEqual(false, `Expected control to stay pristine after programmatic change.`);
      }));
    });

    describe('disabled behavior', () => {
      it('should disable itself when control is disabled programmatically', fakeAsync(() => {
        const fixture = TestBed.createComponent(BasicSelect);
        fixture.detectChanges();

        fixture.componentInstance.control.disable();
        const trigger = fixture.debugElement.query(By.css('.dt-select-trigger')).nativeElement;
        trigger.click();
        fixture.detectChanges();

        expect(overlayContainerElement.textContent).toEqual('', `Expected select panel to stay closed.`);
        expect(fixture.componentInstance.select.panelOpen).toBe(false, `Expected select panelOpen property to stay false.`);

        fixture.componentInstance.control.enable();
        trigger.click();
        fixture.detectChanges();

        expect(overlayContainerElement.textContent)
          .toContain('Steak', `Expected select panel to open normally on re-enabled control`);
        expect(fixture.componentInstance.select.panelOpen)
          .toBe(true, `Expected select panelOpen property to become true.`);
      }));
    });
  });

  describe('when initialized without options', () => {
    beforeEach(async(() => { configureDtSelectTestingModule([SelectInitWithoutOptions]); }));

    it('should select the proper option when option list is initialized later', fakeAsync(() => {
      const fixture = TestBed.createComponent(SelectInitWithoutOptions);
      const instance = fixture.componentInstance;

      fixture.detectChanges();
      flush();

      // Wait for the initial writeValue promise.
      expect(instance.select.selected).toBeFalsy();

      instance.addOptions();
      fixture.detectChanges();
      flush();

      // Wait for the next writeValue promise.
      expect(instance.select.selected).toBe(instance.options.toArray()[1]);
    }));
  });

  describe('with a selectionChange event handler', () => {
    beforeEach(async(() => { configureDtSelectTestingModule([SelectWithChangeEvent]); }));

    let fixture: ComponentFixture<SelectWithChangeEvent>;
    let trigger: HTMLElement;

    beforeEach(fakeAsync(() => {
      fixture = TestBed.createComponent(SelectWithChangeEvent);
      fixture.detectChanges();

      trigger = fixture.debugElement.query(By.css('.dt-select-trigger')).nativeElement;
    }));

    it('should emit an event when the selected option has changed', fakeAsync(() => {
      trigger.click();
      fixture.detectChanges();

      // tslint:disable-next-line: no-unnecessary-type-assertion
      (overlayContainerElement.querySelector('dt-option') as HTMLElement).click();

      expect(fixture.componentInstance.changeListener).toHaveBeenCalled();
    }));

    it('should not emit multiple change events for the same option', fakeAsync(() => {
      trigger.click();
      fixture.detectChanges();

      const option: HTMLElement = overlayContainerElement.querySelector('dt-option');

      option.click();
      option.click();

      expect(fixture.componentInstance.changeListener).toHaveBeenCalledTimes(1);
    }));

    it('should only emit one event when pressing arrow keys on closed select', fakeAsync(() => {
      const select = fixture.debugElement.query(By.css('dt-select')).nativeElement;
      dispatchKeyboardEvent(select, 'keydown', DOWN_ARROW);

      expect(fixture.componentInstance.changeListener).toHaveBeenCalledTimes(1);
    }));
  });

  describe('with ngModel', () => {
    beforeEach(async(() => { configureDtSelectTestingModule([NgModelSelect]); }));

    it('should disable itself when control is disabled using the property', fakeAsync(() => {
      const fixture = TestBed.createComponent(NgModelSelect);
      fixture.detectChanges();

      fixture.componentInstance.isDisabled = true;
      fixture.detectChanges();
      flush();

      const trigger = fixture.debugElement.query(By.css('.dt-select-trigger')).nativeElement;

      trigger.click();
      fixture.detectChanges();

      expect(overlayContainerElement.textContent)
        .toEqual('', `Expected select panel to stay closed.`);
      expect(fixture.componentInstance.select.panelOpen)
        .toBe(false, `Expected select panelOpen property to stay false.`);

      fixture.componentInstance.isDisabled = false;
      fixture.detectChanges();
      flush();

      trigger.click();
      fixture.detectChanges();

      expect(overlayContainerElement.textContent)
        .toContain('Steak', `Expected select panel to open normally on re-enabled control`);
      expect(fixture.componentInstance.select.panelOpen)
        .toBe(true, `Expected select panelOpen property to become true.`);
    }));
  });

  describe('with tabindex', () => {
    beforeEach(async(() => { configureDtSelectTestingModule([SelectWithPlainTabindex]); }));

    it('should be able to set the tabindex via the native attribute', fakeAsync(() => {
      const fixture = TestBed.createComponent(SelectWithPlainTabindex);
      fixture.detectChanges();

      const select = fixture.debugElement.query(By.css('dt-select')).nativeElement;
      expect(select.getAttribute('tabindex')).toBe('5');
    }));
  });

  describe('change events', () => {
    beforeEach(async(() => { configureDtSelectTestingModule([SelectWithPlainTabindex]); }));

    it('should complete the stateChanges stream on destroy', () => {
      const fixture = TestBed.createComponent(SelectWithPlainTabindex);
      fixture.detectChanges();

      const debugElement = fixture.debugElement.query(By.directive(DtSelect));
      const select = debugElement.componentInstance;

      const spy = jasmine.createSpy('stateChanges complete');
      const subscription = select.stateChanges.subscribe(undefined, undefined, spy);

      fixture.destroy();
      expect(spy).toHaveBeenCalled();
      subscription.unsubscribe();
    });
  });

  describe('with no placeholder', () => {
    beforeEach(async(() => { configureDtSelectTestingModule([BasicSelectNoPlaceholder]); }));

    it('should set the width of the overlay if there is no placeholder', fakeAsync(() => {
      const fixture = TestBed.createComponent(BasicSelectNoPlaceholder);

      fixture.detectChanges();
      const trigger = fixture.debugElement.query(By.css('.dt-select-trigger')).nativeElement;

      trigger.click();
      fixture.detectChanges();
      flush();

      const pane: HTMLElement = overlayContainerElement.querySelector('.cdk-overlay-pane');
      expect(parseInt(pane.style.minWidth, 10)).toBeGreaterThan(0);
    }));
  });

  describe('when invalid inside a form', () => {
    beforeEach(async(() => { configureDtSelectTestingModule([InvalidSelectInForm]); }));

    it('should not throw SelectionModel errors in addition to ngModel errors', fakeAsync(() => {
      const fixture = TestBed.createComponent(InvalidSelectInForm);

      // The first change detection run will throw the "ngModel is missing a name" error.
      expect(() => { fixture.detectChanges(); }).toThrowError(/the name attribute must be set/g);

      // The second run shouldn't throw selection-model related errors.
      expect(() => { fixture.detectChanges(); }).not.toThrow();
    }));
  });

  describe('with ngModel using compareWith', () => {
    beforeEach(async(() => { configureDtSelectTestingModule([NgModelCompareWithSelect]); }));

    let fixture: ComponentFixture<NgModelCompareWithSelect>;
    let instance: NgModelCompareWithSelect;

    beforeEach(fakeAsync(() => {
      fixture = TestBed.createComponent(NgModelCompareWithSelect);
      instance = fixture.componentInstance;
      fixture.detectChanges();
    }));

    describe('comparing by value', () => {

      it('should have a selection', fakeAsync(() => {
        const selectedOption = instance.select.selected;
        expect(selectedOption.value.value).toEqual('pizza-1');
      }));

      it('should update when making a new selection', fakeAsync(() => {
        instance.options.last._selectViaInteraction();
        fixture.detectChanges();
        flush();

        const selectedOption = instance.select.selected;
        expect(instance.selectedFood.value).toEqual('tacos-2');
        expect(selectedOption.value.value).toEqual('tacos-2');
      }));
    });

    describe('comparing by reference', () => {
      beforeEach(fakeAsync(() => {
        spyOn(instance, 'compareByReference').and.callThrough();
        instance.useCompareByReference();
        fixture.detectChanges();
      }));

      it('should use the comparator', fakeAsync(() => {
        // tslint:disable-next-line:no-unbound-method
        expect(instance.compareByReference).toHaveBeenCalled();
      }));

      it('should initialize with no selection despite having a value', fakeAsync(() => {
        expect(instance.selectedFood.value).toBe('pizza-1');
        expect(instance.select.selected).toBeUndefined();
      }));

      it('should not update the selection if value is copied on change', fakeAsync(() => {
        instance.options.first._selectViaInteraction();
        fixture.detectChanges();
        flush();

        expect(instance.selectedFood.value).toEqual('steak-0');
        expect(instance.select.selected).toBeUndefined();
      }));

      it('should throw an error when using a non-function comparator', fakeAsync(() => {
        instance.useNullComparator();

        expect(() => {
          fixture.detectChanges();
        }).toThrowError(wrappedErrorMessage(getDtSelectNonFunctionValueError()));
      }));
    });
  });

  describe(`when the select's value is accessed on initialization`, () => {
    beforeEach(async(() => { configureDtSelectTestingModule([SelectEarlyAccessSibling]); }));

    it('should not throw when trying to access the selected value on init', fakeAsync(() => {
      expect(() => {
        TestBed.createComponent(SelectEarlyAccessSibling).detectChanges();
      }).not.toThrow();
    }));
  });

  describe('inside of a form group', () => {
    beforeEach(async(() => { configureDtSelectTestingModule([SelectInsideFormGroup]); }));

    let fixture: ComponentFixture<SelectInsideFormGroup>;
    let testComponent: SelectInsideFormGroup;
    let select: HTMLElement;

    beforeEach(fakeAsync(() => {
      fixture = TestBed.createComponent(SelectInsideFormGroup);
      fixture.detectChanges();
      testComponent = fixture.componentInstance;
      select = fixture.debugElement.query(By.css('dt-select')).nativeElement;
    }));

    it('should not set the invalid class on a clean select', fakeAsync(() => {
      expect(testComponent.formGroup.untouched).toBe(true, 'Expected the form to be untouched.');
      expect(testComponent.formControl.invalid).toBe(true, 'Expected form control to be invalid.');
      expect(select.classList).not.toContain('dt-select-invalid', 'Expected select not to appear invalid.');
      expect(select.getAttribute('aria-invalid')).toBe('false', 'Expected aria-invalid to be set to false.');
    }));

    it('should appear as invalid if it becomes touched', fakeAsync(() => {
      expect(select.classList).not.toContain('dt-select-invalid', 'Expected select not to appear invalid.');
      expect(select.getAttribute('aria-invalid')).toBe('false', 'Expected aria-invalid to be set to false.');

      testComponent.formControl.markAsDirty();
      fixture.detectChanges();

      expect(select.classList).toContain('dt-select-invalid', 'Expected select to appear invalid.');
      expect(select.getAttribute('aria-invalid')).toBe('true', 'Expected aria-invalid to be set to true.');
    }));

    it('should not have the invalid class when the select becomes valid', fakeAsync(() => {
      testComponent.formControl.markAsDirty();
      fixture.detectChanges();

      expect(select.classList).toContain('dt-select-invalid', 'Expected select to appear invalid.');
      expect(select.getAttribute('aria-invalid')).toBe('true', 'Expected aria-invalid to be set to true.');

      testComponent.formControl.setValue('pizza-1');
      fixture.detectChanges();

      expect(select.classList).not.toContain('dt-select-invalid', 'Expected select not to appear invalid.');
      expect(select.getAttribute('aria-invalid')).toBe('false', 'Expected aria-invalid to be set to false.');
    }));

    it('should appear as invalid when the parent form group is submitted', fakeAsync(() => {
      expect(select.classList).not.toContain('dt-select-invalid', 'Expected select not to appear invalid.');
      expect(select.getAttribute('aria-invalid')).toBe('false', 'Expected aria-invalid to be set to false.');

      dispatchFakeEvent(fixture.debugElement.query(By.css('form')).nativeElement, 'submit');
      fixture.detectChanges();

      expect(select.classList).toContain('dt-select-invalid', 'Expected select to appear invalid.');
      expect(select.getAttribute('aria-invalid')).toBe('true', 'Expected aria-invalid to be set to true.');
    }));

    it('should render the error messages when the parent form is submitted', fakeAsync(() => {
      const debugEl = fixture.debugElement.nativeElement;

      expect(debugEl.querySelectorAll('dt-error').length).toBe(0, 'Expected no error messages');

      dispatchFakeEvent(fixture.debugElement.query(By.css('form')).nativeElement, 'submit');
      fixture.detectChanges();

      expect(debugEl.querySelectorAll('dt-error').length).toBe(1, 'Expected one error message');
    }));

    it('should override error matching behavior via injection token', fakeAsync(() => {
      const errorStateMatcher: ErrorStateMatcher = {
        isErrorState: jasmine.createSpy('error state matcher').and.returnValue(true),
      };

      fixture.destroy();

      TestBed.resetTestingModule().configureTestingModule({
        imports: [
          DtSelectModule,
          ReactiveFormsModule,
          FormsModule,
          NoopAnimationsModule,
          HttpClientTestingModule,
          DtIconModule.forRoot({ svgIconLocation: `{{name}}.svg` }),
        ],
        declarations: [SelectInsideFormGroup],
        providers: [{ provide: ErrorStateMatcher, useValue: errorStateMatcher }],
      });

      const errorFixture = TestBed.createComponent(SelectInsideFormGroup);
      const component = errorFixture.componentInstance;

      errorFixture.detectChanges();

      expect(component.select.errorState).toBe(true);
      // tslint:disable-next-line:no-unbound-method
      expect(errorStateMatcher.isErrorState).toHaveBeenCalled();
    }));
  });

  describe('with custom error behavior', () => {
    beforeEach(async(() => { configureDtSelectTestingModule([CustomErrorBehaviorSelect]); }));

    it('should be able to override the error matching behavior via an @Input', fakeAsync(() => {
      const fixture = TestBed.createComponent(CustomErrorBehaviorSelect);
      const component = fixture.componentInstance;
      const matcher = jasmine.createSpy('error state matcher').and.returnValue(true);

      fixture.detectChanges();

      expect(component.control.invalid).toBe(false);
      expect(component.select.errorState).toBe(false);

      fixture.componentInstance.errorStateMatcher = { isErrorState: matcher };
      fixture.detectChanges();

      expect(component.select.errorState).toBe(true);
      expect(matcher).toHaveBeenCalled();
    }));
  });

  describe('with preselected array values', () => {
    beforeEach(async(() => {
      configureDtSelectTestingModule([SingleSelectWithPreselectedArrayValues]);
    }));

    it('should be able to preselect an array value in single-selection mode', fakeAsync(() => {
      const fixture = TestBed.createComponent(SingleSelectWithPreselectedArrayValues);
      fixture.detectChanges();
      flush();
      fixture.detectChanges();

      const trigger = fixture.debugElement.query(By.css('.dt-select-trigger')).nativeElement;

      expect(trigger.textContent).toContain('Pizza');
      expect(fixture.componentInstance.options.toArray()[1].selected).toBe(true);
    }));
  });

  describe('with OnPush', () => {
    beforeEach(async(() => {
      configureDtSelectTestingModule([
        BasicSelectOnPush,
        BasicSelectOnPushPreselected,
      ]);
    }));

    it('should set the trigger text based on the value when initialized', fakeAsync(() => {
      const fixture = TestBed.createComponent(BasicSelectOnPushPreselected);

      fixture.detectChanges();
      flush();

      const trigger = fixture.debugElement.query(By.css('.dt-select-trigger')).nativeElement;

      fixture.detectChanges();

      expect(trigger.textContent).toContain('Pizza');
    }));

    it('should update the trigger based on the value', fakeAsync(() => {
      const fixture = TestBed.createComponent(BasicSelectOnPush);
      fixture.detectChanges();
      const trigger = fixture.debugElement.query(By.css('.dt-select-trigger')).nativeElement;

      fixture.componentInstance.control.setValue('pizza-1');
      fixture.detectChanges();

      expect(trigger.textContent).toContain('Pizza');

      fixture.componentInstance.control.reset();
      fixture.detectChanges();

      expect(trigger.textContent).not.toContain('Pizza');
    }));
  });

  describe('when reseting the value by setting null or undefined', () => {
    beforeEach(async(() => { configureDtSelectTestingModule([ResetValuesSelect]); }));

    let fixture: ComponentFixture<ResetValuesSelect>;
    let trigger: HTMLElement;
    let options: NodeListOf<HTMLElement>;

    beforeEach(fakeAsync(() => {
      fixture = TestBed.createComponent(ResetValuesSelect);
      fixture.detectChanges();
      trigger = fixture.debugElement.query(By.css('.dt-select-trigger')).nativeElement;

      trigger.click();
      fixture.detectChanges();
      flush();

      options = overlayContainerElement.querySelectorAll('dt-option');
      options[0].click();
      fixture.detectChanges();
      flush();
    }));

    it('should reset when an option with an undefined value is selected', fakeAsync(() => {
      options[4].click();
      fixture.detectChanges();
      flush();

      expect(fixture.componentInstance.control.value).toBeUndefined();
      expect(fixture.componentInstance.select.selected).toBeFalsy();
      expect(trigger.textContent).not.toContain('Undefined');
    }));

    it('should reset when an option with a null value is selected', fakeAsync(() => {
      options[5].click();
      fixture.detectChanges();
      flush();

      expect(fixture.componentInstance.control.value).toBeNull();
      expect(fixture.componentInstance.select.selected).toBeFalsy();
      expect(trigger.textContent).not.toContain('Null');
    }));

    it('should reset when a blank option is selected', fakeAsync(() => {
      options[6].click();
      fixture.detectChanges();
      flush();

      expect(fixture.componentInstance.control.value).toBeUndefined();
      expect(fixture.componentInstance.select.selected).toBeFalsy();
      expect(trigger.textContent).not.toContain('None');
    }));

    it('should not mark the reset option as selected ', fakeAsync(() => {
      options[5].click();
      fixture.detectChanges();
      flush();

      fixture.componentInstance.select.open();
      fixture.detectChanges();
      flush();

      expect(options[5].classList).not.toContain('dt-option-selected');
    }));

    it('should not consider the reset values as selected when resetting the form control', fakeAsync(() => {
      fixture.componentInstance.control.reset();
      fixture.detectChanges();

      expect(fixture.componentInstance.control.value).toBeNull();
      expect(fixture.componentInstance.select.selected).toBeFalsy();
      expect(trigger.textContent).not.toContain('Null');
      expect(trigger.textContent).not.toContain('Undefined');
    }));
  });

});

@Component({
  selector: 'basic-select',
  template: `
    <div [style.height.px]="heightAbove"></div>
    <dt-form-field>
      <dt-select placeholder="Food" [formControl]="control" [required]="isRequired"
        [tabIndex]="tabIndexOverride" [aria-label]="ariaLabel" [aria-labelledby]="ariaLabelledby"
        [panelClass]="panelClass">
        <dt-option *ngFor="let food of foods" [value]="food.value" [disabled]="food.disabled">
          {{ food.viewValue }}
        </dt-option>
      </dt-select>
    </dt-form-field>
    <div [style.height.px]="heightBelow"></div>
  `,
})
class BasicSelect {
  foods: any[] = [
    { value: 'steak-0', viewValue: 'Steak' },
    { value: 'pizza-1', viewValue: 'Pizza' },
    { value: 'tacos-2', viewValue: 'Tacos', disabled: true },
    { value: 'sandwich-3', viewValue: 'Sandwich' },
    { value: 'chips-4', viewValue: 'Chips' },
    { value: 'eggs-5', viewValue: 'Eggs' },
    { value: 'pasta-6', viewValue: 'Pasta' },
    { value: 'sushi-7', viewValue: 'Sushi' },
  ];
  control = new FormControl();
  isRequired: boolean;
  heightAbove = 0;
  heightBelow = 0;
  tabIndexOverride: number;
  ariaLabel: string;
  ariaLabelledby: string;
  panelClass = ['custom-one', 'custom-two'];

  @ViewChild(DtSelect, { static: true }) select: DtSelect<any>;
  @ViewChildren(DtOption) options: QueryList<DtOption<any>>;
}

@Component({
  selector: 'select-with-groups',
  template: `
    <dt-form-field>
      <dt-select placeholder="Pokemon" [formControl]="control">
        <dt-optgroup *ngFor="let group of pokemonTypes" [label]="group.name"
          [disabled]="group.disabled">
          <dt-option *ngFor="let pokemon of group.pokemon" [value]="pokemon.value">
            {{ pokemon.viewValue }}
          </dt-option>
        </dt-optgroup>
        <dt-option value="mime-11">Mr. Mime</dt-option>
      </dt-select>
    </dt-form-field>
  `,
})
class SelectWithGroups {
  control = new FormControl();
  pokemonTypes = [
    {
      name: 'Grass',
      pokemon: [
        { value: 'bulbasaur-0', viewValue: 'Bulbasaur' },
        { value: 'oddish-1', viewValue: 'Oddish' },
        { value: 'bellsprout-2', viewValue: 'Bellsprout' },
      ],
    },
    {
      name: 'Water',
      disabled: true,
      pokemon: [
        { value: 'squirtle-3', viewValue: 'Squirtle' },
        { value: 'psyduck-4', viewValue: 'Psyduck' },
        { value: 'horsea-5', viewValue: 'Horsea' },
      ],
    },
    {
      name: 'Fire',
      pokemon: [
        { value: 'charmander-6', viewValue: 'Charmander' },
        { value: 'vulpix-7', viewValue: 'Vulpix' },
        { value: 'flareon-8', viewValue: 'Flareon' },
      ],
    },
    {
      name: 'Psychic',
      pokemon: [
        { value: 'mew-9', viewValue: 'Mew' },
        { value: 'mewtwo-10', viewValue: 'Mewtwo' },
      ],
    },
  ];

  @ViewChild(DtSelect, { static: true }) select: DtSelect<any>;
  @ViewChildren(DtOption) options: QueryList<DtOption<any>>;
}

@Component({
  selector: 'select-with-groups',
  template: `
    <dt-form-field>
      <dt-select placeholder="Pokemon" [formControl]="control">
        <dt-optgroup *ngFor="let group of pokemonTypes" [label]="group.name">
          <ng-container *ngFor="let pokemon of group.pokemon">
            <dt-option [value]="pokemon.value">{{ pokemon.viewValue }}</dt-option>
          </ng-container>
        </dt-optgroup>
      </dt-select>
    </dt-form-field>
  `,
})
class SelectWithGroupsAndNgContainer {
  control = new FormControl();
  pokemonTypes = [
    {
      name: 'Grass',
      pokemon: [{ value: 'bulbasaur-0', viewValue: 'Bulbasaur' }],
    },
  ];
}

@Component({
  template: `
    <dt-form-field>
      <dt-label>Select a thing</dt-label>
      <dt-select [placeholder]="placeholder">
        <dt-option value="thing">A thing</dt-option>
      </dt-select>
    </dt-form-field>
  `,
})
class SelectWithFormFieldLabel {
  placeholder: string;
}

@Component({
  selector: 'select-init-without-options',
  template: `
    <dt-form-field>
      <dt-select placeholder="Food I want to eat right now" [formControl]="control">
        <dt-option *ngFor="let food of foods" [value]="food.value">{{ food.viewValue }}</dt-option>
      </dt-select>
    </dt-form-field>
  `,
})
class SelectInitWithoutOptions {
  foods: any[];
  control = new FormControl('pizza-1');

  @ViewChild(DtSelect, { static: true }) select: DtSelect<any>;
  @ViewChildren(DtOption) options: QueryList<DtOption<any>>;

  addOptions(): void {
    this.foods = [
      { value: 'steak-0', viewValue: 'Steak' },
      { value: 'pizza-1', viewValue: 'Pizza' },
      { value: 'tacos-2', viewValue: 'Tacos' },
    ];
  }
}

@Component({
  selector: 'select-with-change-event',
  template: `
    <dt-form-field>
      <dt-select (selectionChange)="changeListener($event)">
        <dt-option *ngFor="let food of foods" [value]="food">{{ food }}</dt-option>
      </dt-select>
    </dt-form-field>
  `,
})
class SelectWithChangeEvent {
  foods: string[] = [
    'steak-0',
    'pizza-1',
    'tacos-2',
    'sandwich-3',
    'chips-4',
    'eggs-5',
    'pasta-6',
    'sushi-7',
  ];

  changeListener = jasmine.createSpy('DtSelect change listener');
}

@Component({
  selector: 'ng-model-select',
  template: `
    <dt-form-field>
      <dt-select placeholder="Food" ngModel [disabled]="isDisabled">
        <dt-option *ngFor="let food of foods"
                    [value]="food.value">{{ food.viewValue }}
        </dt-option>
      </dt-select>
    </dt-form-field>
  `,
})
class NgModelSelect {
  foods: any[] = [
    { value: 'steak-0', viewValue: 'Steak' },
    { value: 'pizza-1', viewValue: 'Pizza' },
    { value: 'tacos-2', viewValue: 'Tacos' },
  ];
  isDisabled: boolean;

  @ViewChild(DtSelect, { static: true }) select: DtSelect<any>;
  @ViewChildren(DtOption) options: QueryList<DtOption<any>>;
}

@Component({
  selector: 'select-with-plain-tabindex',
  template: `<dt-form-field><dt-select tabindex="5"></dt-select></dt-form-field>`,
})
class SelectWithPlainTabindex { }

@Component({
  selector: 'basic-select-no-placeholder',
  template: `
    <dt-form-field>
      <dt-select>
        <dt-option value="value">There are no other options</dt-option>
      </dt-select>
    </dt-form-field>
  `,
})
class BasicSelectNoPlaceholder { }

@Component({
  template: `
    <form>
      <dt-form-field>
        <dt-select [(ngModel)]="value"></dt-select>
      </dt-form-field>
    </form>
  `,
})
class InvalidSelectInForm {
  value: any;
}

@Component({
  selector: 'ng-model-compare-with',
  template: `
    <dt-form-field>
      <dt-select [ngModel]="selectedFood" (ngModelChange)="setFoodByCopy($event)"
                 [compareWith]="comparator">
        <dt-option *ngFor="let food of foods" [value]="food">{{ food.viewValue }}</dt-option>
      </dt-select>
    </dt-form-field>
  `,
})
class NgModelCompareWithSelect {
  foods = [
    { value: 'steak-0', viewValue: 'Steak' },
    { value: 'pizza-1', viewValue: 'Pizza' },
    { value: 'tacos-2', viewValue: 'Tacos' },
  ];
  selectedFood = { value: 'pizza-1', viewValue: 'Pizza' };
  // tslint:disable-next-line:no-unbound-method
  comparator: ((f1: any, f2: any) => boolean) | null = this.compareByValue;

  @ViewChild(DtSelect, { static: true }) select: DtSelect<any>;
  @ViewChildren(DtOption) options: QueryList<DtOption<any>>;

  useCompareByValue(): void { this.comparator = this.compareByValue; }

  useCompareByReference(): void { this.comparator = this.compareByReference; }

  useNullComparator(): void { this.comparator = null; }

  compareByValue(f1: any, f2: any): boolean { return f1 && f2 && f1.value === f2.value; }

  compareByReference(f1: any, f2: any): boolean { return f1 === f2; }

  setFoodByCopy(newValue: any): void {
    this.selectedFood = { ...{}, ...newValue };
  }
}

@Component({
  selector: 'select-early-sibling-access',
  template: `
    <dt-form-field>
      <dt-select #select="dtSelect"></dt-select>
    </dt-form-field>
    <div *ngIf="select.selected"></div>
  `,
})
class SelectEarlyAccessSibling { }

@Component({
  template: `
    <form [formGroup]="formGroup">
      <dt-form-field>
        <dt-select placeholder="Food" formControlName="food">
          <dt-option value="steak-0">Steak</dt-option>
          <dt-option value="pizza-1">Pizza</dt-option>
        </dt-select>
        <dt-error>This field is required</dt-error>
      </dt-form-field>
    </form>
  `,
})
class SelectInsideFormGroup {
  @ViewChild(FormGroupDirective, { static: true }) formGroupDirective: FormGroupDirective;
  @ViewChild(DtSelect, { static: true }) select: DtSelect<any>;
  // tslint:disable-next-line:no-unbound-method
  formControl = new FormControl('', Validators.required);
  formGroup = new FormGroup({
    food: this.formControl,
  });
}

@Component({
  template: `
    <dt-select placeholder="Food" [formControl]="control" [errorStateMatcher]="errorStateMatcher">
      <dt-option *ngFor="let food of foods" [value]="food.value">{{ food.viewValue }}</dt-option>
    </dt-select>
  `,
})
class CustomErrorBehaviorSelect {
  @ViewChild(DtSelect, { static: true }) select: DtSelect<any>;
  control = new FormControl();
  foods: any[] = [
    { value: 'steak-0', viewValue: 'Steak' },
    { value: 'pizza-1', viewValue: 'Pizza' },
  ];
  errorStateMatcher: ErrorStateMatcher;
}

@Component({
  template: `
    <dt-form-field>
      <dt-select placeholder="Food" [(ngModel)]="selectedFoods">
        <dt-option *ngFor="let food of foods" [value]="food.value">{{ food.viewValue }}</dt-option>
      </dt-select>
    </dt-form-field>
  `,
})
class SingleSelectWithPreselectedArrayValues {
  foods: any[] = [
    { value: ['steak-0', 'steak-1'], viewValue: 'Steak' },
    { value: ['pizza-1', 'pizza-2'], viewValue: 'Pizza' },
    { value: ['tacos-2', 'tacos-3'], viewValue: 'Tacos' },
  ];

  selectedFoods = this.foods[1].value;

  @ViewChild(DtSelect, { static: true }) select: DtSelect<any>;
  @ViewChildren(DtOption) options: QueryList<DtOption<any>>;
}

@Component({
  selector: 'basic-select-on-push',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <dt-form-field>
      <dt-select placeholder="Food" [formControl]="control">
        <dt-option *ngFor="let food of foods" [value]="food.value">{{ food.viewValue }}</dt-option>
      </dt-select>
    </dt-form-field>
  `,
})
class BasicSelectOnPush {
  foods: any[] = [
    { value: 'steak-0', viewValue: 'Steak' },
    { value: 'pizza-1', viewValue: 'Pizza' },
    { value: 'tacos-2', viewValue: 'Tacos' },
  ];
  control = new FormControl();
}

@Component({
  selector: 'basic-select-on-push-preselected',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <dt-form-field>
      <dt-select placeholder="Food" [formControl]="control">
        <dt-option *ngFor="let food of foods" [value]="food.value">{{ food.viewValue }}</dt-option>
      </dt-select>
    </dt-form-field>
  `,
})
class BasicSelectOnPushPreselected {
  foods: any[] = [
    { value: 'steak-0', viewValue: 'Steak' },
    { value: 'pizza-1', viewValue: 'Pizza' },
    { value: 'tacos-2', viewValue: 'Tacos' },
  ];
  control = new FormControl('pizza-1');
}

@Component({
  selector: 'reset-values-select',
  template: `
    <dt-form-field>
      <dt-select placeholder="Food" [formControl]="control">
        <dt-option *ngFor="let food of foods" [value]="food.value">
          {{ food.viewValue }}
        </dt-option>
        <dt-option>None</dt-option>
      </dt-select>
    </dt-form-field>
  `,
})
class ResetValuesSelect {
  foods: any[] = [
    { value: 'steak-0', viewValue: 'Steak' },
    { value: 'pizza-1', viewValue: 'Pizza' },
    { value: 'tacos-2', viewValue: 'Tacos' },
    { value: false, viewValue: 'Falsy' },
    { viewValue: 'Undefined' },
    { value: null, viewValue: 'Null' },
  ];
  control = new FormControl();

  @ViewChild(DtSelect, { static: true }) select: DtSelect<any>;
}

@Component({
  template: `
    <dt-select>
      <dt-option [value]="0">Zero</dt-option>
    </dt-select>
  `,
})
class SelectWithOptionValueZero {
  @ViewChild(DtSelect, { static: true }) select: DtSelect<any>;
}

// tslint:enable:no-any i18n no-magic-numbers
