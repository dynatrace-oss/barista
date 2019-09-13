import { join } from 'path';

import { AxeBuilder } from 'axe-webdriverjs';
import { sync as glob } from 'glob';
import { WebDriver, browser } from 'protractor';

import { buildConfig } from '../tools/gulp/build-config';
import {
  generateRouteMetadata,
  getExampleMetadata,
} from '../tools/gulp/util/examples-metadata';
import * as rules from './rules.config.json';
import { validationMatcher } from './validationResponseBuilder/validationMatcher';

const SEARCH_QUERY = 'default';

const axeBuilder: {
  (driver: WebDriver): AxeBuilder;
  new (driver: WebDriver): AxeBuilder;
  // tslint:disable-next-line: no-var-requires no-require-imports
} = require('axe-webdriverjs');

// Get the Paths for components
const { examplesDir } = buildConfig;
const metadata = getExampleMetadata(glob(join(examplesDir, '*/*.ts')));
const routeMetadata = generateRouteMetadata(metadata);

// Test every "default" components a11y
routeMetadata
  .reduce(
    (previousValue, currentValue) => [
      ...previousValue,
      ...currentValue.examples.map(routePath => ({ path: routePath.route })),
    ],
    [],
  )
  .filter(route => route.path.includes(SEARCH_QUERY))
  .forEach(route => {
    describe(route.path, () => {
      beforeEach(async () => {
        await browser.get(`/${route.path}`);
        jasmine.addMatchers(validationMatcher);
      });

      it('should have no accessibility violations', done => {
        axeBuilder(browser.driver)
          .configure(rules)
          .analyze((err, result) => {
            if (err) {
              throw new Error(err.message);
            }
            result.violations.forEach(violation => {
              // tslint:disable-next-line: no-any
              (expect(violation) as any).toBeValid();
            });
            done();
          });
      });
    });
  });
