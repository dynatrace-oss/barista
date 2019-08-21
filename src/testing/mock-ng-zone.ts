import { EventEmitter, Injectable, NgZone } from '@angular/core';

/**
 * Mock synchronous NgZone implementation that can be used
 * to flush out `onStable` subscriptions in tests.
 */
@Injectable()
export class MockNgZone extends NgZone {
  // tslint:disable-next-line:no-any
  onStable: EventEmitter<any> = new EventEmitter(false);
  onMicrotaskEmpty: EventEmitter<any> = new EventEmitter(false);

  constructor() {
    super({ enableLongStackTrace: false });
  }

  // tslint:disable-next-line:no-any
  run(fn: () => any): any {
    return fn();
  }

  // tslint:disable-next-line:no-any
  runOutsideAngular(fn: () => any): any {
    return fn();
  }

  simulateZoneExit(): void {
    this.onStable.emit(null);
  }

  simulateMicrotasksEmpty(): void {
    this.onMicrotaskEmpty.emit(null);
  }
}
