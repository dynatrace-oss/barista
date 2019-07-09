import { InjectionToken } from '@angular/core';

export interface DtChartConfig {
  shouldUpdateColors: boolean;
}

export const DT_CHART_DEFAULT_CONFIG: DtChartConfig = {
  shouldUpdateColors: true,
};

export const DT_CHART_CONFIG = new InjectionToken<DtChartConfig>(
  'dt-chart-config'
);
