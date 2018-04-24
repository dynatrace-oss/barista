import {
  Component,
  AfterContentChecked,
  ChangeDetectionStrategy,
  ViewEncapsulation,
  Input,
  ViewChild,
  TemplateRef,
  ViewContainerRef,
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
export class DtTable<T> extends CdkTable<T> implements AfterContentChecked {
  @Input() isLoading: boolean;
  @ViewChild('placeholder', {read: ViewContainerRef}) templatePlaceholder: ViewContainerRef;
  @ViewChild('loadingTemplate') loadingTemplate: TemplateRef<{}>;

  ngAfterContentChecked(): void {
    super.ngAfterContentChecked();

    this.templatePlaceholder.clear();
    switch (true) {
      case this.isLoading:
        this.templatePlaceholder.createEmbeddedView(this.loadingTemplate);
        break;
      case this.isEmptyDataSource:
        // TODO: Add implementation for showing the empty state
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
