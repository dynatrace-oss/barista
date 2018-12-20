// tslint:disable:no-magic-numbers

import { Component } from '@angular/core';
import { generateData } from './chart-data-utils';
import { OriginalClassName } from '../../../core/decorators';

@Component({
  template: `
  <dt-chart [options]="options" [series]="series">
    <dt-chart-tooltip>
      <ng-template let-tooltip>
        <dt-key-value-list style="min-width: 100px">
          <dt-key-value-list-item *ngFor="let data of tooltip.points" [key]="data.series.name" [value]="data.point.y">
          </dt-key-value-list-item>
        </dt-key-value-list>
      </ng-template>
    </dt-chart-tooltip>
  </dt-chart>`,
})
@OriginalClassName('ChartDefaultExampleComponent')
export class ChartDefaultExampleComponent {
  options: Highcharts.Options = {
    "chart": {
      "alignTicks": true
    },
    "legend": {
      "itemStyle": {
        "cursor": "default"
      }
    },
    "plotOptions": {
      "arearange": {
        "color": "#14a8f5",
        "fillOpacity": 0.4,
        "lineWidth": 0,
        "marker": {
          "states": {
            "hover": {
              "enabled": false
            }
          }
        },
        "showInLegend": false
      },
      "column": {
        "color": "#b4e5f9"
      },
      "line": {
        "color": "#006bba",
        "marker": {
          "states": {
            "hover": {
              "enabled": true,
              "lineWidth": 1,
              "lineWidthPlus": 0,
              "radiusPlus": 0
            }
          }
        }
      },
      "series": {
        "events": {},
        "marker": {
          "enabled": false,
          "lineColor": "#ffffff",
          "radius": 4,
          "symbol": "circle"
        },
        "states": {
          "hover": {
            "halo": false,
            "lineWidth": 0,
            "lineWidthPlus": 0
          }
        }
      }
    },
    "tooltip": {
      "shared": true
    },
    "xAxis": {
      "crosshair": {
        "color": "#02a1b2",
        "width": 2,
        "zIndex": 10
      },
      "type": "datetime",
      "units": [
        [
          "second",
          [
            1,
            2,
            5,
            10,
            15,
            30
          ]
        ],
        [
          "minute",
          [
            1,
            2,
            5,
            10,
            15,
            30
          ]
        ],
        [
          "hour",
          [
            1,
            2,
            3,
            4,
            6,
            8,
            12
          ]
        ],
        [
          "day",
          [
            1
          ]
        ],
        [
          "week",
          [
            1
          ]
        ],
        [
          "month",
          [
            1,
            3,
            6
          ]
        ]
      ]
    },
    "yAxis": [
      {
        "labels": {
          "format": "{value} %"
        },
        "max": 100,
        "min": 0,
        "tickAmount": 5,
        "title": {}
      },
      {
        "opposite": true,
        "tickAmount": 5,
        "title": {},
        "labels": {}
      }
    ]
  };

  series: any[] = [
    {
      "type": "arearange",
      "data": [
        [
          1536746400000,
          36,
          49
        ],
        [
          1536746700000,
          32,
          51
        ],
        [
          1536747000000,
          39,
          51
        ],
        [
          1536747300000,
          38,
          45
        ],
        [
          1536747600000,
          28,
          45
        ],
        [
          1536747900000,
          38,
          49
        ],
        [
          1536748200000,
          35,
          50
        ],
        [
          1536748500000,
          33,
          49
        ],
        [
          1536748800000,
          27,
          52
        ],
        [
          1536749100000,
          33,
          48
        ],
        [
          1536749400000,
          37,
          53
        ],
        [
          1536749700000,
          25,
          53
        ],
        [
          1536750000000,
          25,
          44
        ],
        [
          1536750300000,
          35,
          48
        ],
        [
          1536750600000,
          36,
          52
        ],
        [
          1536750900000,
          28,
          46
        ],
        [
          1536751200000,
          26,
          54
        ],
        [
          1536751500000,
          37,
          46
        ],
        [
          1536751800000,
          29,
          45
        ],
        [
          1536752100000,
          34,
          53
        ],
        [
          1536752400000,
          39,
          48
        ],
        [
          1536752700000,
          30,
          48
        ],
        [
          1536753000000,
          38,
          43
        ],
        [
          1536753300000,
          26,
          48
        ],
        [
          1536753600000,
          33,
          52
        ]
      ]
    },
    {
      "type": "line",
      "name": "Memory usage",
      "data": [
        [
          1536746400000,
          43
        ],
        [
          1536746700000,
          42
        ],
        [
          1536747000000,
          45
        ],
        [
          1536747300000,
          42
        ],
        [
          1536747600000,
          37
        ],
        [
          1536747900000,
          44
        ],
        [
          1536748200000,
          43
        ],
        [
          1536748500000,
          41
        ],
        [
          1536748800000,
          40
        ],
        [
          1536749100000,
          41
        ],
        [
          1536749400000,
          45
        ],
        [
          1536749700000,
          39
        ],
        [
          1536750000000,
          35
        ],
        [
          1536750300000,
          42
        ],
        [
          1536750600000,
          44
        ],
        [
          1536750900000,
          37
        ],
        [
          1536751200000,
          40
        ],
        [
          1536751500000,
          42
        ],
        [
          1536751800000,
          37
        ],
        [
          1536752100000,
          44
        ],
        [
          1536752400000,
          44
        ],
        [
          1536752700000,
          39
        ],
        [
          1536753000000,
          41
        ],
        [
          1536753300000,
          37
        ],
        [
          1536753600000,
          43
        ]
      ]
    },
    {
      "type": "column",
      "yAxis": 1,
      "zIndex": -1,
      "name": "Max memory",
      "data": [
        [
          1536746400000,
          152500000000
        ],
        [
          1536746700000,
          152500000000
        ],
        [
          1536747000000,
          152500000000
        ],
        [
          1536747300000,
          152500000000
        ],
        [
          1536747600000,
          152500000000
        ],
        [
          1536747900000,
          139500000000
        ],
        [
          1536748200000,
          139500000000
        ],
        [
          1536748500000,
          139500000000
        ],
        [
          1536748800000,
          152500000000
        ],
        [
          1536749100000,
          152500000000
        ],
        [
          1536749400000,
          152500000000
        ],
        [
          1536749700000,
          152500000000
        ],
        [
          1536750000000,
          152500000000
        ],
        [
          1536750300000,
          152500000000
        ],
        [
          1536750600000,
          152500000000
        ],
        [
          1536750900000,
          152500000000
        ],
        [
          1536751200000,
          152500000000
        ],
        [
          1536751500000,
          152500000000
        ],
        [
          1536751800000,
          152500000000
        ],
        [
          1536752100000,
          152500000000
        ],
        [
          1536752400000,
          152500000000
        ],
        [
          1536752700000,
          152500000000
        ],
        [
          1536753000000,
          152500000000
        ],
        [
          1536753300000,
          152500000000
        ],
        [
          1536753600000,
          152500000000
        ]
      ]
    }
  ];
}

// tslint:enable:no-magic-numbers
