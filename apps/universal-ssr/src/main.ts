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

import 'zone.js/dist/zone-node';
import 'reflect-metadata';
import { ngExpressEngine } from '@nguniversal/express-engine';

import * as express from 'express';
import { provideModuleMap } from '@nguniversal/module-map-ngfactory-loader';

const {
  AppServerModuleNgFactory,
  LAZY_MODULE_MAP,
} = require('dist/apps/universal-server/main.js');

const app = express();

app.engine(
  'html',
  ngExpressEngine({
    bootstrap: AppServerModuleNgFactory,
    providers: [provideModuleMap(LAZY_MODULE_MAP)],
  }) as any,
);

app.set('view engine', 'html');

app.get(
  '*.*',
  express.static('dist/apps/universal/', {
    maxAge: '1y',
  }),
);

app.get('/', (req: express.Request, res: express.Response) => {
  res.render('../dist/apps/universal/index', {
    req,
    res,
  });
});

app.listen(9000, () => {
  console.log(
    `Angular Universal Node Express server listening on http://localhost:9000`,
  );
});
