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
import { renderComment } from '../utils';
import { generateHeaderNoticeComment } from '../../../shared';
import { ImmutableStyleMap, Prop } from 'theo';

/**
 * Generate a scss typography mixin for the typography set.
 */
function generateScssMixinForProp(prop: Prop): string {
  return `
${renderComment(prop)}
@mixin fluid-${prop.getIn(['meta', 'mixinName'])}() {
  font-family: ${prop.getIn(['value', 'fontFamily'])};
  font-size: ${prop.getIn(['value', 'fontSize'])};
  font-weight: ${prop.getIn(['value', 'fontWeight'])};
  line-height: ${prop.getIn(['value', 'lineHeight'])};
  text-transform: ${prop.getIn(['value', 'textTransform'])};
}
`;
}

/** Generates a mixin for all defined tokens within in scss format. */
export function dtDesignTokensScssTypographyConverter(
  results: ImmutableStyleMap,
): string {
  return [
    generateHeaderNoticeComment(),
    '\n',
    ...results.get('props').map(generateScssMixinForProp).toJS(),
  ].join('\n');
}
