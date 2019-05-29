import {
  async,
  ComponentFixture,
  TestBed,
  fakeAsync,
  flush,
} from '@angular/core/testing';
import {
  Component,
  ViewChild,
  ViewChildren,
  QueryList,
  DebugElement,
} from '@angular/core';
import { DtSecondaryNavModule } from '@dynatrace/angular-components/secondary-nav';
import { DtIconModule } from '@dynatrace/angular-components/icon';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { By } from '@angular/platform-browser';
import { DtSecondaryNavSection } from './section/secondary-nav-section';
import { RouterTestingModule } from '@angular/router/testing';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';

describe('single section', () => {
  let fixture: ComponentFixture<SingleSection>;
  let trigger: HTMLElement;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [
        DtSecondaryNavModule,
        HttpClientTestingModule,
        NoopAnimationsModule,
        DtIconModule.forRoot({ svgIconLocation: `{{name}}.svg` }),
      ],
      declarations: [SingleSection],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SingleSection);
    fixture.detectChanges();
    trigger = fixture.debugElement.query(
      By.css('.dt-secondary-nav-section-header'),
    ).nativeElement;
  });

  const clickSectionHeader = () => {
    trigger.click();
    fixture.detectChanges();
    flush();
  };

  it('should open the closed panel', fakeAsync(() => {
    clickSectionHeader();

    expect(fixture.componentInstance.section.expanded).toBe(true);
  }));

  it('should close the panel after it is opened', fakeAsync(() => {
    clickSectionHeader();
    clickSectionHeader();

    expect(fixture.componentInstance.section.expanded).toBe(false);
  }));
});

describe('single section active', () => {
  let fixture: ComponentFixture<SingleSectionActive>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [
        DtSecondaryNavModule,
        HttpClientTestingModule,
        NoopAnimationsModule,
        DtIconModule.forRoot({ svgIconLocation: `{{name}}.svg` }),
      ],
      declarations: [SingleSectionActive],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SingleSectionActive);
    fixture.detectChanges();
  });

  it('should open the active section', fakeAsync(() => {
    expect(fixture.componentInstance.section.expanded).toBe(true);
  }));

  it('should activate the open section', fakeAsync(() => {
    expect(fixture.componentInstance.section.active).toBe(true);
  }));
});

describe('single section no expand', () => {
  let fixture: ComponentFixture<SingleSectionNoExpand>;
  let trigger: HTMLElement;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [
        DtSecondaryNavModule,
        HttpClientTestingModule,
        RouterTestingModule,
        NoopAnimationsModule,
        DtIconModule.forRoot({ svgIconLocation: `{{name}}.svg` }),
      ],
      declarations: [SingleSectionNoExpand],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SingleSectionNoExpand);
    fixture.detectChanges();
    trigger = fixture.debugElement.query(
      By.css('.dt-secondary-nav-section-header'),
    ).nativeElement;
  });

  it('should not open the non-expandable panel when clicked', fakeAsync(() => {
    trigger.click();
    fixture.detectChanges();
    flush();

    expect(fixture.componentInstance.section.expanded).toBe(false);
  }));
});

describe('multi section', () => {
  let fixture: ComponentFixture<MultiSection>;
  let debugElements: DebugElement[];

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [
        DtSecondaryNavModule,
        HttpClientTestingModule,
        NoopAnimationsModule,
        DtIconModule.forRoot({ svgIconLocation: `{{name}}.svg` }),
      ],
      declarations: [MultiSection],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MultiSection);
    fixture.detectChanges();
    debugElements = fixture.debugElement.queryAll(
      By.css('.dt-secondary-nav-section-header'),
    );
  });

  it('should open the second section', fakeAsync(() => {
    const desiredSection = 2;
    // Click the second section
    debugElements.forEach((section, index) => {
      if (index === desiredSection - 1) {
        section.nativeElement.click();
        fixture.detectChanges();
        flush();
      }
    });
    // Check that the second section opened
    fixture.componentInstance.sections.forEach(
      (section: DtSecondaryNavSection, index) => {
        if (index === desiredSection - 1) {
          expect(section.expanded).toBe(true);
        }
      },
    );
  }));

  it('should not open the first section', fakeAsync(() => {
    const desiredSection = 2;
    // Click the second section
    debugElements.forEach((section, index) => {
      if (index === desiredSection - 1) {
        section.nativeElement.click();
        fixture.detectChanges();
        flush();
      }
    });
    // Check that the first section is not opened
    fixture.componentInstance.sections.forEach(
      (section: DtSecondaryNavSection, index) => {
        if (index !== desiredSection - 1) {
          expect(section.expanded).toBe(false);
        }
      },
    );
  }));
});

