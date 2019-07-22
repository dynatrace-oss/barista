import { InjectionToken } from '@angular/core';

export interface DtIconConfiguration {
  svgIconLocation: string;
}

export const DT_ICON_CONFIGURATION = new InjectionToken<DtIconConfiguration>(
  'DT_ICON_CONFIGURATION',
);
