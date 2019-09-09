export interface EventChartDemoEvent {
  lane: string;
  value: number;
  duration: number;
  color?: 'default' | 'error' | 'filtered';
  // tslint:disable-next-line: no-any
  data?: any;
}

export interface EventChartDemoLane {
  name: string;
  label: string;
  color: 'default' | 'error' | 'conversion';
}

export interface EventChartDemoLegendItem {
  lanes: string[];
  label: string;
}

export interface EventChartDemoDataSource {
  getEvents(): EventChartDemoEvent[];
  getLanes(): EventChartDemoLane[];
  getLegendItems(): EventChartDemoLegendItem[];
}
