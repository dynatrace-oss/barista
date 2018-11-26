import { Component } from '@angular/core';
import { HttpClientModule } from '@angular/common/http';
import { TestBed, async, ComponentFixture } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { DtFilterFieldModule, DtIconModule } from '@dynatrace/angular-components';

fdescribe('DtFilterField', () => {

  function configureDtSelectTestingModule(declarations: any[]): void {
    TestBed.configureTestingModule({
      imports: [
        HttpClientModule,
        DtIconModule.forRoot({ svgIconLocation: `{{name}}.svg` }),
        DtFilterFieldModule,
      ],
      declarations,
    }).compileComponents();
  }

  describe('core', () => {
    let fixture: ComponentFixture<DtFormFieldBasic>;
    let filterField: HTMLElement;

    beforeEach(async(() => {
      configureDtSelectTestingModule([
        DtFormFieldBasic,
      ]);
      fixture = TestBed.createComponent(DtFormFieldBasic);
      filterField = fixture.debugElement.query(By.css('dt-filter-field')).nativeElement;
    }));

    it('should set the filter by label', () => {
      const label: HTMLElement = fixture.debugElement.query(By.css('.dt-filter-field-label')).nativeElement;

      expect(label.textContent).toBe('');

      fixture.componentInstance.label = 'Filter by';
      fixture.detectChanges();

      expect(label.textContent).toBe('Filter by');
    });
  });

  describe('with free text', () => {});

  describe('with autocomplete', () => {
    beforeEach(async(() => {
      configureDtSelectTestingModule([
        DtFormFieldWithAutocomplete,
      ]);
    }));
  });
});

@Component({
  template: `
    <dt-filter-field [label]="label">
    </dt-filter-field>
  `,
})
class DtFormFieldBasic {
  label = '';
}

Component({
  template: `
    <dt-filter-field>
    </dt-filter-field>
  `,
})
class DtFormFieldWithAutocomplete {}
