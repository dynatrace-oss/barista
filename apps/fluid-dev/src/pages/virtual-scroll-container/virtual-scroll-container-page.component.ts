/**
 * @license
 * Copyright 2020 Dynatrace LLC
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
import { Component } from '@angular/core';

import '@dynatrace/fluid-elements/button';
import '@dynatrace/fluid-elements/virtual-scroll-container';
import { html, nothing, TemplateResult } from 'lit-html';
import { unsafeHTML } from 'lit-html/directives/unsafe-html.js';

const hosts = [
  'et-demo-2-win4',
  'et-demo-2-win3',
  'docker-host1',
  'docker-host2',
  'et-demo-2-win1',
  'et-demo-2-win8',
  'et-demo-2-macOS',
  'kyber-host2',
  'kyber-host6',
  'dev-demo-5-macOS',
];

const MAX_ROWS = 5000;

type Node = {
  host: string;
  cpu: string;
  memory: string;
  traffic: string;
};

@Component({
  selector: 'fluid-virtual-scroll-container-page',
  templateUrl: 'virtual-scroll-container-page.component.html',
  styleUrls: ['virtual-scroll-container-page.component.scss'],
})
export class FluidVirtualScrollContainerPage {
  items1 = [
    { title: `item01`, subtitle: `item01 subtitle` },
    { title: `item02`, subtitle: `item02 subtitle` },
    { title: `item03`, subtitle: `item03 subtitle` },
    { title: `item04`, subtitle: `item04 subtitle`, subsub: `something else` },
    { title: `item05`, subtitle: `item05 subtitle` },
    { title: `item06`, subtitle: `item06 subtitle`, subsub: `something else` },
    { title: `item07`, subtitle: `item07 subtitle`, subsub: `something else` },
    { title: `item08`, subtitle: `item08 subtitle`, subsub: `something else` },
    { title: `item09`, subtitle: `item09 subtitle` },
    { title: `item10`, subtitle: `item10 subtitle` },
    { title: `item11`, subtitle: `item11 subtitle`, subsub: `something else` },
    { title: `item12`, subtitle: `item12 subtitle`, subsub: `something else` },
    { title: `item13`, subtitle: `item13 subtitle` },
    { title: `item14`, subtitle: `item14 subtitle` },
    { title: `item15`, subtitle: `item15 subtitle` },
    { title: `item16`, subtitle: `item16 subtitle` },
    { title: `item17`, subtitle: `item17 subtitle`, subsub: `something else` },
    { title: `item18`, subtitle: `item18 subtitle` },
    { title: `item19`, subtitle: `item19 subtitle`, subsub: `something else` },
    { title: `item20`, subtitle: `item20 subtitle` },
    { title: `item21`, subtitle: `item21 subtitle` },
    {
      title: `item22`,
      subtitle: `item22 subtitle`,
      subsub: `<br><br><br>very high item`,
    },
    { title: `item23`, subtitle: `item23 subtitle` },
    { title: `item24`, subtitle: `item24 subtitle` },
    { title: `item25`, subtitle: `item25 subtitle` },
    { title: `item26`, subtitle: `item26 subtitle` },
    { title: `item27`, subtitle: `item27 subtitle`, subsub: `something else` },
    { title: `item28`, subtitle: `item28 subtitle` },
    { title: `item29`, subtitle: `item29 subtitle`, subsub: `something else` },
    { title: `item30`, subtitle: `item30 subtitle`, subsub: `something else` },
    { title: `item31`, subtitle: `item31 subtitle`, subsub: `something else` },
    { title: `item32`, subtitle: `item32 subtitle` },
    { title: `item33`, subtitle: `item33 subtitle` },
    {
      title: `item34`,
      subtitle: `item34 subtitle`,
      subsub: `<br><br><br>very high item`,
    },
    { title: `item35`, subtitle: `item35 subtitle` },
    { title: `item36`, subtitle: `item36 subtitle` },
    { title: `item37`, subtitle: `item37 subtitle` },
    {
      title: `item38`,
      subtitle: `item38 subtitle`,
      subsub: `<br><br><br>very high item`,
    },
    {
      title: `item39`,
      subtitle: `item39 subtitle`,
      subsub: `<br><br><br>very high item`,
    },
    { title: `item40`, subtitle: `item40 subtitle` },
    { title: `item41`, subtitle: `item41 subtitle` },
    { title: `item42`, subtitle: `item42 subtitle` },
    { title: `item43`, subtitle: `item43 subtitle`, subsub: `something else` },
    { title: `item44`, subtitle: `item44 subtitle` },
    { title: `item45`, subtitle: `item45 subtitle`, subsub: `something else` },
    { title: `item46`, subtitle: `item46 subtitle` },
    { title: `item47`, subtitle: `item47 subtitle` },
    { title: `item48`, subtitle: `item48 subtitle` },
    {
      title: `item49`,
      subtitle: `item49 subtitle`,
      subsub: `<br><br><br>very high item`,
    },
    { title: `item50`, subtitle: `item50 subtitle` },
    { title: `item51`, subtitle: `item51 subtitle` },
    {
      title: `item52`,
      subtitle: `item52 subtitle`,
      subsub: `<br><br><br>very high item`,
    },
    {
      title: `item53`,
      subtitle: `item53 subtitle`,
      subsub: `<br><br><br>very high item`,
    },
    { title: `item54`, subtitle: `item54 subtitle`, subsub: `something else` },
    { title: `item55`, subtitle: `item55 subtitle` },
    { title: `item56`, subtitle: `item56 subtitle` },
    { title: `item57`, subtitle: `item57 subtitle` },
    { title: `item58`, subtitle: `item58 subtitle` },
    { title: `item59`, subtitle: `item59 subtitle`, subsub: `something else` },
    { title: `item60`, subtitle: `item60 subtitle` },
    { title: `item61`, subtitle: `item61 subtitle`, subsub: `something else` },
    { title: `item62`, subtitle: `item62 subtitle` },
    { title: `item63`, subtitle: `item63 subtitle` },
    { title: `item64`, subtitle: `item64 subtitle`, subsub: `something else` },
    { title: `item65`, subtitle: `item65 subtitle`, subsub: `something else` },
    { title: `item66`, subtitle: `item66 subtitle` },
    { title: `item67`, subtitle: `item67 subtitle` },
    { title: `item68`, subtitle: `item68 subtitle`, subsub: `something else` },
    { title: `item69`, subtitle: `item69 subtitle` },
    { title: `item70`, subtitle: `item70 subtitle` },
    { title: `item71`, subtitle: `item71 subtitle` },
    { title: `item72`, subtitle: `item72 subtitle` },
    { title: `item73`, subtitle: `item73 subtitle` },
    { title: `item74`, subtitle: `item74 subtitle` },
    { title: `item75`, subtitle: `item75 subtitle`, subsub: `something else` },
    { title: `item76`, subtitle: `item76 subtitle` },
    { title: `item77`, subtitle: `item77 subtitle` },
    { title: `item78`, subtitle: `item78 subtitle`, subsub: `something else` },
    { title: `item79`, subtitle: `item79 subtitle`, subsub: `something else` },
    { title: `item80`, subtitle: `item80 subtitle` },
    { title: `item81`, subtitle: `item81 subtitle` },
    { title: `item82`, subtitle: `item82 subtitle`, subsub: `something else` },
    { title: `item83`, subtitle: `item83 subtitle` },
    { title: `item84`, subtitle: `item84 subtitle` },
    { title: `item85`, subtitle: `item85 subtitle` },
    { title: `item86`, subtitle: `item86 subtitle`, subsub: `something else` },
    { title: `item87`, subtitle: `item87 subtitle` },
    { title: `item88`, subtitle: `item88 subtitle` },
    {
      title: `item89`,
      subtitle: `item89 subtitle`,
      subsub: `<br><br><br>very high item`,
    },
    { title: `item90`, subtitle: `item90 subtitle` },
    { title: `item91`, subtitle: `item91 subtitle` },
    { title: `item92`, subtitle: `item92 subtitle`, subsub: `something else` },
    { title: `item93`, subtitle: `item93 subtitle`, subsub: `something else` },
    { title: `item94`, subtitle: `item94 subtitle` },
    { title: `item95`, subtitle: `item95 subtitle`, subsub: `something else` },
    { title: `item96`, subtitle: `item96 subtitle`, subsub: `something else` },
    { title: `item97`, subtitle: `item97 subtitle`, subsub: `something else` },
    { title: `item98`, subtitle: `item98 subtitle`, subsub: `something else` },
    { title: `item99`, subtitle: `item99 subtitle`, subsub: `something else` },
    { title: `item100`, subtitle: `item100 subtitle` },
    { title: `item101`, subtitle: `item101 subtitle` },
    { title: `item102`, subtitle: `item102 subtitle` },
    { title: `item103`, subtitle: `item103 subtitle` },
    {
      title: `item104`,
      subtitle: `item104 subtitle`,
      subsub: `something else`,
    },
    {
      title: `item105`,
      subtitle: `item105 subtitle`,
      subsub: `something else`,
    },
    { title: `item106`, subtitle: `item106 subtitle` },
    { title: `item107`, subtitle: `item107 subtitle` },
    { title: `item108`, subtitle: `item108 subtitle` },
    {
      title: `item109`,
      subtitle: `item109 subtitle`,
      subsub: `something else`,
    },
    { title: `item110`, subtitle: `item110 subtitle` },
    { title: `item111`, subtitle: `item111 subtitle` },
    { title: `item112`, subtitle: `item112 subtitle` },
    {
      title: `item113`,
      subtitle: `item113 subtitle`,
      subsub: `something else`,
    },
    {
      title: `item114`,
      subtitle: `item114 subtitle`,
      subsub: `something else`,
    },
    { title: `item115`, subtitle: `item115 subtitle` },
    {
      title: `item116`,
      subtitle: `item116 subtitle`,
      subsub: `something else`,
    },
    {
      title: `item117`,
      subtitle: `item117 subtitle`,
      subsub: `something else`,
    },
    {
      title: `item118`,
      subtitle: `item118 subtitle`,
      subsub: `something else`,
    },
    { title: `item119`, subtitle: `item119 subtitle` },
    { title: `item120`, subtitle: `item120 subtitle` },
    { title: `item121`, subtitle: `item121 subtitle` },
    { title: `item122`, subtitle: `item122 subtitle` },
    {
      title: `item123`,
      subtitle: `item123 subtitle`,
      subsub: `something else`,
    },
    { title: `item124`, subtitle: `item124 subtitle` },
    { title: `item125`, subtitle: `item125 subtitle` },
    {
      title: `item126`,
      subtitle: `item126 subtitle`,
      subsub: `<br><br><br>very high item`,
    },
    { title: `item127`, subtitle: `item127 subtitle` },
    {
      title: `item128`,
      subtitle: `item128 subtitle`,
      subsub: `something else`,
    },
    { title: `item129`, subtitle: `item129 subtitle` },
    { title: `item130`, subtitle: `item130 subtitle` },
    {
      title: `item131`,
      subtitle: `item131 subtitle`,
      subsub: `<br><br><br>very high item`,
    },
    { title: `item132`, subtitle: `item132 subtitle` },
    { title: `item133`, subtitle: `item133 subtitle` },
    {
      title: `item134`,
      subtitle: `item134 subtitle`,
      subsub: `<br><br><br>very high item`,
    },
    {
      title: `item135`,
      subtitle: `item135 subtitle`,
      subsub: `something else`,
    },
    { title: `item136`, subtitle: `item136 subtitle` },
    { title: `item137`, subtitle: `item137 subtitle` },
    { title: `item138`, subtitle: `item138 subtitle` },
    {
      title: `item139`,
      subtitle: `item139 subtitle`,
      subsub: `<br><br><br>very high item`,
    },
    { title: `item140`, subtitle: `item140 subtitle` },
    {
      title: `item141`,
      subtitle: `item141 subtitle`,
      subsub: `something else`,
    },
    {
      title: `item142`,
      subtitle: `item142 subtitle`,
      subsub: `something else`,
    },
    { title: `item143`, subtitle: `item143 subtitle` },
    {
      title: `item144`,
      subtitle: `item144 subtitle`,
      subsub: `something else`,
    },
    {
      title: `item145`,
      subtitle: `item145 subtitle`,
      subsub: `something else`,
    },
    { title: `item146`, subtitle: `item146 subtitle` },
    { title: `item147`, subtitle: `item147 subtitle` },
    { title: `item148`, subtitle: `item148 subtitle` },
    {
      title: `item149`,
      subtitle: `item149 subtitle`,
      subsub: `something else`,
    },
    { title: `item150`, subtitle: `item150 subtitle` },
    { title: `item151`, subtitle: `item151 subtitle` },
    {
      title: `item152`,
      subtitle: `item152 subtitle`,
      subsub: `something else`,
    },
    { title: `item153`, subtitle: `item153 subtitle` },
    { title: `item154`, subtitle: `item154 subtitle` },
    { title: `item155`, subtitle: `item155 subtitle` },
    { title: `item156`, subtitle: `item156 subtitle` },
    {
      title: `item157`,
      subtitle: `item157 subtitle`,
      subsub: `something else`,
    },
    { title: `item158`, subtitle: `item158 subtitle` },
    { title: `item159`, subtitle: `item159 subtitle` },
    { title: `item160`, subtitle: `item160 subtitle` },
    { title: `item161`, subtitle: `item161 subtitle` },
    {
      title: `item162`,
      subtitle: `item162 subtitle`,
      subsub: `something else`,
    },
    {
      title: `item163`,
      subtitle: `item163 subtitle`,
      subsub: `something else`,
    },
    { title: `item164`, subtitle: `item164 subtitle` },
    {
      title: `item165`,
      subtitle: `item165 subtitle`,
      subsub: `something else`,
    },
    { title: `item166`, subtitle: `item166 subtitle` },
    { title: `item167`, subtitle: `item167 subtitle` },
    { title: `item168`, subtitle: `item168 subtitle` },
    { title: `item169`, subtitle: `item169 subtitle` },
    { title: `item170`, subtitle: `item170 subtitle` },
    { title: `item171`, subtitle: `item171 subtitle` },
    {
      title: `item172`,
      subtitle: `item172 subtitle`,
      subsub: `something else`,
    },
    {
      title: `item173`,
      subtitle: `item173 subtitle`,
      subsub: `something else`,
    },
    { title: `item174`, subtitle: `item174 subtitle` },
    { title: `item175`, subtitle: `item175 subtitle` },
    {
      title: `item176`,
      subtitle: `item176 subtitle`,
      subsub: `something else`,
    },
    { title: `item177`, subtitle: `item177 subtitle` },
    {
      title: `item178`,
      subtitle: `item178 subtitle`,
      subsub: `something else`,
    },
    { title: `item179`, subtitle: `item179 subtitle` },
    { title: `item180`, subtitle: `item180 subtitle` },
    {
      title: `item181`,
      subtitle: `item181 subtitle`,
      subsub: `something else`,
    },
    { title: `item182`, subtitle: `item182 subtitle` },
    { title: `item183`, subtitle: `item183 subtitle` },
    {
      title: `item184`,
      subtitle: `item184 subtitle`,
      subsub: `something else`,
    },
    { title: `item185`, subtitle: `item185 subtitle` },
    { title: `item186`, subtitle: `item186 subtitle` },
    {
      title: `item187`,
      subtitle: `item187 subtitle`,
      subsub: `something else`,
    },
    {
      title: `item188`,
      subtitle: `item188 subtitle`,
      subsub: `something else`,
    },
    {
      title: `item189`,
      subtitle: `item189 subtitle`,
      subsub: `something else`,
    },
    {
      title: `item190`,
      subtitle: `item190 subtitle`,
      subsub: `something else`,
    },
    { title: `item191`, subtitle: `item191 subtitle` },
    { title: `item192`, subtitle: `item192 subtitle` },
    { title: `item193`, subtitle: `item193 subtitle` },
    { title: `item194`, subtitle: `item194 subtitle` },
    { title: `item195`, subtitle: `item195 subtitle` },
    { title: `item196`, subtitle: `item196 subtitle` },
    {
      title: `item197`,
      subtitle: `item197 subtitle`,
      subsub: `<br><br><br>very high item`,
    },
    {
      title: `item198`,
      subtitle: `item198 subtitle`,
      subsub: `<br><br><br>very high item`,
    },
    {
      title: `item199`,
      subtitle: `item199 subtitle`,
      subsub: `<br><br><br>very high item`,
    },
    {
      title: `item200`,
      subtitle: `item200 subtitle`,
      subsub: `<br><br><br>very high item`,
    },
    {
      title: `item201`,
      subtitle: `item201 subtitle`,
      subsub: `<br><br><br>very high item`,
    },
    { title: `item202`, subtitle: `item202 subtitle` },
    { title: `item203`, subtitle: `item203 subtitle` },
    { title: `item204`, subtitle: `item204 subtitle` },
    { title: `item205`, subtitle: `item205 subtitle` },
    { title: `item206`, subtitle: `item206 subtitle` },
    { title: `item207`, subtitle: `item207 subtitle` },
    { title: `item208`, subtitle: `item208 subtitle` },
    { title: `item209`, subtitle: `item209 subtitle` },
    {
      title: `item210`,
      subtitle: `item210 subtitle`,
      subsub: `something else`,
    },
    { title: `item211`, subtitle: `item211 subtitle` },
    { title: `item212`, subtitle: `item212 subtitle` },
    {
      title: `item213`,
      subtitle: `item213 subtitle`,
      subsub: `something else`,
    },
    { title: `item214`, subtitle: `item214 subtitle` },
    { title: `item215`, subtitle: `item215 subtitle` },
    { title: `item216`, subtitle: `item216 subtitle` },
    { title: `item217`, subtitle: `item217 subtitle` },
    { title: `item218`, subtitle: `item218 subtitle` },
    { title: `item219`, subtitle: `item219 subtitle` },
    { title: `item220`, subtitle: `item220 subtitle` },
    { title: `item221`, subtitle: `item221 subtitle` },
    { title: `item222`, subtitle: `item222 subtitle` },
    { title: `item223`, subtitle: `item223 subtitle` },
    { title: `item224`, subtitle: `item224 subtitle` },
    { title: `item225`, subtitle: `item225 subtitle` },
    { title: `item226`, subtitle: `item226 subtitle` },
    { title: `item227`, subtitle: `item227 subtitle` },
    { title: `item228`, subtitle: `item228 subtitle` },
    { title: `item229`, subtitle: `item229 subtitle` },
    { title: `item230`, subtitle: `item230 subtitle` },
    { title: `item231`, subtitle: `item231 subtitle` },
    { title: `item232`, subtitle: `item232 subtitle` },
    { title: `item233`, subtitle: `item233 subtitle` },
    { title: `item234`, subtitle: `item234 subtitle` },
    { title: `item235`, subtitle: `item235 subtitle` },
    { title: `item236`, subtitle: `item236 subtitle` },
    { title: `item237`, subtitle: `item237 subtitle` },
    { title: `item238`, subtitle: `item238 subtitle` },
    { title: `item239`, subtitle: `item239 subtitle` },
    { title: `item240`, subtitle: `item240 subtitle` },
    { title: `item241`, subtitle: `item241 subtitle` },
    { title: `item242`, subtitle: `item242 subtitle` },
    { title: `item243`, subtitle: `item243 subtitle` },
    { title: `item244`, subtitle: `item244 subtitle` },
    { title: `item245`, subtitle: `item245 subtitle` },
    { title: `item246`, subtitle: `item246 subtitle` },
    { title: `item247`, subtitle: `item247 subtitle` },
    { title: `item248`, subtitle: `item248 subtitle` },
    { title: `item249`, subtitle: `item249 subtitle` },
    { title: `item250`, subtitle: `item250 subtitle` },
    { title: `item251`, subtitle: `item251 subtitle` },
    { title: `item252`, subtitle: `item252 subtitle` },
    { title: `item253`, subtitle: `item253 subtitle` },
    { title: `item254`, subtitle: `item254 subtitle` },
    { title: `item255`, subtitle: `item255 subtitle` },
    { title: `item256`, subtitle: `item256 subtitle` },
    { title: `item257`, subtitle: `item257 subtitle` },
    { title: `item258`, subtitle: `item258 subtitle` },
    { title: `item259`, subtitle: `item259 subtitle` },
    { title: `item260`, subtitle: `item260 subtitle` },
    { title: `item261`, subtitle: `item261 subtitle` },
    { title: `item262`, subtitle: `item262 subtitle` },
    { title: `item263`, subtitle: `item263 subtitle` },
    { title: `item264`, subtitle: `item264 subtitle` },
    { title: `item265`, subtitle: `item265 subtitle` },
    { title: `item266`, subtitle: `item266 subtitle` },
    { title: `item267`, subtitle: `item267 subtitle` },
    { title: `item268`, subtitle: `item268 subtitle` },
    { title: `item269`, subtitle: `item269 subtitle` },
    { title: `item270`, subtitle: `item270 subtitle` },
    { title: `item271`, subtitle: `item271 subtitle` },
    { title: `item272`, subtitle: `item272 subtitle` },
    { title: `item273`, subtitle: `item273 subtitle` },
    { title: `item274`, subtitle: `item274 subtitle` },
    { title: `item275`, subtitle: `item275 subtitle` },
    { title: `item276`, subtitle: `item276 subtitle` },
    { title: `item277`, subtitle: `item277 subtitle` },
    { title: `item278`, subtitle: `item278 subtitle` },
    { title: `item279`, subtitle: `item279 subtitle` },
    { title: `item280`, subtitle: `item280 subtitle` },
    { title: `item281`, subtitle: `item281 subtitle` },
    { title: `item282`, subtitle: `item282 subtitle` },
    { title: `item283`, subtitle: `item283 subtitle` },
    { title: `item284`, subtitle: `item284 subtitle` },
    { title: `item285`, subtitle: `item285 subtitle` },
    { title: `item286`, subtitle: `item286 subtitle` },
    { title: `item287`, subtitle: `item287 subtitle` },
    { title: `item288`, subtitle: `item288 subtitle` },
    { title: `item289`, subtitle: `item289 subtitle` },
    { title: `item290`, subtitle: `item290 subtitle` },
    { title: `item291`, subtitle: `item291 subtitle` },
    { title: `item292`, subtitle: `item292 subtitle` },
    { title: `item293`, subtitle: `item293 subtitle` },
    { title: `item294`, subtitle: `item294 subtitle` },
    { title: `item295`, subtitle: `item295 subtitle` },
    { title: `item296`, subtitle: `item296 subtitle` },
    { title: `item297`, subtitle: `item297 subtitle` },
    { title: `item298`, subtitle: `item298 subtitle` },
    { title: `item299`, subtitle: `item299 subtitle` },
    { title: `item300`, subtitle: `item300 subtitle` },
  ];

  items2: Node[] = [];

  clearRows(): void {
    this.items2 = [];
  }

  fetchData(): void {
    setTimeout(() => {
      for (let i = 0; i < MAX_ROWS; i += 1) {
        this.items2.push({
          host: hosts[Math.floor(Math.random() * 10)],
          cpu: `${(Math.random() * 10).toFixed(2)} %`,
          memory: `${(Math.random() * 10).toFixed(2)} % of ${(
            Math.random() * 40
          ).toFixed(2)} GB`,
          traffic: `${(Math.random() * 100).toFixed(2)} Mbit/s`,
        });
      }

      this.items2 = [...this.items2];
    }, 500);
  }

  renderItemFn1(item: {
    title: string;
    subtitle: string;
    subsub: string;
  }): TemplateResult {
    return html`
      <style>
        .virtual-scroll-item {
          padding: 1rem;
          border-bottom: 1px dashed #4e4e4e;
        }

        h2,
        p {
          margin: 0;
        }
      </style>
      <h2>${item.title}</h2>
      <p>${item.subtitle}</p>
      ${item.subsub ? html`<p>${unsafeHTML(item.subsub)}</p>` : nothing}
    `;
  }

  trackByFn1(item: { title: string; subtitle: string }): string {
    return item.title;
  }

  renderItemFn2(item: Node): TemplateResult {
    return html`
      <style>
        .virtual-scroll-item {
          padding: 0.5rem;
        }
      </style>
      ${item.host}<br />
      ${item.cpu}<br />
      ${item.memory}<br />
      ${item.traffic}
    `;
  }

  trackByFn2(item: Node): string {
    return `${item.host}${item.cpu}${item.memory}`;
  }
}
