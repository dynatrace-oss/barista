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

import { Architect } from '@angular-devkit/architect';
import { TestingArchitectHost } from '@angular-devkit/architect/testing';
import { schema } from '@angular-devkit/core';
import { join } from 'path';
import { of } from 'rxjs';
import { BaristaBuildBuilderSchema } from './schema';

// Mocked imports
import * as devkitArchitect from '@angular-devkit/architect';
import * as render from './prerender/render-routes';

const options: BaristaBuildBuilderSchema = {
  devServerTarget: 'barista-design-system:render:production',
  outputPath: '',
};

describe('Barista Builder', () => {
  let architect: Architect;
  let architectHost: TestingArchitectHost;
  let renderSpy: jest.SpyInstance<Promise<number>>;

  beforeEach(async () => {
    const registry = new schema.CoreSchemaRegistry();
    registry.addPostTransform(schema.transforms.addUndefinedDefaults);

    architectHost = new TestingArchitectHost('/root', '/root');
    architect = new Architect(architectHost, registry);

    await architectHost.addBuilderFromPackage(join(__dirname, '../../..'));
    // mock the render Routes to test it separately
    renderSpy = jest
      .spyOn(render, 'renderRoutes')
      .mockImplementation(async () => 10);

    // mock the dev server
    (devkitArchitect as any).scheduleTargetAndForget = jest
      .fn()
      .mockReturnValue(
        of({
          success: true,
          baseUrl: 'http://localhost:4200',
        }),
      );
  });

  it('can run successfully', async () => {
    // A "run" can have multiple outputs, and contains progress information.
    const run = await architect.scheduleBuilder(
      '@dynatrace/workspace:build-barista',
      options,
    );

    // The "result" member (of type BuilderOutput) is the next output.
    const output = await run.result;

    // Stop the builder from running. This stops Architect from keeping
    // the builder-associated states in memory, since builders keep waiting
    // to be scheduled.
    await run.stop();

    // Expect that the builder succeeded
    expect(output.success).toBe(true);
    expect(renderSpy).toHaveBeenCalledTimes(1);
    expect(renderSpy).toHaveBeenCalledWith(
      expect.objectContaining({
        baseURL: 'http://localhost:4200',
      }),
    );
  });
});
