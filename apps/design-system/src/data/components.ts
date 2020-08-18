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

import { resolve } from 'path';
import { sync } from 'glob';
import { readFileSync } from 'fs';
import axios from 'axios';
import matter from 'gray-matter';

module.exports = async function () {
  const componentPagesResponse = await axios.get(
    `${process.env.STRAPI_ENDPOINT}/nextpages/?category.title=Components`,
  );
  const componentPagesData = componentPagesResponse.data;
  const readmeFiles = sync('libs/fluid-elements/**/README.md');

  const fullPaths = readmeFiles.map((file) =>
    resolve(`${process.env.ELEVENTY_ROOT_DIR}`, file),
  );

  for (const filePath of fullPaths) {
    const fileContent = readFileSync(filePath, {
      encoding: 'utf-8',
    });
    const parsedContent = matter(fileContent);

    const linkedComponent = componentPagesData.find(
      (page) => page.id === parsedContent.data.strapiPageID,
    );
    if (linkedComponent) {
      linkedComponent.readmeContent = parsedContent.content;
    }
  }

  return componentPagesData;
};
