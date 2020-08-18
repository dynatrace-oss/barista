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

import axios from 'axios';

module.exports = async function () {
  const componentPagesResponse = await axios.get(
    `${process.env.STRAPI_ENDPOINT}/nextpages/?category.title=Components`,
  );
  const componentPagesData = componentPagesResponse.data;

  const groups: any[] = [];
  for (const page of componentPagesData) {
    if (!groups.some(({ title }) => title === page.group)) {
      groups.push({ title: page.group, items: [] });
    }
    const group = groups.find(({ title }) => title === page.group);
    group.items.push({ title: page.title, link: page.slug });
  }
  return groups;
};
