import { OverlayContainer } from '@angular/cdk/overlay';
import { Provider, Type, ViewChild, ViewChildren, QueryList, Component, OnDestroy, NgZone } from '@angular/core';
import { TestBed, inject, ComponentFixture, flush, fakeAsync, async, tick } from '@angular/core/testing';
import { DtAutocompleteModule, DtFormFieldModule, DtInputModule, DtAutocompleteTrigger, DtAutocomplete, DtFormField, DtOption } from '@dynatrace/angular-components';
import { FormsModule, ReactiveFormsModule, FormControl } from '@angular/forms';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { dispatchFakeEvent, dispatchKeyboardEvent } from '../../testing/dispatch-events';
import { MockNgZone } from '../../testing/mock-ng-zone';
import { By } from '@angular/platform-browser';
import { Subscription } from 'rxjs';
import { DOWN_ARROW } from '@angular/cdk/keycodes';
import { typeInElement } from '../../testing/type-in-element';

// tslint:disable:no-any

fdescribe('DtAutocomplete', () => {
  let overlayContainer: OverlayContainer;
  let overlayContainerElement: HTMLElement;
  let zone: MockNgZone;

  // Creates a test component fixture.
  function createComponent<T>(component: Type<T>, providers: Provider[] = []): any {
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
        {provide: NgZone, useFactory: () => zone = new MockNgZone()},
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

  afterEach(inject([OverlayContainer], (currentOverlayContainer: OverlayContainer) => {
    // Since we're resetting the testing module in some of the tests,
    // we can potentially have multiple overlay containers.
    currentOverlayContainer.ngOnDestroy();
    overlayContainer.ngOnDestroy();
  }));

  describe('panel toggling', () => {
    let fixture: ComponentFixture<SimpleAutocomplete>;
    let input: HTMLInputElement;

    beforeEach(() => {
      fixture = createComponent(SimpleAutocomplete);
      fixture.detectChanges();
      input = fixture.debugElement.query(By.css('input')).nativeElement;
    });

    it('should open the panel when the input is focused', () => {
      expect(fixture.componentInstance.trigger.panelOpen).toBe(false, `Expected panel state to start out closed.`);

      dispatchFakeEvent(input, 'focusin');
      fixture.detectChanges();

      expect(fixture.componentInstance.trigger.panelOpen)
        .toBe(true, `Expected panel state to read open when input is focused.`);
      expect(overlayContainerElement.textContent)
        .toContain('Alabama', `Expected panel to display when input is focused.`);
      expect(overlayContainerElement.textContent)
        .toContain('California', `Expected panel to display when input is focused.`);
    });

    it('should not open the panel on focus if the input is readonly', fakeAsync(() => {
      const trigger = fixture.componentInstance.trigger;
      input.readOnly = true;
      fixture.detectChanges();

      expect(trigger.panelOpen).toBe(false, 'Expected panel state to start out closed.');
      dispatchFakeEvent(input, 'focusin');
      flush();

      fixture.detectChanges();
      expect(trigger.panelOpen).toBe(false, 'Expected panel to stay closed.');
    }));

    it('should not open using the arrow keys when the input is readonly', fakeAsync(() => {
      const trigger = fixture.componentInstance.trigger;
      input.readOnly = true;
      fixture.detectChanges();

      expect(trigger.panelOpen).toBe(false, 'Expected panel state to start out closed.');
      dispatchKeyboardEvent(input, 'keydown', DOWN_ARROW);
      flush();

      fixture.detectChanges();
      expect(trigger.panelOpen).toBe(false, 'Expected panel to stay closed.');
    }));

    it('should open the panel programmatically', () => {
      expect(fixture.componentInstance.trigger.panelOpen)
        .toBe(false, `Expected panel state to start out closed.`);

      fixture.componentInstance.trigger.openPanel();
      fixture.detectChanges();

      expect(fixture.componentInstance.trigger.panelOpen)
        .toBe(true, `Expected panel state to read open when opened programmatically.`);
      expect(overlayContainerElement.textContent)
        .toContain('Alabama', `Expected panel to display when opened programmatically.`);
      expect(overlayContainerElement.textContent)
        .toContain('California', `Expected panel to display when opened programmatically.`);
    });

    it('should show the panel when the first open is after the initial zone stabilization', async(() => {
      // Note that we're running outside the Angular zone, in order to be able
      // to test properly without the subscription from `_subscribeToClosingActions`
      // giving us a false positive.
      fixture.ngZone!.runOutsideAngular(() => {
        fixture.componentInstance.trigger.openPanel();

        Promise.resolve().then(() => {
          expect(fixture.componentInstance.panel.showPanel)
            .toBe(true, `Expected panel to be visible.`);
        });
      });
    }));

    it('should close the panel when the user clicks away', fakeAsync(() => {
      dispatchFakeEvent(input, 'focusin');
      fixture.detectChanges();
      zone.simulateZoneExit();
      dispatchFakeEvent(document, 'click');

      expect(fixture.componentInstance.trigger.panelOpen)
        .toBe(false, `Expected clicking outside the panel to set its state to closed.`);
      expect(overlayContainerElement.textContent)
        .toEqual('', `Expected clicking outside the panel to close the panel.`);
    }));

    it('should close the panel when the user taps away on a touch device', fakeAsync(() => {
      dispatchFakeEvent(input, 'focus');
      fixture.detectChanges();
      flush();
      dispatchFakeEvent(document, 'touchend');

      expect(fixture.componentInstance.trigger.panelOpen)
        .toBe(false, `Expected tapping outside the panel to set its state to closed.`);
      expect(overlayContainerElement.textContent)
        .toEqual('', `Expected tapping outside the panel to close the panel.`);
    }));

    it('should close the panel when an option is clicked', fakeAsync(() => {
      dispatchFakeEvent(input, 'focusin');
      fixture.detectChanges();
      zone.simulateZoneExit();

      const option = overlayContainerElement.querySelector('dt-option') as HTMLElement;
      option.click();
      fixture.detectChanges();

      expect(fixture.componentInstance.trigger.panelOpen)
        .toBe(false, `Expected clicking an option to set the panel state to closed.`);
      expect(overlayContainerElement.textContent)
        .toEqual('', `Expected clicking an option to close the panel.`);
    }));

    it('should close the panel when a newly created option is clicked', fakeAsync(() => {
      dispatchFakeEvent(input, 'focusin');
      fixture.detectChanges();
      zone.simulateZoneExit();

      // Filter down the option list to a subset of original options ('Alabama', 'California')
      typeInElement('al', input);
      fixture.detectChanges();
      tick();

      let options = overlayContainerElement.querySelectorAll('dt-option') as NodeListOf<HTMLElement>;
      options[0].click();

      // Changing value from 'Alabama' to 'al' to re-populate the option list,
      // ensuring that 'California' is created new.
      dispatchFakeEvent(input, 'focusin');
      typeInElement('al', input);
      fixture.detectChanges();
      tick();

      options = overlayContainerElement.querySelectorAll('dt-option') as NodeListOf<HTMLElement>;
      options[1].click();
      fixture.detectChanges();

      expect(fixture.componentInstance.trigger.panelOpen)
          .toBe(false, `Expected clicking a new option to set the panel state to closed.`);
      expect(overlayContainerElement.textContent)
          .toEqual('', `Expected clicking a new option to close the panel.`);
    }));

    it('should close the panel programmatically', () => {
      fixture.componentInstance.trigger.openPanel();
      fixture.detectChanges();

      fixture.componentInstance.trigger.closePanel();
      fixture.detectChanges();

      expect(fixture.componentInstance.trigger.panelOpen)
          .toBe(false, `Expected closing programmatically to set the panel state to closed.`);
      expect(overlayContainerElement.textContent)
          .toEqual('', `Expected closing programmatically to close the panel.`);
    });

    it('should not throw when attempting to close the panel of a destroyed autocomplete', () => {
      const trigger = fixture.componentInstance.trigger;

      trigger.openPanel();
      fixture.detectChanges();
      fixture.destroy();

      expect(() => trigger.closePanel()).not.toThrow();
    });

    it('should hide the panel when the options list is empty', fakeAsync(() => {
      dispatchFakeEvent(input, 'focusin');
      fixture.detectChanges();

      const panel = overlayContainerElement.querySelector('.dt-autocomplete-panel') as HTMLElement;

      expect(panel.classList).toContain('dt-autocomplete-visible', `Expected panel to start out visible.`);

      // Filter down the option list such that no options match the value
      typeInElement('af', input);
      fixture.detectChanges();
      tick();
      fixture.detectChanges();

      expect(panel.classList).toContain('dt-autocomplete-hidden', `Expected panel to hide itself when empty.`);
    }));

    it('should not open the panel when the `input` event is invoked on a non-focused input', () => {
      expect(fixture.componentInstance.trigger.panelOpen)
          .toBe(false, `Expected panel state to start out closed.`);

      input.value = 'Alabama';
      dispatchFakeEvent(input, 'input');
      fixture.detectChanges();

      expect(fixture.componentInstance.trigger.panelOpen)
          .toBe(false, `Expected panel state to stay closed.`);
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
        [formControl]="stateCtrl">
    </dt-form-field>
    <dt-autocomplete class="class-one class-two" #auto="dtAutocomplete" [displayWith]="displayFn"
       (opened)="openedSpy()" (closed)="closedSpy()">
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
  openedSpy = jasmine.createSpy('autocomplete opened spy');
  closedSpy = jasmine.createSpy('autocomplete closed spy');

  @ViewChild(DtAutocompleteTrigger) trigger: DtAutocompleteTrigger<any>;
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
      this.filteredStates = val ? this.states.filter((s) => s.name.match(new RegExp(val, 'gi'))) : this.states;
    });
  }

  displayFn(value: any): string {
    return value ? value.name : value;
  }

  ngOnDestroy(): void {
    this.valueSub.unsubscribe();
  }

}

// tslint:enabule:no-any
