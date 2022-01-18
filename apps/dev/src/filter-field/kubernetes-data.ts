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

export const KUBERNETES_DATA = {
  autocomplete: [
    {
      name: 'Kubernetes Labels',
      options: [
        {
          name: 'beta.kubernetes.io/arch',
          value: 'beta.kubernetes.io/arch',
          autocomplete: ['amd64', 'amd32'],
          distinct: true,
        },
        {
          name: 'beta.kubernetes.io/os',
          value: 'beta.kubernetes.io/os',
          autocomplete: ['linux', 'windows'],
          distinct: true,
        },
        {
          name: 'node-role.kubernetes.io/master (simple label)',
          value: 'node-role.kubernetes.io/master',
        },
      ],
    },
    {
      name: 'Node',
      options: [
        {
          name: 'Custom Simple Option',
        },
        {
          name: 'Node Label',
          key: 'MyKey',
          unique: true,
          suggestions: ['some cool', 'very weird'],
        },
      ],
    },
  ],
};
