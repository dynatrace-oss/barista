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

import { ESCAPE } from '@angular/cdk/keycodes';
import { OverlayContainer } from '@angular/cdk/overlay';
import {
  Component,
  ElementRef,
  NgModule,
  TemplateRef,
  ViewChild,
} from '@angular/core';
import {
  ComponentFixture,
  TestBed,
  fakeAsync,
  flush,
  inject,
} from '@angular/core/testing';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';

import { DtOverlayModule } from './overlay-module';
import { DtOverlay } from './overlay';

import {
  createComponent,
  dispatchKeyboardEvent,
  dispatchMouseEvent,
} from '@dynatrace/testing/browser';

describe('DtOverlay', () => {
  let dtOverlay: DtOverlay;
  let overlayContainer: OverlayContainer;
  let overlayContainerElement: HTMLElement;

  let fixture: ComponentFixture<TestComponent>;

  beforeEach(fakeAsync(() => {
    TestBed.configureTestingModule({
      imports: [DtOverlayModule, NoopAnimationsModule, TestOverlayModule],
      declarations: [TestComponent],
    }).compileComponents();
  }));

  beforeEach(inject(
    [DtOverlay, OverlayContainer],
    (overlay: DtOverlay, oc: OverlayContainer) => {
      dtOverlay = overlay;
      overlayContainer = oc;
      overlayContainerElement = oc.getContainerElement();
    },
  ));

  beforeEach(() => {
    fixture = createComponent(TestComponent);
  });

  afterEach(() => {
    overlayContainer.ngOnDestroy();
  });

  it('should create a new overlay from templateRef', () => {
    dtOverlay.create(
      fixture.componentInstance.trigger,
      fixture.componentInstance.overlay,
    );

    fixture.detectChanges();

    const overlay = overlayContainerElement.querySelector(
      '.dt-overlay-container',
    ) as HTMLElement;
    expect(overlay).toBeDefined();
    expect(overlay.textContent).toContain('overlay');
  });

  it('should create a new overlay from component', () => {
    const ref = dtOverlay.create(
      fixture.componentInstance.trigger,
      DummyOverlay,
    );

    fixture.detectChanges();

    const overlay = overlayContainerElement.querySelector(
      '.dt-overlay-container',
    ) as HTMLElement;
    expect(overlay).toBeDefined();
    expect(overlay.textContent).toContain('dummy-overlay');
    expect(ref.componentInstance).toBeInstanceOf(DummyOverlay);
  });

  it('should dismiss the overlay correctly', fakeAsync(() => {
    dtOverlay.create(
      fixture.componentInstance.trigger,
      fixture.componentInstance.overlay,
    );
    fixture.detectChanges();

    let overlay = overlayContainerElement.querySelector(
      '.dt-overlay-container',
    );
    expect(overlay).toBeDefined();
    dtOverlay.dismiss();
    fixture.detectChanges();
    flush();
    overlay = overlayContainerElement.querySelector('.dt-overlay-container');
    expect(overlay).toBeNull();
  }));

  it('should not be pinnable by default', fakeAsync(() => {
    const dtOverlayRef = dtOverlay.create(
      fixture.componentInstance.trigger,
      fixture.componentInstance.overlay,
    );
    fixture.detectChanges();
    dtOverlayRef.pin(true);
    fixture.detectChanges();
    flush();
    expect(dtOverlayRef.pinned).toBeFalsy();
  }));

  it('should be pinnable if config is passed', fakeAsync(() => {
    const dtOverlayRef = dtOverlay.create(
      fixture.componentInstance.trigger,
      fixture.componentInstance.overlay,
      { pinnable: true },
    );
    fixture.detectChanges();
    dtOverlayRef.pin(true);
    fixture.detectChanges();
    flush();
    expect(dtOverlayRef.pinned).toBeTruthy();
  }));

  it('should close the overlay when pinned and backdrop is clicked', fakeAsync(() => {
    const dtOverlayRef = dtOverlay.create(
      fixture.componentInstance.trigger,
      fixture.componentInstance.overlay,
      { pinnable: true },
    );
    fixture.detectChanges();
    dtOverlayRef.pin(true);
    fixture.detectChanges();
    flush();
    const backdrop = overlayContainerElement.querySelector(
      '.cdk-overlay-backdrop',
    );
    expect(backdrop).not.toBeNull();
    dispatchMouseEvent(backdrop!, 'click');
    fixture.detectChanges();
    flush();
    expect(dtOverlayRef.pinned).toBeFalsy();
    const overlay = overlayContainerElement.querySelector(
      '.dt-overlay-container',
    );
    expect(overlay).toBeNull();
  }));

  it('should close the overlay when pinned and ESC is pressed', fakeAsync(() => {
    const dtOverlayRef = dtOverlay.create(
      fixture.componentInstance.trigger,
      fixture.componentInstance.overlay,
      { pinnable: true },
    );
    fixture.detectChanges();
    dtOverlayRef.pin(true);
    fixture.detectChanges();
    flush();
    dispatchKeyboardEvent(document.body, 'keydown', ESCAPE);
    fixture.detectChanges();
    flush();
    expect(dtOverlayRef.pinned).toBeFalsy();
    const overlay = overlayContainerElement.querySelector(
      '.dt-overlay-container',
    );
    expect(overlay).toBeNull();
  }));

  it('should update the implicit context', fakeAsync(() => {
    const dtOverlayRef = dtOverlay.create(
      fixture.componentInstance.trigger,
      fixture.componentInstance.implicitOverlay,
      { data: { value: 1 }, pinnable: true },
    );
    fixture.detectChanges();

    const overlay = overlayContainerElement.querySelector(
      '.dt-overlay-container',
    ) as HTMLElement;
    expect(overlay).toBeDefined();
    expect(overlay.textContent).toContain('1');

    dtOverlayRef.updateImplicitContext({ value: 5 });
    fixture.detectChanges();

    expect(overlay.textContent).toContain('5');
  }));
});

