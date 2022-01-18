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

import {
  BuilderContext,
  targetFromTargetString,
} from '@angular-devkit/architect';
import { join } from 'path';
import { BaristaBuildBuilderSchema } from '../schema';

export async function scheduleBuilds(
  options: BaristaBuildBuilderSchema,
  context: BuilderContext,
): Promise<string> {
  const browserTarget = targetFromTargetString(options.browserTarget);
  const serverTarget = targetFromTargetString(options.serverTarget);

  const browserTargetRun = await context.scheduleTarget(browserTarget, {
    watch: false,
  });
  const serverTargetRun = await context.scheduleTarget(serverTarget, {
    watch: false,
  });

  const [browserResult, serverResult] = await Promise.all([
    browserTargetRun.result,
    serverTargetRun.result,
  ]);

  const success =
    browserResult.success &&
    serverResult.success &&
    browserResult.baseOutputPath !== undefined;
  const error = browserResult.error || (serverResult.error as string);

  if (!success) {
    throw Error(error);
  }

  context.logger.info(`✅ Successfully build Frontend and backend!`);

  await Promise.all([browserTargetRun.stop(), serverTargetRun.stop()]);

  return join(`${serverResult.outputPath}`, 'main.js');
}
