import {
  Component,
  AfterContentChecked,
  ChangeDetectionStrategy,
  ViewEncapsulation,
  Input,
  ViewChild,
  TemplateRef,
  ViewContainerRef,
  AfterContentInit,
} from '@angular/core';
import { CdkTable } from '@angular/cdk/table';

@Component({
  moduleId: module.id,
  selector: 'dt-table',
  styleUrls: ['./scss/table.scss'],
  templateUrl: './table.html',
  exportAs: 'dtTable',
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.Emulated,
  preserveWhitespaces: false,
  host: {
    class: 'dt-table',
  },
})
export class DtTable<T> extends CdkTable<T> implements AfterContentInit, AfterContentChecked {
  @Input() emptyTitle: string;
  @Input() emptyMessage: string;
  @ViewChild('noDataPlaceholder', {read: ViewContainerRef}) noDataPlaceholder: ViewContainerRef;
  @ViewChild('noData') noDataTemplate: TemplateRef<{}>;

  ngAfterContentInit(): void {
    this.emptyTitle = this.emptyTitle || 'No data';
    this.emptyMessage = this.emptyMessage || `Sorry, there's no data to display`;
  }

  ngAfterContentChecked(): void {
    super.ngAfterContentChecked();

    if (this.isEmptyDataSource) {
      this.noDataPlaceholder.clear();
      this.noDataPlaceholder.createEmbeddedView(this.noDataTemplate);
    }
  }

  renderRows(): void {
    this.noDataPlaceholder.clear();
    super.renderRows();
  }

  get isEmptyDataSource(): boolean {
    if (Array.isArray(this.dataSource) && !this.dataSource.length) {
      return true;
    }

    return !this.dataSource;
  }
}