/** dummy component */
@Component({
  selector: 'dt-test-component',
  template: `
    <div #trigger>trigger</div>
    <ng-template #overlay>overlay</ng-template>
    <ng-template #implicitOverlay let-tooltip>{{ tooltip.value }}</ng-template>
  `,
})
class TestComponent {
  @ViewChild('trigger', { static: true }) trigger: ElementRef;

  @ViewChild('overlay', { static: true }) overlay: TemplateRef<any>;

  @ViewChild('implicitOverlay', { static: true, read: TemplateRef })
  implicitOverlay: TemplateRef<any>;
}

@Component({
  selector: 'dt-text-component-overlay',
  template: '<div class="dummy-overlay">dummy-overlay</div>',
})
class DummyOverlay {}

// @Component({
//   moduleId: module.id,
//   selector: 'component-barista-example',
//   template: `
//     <ng-template #implicitOverlay let-tooltip>
//       Hello
//       {{ tooltip.value }}
//     </ng-template>
//     <p><span #origin>An overlay will be created here</span></p>
//   `,
// })
// export class ImplicitContextTestComponent {
//   i = 0;

//   @ViewChild('origin', { static: true }) origin: ElementRef;

//   @ViewChild('overlay', { static: true, read: TemplateRef })
//   overlayTemplate: TemplateRef<any>;

//   constructor(
//     private _dtOverlay: DtOverlay,
//     private changeDetectorRef: ChangeDetectorRef,
//   ) {}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
//   overlayRef: DtOverlayRef<any> | null;

//   createOverlay(): void {
//     if (!this.overlayRef) {
//       this.overlayRef = this._dtOverlay.create(
//         this.origin,
//         this.overlayTemplate,
//         { data: { value: this.i }, pinnable: true },
//       );
//     }
//   }

//   /** Update the context with some arbitrary values. */
//   updateContext(): void {
//     this.i += 1;
//     if (this.overlayRef) {
//       this.overlayRef.updateImplicitContext({
//         value: this.i,
//       });
//       this.changeDetectorRef.markForCheck();
//     }
//   }

//   dismiss(): void {
//     if (this.overlayRef && !this.overlayRef.pinned) {
//       this._dtOverlay.dismiss();
//       this.overlayRef = null;
//     }
//   }
// }

@NgModule({
  declarations: [DummyOverlay],
  entryComponents: [DummyOverlay],
})
export class TestOverlayModule {}
