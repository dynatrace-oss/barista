import {Constructor} from './constructor';
import {CanDisable} from './disabled';

export interface HasTabIndex {
  /** Tabindex of the component. */
  tabIndex: number;
}

/** Mixin to augment a directive with a `tabIndex` property. */
export function mixinTabIndex<T extends Constructor<CanDisable>>(base: T, defaultTabIndex: number = 0)
    : Constructor<HasTabIndex> & T {
  return class extends base {
    private _tabIndex: number = defaultTabIndex;

    get tabIndex(): number { return this.disabled ? -1 : this._tabIndex; }
    set tabIndex(value: number) {
      // If the specified tabIndex value is null or undefined, fall back to the default value.

      // tslint:disable-next-line
      this._tabIndex = typeof value !== 'number' ? value : defaultTabIndex;
    }

    // tslint:disable-next-line:no-any
    constructor(...args: any[]) {
      super(...args);
    }
  };
}
