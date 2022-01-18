/**
 * @license
 * Copyright 2022 Dynatrace LLC
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

import {
  waitForAsync,
  ComponentFixture,
  TestBed,
  fakeAsync,
  flush,
  tick,
} from '@angular/core/testing';
import {
  Component,
  ViewChild,
  ViewChildren,
  QueryList,
  DebugElement,
} from '@angular/core';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { createComponent } from '@dynatrace/testing/browser';
import { DtIconModule } from '@dynatrace/barista-components/icon';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { By } from '@angular/platform-browser';
import { DtSecondaryNavModule } from './secondary-nav-module';
import { DtSecondaryNavSection } from './section/secondary-nav-section';

describe('DtSecondaryNav', () => {
  beforeEach(
    waitForAsync(() => {
      TestBed.configureTestingModule({
        imports: [
          DtSecondaryNavModule,
          HttpClientTestingModule,
          NoopAnimationsModule,
          DtIconModule.forRoot({ svgIconLocation: `{{name}}.svg` }),
        ],
        declarations: [
          SingleSection,
          SingleSectionActive,
          SingleSectionNoExpand,
          MultiSection,
          SingleSectionWithActiveLink,
        ],
      }).compileComponents();
    }),
  );

  describe('single section', () => {
    let fixture: ComponentFixture<SingleSection>;
    let trigger: HTMLElement;

    beforeEach(() => {
      fixture = createComponent(SingleSection);
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

    beforeEach(() => {
      fixture = createComponent(SingleSectionActive);
    });

    it('should open the active section', fakeAsync(() => {
      expect(fixture.componentInstance.section.expanded).toBe(false);
    }));

    it('should activate the open section', fakeAsync(() => {
      expect(fixture.componentInstance.section._active).toBe(false);
    }));
  });

  describe('single section no expand', () => {
    let fixture: ComponentFixture<SingleSectionNoExpand>;
    let trigger: HTMLElement;

    beforeEach(() => {
      fixture = createComponent(SingleSectionNoExpand);
      trigger = fixture.debugElement.query(
        By.css('.dt-secondary-nav-section-header'),
      ).nativeElement;
    });

    it('should not open the non-expandable panel when clicked', fakeAsync(() => {
      trigger.click();
      fixture.detectChanges();
      flush();

      expect(fixture.componentInstance.section.expanded).toBe(true);
    }));
  });

  describe('multi section', () => {
    let fixture: ComponentFixture<MultiSection>;
    let debugElements: DebugElement[];

    beforeEach(() => {
      fixture = createComponent(MultiSection);
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

  describe('single selection with active router link', () => {
    let fixture: ComponentFixture<SingleSectionWithActiveLink>;

    beforeEach(() => {
      fixture = TestBed.createComponent(SingleSectionWithActiveLink);
    });

    it('should have the section expanded where the active link is in', fakeAsync(() => {
      // Set the initial value before the component is initialized
      fixture.componentInstance.linkActive = true;
      fixture.detectChanges();
      tick();
      expect(fixture.componentInstance.section.expanded).toBeTruthy();
    }));

    it('should not have the section expanded where the active link is in', fakeAsync(() => {
      fixture.componentInstance.linkActive = false;
      fixture.detectChanges();
      tick();
      expect(fixture.componentInstance.section.expanded).toBeFalsy();
    }));
  });
});

@Component({
  selector: 'single-section',
  template: `
    <dt-secondary-nav>
      <dt-secondary-nav-title>Secondary nav</dt-secondary-nav-title>
      <dt-secondary-nav-section>
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
      <dt-secondary-nav-section>
        <dt-secondary-nav-section-title>Section</dt-secondary-nav-section-title>
        <dt-secondary-nav-section-description
          >Description</dt-secondary-nav-section-description
        >
        <dt-secondary-nav-group label="Group">
          <a dtSecondaryNavLink routerLink="/">Link</a>
          <a dtSecondaryNavLink routerLink="/">Link</a>
        </dt-secondary-nav-group>
      </dt-secondary-nav-section>
      <dt-secondary-nav-section>
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
      <dt-secondary-nav-section>
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
      <dt-secondary-nav-section>
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

@Component({
  selector: 'single-section-with-active-link',
  template: `
    <dt-secondary-nav>
      <dt-secondary-nav-title>Secondary nav</dt-secondary-nav-title>
      <dt-secondary-nav-section>
        <dt-secondary-nav-section-title>Section</dt-secondary-nav-section-title>
        <dt-secondary-nav-section-description
          >Description</dt-secondary-nav-section-description
        >
        <dt-secondary-nav-group label="Group">
          <a dtSecondaryNavLink routerLink="/">Link</a>
          <a
            routerLinkActive
            dtSecondaryNavLink
            [dtSecondaryNavLinkActive]="linkActive"
          >
            Link
          </a>
        </dt-secondary-nav-group>
      </dt-secondary-nav-section>
    </dt-secondary-nav>
  `,
})
class SingleSectionWithActiveLink {
  @ViewChild(DtSecondaryNavSection, { static: true })
  section: DtSecondaryNavSection;

  linkActive = true;
}
