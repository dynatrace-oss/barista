import 'zone.js/dist/zone-node';
import 'reflect-metadata';

import * as express from 'express';

import { ngExpressEngine } from '@nguniversal/express-engine';

const {
  AppServerModuleNgFactory,
} = require('dist/apps/universal-server/main.js');

const app = express();

app.engine(
  'html',
  ngExpressEngine({
    bootstrap: AppServerModuleNgFactory,
  }),
);

app.set('view engine', 'html');

app.get(
  '*.*',
  express.static('dist/apps/universal/', {
    maxAge: '1y',
  }),
);

app.get('/', (req: Request, res: any) => {
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
