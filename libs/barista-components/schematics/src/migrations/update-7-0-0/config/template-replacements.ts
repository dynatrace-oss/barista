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

import { TemplateReplacementList } from '../rules';
import { replaceHtmlAttribute } from '../utils/replace-html-attribute';

export const TEMPLATE_REPLACEMENTS: TemplateReplacementList[] = [
  {
    needle: 'aria-label-close',
    replacement: (content) =>
      replaceHtmlAttribute(
        'aria-label-close',
        'ariaLabelClose',
        ['dt-chart-timestamp', 'dt-chart-range'],
        content,
      ),
  },
  {
    needle: 'aria-label-close-button',
    replacement: (content) =>
      replaceHtmlAttribute(
        'aria-label-close-button',
        'ariaLabelClose',
        ['dt-context-dialog'],
        content,
      ),
  },
  {
    needle: 'aria-label-left-handle',
    replacement: (content) =>
      replaceHtmlAttribute(
        'aria-label-left-handle',
        'ariaLabelLeftHandle',
        ['dt-chart-range'],
        content,
      ),
  },
  {
    needle: 'aria-label-right-handle',
    replacement: (content) =>
      replaceHtmlAttribute(
        'aria-label-right-handle',
        'ariaLabelRightHandle',
        ['dt-chart-range'],
        content,
      ),
  },
  {
    needle: 'aria-label-selected-area',
    replacement: (content) =>
      replaceHtmlAttribute(
        'aria-label-selected-area',
        'ariaLabelSelectedArea',
        ['dt-chart-range'],
        content,
      ),
  },
  {
    needle: 'aria-label-selected',
    replacement: (content) =>
      replaceHtmlAttribute(
        'aria-label-selected',
        'ariaLabelSelected',
        ['dt-chart-timestamp'],
        content,
      ),
  },
  {
    needle: 'aria-label-current',
    replacement: (content) =>
      replaceHtmlAttribute(
        'aria-label-current',
        'ariaLabelCurrent',
        ['dt-pagination'],
        content,
      ),
  },
  {
    needle: 'aria-label-page',
    replacement: (content) =>
      replaceHtmlAttribute(
        'aria-label-page',
        'ariaLabelPage',
        ['dt-pagination'],
        content,
      ),
  },
  {
    needle: 'aria-label-ellipses',
    replacement: (content) =>
      replaceHtmlAttribute(
        'aria-label-ellipses',
        'ariaLabelEllipsis',
        ['dt-pagination'],
        content,
      ),
  },
  {
    needle: 'aria-label-next',
    replacement: (content) =>
      replaceHtmlAttribute(
        'aria-label-next',
        'ariaLabelNext',
        ['dt-pagination'],
        content,
      ),
  },
  {
    needle: 'aria-label-previous',
    replacement: (content) =>
      replaceHtmlAttribute(
        'aria-label-previous',
        'ariaLabelPrevious',
        ['dt-pagination'],
        content,
      ),
  },
  {
    needle: 'aria-label-cancel',
    replacement: (content) =>
      replaceHtmlAttribute(
        'aria-label-cancel',
        'ariaLabelCancel',
        ['dt-inline-editor'],
        content,
      ),
  },
  {
    needle: 'aria-label-save',
    replacement: (content) =>
      replaceHtmlAttribute(
        'aria-label-save',
        'ariaLabelSave',
        ['dt-inline-editor'],
        content,
      ),
  },
  {
    needle: '[aria-label]=',
    replacement: (content) =>
      replaceHtmlAttribute(
        '[aria-label]',
        '[attr.aria-label]',
        [
          'dt-breadcrumbs',
          'dt-menu',
          'dt-consumption-icon',
          'dt-tree-table',
          'dt-secondary-nav',
        ],
        content,
      ),
  },
  {
    needle: 'dt-breadcrumbs-item',
    replacement: (content) => {
      const regex = new RegExp(
        /<dt-breadcrumbs-item[\s\S]*?<\/dt-breadcrumbs-item>/gm,
      );

      return content.replace(regex, (match) => {
        return match
          .replace(/dt-breadcrumbs-item/gm, 'a')
          .replace('<a', '<a dtBreadcrumbsItem');
      });
    },
  },
  {
    needle: 'dt-table-empty-state',
    replacement: (content) => {
      // https://regex101.com/r/TfPzqw/1
      const regex = new RegExp(
        /(<dt-table-empty-state[\s\S]*?>)([\s\S]*?)(<\/dt-table-empty-state>)/gm,
      );
      return content.replace(regex, (_, ...matchingGroups) => {
        const [openTag, tagContent, endTag] = matchingGroups;
        return (
          openTag.replace('dt-table-empty-state', 'dt-empty-state') +
          `<dt-empty-state-item>\n${tagContent}\n</dt-empty-state-item>` +
          endTag.replace('dt-table-empty-state', 'dt-empty-state')
        );
      });
    },
  },
  {
    needle: 'dt-table-empty-state-title',
    replacement: 'dt-empty-state-item-title',
  },
  {
    needle: 'dt-table-empty-state-message',
    replacement: (content) => {
      // https://regex101.com/r/TfPzqw/3
      const regex = new RegExp(
        /(<dt-table-empty-state-message([\s\S]*?)>)([\s\S]*?)(<\/dt-table-empty-state-message>)/gm,
      );
      return content.replace(regex, (_, ...matchingGroups) => {
        const [openTag, attributes, tagContent, endTag] = matchingGroups;

        // If there are some attributes like directives or ngif on the container
        // wrap it in an ng-container
        if (attributes.length > 0) {
          return (
            openTag.replace('dt-table-empty-state-message', 'ng-container') +
            tagContent +
            endTag.replace('dt-table-empty-state-message', 'ng-container')
          );
        }
        return tagContent;
      });
    },
  },
  {
    needle: 'dt-table-empty-state-image',
    replacement: 'dt-empty-state-item-img',
  },
];
