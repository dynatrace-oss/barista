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
  @Input() isLoading: boolean;
  @ViewChild('placeholder', {read: ViewContainerRef}) templatePlaceholder: ViewContainerRef;
  @ViewChild('emptyTemplate') emptyTemplate: TemplateRef<{}>;
  @ViewChild('loadingTemplate') loadingTemplate: TemplateRef<{}>;

  ngAfterContentInit(): void {
    this.emptyTitle = this.emptyTitle || 'No data';
    this.emptyMessage = this.emptyMessage || `Sorry, there's no data to display`;
  }

  ngAfterContentChecked(): void {
    super.ngAfterContentChecked();

    this.templatePlaceholder.clear();
    switch (true) {
      case this.isLoading:
        this.templatePlaceholder.createEmbeddedView(this.loadingTemplate);
        break;
      case this.isEmptyDataSource:
        this.templatePlaceholder.createEmbeddedView(this.emptyTemplate);
        break;
      default:
    }
  }

  renderRows(): void {
    this.templatePlaceholder.clear();
    super.renderRows();
  }

  get isEmptyDataSource(): boolean {
    if (Array.isArray(this.dataSource) && !this.dataSource.length) {
      return true;
    }

    return !this.dataSource;
  }
}
