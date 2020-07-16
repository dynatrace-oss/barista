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

import { generateHeaderNoticeComment, renderComment } from '../utils';
import { ImmutableStyleMap, Prop } from 'theo';

/**
 * Generate a css rule for typography.
 */
function generateCssSelectorForProp(prop: Prop): string {
  const sizeIdentifier = prop.getIn(['meta', 'sizeIdentifier']);
  const value = prop.get('value');
  return `
${renderComment(prop)}
.dt-m-${sizeIdentifier} {
  margin: ${value};
}
.dt-mx-${sizeIdentifier} {
  margin-left: ${value};
  margin-right: ${value};
}
.dt-my-${sizeIdentifier} {
  margin-top: ${value};
  margin-bottom: ${value};
}
.dt-mt-${sizeIdentifier} {
  margin-top: ${value};
}
.dt-mr-${sizeIdentifier} {
  margin-right: ${value};
}
.dt-mb-${sizeIdentifier} {
  margin-bottom: ${value};
}
.dt-ml-${sizeIdentifier} {
  margin-left: ${value};
}
.dt-p-${sizeIdentifier} {
  padding: ${value};
}
.dt-px-${sizeIdentifier} {
  padding-left: ${value};
  padding-right: ${value};
}
.dt-py-${sizeIdentifier} {
  padding-top: ${value};
  padding-bottom: ${value};
}
.dt-pt-${sizeIdentifier} {
  padding-top: ${value};
}
.dt-pr-${sizeIdentifier} {
  padding-right: ${value};
}
.dt-pb-${sizeIdentifier} {
  padding-bottom: ${value};
}
.dt-pl-${sizeIdentifier} {
  padding-left: ${value};
}
`;
}

/** Generates a mixin for all defined tokens within in scss format. */
export function dtDesignTokensCssSpacingConverter(
  results: ImmutableStyleMap,
): string {
  return [
    generateHeaderNoticeComment(),
    '\n',
    ...results.get('props').map(generateCssSelectorForProp).toJS(),
  ].join('\n');
}
