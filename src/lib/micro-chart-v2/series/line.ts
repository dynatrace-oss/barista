import { Input, ChangeDetectionStrategy, Component, ViewChild, TemplateRef, ViewContainerRef, ChangeDetectorRef } from '@angular/core';
import { DtMicroChartSeriesSVG } from './series';
import { CdkPortalOutlet, TemplatePortal } from '@angular/cdk/portal';

@Component({
  selector: 'g[dt-micro-chart-line-series]',
  host: {
    class: 'dt-micro-chart-series, dt-micro-chart-line-series',
  },
  templateUrl: './line.html',
  styleUrls: ['line.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [{ provide: DtMicroChartSeriesSVG, useExisting: DtMicroChartLineSeriesSVG }],
})
export class DtMicroChartLineSeriesSVG extends DtMicroChartSeriesSVG {

  @Input() points: Array<{ x: number; y: number }>;
  @Input() path: string;
  @Input() highlightExtremes: boolean;
  @Input() minTemplate: TemplateRef<any>;
  @Input() maxTemplate: TemplateRef<any>;
  minPortal: TemplatePortal<any>;
  maxPortal: TemplatePortal<any>;

  constructor(private _viewContainerRef: ViewContainerRef, private _changeDetectorRef: ChangeDetectorRef) {
    super();
  }

  ngAfterViewInit(): void {
    Promise.resolve()
      .then(() => {
        this.renderExtremeLabels();
        this._changeDetectorRef.markForCheck();
      });
  }

  // Renders extreme labels if they are set.
  private renderExtremeLabels(): void {
    if (!this.highlightExtremes) {
      return;
    }
    if (this.minTemplate) {
      this.minPortal = new TemplatePortal(this.minTemplate, this._viewContainerRef, { $implicit: 8 });
    }
    if (this.maxTemplate) {
      this.maxPortal = new TemplatePortal(this.maxTemplate, this._viewContainerRef, { $implicit: 9 });
    }
  }
}
