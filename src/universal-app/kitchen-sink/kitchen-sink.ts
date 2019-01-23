import {Component, NgModule} from '@angular/core';
import {BrowserModule} from '@angular/platform-browser';
import {ServerModule} from '@angular/platform-server';
import { DtAlertModule } from '@dynatrace/angular-components/alert';
import { DtButtonModule } from '@dynatrace/angular-components/button';
import { DtCheckboxModule } from '@dynatrace/angular-components/checkbox';
import { DtLoadingDistractorModule } from '@dynatrace/angular-components/loading-distractor';
import { DtTileModule } from '@dynatrace/angular-components/tile';
import { DtCardModule } from '@dynatrace/angular-components/card';
import { DtContextDialogModule } from '@dynatrace/angular-components/context-dialog';
import { DtDrawerModule } from '@dynatrace/angular-components/drawer';
import { DtButtonGroupModule } from '@dynatrace/angular-components/button-group';
import { DtTableModule } from '@dynatrace/angular-components/table';
import { DtTagModule } from '@dynatrace/angular-components/tag';
import { DtIconModule } from '@dynatrace/angular-components/icon';
import { DtPaginationModule } from '@dynatrace/angular-components/pagination';
import { DtRadioModule } from '@dynatrace/angular-components/radio';
import { DtShowMoreModule } from '@dynatrace/angular-components/show-more';
import { DtSwitchModule } from '@dynatrace/angular-components/switch';
import { DtProgressBarModule } from '@dynatrace/angular-components/progress-bar';
import { DtProgressCircleModule } from '@dynatrace/angular-components/progress-circle';
import { DtCopyToClipboardModule } from '@dynatrace/angular-components/copy-to-clipboard';
import { DtSelectModule } from '@dynatrace/angular-components/select';
import { DtInputModule } from '@dynatrace/angular-components/input';
import { DtOverlayModule } from '@dynatrace/angular-components/overlay';
import { DtAutocompleteModule } from '@dynatrace/angular-components/autocomplete';
import { DtTreeControl, DtTreeFlattener, DtTreeDataSource } from '@dynatrace/angular-components/core';
import { DtIconType } from '@dynatrace/dt-iconpack';
import { DtTreeTableModule } from '@dynatrace/angular-components/tree-table';
import { DtToggleButtonGroupModule } from '@dynatrace/angular-components/toggle-button-group';
import { DtInfoGroupModule } from '@dynatrace/angular-components/info-group';

const TESTDATA: ThreadNode[] = [
  {
    name: 'hz.hzInstance_1_cluster.thread',
    icon: 'apache-tomcat',
    threadlevel: 'S0',
    totalTimeConsumption: 150,
    waiting: 123,
    running: 20,
    blocked: 0,
    children: [
      {
        name: 'hz.hzInstance_1_cluster.thread_1_hz.hzInstance_1_cluster.thread-1',
        icon: 'apache-tomcat',
        threadlevel: 'S1',
        totalTimeConsumption: 150,
        waiting: 123,
        running: 20,
        blocked: 0,
      },
      {
        name: 'hz.hzInstance_1_cluster.thread-2',
        icon: 'apache-tomcat',
        threadlevel: 'S1',
        totalTimeConsumption: 150,
        waiting: 130,
        running: 0,
        blocked: 0,
      },
    ],
  },
  {
    name: 'jetty',
    icon: 'apache-tomcat',
    threadlevel: 'S0',
    totalTimeConsumption: 150,
    waiting: 123,
    running: 20,
    blocked: 0,
    children: [
      {
        name: 'jetty-422',
        icon: 'apache-tomcat',
        threadlevel: 'S1',
        totalTimeConsumption: 150,
        waiting: 123,
        running: 20,
        blocked: 0,
      },
      {
        name: 'jetty-423',
        icon: 'apache-tomcat',
        threadlevel: 'S1',
        totalTimeConsumption: 150,
        waiting: 130,
        running: 0,
        blocked: 0,
      },
      {
        name: 'jetty-424',
        icon: 'apache-tomcat',
        threadlevel: 'S1',
        totalTimeConsumption: 150,
        waiting: 130,
        running: 0,
        blocked: 0,
      },
    ],
  },
  {
    name: 'Downtime timer',
    icon: 'apache-tomcat',
    threadlevel: 'S0',
    totalTimeConsumption: 150,
    waiting: 123,
    running: 20,
    blocked: 0,
  }];

