// tslint:disable no-lifecycle-call no-use-before-declare no-magic-numbers
// tslint:disable no-any max-file-line-count no-unbound-method use-component-selector

import { HttpClientModule, HttpXhrBackend } from '@angular/common/http';
import { Component } from '@angular/core';
import { async, TestBed } from '@angular/core/testing';
import { DtTagModule, DtIconModule } from '@dynatrace/angular-components';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { createComponent } from '../../testing/create-component';

fdescribe('DtTag', () => {
  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [
        DtTagModule,
        HttpClientModule,
        DtIconModule.forRoot({svgIconLocation: `{{name}}.svg`}),
      ],
      declarations: [TestAppSimple, TestAppRemovable],
      providers: [{
        provide: HttpXhrBackend,
        useClass: HttpClientTestingModule,
      }],
    });

    TestBed.compileComponents();
  }));

  it('should not be removable', () => {
    const fixture = createComponent(TestAppSimple);
    fixture.detectChanges();

    const tileNativeElement = fixture.debugElement.nativeElement.querySelector('dt-tag dt-icon');
    expect(tileNativeElement).toBeFalsy();
  });

  it('should be removable', () => {
    const fixture = createComponent(TestAppRemovable);
    fixture.detectChanges();

    const tileNativeElement = fixture.debugElement.nativeElement.querySelector('dt-tag dt-icon');
    expect(tileNativeElement).toBeTruthy();
  });

  it('should fire removed event', () => {
    const fixture = createComponent(TestAppRemovable);
    fixture.detectChanges();

    const item = fixture.debugElement.nativeElement.querySelector('dt-icon');

    expect(fixture.componentInstance.removeEventCount).toBe(0);

    item.click();

    expect(fixture.componentInstance.removeEventCount).toBe(1);
  });

});

/** Test component that contains an DtTag. */
@Component({
  selector: 'dt-test-app',
  template: `
    <dt-tag>Value</dt-tag>
  `,
})
class TestAppSimple {
}

@Component({
  selector: 'dt-test-app',
  template: `<dt-tag removable (removed)="increaseEventCount()">Value</dt-tag>`,
})
class TestAppRemovable {
  removeEventCount = 0;

  increaseEventCount(): void {
    this.removeEventCount++;
  }
}
