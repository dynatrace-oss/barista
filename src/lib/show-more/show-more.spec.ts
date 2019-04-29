import {async, TestBed} from '@angular/core/testing';
import {Component, DebugElement} from '@angular/core';
import {By} from '@angular/platform-browser';
import {DtShowMoreModule, DtShowMore, DtIconModule} from '@dynatrace/angular-components';
import {HttpClientModule, HttpXhrBackend} from '@angular/common/http';
import {ENTER, SPACE} from '@angular/cdk/keycodes';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { dispatchKeyboardEvent } from '../../testing/dispatch-events';

describe('DtShowMore', () => {
  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [
        DtShowMoreModule,
        HttpClientModule,
        DtIconModule.forRoot({ svgIconLocation: `{{name}}.svg` })],
      declarations: [TestApp],
      providers: [{
        provide: HttpXhrBackend,
        useClass: HttpClientTestingModule,
      }],
    });

    TestBed.compileComponents();
  }));

  describe('show-more', () => {

    let fixture;
    let testComponent: TestApp;
    let instanceDebugElement: DebugElement;
    let instanceElement: HTMLElement;

    beforeEach(async(() => {
      fixture = TestBed.createComponent(TestApp);
      testComponent = fixture.componentInstance;
      fixture.detectChanges();
      instanceDebugElement = fixture.debugElement.query(By.directive(DtShowMore));
      instanceElement = instanceDebugElement.nativeElement;
    }));

    it('should not contain less style', () => {
      expect(instanceElement.classList).not.toContain(
        'dt-show-more-show-less');
    });

    it('should have less styles', () => {
      testComponent.showLess = true;
      fixture.detectChanges();

      expect(instanceElement.classList).toContain(
        'dt-show-more-show-less');
    });

    it('should fire event', () => {
      expect(testComponent.eventsFired).toBe(0);

      instanceElement.click();

      expect(testComponent.eventsFired).toBe(1);
    });
  });
});

@Component({
  selector: 'dt-test-app',
  template: `<dt-show-more [showLess]="showLess" (changed)="eventFired()">More</dt-show-more>`,
})
class TestApp {
  showLess = false;
  eventsFired = 0;

  eventFired(): void {
    this.eventsFired++;
  }
}
