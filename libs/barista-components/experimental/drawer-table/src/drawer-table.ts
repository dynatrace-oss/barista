/**
 * @license
 * Copyright 2022 Dynatrace LLC
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

import {
  AfterContentInit,
  AfterViewInit,
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  ContentChild,
  Directive,
  Input,
  TemplateRef,
  ViewChild,
  ViewContainerRef,
  ViewEncapsulation,
} from '@angular/core';
import {
  DtHeaderRowDef,
  DtRowDef,
  DtTable,
} from '@dynatrace/barista-components/table';

import { DtDrawer } from '@dynatrace/barista-components/drawer';
import { isEmpty } from '@dynatrace/barista-components/core';

@Directive({
  selector: '[dtDrawerContent]',
})
export class DtDrawerContent {}

@Component({
  selector: 'dt-drawer-table',
  templateUrl: './drawer-table.html',
  styleUrls: ['./drawer-table.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.Emulated,
  host: {
    class: 'dt-drawer-table',
  },
})
export class DtDrawerTable<T> implements AfterViewInit, AfterContentInit {
  /** Columns that stay visible when drawer is expanded */
  @Input()
  get openColumns(): string[] {
    return this._openColumns;
  }
  set openColumns(openColumns: string[]) {
    this._openColumns = openColumns;
  }
  private _openColumns: string[];

  /** Whether the drawer is open  */
  get isOpen(): boolean {
    return !isEmpty(this._drawer) && this._drawer.opened;
  }

  /** Reference to the drawer element  */
  @ViewChild(DtDrawer, { static: true }) private _drawer: DtDrawer;

  /** Reference to the drawer container  */
  @ViewChild('container', { read: ViewContainerRef, static: false })
  private _container: ViewContainerRef;

  /** Template reference for the drawer content. */
  @ContentChild(DtDrawerContent, { static: false, read: TemplateRef })
  private _drawerContentRef: TemplateRef<{
    $implicit: T;
  }>;

  /** Reference to the table that is used to make the rows interactive */
  @ContentChild(DtTable, { static: false }) private _table: DtTable<T>;

  /** Reference to the header row definition which is used to set the columns  */
  @ContentChild(DtHeaderRowDef, { static: false })
  private _rowHeaderDef: DtHeaderRowDef;

  /**
   * Reference to the row definition which is used to get and set the columns
   * this stores the columns that are initially set since we need to switch between the open and initial
   * set of columns when the drawer is toggled
   */
  @ContentChild(DtRowDef, { static: false }) rowDef: DtRowDef<T>;
  private _initialColumns: Iterable<string>;

  /** @internal Used to track the currently clicked row */
  _currentRow: T;

  constructor(private _changeDetectorRef: ChangeDetectorRef) {}

  ngAfterContentInit(): void {
    this._table.interactiveRows = true;
  }

  ngAfterViewInit(): void {
    this._initialColumns = this.rowDef.columns;
    // default the openColumns to the first one
    if (isEmpty(this._openColumns)) {
      this._openColumns = [this._initialColumns[0]];
    }
  }

  /**
   * Opens the drawer if it is not already opened.
   */
  open(): void {
    this._setColumns(this.openColumns);
    this._drawer.open();
    this._changeDetectorRef.markForCheck();
  }

  /**
   * Closes the drawer if it is not already closed.
   */
  close(): void {
    this._setColumns(this._initialColumns);
    this._drawer.close();
    this._changeDetectorRef.markForCheck();
  }

  /**
   * Toggles the the drawer.
   */
  toggle(): void {
    if (this._drawer.opened) {
      this.close();
    } else {
      this.open();
    }
  }

  /** Sets the drawer content */
  private _setDrawerContent(row: T): void {
    this._container.clear();
    this._container.createEmbeddedView(this._drawerContentRef, {
      $implicit: row,
    });
  }

  /** @internal Row click opens the drawer and sets its content or closes if the drawer is already open */
  _onRowClicked(row: T): void {
    const open = !this._drawer.opened || this._currentRow !== row;
    if (open) {
      this.open();
      this._setDrawerContent(row);
    } else {
      this.close();
    }
    this._currentRow = row;
  }

  /** Sets the columns of the table */
  private _setColumns(columns: Iterable<string>): void {
    this._rowHeaderDef.columns = columns;
    this.rowDef.columns = columns;
  }
}

/**
 * Data row definition for the dt-table of the drawer-table component.
 * Used to handle click event and apply style.
 */
@Directive({
  selector: '[dtDrawerRowDef]',
  exportAs: 'dtDrawerRowDef',
  host: {
    class: 'dt-drawer-row-def',
    '[class.dt-drawer-row-def-selected]': '_isOpen',
    '(click)': '_handleRowClick()',
  },
})
export class DtDrawerRowDef<T> {
  /** Input to match the current row that is open to the row given */
  @Input('dtDrawerRowDef')
  row: T;

  constructor(private readonly drawerTable: DtDrawerTable<T>) {}

  get _isOpen(): boolean {
    return this.drawerTable._currentRow === this.row && this.drawerTable.isOpen;
  }

  /** @internal Event handler function that relays the row click to the drawerTable component. */
  _handleRowClick(): void {
    this.drawerTable._onRowClicked(this.row);
  }
}
