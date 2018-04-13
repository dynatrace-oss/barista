import {
  Component,
  AfterContentChecked,
  ChangeDetectionStrategy,
  ViewEncapsulation,
  Input,
  ViewChild,
  TemplateRef,
  ViewContainerRef
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
  host: {
    class: 'dt-table',
  },
})
export class DtTable<T> extends CdkTable<T> implements AfterContentChecked {
  @Input() emptyMessage: string;
  @ViewChild('noDataPlaceholder', {read: ViewContainerRef}) noDataPlaceholder: ViewContainerRef;
  @ViewChild('noData') noDataTemplate: TemplateRef<void>;

  ngAfterContentChecked(): void {
    super.ngAfterContentChecked();

    if (this.isEmptyDataSource()) {
      this.noDataPlaceholder.createEmbeddedView(this.noDataTemplate);
    }
  }

  renderRows(): void {
    this.noDataPlaceholder.clear();
    super.renderRows();
  }

  isEmptyDataSource(): boolean {
    if (Array.isArray(this.dataSource) && !this.dataSource.length) {
      return true;
    }

    return !this.dataSource;
  }
}
