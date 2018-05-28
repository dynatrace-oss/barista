import {
  Component,
  ChangeDetectionStrategy,
  ViewEncapsulation,
  Input,
  Output,
  Directive,
} from '@angular/core';
import { Observable } from 'rxjs/Observable';

@Component({
  moduleId: module.id,
  selector: 'dt-key-value-list',
  templateUrl: 'key-value-list.html',
  styleUrls: ['key-value-list.scss'],
  host: {
    class: 'dt-key-value-list',
  },
  preserveWhitespaces: false,
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.Emulated,
})
export class DtKeyValueList<T> {
  @Input() columns:number = 1;
  private _dataSource: T[] | Observable<T>;
  get dataSource(): T[] | Observable<T> { return this._dataSource; }
  @Input()
  set dataSource(value: T[] | Observable<T>) { this._dataSource = value; }

  private _key: string | Function;
  get key(): string | Function { return this._key; }
  @Input()
  set key(value: string | Function ) { this._key = value; }

  private _val: string | Function;
  get val(): string | Function { return this._val; }
  @Input()
  set val(value: string | Function ) { this._val = value; }

  private getColumnsClass() : string {
    return "dtKeyValueListColumns"+(this.columns);
  }
  private getValueEntry( entry : T) : string {
    if (this._val instanceof Function) {
      return this._val(entry);
    }
    return entry[this._val]; 
  }
  private getKeyEntry( entry : T) : string {
    if (this._key instanceof Function) {
      return this._key(entry);
    }
    return entry[this._key]; 
  }
}