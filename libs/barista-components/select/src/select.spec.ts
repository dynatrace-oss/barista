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

import {
  DOWN_ARROW,
  END,
  ENTER,
  HOME,
  LEFT_ARROW,
  RIGHT_ARROW,
  SPACE,
  TAB,
  UP_ARROW,
} from '@angular/cdk/keycodes';
import { OverlayContainer } from '@angular/cdk/overlay';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import {
  ChangeDetectionStrategy,
  Component,
  QueryList,
  ViewChild,
  ViewChildren,
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
import { map } from 'rxjs/operators';

import {
  DtOption,
  DtOptionSelectionChange,
  ErrorStateMatcher,
  DT_UI_TEST_CONFIG,
  DtUiTestConfiguration,
} from '@dynatrace/barista-components/core';
import { DtFormFieldModule } from '@dynatrace/barista-components/form-field';
import { DtIconModule } from '@dynatrace/barista-components/icon';
import { DtSelectModule } from './select-module';
import {
  dispatchEvent,
  dispatchFakeEvent,
  dispatchKeyboardEvent,
  createComponent,
  createKeyboardEvent,
} from '@dynatrace/testing/browser';
import { DtSelectValueTemplate } from './select-value-template';
import { DtSelect } from './select';

describe('DtSelect', () => {
  let overlayContainer: OverlayContainer;
  let overlayContainerElement: HTMLElement;
  const overlayConfig: DtUiTestConfiguration = {
    attributeName: 'dt-ui-test-id',
    constructOverlayAttributeValue(attributeName: string): string {
      return `${attributeName}-overlay`;
    },
  };

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
      providers: [{ provide: DT_UI_TEST_CONFIG, useValue: overlayConfig }],
    }).compileComponents();

    inject([OverlayContainer], (oc: OverlayContainer) => {
      overlayContainer = oc;
      overlayContainerElement = oc.getContainerElement();
    })();
  }

  afterEach(() => {
    overlayContainer.ngOnDestroy();
  });

  describe('core', () => {
    beforeEach(
      waitForAsync(() => {
        configureDtSelectTestingModule([
          BasicSelect,
          SelectWithGroups,
          SelectWithGroupsAndNgContainer,
          SelectWithFormFieldLabel,
          SelectWithOptionValueZero,
          SelectWithCustomTrigger,
        ]);
      }),
    );

    describe('accessibility', () => {
      describe('for select', () => {
        let fixture: ComponentFixture<BasicSelect>;
        let select: HTMLElement;

        beforeEach(fakeAsync(() => {
          fixture = createComponent(BasicSelect);
          select = fixture.debugElement.query(
            By.css('dt-select'),
          ).nativeElement;
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

          expect(select.getAttribute('aria-label')).toBeFalsy();
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
          expect(select.getAttribute('aria-required')).toEqual('false');

          fixture.componentInstance.isRequired = true;
          fixture.detectChanges();

          expect(select.getAttribute('aria-required')).toEqual('true');
        }));

        it('should set the dt-select-required class for required selects', fakeAsync(() => {
          expect(select.classList).not.toContain('dt-select-required');

          fixture.componentInstance.isRequired = true;
          fixture.detectChanges();

          expect(select.classList).toContain('dt-select-required');
        }));

        it('should set aria-invalid for selects that are invalid and touched', fakeAsync(() => {
          expect(select.getAttribute('aria-invalid')).toEqual('false');

          fixture.componentInstance.isRequired = true;
          fixture.componentInstance.control.markAsDirty();
          fixture.detectChanges();

          expect(select.getAttribute('aria-invalid')).toEqual('true');
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

          const labelFixture = TestBed.createComponent(
            SelectWithFormFieldLabel,
          );
          labelFixture.detectChanges();
          select = labelFixture.debugElement.query(
            By.css('dt-select'),
          ).nativeElement;

          expect(select.getAttribute('aria-labelledby')).toBeTruthy();
          expect(select.getAttribute('aria-labelledby')).toBe(
            labelFixture.nativeElement
              .querySelector('label')
              .getAttribute('id'),
          );
        });

        it('should not set `aria-labelledby` if there is a placeholder', () => {
          fixture.destroy();

          const labelFixture = TestBed.createComponent(
            SelectWithFormFieldLabel,
          );
          labelFixture.componentInstance.placeholder = 'Thing selector';
          labelFixture.detectChanges();
          select = labelFixture.debugElement.query(
            By.css('dt-select'),
          ).nativeElement;

          expect(select.getAttribute('aria-labelledby')).toBeFalsy();
        });

        it('should select options via the UP/DOWN arrow keys on a closed select', () => {
          const formControl = fixture.componentInstance.control;
          const options = fixture.componentInstance.options.toArray();

          expect(formControl.value).toBeFalsy();

          dispatchKeyboardEvent(select, 'keydown', DOWN_ARROW);

          expect(options[0].selected).toBe(true);
          expect(formControl.value).toBe(options[0].value);

          dispatchKeyboardEvent(select, 'keydown', DOWN_ARROW);
          dispatchKeyboardEvent(select, 'keydown', DOWN_ARROW);

          // Note that the third option is skipped, because it is disabled.
          expect(options[3].selected).toBe(true);
          expect(formControl.value).toBe(options[3].value);

          dispatchKeyboardEvent(select, 'keydown', UP_ARROW);

          expect(options[1].selected).toBe(true);
          expect(formControl.value).toBe(options[1].value);
        });

        it('should resume focus from selected item after selecting via click', fakeAsync(() => {
          const formControl = fixture.componentInstance.control;
          const options = fixture.componentInstance.options.toArray();

          expect(formControl.value).toBeFalsy();

          fixture.componentInstance.select.open();
          fixture.detectChanges();
          flush();

          (
            overlayContainerElement.querySelectorAll(
              'dt-option',
            )[3] as HTMLElement
          ).click();
          fixture.detectChanges();
          flush();

          expect(formControl.value).toBe(options[3].value);

          dispatchKeyboardEvent(select, 'keydown', DOWN_ARROW);
          fixture.detectChanges();

          expect(formControl.value).toBe(options[4].value);
          flush();
        }));

        it('should select options via LEFT/RIGHT arrow keys on a closed select', () => {
          const formControl = fixture.componentInstance.control;
          const options = fixture.componentInstance.options.toArray();

          expect(formControl.value).toBeFalsy();

          dispatchKeyboardEvent(select, 'keydown', RIGHT_ARROW);

          expect(options[0].selected).toBe(true);
          expect(formControl.value).toBe(options[0].value);

          dispatchKeyboardEvent(select, 'keydown', RIGHT_ARROW);
          dispatchKeyboardEvent(select, 'keydown', RIGHT_ARROW);

          // Note that the third option is skipped, because it is disabled.
          expect(options[3].selected).toBe(true);
          expect(formControl.value).toBe(options[3].value);

          dispatchKeyboardEvent(select, 'keydown', LEFT_ARROW);

          expect(options[1].selected).toBe(true);
          expect(formControl.value).toBe(options[1].value);
        });

        it('should open a single-selection select using ALT + DOWN_ARROW', () => {
          const { control: formControl, select: selectInstance } =
            fixture.componentInstance;

          expect(selectInstance.panelOpen).toBe(false);
          expect(formControl.value).toBeFalsy();

          const event = createKeyboardEvent('keydown', DOWN_ARROW);
          Object.defineProperty(event, 'altKey', { get: () => true });

          dispatchEvent(select, event);

          expect(selectInstance.panelOpen).toBe(true);
          expect(formControl.value).toBeFalsy();
        });

        it('should open a single-selection select using ALT + UP_ARROW', () => {
          const { control: formControl, select: selectInstance } =
            fixture.componentInstance;

          expect(selectInstance.panelOpen).toBe(false);
          expect(formControl.value).toBeFalsy();

          const event = createKeyboardEvent('keydown', UP_ARROW);
          Object.defineProperty(event, 'altKey', { get: () => true });

          dispatchEvent(select, event);

          expect(selectInstance.panelOpen).toBe(true);
          expect(formControl.value).toBeFalsy();
        });

        it('should should close when pressing ALT + DOWN_ARROW', () => {
          const { select: selectInstance } = fixture.componentInstance;

          selectInstance.open();
          fixture.detectChanges();

          expect(selectInstance.panelOpen).toBe(true);

          const event = createKeyboardEvent('keydown', DOWN_ARROW);
          Object.defineProperty(event, 'altKey', { get: () => true });

          dispatchEvent(select, event);

          expect(selectInstance.panelOpen).toBe(false);
          expect(event.defaultPrevented).toBe(true);
        });

        it('should should close when pressing ALT + UP_ARROW', () => {
          const { select: selectInstance } = fixture.componentInstance;

          selectInstance.open();
          fixture.detectChanges();

          expect(selectInstance.panelOpen).toBe(true);

          const event = createKeyboardEvent('keydown', UP_ARROW);
          Object.defineProperty(event, 'altKey', { get: () => true });

          dispatchEvent(select, event);

          expect(selectInstance.panelOpen).toBe(false);
          expect(event.defaultPrevented).toBe(true);
        });

        it('should be able to select options by typing on a closed select', fakeAsync(() => {
          const formControl = fixture.componentInstance.control;
          const options = fixture.componentInstance.options.toArray();

          expect(formControl.value).toBeFalsy();

          dispatchEvent(
            select,
            createKeyboardEvent('keydown', 80, undefined, 'p'),
          );
          tick(200);

          expect(options[1].selected).toBe(true);
          expect(formControl.value).toBe(options[1].value);

          dispatchEvent(
            select,
            createKeyboardEvent('keydown', 69, undefined, 'e'),
          );
          tick(200);

          expect(options[5].selected).toBe(true);
          expect(formControl.value).toBe(options[5].value);
        }));

        it('should do nothing if the key manager did not change the active item', () => {
          const formControl = fixture.componentInstance.control;

          expect(formControl.value).toBeNull();
          expect(formControl.pristine).toBe(true);

          dispatchKeyboardEvent(select, 'keydown', 16); // Press a random key.
          expect(formControl.value).toBeNull();
          expect(formControl.pristine).toBe(true);
        });

        it('should continue from the selected option when the value is set programmatically', fakeAsync(() => {
          const formControl = fixture.componentInstance.control;

          formControl.setValue('eggs-5');
          fixture.detectChanges();

          dispatchKeyboardEvent(select, 'keydown', DOWN_ARROW);

          expect(formControl.value).toBe('pasta-6');
          expect(fixture.componentInstance.options.toArray()[6].selected).toBe(
            true,
          );
          flush();
        }));

        it('should not cycle through the options if the control is disabled', () => {
          const formControl = fixture.componentInstance.control;

          formControl.setValue('eggs-5');
          formControl.disable();

          dispatchKeyboardEvent(select, 'keydown', DOWN_ARROW);

          expect(formControl.value).toBe('eggs-5');
        });

        it('should not wrap selection after reaching the end of the options', () => {
          const lastOption = fixture.componentInstance.options.last;

          fixture.componentInstance.options.forEach(() => {
            dispatchKeyboardEvent(select, 'keydown', DOWN_ARROW);
          });

          expect(lastOption.selected).toBe(true);

          dispatchKeyboardEvent(select, 'keydown', DOWN_ARROW);

          expect(lastOption.selected).toBe(true);
        });

        it('should prevent the default action when pressing space', fakeAsync(() => {
          const event = dispatchKeyboardEvent(select, 'keydown', SPACE);
          expect(event.defaultPrevented).toBe(true);
          flush();
        }));

        it('should consider the selection a result of a user action when closed', fakeAsync(() => {
          const option = fixture.componentInstance.options.first;
          const spy = jest.fn();
          const subscription = option.selectionChange
            .pipe(map((e) => e.isUserInput))
            .subscribe(spy);

          dispatchKeyboardEvent(select, 'keydown', DOWN_ARROW);
          expect(spy).toHaveBeenCalledWith(true);

          subscription.unsubscribe();
          flush();
        }));

        it('should be able to focus the select trigger', fakeAsync(() => {
          document.body.focus(); // ensure that focus isn't on the trigger already
          fixture.componentInstance.select.focus();

          expect(document.activeElement).toBe(select);
        }));

        // Having `aria-hidden` on the trigger avoids issues where
        // screen readers read out the wrong amount of options.
        it('should set aria-hidden on the trigger element', fakeAsync(() => {
          const trigger = fixture.debugElement.query(
            By.css('.dt-select-trigger'),
          ).nativeElement;

          expect(trigger.getAttribute('aria-hidden')).toBe('true');
        }));

        it('should set aria-activedescendant only while the panel is open', fakeAsync(() => {
          fixture.componentInstance.control.setValue('chips-4');
          fixture.detectChanges();

          const host = fixture.debugElement.query(
            By.css('dt-select'),
          ).nativeElement;

          expect(host.hasAttribute('aria-activedescendant')).toBe(false);

          fixture.componentInstance.select.open();
          fixture.detectChanges();
          flush();

          const options = overlayContainerElement.querySelectorAll('dt-option');

          expect(host.getAttribute('aria-activedescendant')).toBe(
            options[4].id,
          );

          fixture.componentInstance.select.close();
          fixture.detectChanges();
          flush();

          expect(host.hasAttribute('aria-activedescendant')).toBe(false);
        }));

        it('should set aria-activedescendant based on the focused option', fakeAsync(() => {
          const host = fixture.debugElement.query(
            By.css('dt-select'),
          ).nativeElement;

          fixture.componentInstance.select.open();
          fixture.detectChanges();
          flush();

          const options = overlayContainerElement.querySelectorAll('dt-option');

          expect(host.getAttribute('aria-activedescendant')).toBe(
            options[0].id,
          );

          [1, 2, 3].forEach(() => {
            dispatchKeyboardEvent(host, 'keydown', DOWN_ARROW);
            fixture.detectChanges();
          });

          expect(host.getAttribute('aria-activedescendant')).toBe(
            options[4].id,
          );

          dispatchKeyboardEvent(host, 'keydown', UP_ARROW);
          fixture.detectChanges();

          expect(host.getAttribute('aria-activedescendant')).toBe(
            options[3].id,
          );
          flush();
        }));

        it('should not change the aria-activedescendant using the horizontal arrow keys', fakeAsync(() => {
          const host = fixture.debugElement.query(
            By.css('dt-select'),
          ).nativeElement;

          fixture.componentInstance.select.open();
          fixture.detectChanges();
          flush();

          const options = overlayContainerElement.querySelectorAll('dt-option');

          expect(host.getAttribute('aria-activedescendant')).toBe(
            options[0].id,
          );

          [1, 2, 3].forEach(() => {
            dispatchKeyboardEvent(host, 'keydown', RIGHT_ARROW);
            fixture.detectChanges();
          });

          expect(host.getAttribute('aria-activedescendant')).toBe(
            options[0].id,
          );
          flush();
        }));
      });

      describe('for options', () => {
        let fixture: ComponentFixture<BasicSelect>;
        let trigger: HTMLElement;
        let options: NodeListOf<HTMLElement>;

        beforeEach(fakeAsync(() => {
          fixture = createComponent(BasicSelect);
          trigger = fixture.debugElement.query(
            By.css('.dt-select-trigger'),
          ).nativeElement;
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

          // eslint-disable-next-line dot-notation, @typescript-eslint/dot-notation
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
          fixture = createComponent(SelectWithGroups);
          trigger = fixture.debugElement.query(
            By.css('.dt-select-trigger'),
          ).nativeElement;
          trigger.click();
          fixture.detectChanges();
          groups = overlayContainerElement.querySelectorAll('dt-optgroup');
        }));

        it('should set the appropriate role', fakeAsync(() => {
          expect(groups[0].getAttribute('role')).toBe('group');
        }));

        it('should set the `aria-labelledby` attribute', fakeAsync(() => {
          const group = groups[0];
          const label = group.querySelector('label') as HTMLElement;

          expect(label.getAttribute('id')).toBeTruthy();
          expect(group.getAttribute('aria-labelledby')).toBe(
            label.getAttribute('id'),
          );
        }));

        it('should set the `aria-disabled` attribute if the group is disabled', fakeAsync(() => {
          expect(groups[1].getAttribute('aria-disabled')).toBe('true');
        }));
      });
    });

    describe('custom trigger', () => {
      let fixture: ComponentFixture<SelectWithCustomTrigger>;
      let trigger: HTMLElement;

      beforeEach(fakeAsync(() => {
        fixture = createComponent(SelectWithCustomTrigger);
        trigger = fixture.debugElement.query(
          By.css('.dt-select-trigger'),
        ).nativeElement;
      }));

      it('should be undefined', fakeAsync(() => {
        trigger.click();
        fixture.detectChanges();
        flush();

        const option = overlayContainerElement.querySelector(
          'dt-option',
        ) as HTMLElement;
        option.click();
        fixture.detectChanges();
        flush();

        const customTrigger = fixture.debugElement.query(
          By.directive(DtSelectValueTemplate),
        );

        expect(customTrigger).toBeNull();
      }));

      it('should be defined', fakeAsync(() => {
        trigger.click();
        fixture.detectChanges();
        flush();

        fixture.componentInstance._customTemplate = true;

        const option = overlayContainerElement.querySelector(
          'dt-option',
        ) as HTMLElement;
        option.click();
        fixture.detectChanges();
        flush();

        const customTrigger = fixture.debugElement.query(
          By.directive(DtSelectValueTemplate),
        );

        expect(customTrigger).toBeDefined();
      }));
    });

    describe('overlay panel', () => {
      let fixture: ComponentFixture<BasicSelect>;
      let trigger: HTMLElement;

      beforeEach(fakeAsync(() => {
        fixture = createComponent(BasicSelect);
        trigger = fixture.debugElement.query(
          By.css('.dt-select-trigger'),
        ).nativeElement;
      }));

      it('should not throw when attempting to open too early', fakeAsync(() => {
        // Create component and then immediately open without running change detection
        expect(() => {
          fixture.componentInstance.select.open();
        }).not.toThrow();
        flush();
      }));

      it('should open the panel when trigger is clicked', fakeAsync(() => {
        trigger.click();
        fixture.detectChanges();
        flush();

        expect(fixture.componentInstance.select.panelOpen).toBe(true);
        expect(overlayContainerElement.textContent).toContain('Steak');
        expect(overlayContainerElement.textContent).toContain('Pizza');
        expect(overlayContainerElement.textContent).toContain('Tacos');
      }));

      it('should propagate attribute to overlay if `dt-ui-test-id` is provided', fakeAsync(() => {
        trigger.click();
        fixture.detectChanges();
        flush();

        expect(overlayContainerElement.innerHTML).toContain(
          'dt-ui-test-id="select-overlay"',
        );
      }));

      it('should close the panel when an item is clicked', fakeAsync(() => {
        trigger.click();
        fixture.detectChanges();
        flush();

        const option = overlayContainerElement.querySelector(
          'dt-option',
        ) as HTMLElement;
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

        const backdrop = overlayContainerElement.querySelector(
          '.cdk-overlay-backdrop',
        ) as HTMLElement;

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
        jest.spyOn(select, 'focus');

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

        const panel = overlayContainerElement.querySelector(
          '.dt-select-panel',
        ) as HTMLElement;
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

        expect(
          fixture.componentInstance.select._keyManager.activeItemIndex,
        ).toBe(0);
        expect(event.defaultPrevented).toBe(true);
        flush();
      }));

      it('should focus the last option when pressing END', fakeAsync(() => {
        fixture.componentInstance.control.setValue('pizza-1');
        fixture.detectChanges();

        trigger.click();
        fixture.detectChanges();
        flush();

        const event = dispatchKeyboardEvent(trigger, 'keydown', END);
        fixture.detectChanges();

        expect(
          fixture.componentInstance.select._keyManager.activeItemIndex,
        ).toBe(7);
        expect(event.defaultPrevented).toBe(true);
        flush();
      }));

      it('should be able to set extra classes on the panel', fakeAsync(() => {
        trigger.click();
        fixture.detectChanges();

        const panel = overlayContainerElement.querySelector(
          '.dt-select-panel',
        ) as HTMLElement;

        expect(panel.classList).toContain('custom-one');
        expect(panel.classList).toContain('custom-two');
      }));

      it('should prevent the default action when pressing SPACE on an option', fakeAsync(() => {
        trigger.click();
        fixture.detectChanges();

        const option = overlayContainerElement.querySelector(
          'dt-option',
        ) as HTMLElement;
        const event = dispatchKeyboardEvent(option, 'keydown', SPACE);

        expect(event.defaultPrevented).toBe(true);
        flush();
      }));

      it('should prevent the default action when pressing ENTER on an option', fakeAsync(() => {
        trigger.click();
        fixture.detectChanges();

        const option = overlayContainerElement.querySelector(
          'dt-option',
        ) as HTMLElement;
        const event = dispatchKeyboardEvent(option, 'keydown', ENTER);

        expect(event.defaultPrevented).toBe(true);
        flush();
      }));

      it('should be able to render options inside groups with an ng-container', fakeAsync(() => {
        fixture.destroy();

        const groupFixture = TestBed.createComponent(
          SelectWithGroupsAndNgContainer,
        );
        groupFixture.detectChanges();
        trigger = groupFixture.debugElement.query(
          By.css('.dt-select-trigger'),
        ).nativeElement;
        trigger.click();
        groupFixture.detectChanges();

        expect(
          document.querySelectorAll('.cdk-overlay-container dt-option').length,
        ).toBeGreaterThan(0);
      }));

      it('should not consider itself as blurred if the trigger loses focus while the panel is still open', fakeAsync(() => {
        const selectElement = fixture.nativeElement.querySelector('.dt-select');
        const selectInstance = fixture.componentInstance.select;

        dispatchFakeEvent(selectElement, 'focus');
        fixture.detectChanges();

        expect(selectInstance.focused).toBe(true);

        selectInstance.open();
        fixture.detectChanges();
        flush();
        dispatchFakeEvent(selectElement, 'blur');
        fixture.detectChanges();

        expect(selectInstance.focused).toBe(true);
      }));
    });

    describe('selection logic', () => {
      let fixture: ComponentFixture<BasicSelect>;
      let trigger: HTMLElement;

      beforeEach(fakeAsync(() => {
        fixture = createComponent(BasicSelect);
        trigger = fixture.debugElement.query(
          By.css('.dt-select-trigger'),
        ).nativeElement;
      }));

      it('should focus the first option if no option is selected', fakeAsync(() => {
        trigger.click();
        fixture.detectChanges();
        flush();

        expect(
          fixture.componentInstance.select._keyManager.activeItemIndex,
        ).toEqual(0);
      }));

      it('should select an option when it is clicked', fakeAsync(() => {
        trigger.click();
        fixture.detectChanges();
        flush();

        let option = overlayContainerElement.querySelector(
          'dt-option',
        ) as HTMLElement;
        option.click();
        fixture.detectChanges();
        flush();

        trigger.click();
        fixture.detectChanges();
        flush();

        option = overlayContainerElement.querySelector(
          'dt-option',
        ) as HTMLElement;

        expect(option.classList).toContain('dt-option-selected');
        expect(fixture.componentInstance.options.first.selected).toBe(true);
        expect(fixture.componentInstance.select.selected).toBe(
          fixture.componentInstance.options.first,
        );
      }));

      it('should be able to select an option using the DtOption API', fakeAsync(() => {
        trigger.click();
        fixture.detectChanges();
        flush();

        const optionInstances = fixture.componentInstance.options.toArray();
        const optionNodes: NodeListOf<HTMLElement> =
          overlayContainerElement.querySelectorAll('dt-option');

        optionInstances[1].select();
        fixture.detectChanges();

        expect(optionNodes[1].classList).toContain('dt-option-selected');
        expect(optionInstances[1].selected).toBe(true);
        expect(fixture.componentInstance.select.selected).toBe(
          optionInstances[1],
        );
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

        expect(options[0].classList).not.toContain('dt-option-selected');
        expect(options[1].classList).toContain('dt-option-selected');

        const optionInstances = fixture.componentInstance.options.toArray();

        expect(optionInstances[0].selected).toBe(false);
        expect(optionInstances[1].selected).toBe(true);
      }));

      it('should remove selection if option has been removed', fakeAsync(() => {
        const select = fixture.componentInstance.select;

        trigger.click();
        fixture.detectChanges();
        flush();

        const firstOption = overlayContainerElement.querySelectorAll(
          'dt-option',
        )[0] as HTMLElement;

        firstOption.click();
        fixture.detectChanges();

        expect(select.selected).toBe(select.options.first);

        fixture.componentInstance.foods = [];
        fixture.detectChanges();
        flush();

        expect(select.selected).toBeUndefined();
      }));

      it('should display the selected option in the trigger', fakeAsync(() => {
        trigger.click();
        fixture.detectChanges();
        flush();

        const option = overlayContainerElement.querySelector(
          'dt-option',
        ) as HTMLElement;
        option.click();
        fixture.detectChanges();
        flush();

        const value = fixture.debugElement.query(
          By.css('.dt-select-value'),
        ).nativeElement;

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
        expect(
          fixture.componentInstance.select._keyManager.activeItemIndex,
        ).toEqual(1);
      }));

      it('should select an option that was added after initialization', fakeAsync(() => {
        fixture.componentInstance.foods.push({
          viewValue: 'Potatoes',
          value: 'potatoes-8',
        });
        trigger.click();
        fixture.detectChanges();
        flush();

        const options = overlayContainerElement.querySelectorAll('dt-option');
        (options[8] as HTMLElement).click();
        fixture.detectChanges();
        flush();

        expect(trigger.textContent).toContain('Potatoes');
        expect(fixture.componentInstance.select.selected).toBe(
          fixture.componentInstance.options.last,
        );
      }));

      it('should update the trigger when the selected option label is changed', fakeAsync(() => {
        fixture.componentInstance.control.setValue('pizza-1');
        fixture.detectChanges();

        expect(trigger.textContent!.trim()).toBe('Pizza');

        fixture.componentInstance.foods[1].viewValue = 'Calzone';
        fixture.detectChanges();

        expect(trigger.textContent!.trim()).toBe('Calzone');
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
        groupFixture.debugElement
          .query(By.css('.dt-select-trigger'))
          .nativeElement.click();
        groupFixture.detectChanges();

        const disabledGroup =
          overlayContainerElement.querySelectorAll('dt-optgroup')[1];
        const options = disabledGroup.querySelectorAll('dt-option');

        (options[0] as HTMLElement).click();
        groupFixture.detectChanges();

        expect(groupFixture.componentInstance.select.panelOpen).toBe(true);
        expect(options[0].classList).not.toContain('dt-option-selected');
        expect(groupFixture.componentInstance.select.selected).toBeUndefined();
      }));

      it('should not throw if triggerValue accessed with no selected value', fakeAsync(() => {
        expect(
          () => fixture.componentInstance.select.triggerValue,
        ).not.toThrow();
      }));

      it('should emit to `optionSelectionChanges` when an option is selected', fakeAsync(() => {
        trigger.click();
        fixture.detectChanges();
        flush();

        const spy = jest.fn();
        const subscription =
          fixture.componentInstance.select.optionSelectionChanges.subscribe(
            spy,
          );
        const option = overlayContainerElement.querySelector(
          'dt-option',
        ) as HTMLElement;
        option.click();
        fixture.detectChanges();
        flush();

        expect(spy).toHaveBeenCalledWith(expect.any(DtOptionSelectionChange));

        subscription.unsubscribe();
      }));

      // TODO @thomas.pink: Check why this is failing with Angular 8
      // it('should handle accessing `optionSelectionChanges` before the options are initialized', fakeAsync(() => {
      //   fixture.destroy();
      //   fixture = TestBed.createComponent(BasicSelect);

      //   const spy = jasmine.createSpy('option selection spy');
      //   let subscription: Subscription;

      //   expect(fixture.componentInstance.select.options).toBeFalsy();
      //   expect(() => {
      //     subscription = fixture.componentInstance.select.optionSelectionChanges.subscribe(spy);
      //   }).not.toThrow();

      //   fixture.detectChanges();
      //   trigger = fixture.debugElement.query(By.css('.dt-select-trigger')).nativeElement;

      //   trigger.click();
      //   fixture.detectChanges();
      //   flush();

      //   const option = overlayContainerElement.querySelector('dt-option') as HTMLElement;
      //   option.click();
      //   fixture.detectChanges();
      //   flush();

      //   expect(spy).toHaveBeenCalledWith(jasmine.any(DtOptionSelectionChange));

      // eslint-disable-next-line
      //   subscription!.unsubscribe();
      // }));
    });

    describe('valueChange events', () => {
      it('should emit `valueChange` when an option was selected', fakeAsync(() => {
        const fixture = createComponent(BasicSelect);
        const trigger = fixture.debugElement.query(
          By.css('.dt-select-trigger'),
        ).nativeElement;

        trigger.click();
        fixture.detectChanges();
        flush();

        const spy = jest.fn();
        const subscription =
          fixture.componentInstance.select.valueChange.subscribe(spy);

        const option = overlayContainerElement.querySelector(
          'dt-option',
        ) as HTMLElement;
        option.click();
        fixture.detectChanges();
        flush();

        expect(spy).toHaveBeenCalledTimes(1);

        subscription.unsubscribe();
      }));

      it('should emit `valueChange` when an option was selected', fakeAsync(() => {
        const fixture = createComponent(SelectWithOptionValueZero);
        const trigger = fixture.debugElement.query(
          By.css('.dt-select-trigger'),
        ).nativeElement;

        trigger.click();
        fixture.detectChanges();
        flush();

        const spy = jest.fn();
        const subscription =
          fixture.componentInstance.select.valueChange.subscribe(spy);

        const option = overlayContainerElement.querySelector(
          'dt-option',
        ) as HTMLElement;
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
        fixture = createComponent(BasicSelect);
        trigger = fixture.debugElement.query(
          By.css('.dt-select-trigger'),
        ).nativeElement;
      }));

      it('should take an initial view value with reactive forms', fakeAsync(() => {
        fixture.componentInstance.control = new FormControl('pizza-1');
        fixture.detectChanges();

        const value = fixture.debugElement.query(By.css('.dt-select-value'));
        expect(value.nativeElement.textContent).toContain('Pizza');

        trigger = fixture.debugElement.query(
          By.css('.dt-select-trigger'),
        ).nativeElement;
        trigger.click();
        fixture.detectChanges();
        flush();

        const options = overlayContainerElement.querySelectorAll('dt-option');
        expect(options[1].classList).toContain('dt-option-selected');
      }));

      it('should set the view value from the form', fakeAsync(() => {
        let value = fixture.debugElement.query(By.css('.dt-select-value'));
        expect(value.nativeElement.textContent.trim()).toBe('Food');

        fixture.componentInstance.control.setValue('pizza-1');
        fixture.detectChanges();

        value = fixture.debugElement.query(By.css('.dt-select-value'));
        expect(value.nativeElement.textContent).toContain('Pizza');

        trigger.click();
        fixture.detectChanges();
        flush();

        const options = overlayContainerElement.querySelectorAll('dt-option');
        expect(options[1].classList).toContain('dt-option-selected');
      }));

      it('should update the form value when the view changes', fakeAsync(() => {
        expect(fixture.componentInstance.control.value).toEqual(null);

        trigger.click();
        fixture.detectChanges();
        flush();

        const option = overlayContainerElement.querySelector(
          'dt-option',
        ) as HTMLElement;
        option.click();
        fixture.detectChanges();
        flush();

        expect(fixture.componentInstance.control.value).toEqual('steak-0');
      }));

      it('should clear the selection when a nonexistent option value is selected', fakeAsync(() => {
        fixture.componentInstance.control.setValue('pizza-1');
        fixture.detectChanges();

        fixture.componentInstance.control.setValue('gibberish');
        fixture.detectChanges();

        const value = fixture.debugElement.query(By.css('.dt-select-value'));
        expect(value.nativeElement.textContent.trim()).toBe('Food');
        expect(trigger.textContent).not.toContain('Pizza');

        trigger.click();
        fixture.detectChanges();
        flush();

        const options = overlayContainerElement.querySelectorAll('dt-option');
        expect(options[1].classList).not.toContain('dt-option-selected');
      }));

      it('should clear the selection when the control is reset', fakeAsync(() => {
        fixture.componentInstance.control.setValue('pizza-1');
        fixture.detectChanges();

        fixture.componentInstance.control.reset();
        fixture.detectChanges();

        const value = fixture.debugElement.query(By.css('.dt-select-value'));
        expect(value.nativeElement.textContent.trim()).toBe('Food');
        expect(trigger.textContent).not.toContain('Pizza');

        trigger.click();
        fixture.detectChanges();
        flush();

        const options = overlayContainerElement.querySelectorAll('dt-option');
        expect(options[1].classList).not.toContain('dt-option-selected');
      }));

      it('should set the control to touched when the select is blurred', fakeAsync(() => {
        expect(fixture.componentInstance.control.touched).toEqual(false);

        trigger.click();
        dispatchFakeEvent(trigger, 'blur');
        fixture.detectChanges();
        flush();

        expect(fixture.componentInstance.control.touched).toEqual(false);

        const backdrop = overlayContainerElement.querySelector(
          '.cdk-overlay-backdrop',
        ) as HTMLElement;
        backdrop.click();
        dispatchFakeEvent(trigger, 'blur');
        fixture.detectChanges();
        flush();

        expect(fixture.componentInstance.control.touched).toEqual(true);
      }));

      it('should set the control to touched when the panel is closed', fakeAsync(() => {
        expect(fixture.componentInstance.control.touched).toBe(false);

        trigger.click();
        dispatchFakeEvent(trigger, 'blur');
        fixture.detectChanges();
        flush();

        expect(fixture.componentInstance.control.touched).toBe(false);

        fixture.componentInstance.select.close();
        fixture.detectChanges();
        flush();

        expect(fixture.componentInstance.control.touched).toBe(true);
      }));

      it('should not set touched when a disabled select is touched', fakeAsync(() => {
        expect(fixture.componentInstance.control.touched).toBe(false);

        fixture.componentInstance.control.disable();
        dispatchFakeEvent(trigger, 'blur');

        expect(fixture.componentInstance.control.touched).toBe(false);
      }));

      it('should set the control to dirty when the select value changes in DOM', fakeAsync(() => {
        expect(fixture.componentInstance.control.dirty).toEqual(false);

        trigger.click();
        fixture.detectChanges();
        flush();

        const option = overlayContainerElement.querySelector(
          'dt-option',
        ) as HTMLElement;
        option.click();
        fixture.detectChanges();
        flush();

        expect(fixture.componentInstance.control.dirty).toEqual(true);
      }));

      it('should not set the control to dirty when the value changes programmatically', fakeAsync(() => {
        expect(fixture.componentInstance.control.dirty).toEqual(false);

        fixture.componentInstance.control.setValue('pizza-1');

        expect(fixture.componentInstance.control.dirty).toEqual(false);
      }));
    });

    describe('disabled behavior', () => {
      it('should disable itself when control is disabled programmatically', fakeAsync(() => {
        const fixture = createComponent(BasicSelect);

        fixture.componentInstance.control.disable();
        const trigger = fixture.debugElement.query(
          By.css('.dt-select-trigger'),
        ).nativeElement;
        trigger.click();
        fixture.detectChanges();

        expect(overlayContainerElement.textContent).toEqual('');
        expect(fixture.componentInstance.select.panelOpen).toBe(false);

        fixture.componentInstance.control.enable();
        trigger.click();
        fixture.detectChanges();

        expect(overlayContainerElement.textContent).toContain('Steak');
        expect(fixture.componentInstance.select.panelOpen).toBe(true);
      }));
    });
  });

  describe('when initialized without options', () => {
    beforeEach(
      waitForAsync(() => {
        configureDtSelectTestingModule([SelectInitWithoutOptions]);
      }),
    );

    it('should select the proper option when option list is initialized later', fakeAsync(() => {
      const fixture = createComponent(SelectInitWithoutOptions);
      const instance = fixture.componentInstance;

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
    beforeEach(fakeAsync(() => {
      configureDtSelectTestingModule([SelectWithChangeEvent]);
    }));

    let fixture: ComponentFixture<SelectWithChangeEvent>;
    let trigger: HTMLElement;

    beforeEach(fakeAsync(() => {
      fixture = createComponent(SelectWithChangeEvent);

      trigger = fixture.debugElement.query(
        By.css('.dt-select-trigger'),
      ).nativeElement;
    }));

    it('should emit an event when the selected option has changed', fakeAsync(() => {
      trigger.click();
      fixture.detectChanges();

      // eslint-disable-next-line @typescript-eslint/no-unnecessary-type-assertion
      (
        overlayContainerElement.querySelector('dt-option') as HTMLElement
      ).click();

      expect(fixture.componentInstance.changeListener).toHaveBeenCalled();
    }));

    it('should not emit multiple change events for the same option', fakeAsync(() => {
      trigger.click();
      fixture.detectChanges();

      const option = overlayContainerElement.querySelector(
        'dt-option',
      ) as HTMLElement;

      option.click();
      option.click();

      expect(fixture.componentInstance.changeListener).toHaveBeenCalledTimes(1);
    }));

    it('should only emit one event when pressing arrow keys on closed select', fakeAsync(() => {
      const select = fixture.debugElement.query(
        By.css('dt-select'),
      ).nativeElement;
      dispatchKeyboardEvent(select, 'keydown', DOWN_ARROW);

      expect(fixture.componentInstance.changeListener).toHaveBeenCalledTimes(1);
      flush();
    }));
  });

  describe('with ngModel', () => {
    beforeEach(
      waitForAsync(() => {
        configureDtSelectTestingModule([NgModelSelect]);
      }),
    );

    it('should disable itself when control is disabled using the property', fakeAsync(() => {
      const fixture = createComponent(NgModelSelect);

      fixture.componentInstance.isDisabled = true;
      fixture.detectChanges();
      flush();

      const trigger = fixture.debugElement.query(
        By.css('.dt-select-trigger'),
      ).nativeElement;

      trigger.click();
      fixture.detectChanges();

      expect(overlayContainerElement.textContent).toEqual('');
      expect(fixture.componentInstance.select.panelOpen).toBe(false);

      fixture.componentInstance.isDisabled = false;
      fixture.detectChanges();
      flush();

      trigger.click();
      fixture.detectChanges();

      expect(overlayContainerElement.textContent).toContain('Steak');
      expect(fixture.componentInstance.select.panelOpen).toBe(true);
    }));
  });

  describe('with tabindex', () => {
    beforeEach(
      waitForAsync(() => {
        configureDtSelectTestingModule([SelectWithPlainTabindex]);
      }),
    );

    it('should be able to set the tabindex via the native attribute', fakeAsync(() => {
      const fixture = createComponent(SelectWithPlainTabindex);

      const select = fixture.debugElement.query(
        By.css('dt-select'),
      ).nativeElement;
      expect(select.getAttribute('tabindex')).toBe('5');
    }));
  });

  describe('change events', () => {
    beforeEach(
      waitForAsync(() => {
        configureDtSelectTestingModule([SelectWithPlainTabindex]);
      }),
    );

    it('should complete the stateChanges stream on destroy', () => {
      const fixture = createComponent(SelectWithPlainTabindex);

      const debugElement = fixture.debugElement.query(By.directive(DtSelect));
      const select = debugElement.componentInstance;

      const spy = jest.fn();
      const subscription = select.stateChanges.subscribe(
        undefined,
        undefined,
        spy,
      );

      fixture.destroy();
      expect(spy).toHaveBeenCalled();
      subscription.unsubscribe();
    });
  });

  describe('with no placeholder', () => {
    beforeEach(
      waitForAsync(() => {
        configureDtSelectTestingModule([BasicSelectNoPlaceholder]);
      }),
    );

    // eslint-disable-next-line
    it.skip('should set the width of the overlay if there is no placeholder', fakeAsync(() => {
      const fixture = createComponent(BasicSelectNoPlaceholder);

      const trigger = fixture.debugElement.query(
        By.css('.dt-select-trigger'),
      ).nativeElement;

      trigger.click();
      fixture.detectChanges();
      flush();

      const pane = overlayContainerElement.querySelector(
        '.cdk-overlay-pane',
      ) as HTMLElement;

      // TODO: [e2e] style.minWidth calculation can not be performed in jsdom
      expect(parseInt(pane.style.minWidth!, 10)).toBeGreaterThan(0);
    }));
  });

  describe('when invalid inside a form', () => {
    beforeEach(
      waitForAsync(() => {
        configureDtSelectTestingModule([InvalidSelectInForm]);
      }),
    );

    it('should not throw SelectionModel errors in addition to ngModel errors', fakeAsync(() => {
      const fixture = TestBed.createComponent(InvalidSelectInForm);

      // The first change detection run will throw the "ngModel is missing a name" error.
      expect(() => {
        fixture.detectChanges();
      }).toThrowError(/the name attribute must be set/g);

      // The second run shouldn't throw selection-model related errors.
      expect(() => {
        fixture.detectChanges();
      }).not.toThrow();
    }));
  });

  describe('with ngModel using compareWith', () => {
    beforeEach(
      waitForAsync(() => {
        configureDtSelectTestingModule([NgModelCompareWithSelect]);
      }),
    );

    let fixture: ComponentFixture<NgModelCompareWithSelect>;
    let instance: NgModelCompareWithSelect;

    beforeEach(fakeAsync(() => {
      fixture = createComponent(NgModelCompareWithSelect);
      instance = fixture.componentInstance;
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
        jest.spyOn(instance, 'compareByReference');
        instance.useCompareByReference();
        fixture.detectChanges();
      }));

      it('should use the comparator', fakeAsync(() => {
        // eslint-disable-next-line @typescript-eslint/unbound-method
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
    });
  });

  describe(`when the select's value is accessed on initialization`, () => {
    beforeEach(
      waitForAsync(() => {
        configureDtSelectTestingModule([SelectEarlyAccessSibling]);
      }),
    );

    it('should not throw when trying to access the selected value on init', fakeAsync(() => {
      expect(() => {
        TestBed.createComponent(SelectEarlyAccessSibling).detectChanges();
      }).not.toThrow();
    }));
  });

  describe('inside of a form group', () => {
    beforeEach(
      waitForAsync(() => {
        configureDtSelectTestingModule([SelectInsideFormGroup]);
      }),
    );

    let fixture: ComponentFixture<SelectInsideFormGroup>;
    let testComponent: SelectInsideFormGroup;
    let select: HTMLElement;

    beforeEach(fakeAsync(() => {
      fixture = createComponent(SelectInsideFormGroup);
      testComponent = fixture.componentInstance;
      select = fixture.debugElement.query(By.css('dt-select')).nativeElement;
    }));

    it('should not set the invalid class on a clean select', fakeAsync(() => {
      expect(testComponent.formGroup.untouched).toBe(true);
      expect(testComponent.formControl.invalid).toBe(true);
      expect(select.classList).not.toContain('dt-select-invalid');
      expect(select.getAttribute('aria-invalid')).toBe('false');
    }));

    it('should appear as invalid if it becomes touched', fakeAsync(() => {
      expect(select.classList).not.toContain('dt-select-invalid');
      expect(select.getAttribute('aria-invalid')).toBe('false');

      testComponent.formControl.markAsDirty();
      fixture.detectChanges();

      expect(select.classList).toContain('dt-select-invalid');
      expect(select.getAttribute('aria-invalid')).toBe('true');
    }));

    it('should not have the invalid class when the select becomes valid', fakeAsync(() => {
      testComponent.formControl.markAsDirty();
      fixture.detectChanges();

      expect(select.classList).toContain('dt-select-invalid');
      expect(select.getAttribute('aria-invalid')).toBe('true');

      testComponent.formControl.setValue('pizza-1');
      fixture.detectChanges();

      expect(select.classList).not.toContain('dt-select-invalid');
      expect(select.getAttribute('aria-invalid')).toBe('false');
    }));

    it('should appear as invalid when the parent form group is submitted', fakeAsync(() => {
      expect(select.classList).not.toContain('dt-select-invalid');
      expect(select.getAttribute('aria-invalid')).toBe('false');

      dispatchFakeEvent(
        fixture.debugElement.query(By.css('form')).nativeElement,
        'submit',
      );
      fixture.detectChanges();

      expect(select.classList).toContain('dt-select-invalid');
      expect(select.getAttribute('aria-invalid')).toBe('true');
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

    it('should override error matching behavior via injection token', fakeAsync(() => {
      const errorStateMatcher: ErrorStateMatcher = {
        isErrorState: jest.fn(() => true),
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
        providers: [
          { provide: ErrorStateMatcher, useValue: errorStateMatcher },
        ],
      });

      const errorFixture = TestBed.createComponent(SelectInsideFormGroup);
      const component = errorFixture.componentInstance;

      errorFixture.detectChanges();

      expect(component.select.errorState).toBe(true);
      expect(errorStateMatcher.isErrorState).toHaveBeenCalled();
    }));
  });

  describe('with custom error behavior', () => {
    beforeEach(
      waitForAsync(() => {
        configureDtSelectTestingModule([CustomErrorBehaviorSelect]);
      }),
    );

    it('should be able to override the error matching behavior via an @Input', fakeAsync(() => {
      const fixture = createComponent(CustomErrorBehaviorSelect);
      const component = fixture.componentInstance;
      const matcher = jest.fn(() => true);

      expect(component.control.invalid).toBe(false);
      expect(component.select.errorState).toBe(false);

      fixture.componentInstance.errorStateMatcher = { isErrorState: matcher };
      fixture.detectChanges();

      expect(component.select.errorState).toBe(true);
      expect(matcher).toHaveBeenCalled();
    }));
  });

  describe('with preselected array values', () => {
    beforeEach(
      waitForAsync(() => {
        configureDtSelectTestingModule([
          SingleSelectWithPreselectedArrayValues,
        ]);
      }),
    );

    it('should be able to preselect an array value in single-selection mode', fakeAsync(() => {
      const fixture = createComponent(SingleSelectWithPreselectedArrayValues);
      flush();
      fixture.detectChanges();

      const trigger = fixture.debugElement.query(
        By.css('.dt-select-trigger'),
      ).nativeElement;

      expect(trigger.textContent).toContain('Pizza');
      expect(fixture.componentInstance.options.toArray()[1].selected).toBe(
        true,
      );
    }));
  });

  describe('with OnPush', () => {
    beforeEach(
      waitForAsync(() => {
        configureDtSelectTestingModule([
          BasicSelectOnPush,
          BasicSelectOnPushPreselected,
        ]);
      }),
    );

    it('should set the trigger text based on the value when initialized', fakeAsync(() => {
      const fixture = createComponent(BasicSelectOnPushPreselected);

      flush();

      const trigger = fixture.debugElement.query(
        By.css('.dt-select-trigger'),
      ).nativeElement;

      fixture.detectChanges();

      expect(trigger.textContent).toContain('Pizza');
    }));

    it('should update the trigger based on the value', fakeAsync(() => {
      const fixture = createComponent(BasicSelectOnPush);
      const trigger = fixture.debugElement.query(
        By.css('.dt-select-trigger'),
      ).nativeElement;

      fixture.componentInstance.control.setValue('pizza-1');
      fixture.detectChanges();

      expect(trigger.textContent).toContain('Pizza');

      fixture.componentInstance.control.reset();
      fixture.detectChanges();

      expect(trigger.textContent).not.toContain('Pizza');
    }));
  });

  describe('when reseting the value by setting null or undefined', () => {
    beforeEach(
      waitForAsync(() => {
        configureDtSelectTestingModule([ResetValuesSelect]);
      }),
    );

    let fixture: ComponentFixture<ResetValuesSelect>;
    let trigger: HTMLElement;
    let options: NodeListOf<HTMLElement>;

    beforeEach(fakeAsync(() => {
      fixture = createComponent(ResetValuesSelect);
      trigger = fixture.debugElement.query(
        By.css('.dt-select-trigger'),
      ).nativeElement;

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
      <dt-select
        placeholder="Food"
        [formControl]="control"
        [required]="isRequired"
        [tabIndex]="tabIndexOverride"
        [aria-label]="ariaLabel"
        [aria-labelledby]="ariaLabelledby"
        [panelClass]="panelClass"
        dt-ui-test-id="select"
      >
        <dt-option
          *ngFor="let food of foods"
          [value]="food.value"
          [disabled]="food.disabled"
        >
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

  @ViewChild(DtSelect) select: DtSelect<any>;
  @ViewChildren(DtOption) options: QueryList<DtOption<any>>;
}

@Component({
  selector: 'select-with-groups',
  template: `
    <dt-form-field>
      <dt-select placeholder="Pokemon" [formControl]="control">
        <dt-optgroup
          *ngFor="let group of pokemonTypes"
          [label]="group.name"
          [disabled]="group.disabled"
        >
          <dt-option
            *ngFor="let pokemon of group.pokemon"
            [value]="pokemon.value"
          >
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

  @ViewChild(DtSelect) select: DtSelect<any>;
  @ViewChildren(DtOption) options: QueryList<DtOption<any>>;
}

@Component({
  selector: 'select-with-groups',
  template: `
    <dt-form-field>
      <dt-select placeholder="Pokemon" [formControl]="control">
        <dt-optgroup *ngFor="let group of pokemonTypes" [label]="group.name">
          <ng-container *ngFor="let pokemon of group.pokemon">
            <dt-option [value]="pokemon.value">
              {{ pokemon.viewValue }}
            </dt-option>
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
      <dt-select
        placeholder="Food I want to eat right now"
        [formControl]="control"
      >
        <dt-option *ngFor="let food of foods" [value]="food.value">
          {{ food.viewValue }}
        </dt-option>
      </dt-select>
    </dt-form-field>
  `,
})
class SelectInitWithoutOptions {
  foods: any[];
  control = new FormControl('pizza-1');

  @ViewChild(DtSelect) select: DtSelect<any>;
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
        <dt-option *ngFor="let food of foods" [value]="food">
          {{ food }}
        </dt-option>
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

  changeListener = jest.fn();
}

@Component({
  selector: 'ng-model-select',
  template: `
    <dt-form-field>
      <dt-select placeholder="Food" ngModel [disabled]="isDisabled">
        <dt-option *ngFor="let food of foods" [value]="food.value">
          {{ food.viewValue }}
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

  @ViewChild(DtSelect) select: DtSelect<any>;
  @ViewChildren(DtOption) options: QueryList<DtOption<any>>;
}

@Component({
  selector: 'select-with-plain-tabindex',
  template: `
    <dt-form-field><dt-select tabindex="5"></dt-select></dt-form-field>
  `,
})
class SelectWithPlainTabindex {}

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
class BasicSelectNoPlaceholder {}

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
      <dt-select
        [ngModel]="selectedFood"
        (ngModelChange)="setFoodByCopy($event)"
        [compareWith]="comparator"
      >
        <dt-option *ngFor="let food of foods" [value]="food">
          {{ food.viewValue }}
        </dt-option>
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
  // eslint-disable-next-line @typescript-eslint/unbound-method
  comparator: ((f1: any, f2: any) => boolean) | null = this.compareByValue;

  @ViewChild(DtSelect) select: DtSelect<any>;
  @ViewChildren(DtOption) options: QueryList<DtOption<any>>;

  useCompareByValue(): void {
    this.comparator = this.compareByValue;
  }

  useCompareByReference(): void {
    this.comparator = this.compareByReference;
  }

  useNullComparator(): void {
    this.comparator = null;
  }

  compareByValue(f1: any, f2: any): boolean {
    return f1 && f2 && f1.value === f2.value;
  }

  compareByReference(f1: any, f2: any): boolean {
    return f1 === f2;
  }

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
class SelectEarlyAccessSibling {}

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
  @ViewChild(FormGroupDirective)
  formGroupDirective: FormGroupDirective;
  @ViewChild(DtSelect) select: DtSelect<any>;
  // eslint-disable-next-line @typescript-eslint/unbound-method
  formControl = new FormControl('', Validators.required);
  formGroup = new FormGroup({
    food: this.formControl,
  });
}

@Component({
  template: `
    <dt-select
      placeholder="Food"
      [formControl]="control"
      [errorStateMatcher]="errorStateMatcher"
    >
      <dt-option *ngFor="let food of foods" [value]="food.value">
        {{ food.viewValue }}
      </dt-option>
    </dt-select>
  `,
})
class CustomErrorBehaviorSelect {
  @ViewChild(DtSelect) select: DtSelect<any>;
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
        <dt-option *ngFor="let food of foods" [value]="food.value">
          {{ food.viewValue }}
        </dt-option>
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

  @ViewChild(DtSelect) select: DtSelect<any>;
  @ViewChildren(DtOption) options: QueryList<DtOption<any>>;
}

@Component({
  selector: 'basic-select-on-push',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <dt-form-field>
      <dt-select placeholder="Food" [formControl]="control">
        <dt-option *ngFor="let food of foods" [value]="food.value">
          {{ food.viewValue }}
        </dt-option>
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
        <dt-option *ngFor="let food of foods" [value]="food.value">
          {{ food.viewValue }}
        </dt-option>
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

  @ViewChild(DtSelect) select: DtSelect<any>;
}

@Component({
  template: `
    <dt-select>
      <dt-option [value]="0">Zero</dt-option>
    </dt-select>
  `,
})
class SelectWithOptionValueZero {
  @ViewChild(DtSelect) select: DtSelect<any>;
}

@Component({
  template: `
    <dt-form-field>
      <dt-select placeholder="Service" [formControl]="control">
        <dt-select-value-template *ngIf="_customTemplate">
          <dt-icon [name]="control.value?.value"></dt-icon>
        </dt-select-value-template>
        <dt-option *ngFor="let service of services" [value]="service">
          {{ service.viewValue }}
        </dt-option>
        <dt-option>None</dt-option>
      </dt-select>
    </dt-form-field>
  `,
})
class SelectWithCustomTrigger {
  services: any[] = [
    { value: 'cloud-spanner', viewValue: 'Cloud Spanner' },
    { value: 'cloud-sql', viewValue: 'Cloud SQL' },
    { value: 'cloud-storage', viewValue: 'Cloud Storage' },
  ];
  control = new FormControl();
  _customTemplate = false;

  @ViewChild(DtSelect) select: DtSelect<any>;
}
