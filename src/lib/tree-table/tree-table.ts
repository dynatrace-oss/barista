import {
  Component,
  ViewEncapsulation,
  ChangeDetectionStrategy,
  Input,
  ChangeDetectorRef,
  ElementRef,
  Attribute,
  IterableDiffers,
  Inject,
} from '@angular/core';
import { DtTreeControl } from '@dynatrace/angular-components/core';
import { _DtTableBase } from '@dynatrace/angular-components/table';
import { DOCUMENT } from '@angular/common';
import { Platform } from '@angular/cdk/platform';

/** Dynatrace Tree Table component */
@Component({
  selector: 'dt-tree-table',
  templateUrl: 'tree-table.html',
  styleUrls: ['tree-table.scss'],
  host: {
    class: 'dt-tree-table',
    '[class.dt-table-interactive-rows]': 'interactiveRows',
    role: 'treegrid',
    '[attr.aria-label]': 'ariaLabel',
  },
  encapsulation: ViewEncapsulation.Emulated,
  changeDetection: ChangeDetectionStrategy.OnPush,
  preserveWhitespaces: false,
})
export class DtTreeTable<T> extends _DtTableBase<T> {
  /** The tree control that handles expanding/collapsing or rows */
  @Input() treeControl: DtTreeControl<T>;
  /** The aria label for the tree-table */
  @Input('aria-label') ariaLabel: string;

  constructor(
    differs: IterableDiffers,
    changeDetectorRef: ChangeDetectorRef,
    elementRef: ElementRef,
    // tslint:disable-next-line: no-any
    @Inject(DOCUMENT) document: any,
    platform: Platform,
    @Attribute('role') role: string
  ) {
    super(differs, changeDetectorRef, elementRef, document, platform, role);
    if (!role) {
      // We need this setAttribute here to override the attribute set in the constructor of the cdkTable
      this._elementRef.nativeElement.setAttribute('role', 'treegrid');
    }
  }
}
