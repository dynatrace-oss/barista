import { Routes } from '@angular/router';
import { Home } from './ui-test-app';
import { ButtonUI } from '../button/button-ui';
import { ButtonGroupUi } from '../button-group/button-group-ui';
import { ExpandableSectionUi } from '../expandable-section/expandable-section-ui';
import { ExpandablePanelUi } from '../expandable-panel/expandable-panel-ui';
import { TileUI } from '../tile/tile-ui';
import { ContextDialogUI } from '../context-dialog/context-dialog-ui';
import { KeyValueListUI } from '../key-value-list/key-value-list-ui';
import { PaginationUI } from '../pagination/pagination-ui';
import { RadioUI } from '../radio/radio.ui';
import { ShowMoreUI } from '../show-more/show-more-ui';
import { CheckboxUI } from '../checkbox/checkbox-ui';
import { SwitchUI } from '../switch/switch-ui';
import { CopyToClipboardUI } from '../copy-to-clipboard/copy-to-clipboard-ui';
import { ChartUI } from '../chart/chart-ui';
import { ChartHighchartsUI } from '../chart/chart-highcharts-ui';
import { ProgressBarUI } from '../progress-bar/progress-bar-ui';
import { TabsUI } from '../tabs/tabs-ui';
import { OverlayUI } from '../overlay/overlay-ui';
import { ChartSelectionAreaUI } from '../chart/chart-selection-area-ui';
import { DrawerUI } from '../drawer/drawer-ui';
import { InfoGroupUI } from '../info-group/info-group-ui';

export const UI_TEST_APP_ROUTES: Routes = [
  { path: '', component: Home },
  { path: 'button', component: ButtonUI },
  { path: 'button-group', component: ButtonGroupUi },
  { path: 'chart', children: [
     { path: '', component: ChartUI },
     { path: 'highcharts', component: ChartHighchartsUI },
     { path: 'selection-area', component: ChartSelectionAreaUI },
    ],
  },
  { path: 'checkbox', component: CheckboxUI },
  { path: 'context-dialog', component: ContextDialogUI },
  { path: 'drawer', component: DrawerUI },
  { path: 'copy-to-clipboard', component: CopyToClipboardUI },
  { path: 'expandable-panel', component: ExpandablePanelUi },
  { path: 'expandable-section', component: ExpandableSectionUi },
  { path: 'key-value-list', component: KeyValueListUI },
  { path: 'pagination', component: PaginationUI },
  { path: 'radio', component: RadioUI },
  { path: 'show-more', component: ShowMoreUI },
  { path: 'switch', component: SwitchUI },
  { path: 'progress-bar', component: ProgressBarUI },
  { path: 'tabs', component: TabsUI },
  { path: 'overlay', component: OverlayUI },
  { path: 'info-group', component: InfoGroupUI },
  { path: 'tile', component: TileUI },
];
