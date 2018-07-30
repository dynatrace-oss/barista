
import { async, ComponentFixture, TestBed, inject, fakeAsync } from '@angular/core/testing';
import { Component, ViewChild, QueryList, ViewChildren } from '@angular/core';
import { By } from '@angular/platform-browser';
import { DtSelectModule, DtSelect, DtFormFieldModule, DtOption, DtIconModule } from '@dynatrace/angular-components';
import { FormControl, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { OverlayContainer, ViewportRuler, ScrollDispatcher } from '@angular/cdk/overlay';
import { Subject } from 'rxjs';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { Platform } from '@angular/cdk/platform';
import { HttpClientTestingModule } from '@angular/common/http/testing';

// tslint:disable:no-any i18n

fdescribe('DtSelect', () => {
  let overlayContainer: OverlayContainer;
  let overlayContainerElement: HTMLElement;
  let scrolledSubject = new Subject();
  let viewportRuler: ViewportRuler;
  let platform: Platform;

  /**
   * Configures the test module for MatSelect with the given declarations. This is broken out so
   * that we're only compiling the necessary test components for each test in order to speed up
   * overall test time.
   * @param declarations Components to declare for this block
   */
  function configureMatSelectTestingModule(declarations: any[]): void {
    TestBed.configureTestingModule({
      imports: [
        DtFormFieldModule,
        DtSelectModule,
        ReactiveFormsModule,
        FormsModule,
        NoopAnimationsModule,
        HttpClientTestingModule,
        DtIconModule.forRoot({svgIconLocation: `{{name}}.svg`}),
      ],
      declarations,
      providers: [
        {
          provide: ScrollDispatcher, useFactory: () => ({
            scrolled: () => scrolledSubject.asObservable(),
          }),
        },
      ],
    }).compileComponents();

    inject([OverlayContainer, Platform], (oc: OverlayContainer, p: Platform) => {
      overlayContainer = oc;
      overlayContainerElement = oc.getContainerElement();
      platform = p;
    })();
  }

  afterEach(() => {
    overlayContainer.ngOnDestroy();
  });

  describe('core', () => {
    beforeEach(async(() => {
      configureMatSelectTestingModule([
        BasicSelect,
        SelectWithGroups,
        SelectWithGroupsAndNgContainer,
        SelectWithFormFieldLabel,
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
      });
    });
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

  @ViewChild(DtSelect) select: DtSelect<any>;
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

// tslint:enable:no-any i18n