export class ThreadNode {
  name: string;
  threadlevel: string;
  totalTimeConsumption: number;
  blocked: number;
  running: number;
  waiting: number;
  icon: DtIconType;
  children?: ThreadNode[];
}

export class ThreadFlatNode {
  name: string;
  threadlevel: string;
  totalTimeConsumption: number;
  blocked: number;
  running: number;
  waiting: number;
  icon: DtIconType;
  level: number;
  expandable: boolean;
}

@Component({
  selector: 'dt-kitchen-sink',
  templateUrl: './kitchen-sink.html',
})
export class KitchenSink {
  tableDataSource: object[] = [
    { host: 'et-demo-2-win4' },
    { host: 'et-demo-2-win6' },
    { host: 'et-demo-2-win8' },
  ];

  treeControl: DtTreeControl<ThreadFlatNode>;
  treeFlattener: DtTreeFlattener<ThreadNode, ThreadFlatNode>;
  treeTableDataSource: DtTreeDataSource<ThreadNode, ThreadFlatNode>;

  constructor() {
    this.treeControl = new DtTreeControl<ThreadFlatNode>(this._getLevel, this._isExpandable);
    this.treeFlattener =  new DtTreeFlattener(this.transformer, this._getLevel, this._isExpandable, this._getChildren);
    this.treeTableDataSource = new DtTreeDataSource(this.treeControl, this.treeFlattener);
    this.treeTableDataSource.data = TESTDATA;
  }

  hasChild = (_: number, _nodeData: ThreadFlatNode) => _nodeData.expandable;

  transformer = (node: ThreadNode, level: number): ThreadFlatNode => {
    const flatNode = new ThreadFlatNode();
    flatNode.name = node.name;
    flatNode.level = level;
    flatNode.threadlevel = node.threadlevel;
    flatNode.expandable = !!node.children;
    flatNode.blocked = node.blocked;
    flatNode.running = node.running;
    flatNode.waiting = node.waiting;
    flatNode.totalTimeConsumption = node.totalTimeConsumption;
    flatNode.icon = node.icon;
    return flatNode;
  }

  private _getLevel = (node: ThreadFlatNode) => node.level;

  private _isExpandable = (node: ThreadFlatNode) => node.expandable;

  private _getChildren = (node: ThreadNode): ThreadNode[] => node.children || [];
}

@NgModule({
  imports: [
    BrowserModule.withServerTransition({appId: 'kitchen-sink'}),
    DtAlertModule,
    DtAutocompleteModule,
    DtButtonModule,
    DtCheckboxModule,
    DtTableModule,
    DtLoadingDistractorModule,
    DtTileModule,
    DtTagModule,
    DtCardModule,
    DtContextDialogModule,
    DtDrawerModule,
    DtCopyToClipboardModule,
    DtButtonGroupModule,
    DtIconModule.forRoot({svgIconLocation: '/lib/assets/icons/{{name}}.svg'}),
    DtRadioModule,
    DtShowMoreModule,
    DtProgressCircleModule,
    DtPaginationModule,
    DtSwitchModule,
    DtProgressBarModule,
    DtSelectModule,
    DtInputModule,
    DtOverlayModule,
    DtTreeTableModule,
    DtToggleButtonGroupModule,
    DtInfoGroupModule,
  ],
  bootstrap: [KitchenSink],
  declarations: [KitchenSink],
})
export class KitchenSinkClientModule { }

@NgModule({
  imports: [
    KitchenSinkClientModule,
    ServerModule,
  ],
  bootstrap: [KitchenSink],
})
export class KitchenSinkServerModule { }
