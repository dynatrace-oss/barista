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
import { createTestCaseSetup } from '../../testing';

export const migrationCollection = require.resolve('../../migration.json');

describe('v5 dynatrace angular components imports', () => {
  it('should update the styles imports and selectors correctly', async () => {
    const {
      runFixers,
      appTree,
      writeFile,
      removeTempDir,
    } = await createTestCaseSetup('update-5.0.0', migrationCollection, []);

    writeFile(
      'projects/lib-testing/src/global.scss',
      `@import 'normalize';
    @import 'component-toolkit';
    @import 'utils/animations';
    @import 'utils/mixin-helpers';
    @import 'utils/page-layout';

    $fonts-path: '/ruxit/cache/fonts';
    $fonts-dir: '/ruxit/cache/fonts';

    @import '~@dynatrace/angular-components/style/main';
    @import '~@dynatrace/angular-components/style/font-styles';

    html {
      /* APM-13030 */
      scroll-behavior: smooth;
    }

    body {
      /* APM-13030 */
      background-color: $BACKGROUND_COLOR_LIGHT;
    }`,
    );

    if (runFixers) {
      await runFixers();
    }

    expect(
      appTree.readContent('projects/lib-testing/src/global.scss'),
    ).toMatchSnapshot();

    removeTempDir();
  });

  it('should update deprecated mixin selectors', async () => {
    const {
      runFixers,
      appTree,
      writeFile,
      removeTempDir,
    } = await createTestCaseSetup('update-5.0.0', migrationCollection, []);

    writeFile(
      'projects/lib-testing/src/main.scss',
      `import '~@dynatrace/angular-components/styles/mixins'
@import '~@dynatrace/barista-components/style/font-styles';

.class1 {
  @include dt-card-actions-spacing();
  background: red;
}

.class7 {
  @include label-font();
  background: red;
}

.class2 {
  @include default-font();
  background: red;
}

.class3 {
  @include h1-font();
  background: red;
}

.class4 {
  @include h2-font();
  background: red;
}

.class5 {
  @include h3-font();
  background: red;
}

.class6 {
  @include code-font();
  background: red;
}

.class7 {
  @include label-font();
  background: red;
}
`,
    );

    if (runFixers) {
      await runFixers();
    }

    expect(
      appTree.readContent('projects/lib-testing/src/main.scss'),
    ).toMatchSnapshot();

    removeTempDir();
  });
});
