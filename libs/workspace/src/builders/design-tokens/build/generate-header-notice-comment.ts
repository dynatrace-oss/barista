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

export const generateHeaderNoticeComment = (
  commentStart = '/*',
  commentLine = '*',
  commentEnd = '*/',
) => `${commentStart}
${commentLine} THIS FILE IS GENERATED BASED ON THE DESIGN TOKENS DEFINED IN THE src/**.yml
${commentLine} FILES, DO NOT CHANGE MANUALLY.
${commentLine} TO GENERATE THESE FILES RUN \`ng build shared-design-tokens\`
${commentEnd}
`;
