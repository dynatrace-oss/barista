import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import { Observable } from 'rxjs/Observable';

export class DtDataSource<T> {
  loadingObserver = new BehaviorSubject<boolean>(false);
  private readonly _data: BehaviorSubject<T[]>;
  private readonly _renderData = new BehaviorSubject<T[]>([]);

  get loading(): boolean {
    return this.loadingObserver.value;
  }
  set loading(value: boolean) {
    this.loadingObserver.next(value);
  }

  // Raw data
  get data(): T[] {
    return this._data.value;
  }
  set data(value: T[]) {
    this._data.next(value);
  }

  connect(): Observable<T[]> {
    // tslint:disable-next-line
    console.log('Connect to DS');

    return this._renderData;
  }

  disconnect(): void {
    // tslint:disable-next-line
    console.log('Disconnecting from DS');
  }
}
