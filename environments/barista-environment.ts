/**
 * @license
 * Copyright 2022 Dynatrace LLC
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

import { BaEnvironment } from './barista-environment.interface';
import { config as dotenvConfig } from 'dotenv';

dotenvConfig();

const {
  PUBLIC_BUILD,
  STRAPI_ENDPOINT: strapiEndpoint,
  INTERNAL_LINKS: internalLinks,
} = process.env;

const isPublicBuild = PUBLIC_BUILD !== 'false';

const iconChangelogName = `CHANGELOG${isPublicBuild ? '-public' : ''}.json`;

export const environment: BaEnvironment = {
  rootDir: './',
  distDir: './dist/barista-data',
  examplesMetadataFileName: 'examples-metadata.json',
  examplesLibDir: './libs/examples/src',
  shareableExamplesToolsDir: './libs/tools/shareable-examples/src',
  demosAppDir: './apps/demos/src',
  baristaAppDir: './apps/barista-design-system/src',
  iconsRoot: './node_modules/@dynatrace/barista-icons',
  /** Path to the icons changelog relative to the icons root directory. */
  iconsChangelogFileName: `../barista-icons/_build/barista-icons/_templates/${iconChangelogName}`,
  /** URL/IP where the Strapi CMS is located. */
  strapiEndpoint,
  /** Parts of internal URLs that should be removed on public build. */
  internalLinks,
};
