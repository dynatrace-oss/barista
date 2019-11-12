// tslint:disable: no-require-imports no-var-requires

import { axeCheck, createReport } from 'axe-testcafe';

export interface Route {
  name: string;
  route: string;
}

export interface Routes {
  routes: Route[];
}

const baristaExamples = require('./routes.json');
const rules = require('./rules.a11y.json');
const BASEURL = `http://localhost:4200/`;

fixture('Barista Examples a11y');

baristaExamples.routes
  // run for now only default examples
  .filter(data => data.route.includes('default'))
  .forEach(data => {
    test.page(`${BASEURL}${data.route}`)(
      data.name,
      async (testController: TestController) => {
        const axeContext = { include: [['.main']] };
        const check = await axeCheck(testController, axeContext, rules);

        await testController
          .expect(check.violations.length === 0)
          .ok(createReport(check.violations));
      },
    );
  });
