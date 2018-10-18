import { OverlayContainer } from '@angular/cdk/overlay';
import { Provider, Type, ViewChild, ViewChildren, QueryList, Component, OnDestroy } from '@angular/core';
import { TestBed, inject, ComponentFixture } from '@angular/core/testing';
import { DtAutocompleteModule, DtFormFieldModule, DtInputModule, DtAutocompleteTrigger, DtAutocomplete, DtFormField, DtOption } from '@dynatrace/angular-components';
import { FormsModule, ReactiveFormsModule, FormControl } from '@angular/forms';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { dispatchFakeEvent } from '../../testing/dispatch-events';
import { By } from '@angular/platform-browser';
import { Subscription } from 'rxjs';

// tslint:disable:no-any

fdescribe('DtAutocomplete', () => {
  let overlayContainer: OverlayContainer;
  let overlayContainerElement: HTMLElement;

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
      providers: [...providers],
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
