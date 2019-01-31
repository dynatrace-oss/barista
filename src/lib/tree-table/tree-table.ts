import { Component, ViewEncapsulation, ChangeDetectionStrategy, Input, ChangeDetectorRef, ElementRef, Attribute, IterableDiffers, Optional, TrackByFunction } from '@angular/core';
import { CdkTable } from '@angular/cdk/table';
import { DtTreeControl } from '@dynatrace/angular-components/core';
import { mixinHasInteractiveRows, HasInteractiveRows } from '@dynatrace/angular-components/table';
import { toBase64String } from '@angular/compiler/src/output/source_map';

// tslint:disable-next-line:no-any
export const _DtTreeTableMixinBase = mixinHasInteractiveRows<any>(CdkTable);

/** Dynatrace Tree Table component */
@Component({
  selector: 'dt-tree-table',
  templateUrl: 'tree-table.html',
  styleUrls: ['tree-table.scss'],
  host: {
    'class': 'dt-tree-table',
    '[class.dt-table-interactive-rows]': 'interactiveRows',
    'role': 'treegrid',
    '[attr.aria-label]': 'ariaLabel',
  },
  inputs: ['interactiveRows', 'dataSource'],
  encapsulation: ViewEncapsulation.Emulated,
  changeDetection: ChangeDetectionStrategy.OnPush,
  preserveWhitespaces: false,
})
export class DtTreeTable<T> extends _DtTreeTableMixinBase implements HasInteractiveRows {
  /** The tree control that handles expanding/collapsing or rows */
  @Input()
  get treeControl(): DtTreeControl<T> {
    return this._treeControl;
  }
  set treeControl(value: DtTreeControl<T>) {
    this._treeControl = value;
    // this needs to be done to handle diffing for a row that did gets children dymanically added
    // without having prior child rows
    this.trackBy = (_: number, data: T) => this._treeControl.isExpandable(data);
  }
  /** The aria label for the tree-table */
  @Input('aria-label') ariaLabel: string;

  private _treeControl: DtTreeControl<T>;

  constructor(
    readonly _differs: IterableDiffers,
    readonly _changeDetectorRef: ChangeDetectorRef,
    readonly _elementRef: ElementRef,
    @Attribute('role') role: string
  ) {
    super(_differs, _changeDetectorRef, _elementRef, role);

    if (!role) {
      this._elementRef.nativeElement.setAttribute('role', 'treegrid');
    }
  }
}
