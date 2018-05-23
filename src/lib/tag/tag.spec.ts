import {async, TestBed} from '@angular/core/testing';
import {Component} from '@angular/core';
import {By} from '@angular/platform-browser';
import {DtTagModule, DtTag, DtIconModule} from '@dynatrace/angular-components';
import {HttpClientTestingModule} from '@angular/common/http/testing';
import {HttpClientModule} from '@angular/common/http';

describe('DtTag', () => {
  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [DtTagModule, HttpClientModule,
        DtIconModule.forRoot({ svgIconLocation: `{{name}}.svg` })],
      declarations: [TestAppSimple, TestAppRemovable],
    });

    TestBed.compileComponents();
  }));

  it('should not be removable', () => {
    const fixture = TestBed.createComponent(TestAppSimple);
    fixture.detectChanges();

    const tileNativeElement = fixture.debugElement.nativeElement.querySelector('dt-tag dt-icon');
    expect(tileNativeElement).toBeFalsy();
  });

  it('should be removable', () => {
    const fixture = TestBed.createComponent(TestAppRemovable);
    fixture.detectChanges();

    const tileNativeElement = fixture.debugElement.nativeElement.querySelector('dt-tag dt-icon');
    expect(tileNativeElement).toBeTruthy();
  });

  it('should fire removed event', () => {
    const fixture = TestBed.createComponent(TestAppRemovable);
    fixture.detectChanges();

    const tileNativeElement = fixture.debugElement.nativeElement.querySelector('dt-tag');

    let groupDebugElement = fixture.debugElement.query(By.directive(DtTag));
    let groupInstance = groupDebugElement.injector.get<DtTag<string>>(DtTag);

    let item = fixture.debugElement.nativeElement.querySelector('dt-icon');

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