@Component({
  selector: 'single-section',
  template: `
    <dt-secondary-nav>
      <dt-secondary-nav-title>Secondary nav</dt-secondary-nav-title>
      <dt-secondary-nav-section expandable>
        <dt-secondary-nav-section-title>Section</dt-secondary-nav-section-title>
        <dt-secondary-nav-section-description
          >Description</dt-secondary-nav-section-description
        >
        <dt-secondary-nav-group label="Group">
          <a dtSecondaryNavLink routerLink="/">Link</a>
          <a dtSecondaryNavLink routerLink="/">Link</a>
        </dt-secondary-nav-group>
      </dt-secondary-nav-section>
    </dt-secondary-nav>
  `,
})
class SingleSection {
  @ViewChild(DtSecondaryNavSection, { static: true })
  section: DtSecondaryNavSection;
}

@Component({
  selector: 'single-section-active',
  template: `
    <dt-secondary-nav>
      <dt-secondary-nav-title>Secondary nav</dt-secondary-nav-title>
      <dt-secondary-nav-section expandable active>
        <dt-secondary-nav-section-title>Section</dt-secondary-nav-section-title>
        <dt-secondary-nav-section-description
          >Description</dt-secondary-nav-section-description
        >
        <dt-secondary-nav-group label="Group">
          <a dtSecondaryNavLink routerLink="/">Link</a>
          <a dtSecondaryNavLink routerLink="/">Link</a>
        </dt-secondary-nav-group>
      </dt-secondary-nav-section>
      <dt-secondary-nav-section expandable>
        <dt-secondary-nav-section-title>Section</dt-secondary-nav-section-title>
        <dt-secondary-nav-section-description
          >Description</dt-secondary-nav-section-description
        >
        <dt-secondary-nav-group label="Group">
          <a dtSecondaryNavLink routerLink="/">Link</a>
          <a dtSecondaryNavLink routerLink="/">Link</a>
        </dt-secondary-nav-group>
      </dt-secondary-nav-section>
    </dt-secondary-nav>
  `,
})
class SingleSectionActive {
  @ViewChild(DtSecondaryNavSection, { static: true })
  section: DtSecondaryNavSection;
}

@Component({
  selector: 'single-section-no-expand',
  template: `
    <dt-secondary-nav>
      <dt-secondary-nav-title>Secondary nav</dt-secondary-nav-title>
      <dt-secondary-nav-section>
        <dt-secondary-nav-section-title
          >Link without description</dt-secondary-nav-section-title
        >
      </dt-secondary-nav-section>
    </dt-secondary-nav>
  `,
})
class SingleSectionNoExpand {
  @ViewChild(DtSecondaryNavSection, { static: true })
  section: DtSecondaryNavSection;
}

@Component({
  selector: 'multi-section',
  template: `
    <dt-secondary-nav>
      <dt-secondary-nav-title>Secondary nav</dt-secondary-nav-title>
      <dt-secondary-nav-section expandable>
        <dt-secondary-nav-section-title
          >Section 1</dt-secondary-nav-section-title
        >
        <dt-secondary-nav-section-description
          >Description</dt-secondary-nav-section-description
        >
        <dt-secondary-nav-group label="Group">
          <a dtSecondaryNavLink routerLink="/">Link</a>
          <a dtSecondaryNavLink routerLink="/">Link</a>
        </dt-secondary-nav-group>
      </dt-secondary-nav-section>
      <dt-secondary-nav-section expandable>
        <dt-secondary-nav-section-title
          >Section 2</dt-secondary-nav-section-title
        >
        <dt-secondary-nav-section-description
          >Description</dt-secondary-nav-section-description
        >
        <dt-secondary-nav-group label="Group">
          <a dtSecondaryNavLink routerLink="/">Link</a>
          <a dtSecondaryNavLink routerLink="/">Link</a>
        </dt-secondary-nav-group>
      </dt-secondary-nav-section>
    </dt-secondary-nav>
  `,
})
class MultiSection {
  @ViewChildren(DtSecondaryNavSection)
  sections: QueryList<DtSecondaryNavSection>;
}
