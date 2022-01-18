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

import { BaUxdNode } from '@dynatrace/shared/design-system/interfaces';
import { environment } from '@environments/barista-environment';
import { promises as fs } from 'fs';
import * as markdownIt from 'markdown-it';
import { join } from 'path';
import { BaStrapiContentType, BaStrapiDecisionGraphNode } from '../types';
import { fetchContentList } from '@dynatrace/shared/data-access-strapi';

const markdown = new markdownIt({
  html: true,
  typographer: false,
});

/** Generates data for the UX Decision Graph */
export async function uxDecisionGraphGenerator(
  distDir: string,
): Promise<never[] | undefined> {
  // Return here if no endpoint is given.
  if (!environment.strapiEndpoint) {
    console.log('No Strapi endpoint given.');
    return [];
  }

  const contentList = await fetchContentList<BaStrapiDecisionGraphNode>(
    BaStrapiContentType.UXDNodes,
    { publicContent: false },
    environment.strapiEndpoint,
  );

  const graphData: BaUxdNode[] = contentList.map((data) => ({
    id: data.id,
    start: data.start,
    tasknode: data.tasknode,
    order: data.order,
    text: markdown.render(data.text),
    path: data.path.map((pathData) => ({
      text: pathData.text,
      uxd_node: pathData.uxd_node.id,
    })),
  }));

  await fs.writeFile(
    join(distDir, 'uxdg-data.json'),
    JSON.stringify(graphData, null, 2),
    {
      flag: 'w', // "w" -> Create file if it does not exist
      encoding: 'utf8',
    },
  );
}
