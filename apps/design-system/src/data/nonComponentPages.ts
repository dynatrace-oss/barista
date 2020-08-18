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

// TOOD: `Pages` is the default data set for 11ty, we are not happy
// with the naming of this one, but went with it for now.
module.exports = async function () {
  const pagesResponse = await axios.get(
    `${process.env.STRAPI_ENDPOINT}/nextpages/`,
  );

  const pagesData = pagesResponse.data.filter(
    (page) => page.category === null || page.category.title !== 'Components',
  );

  return pagesData;
};
