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

import { NestFactory } from '@nestjs/core';
import { Logger } from '@nestjs/common';

import { AppModule } from './app/app.module';
import { environment } from './environments/environment';

const GLOBAL_PREFIX = environment.globalPrefix;
const PORT = environment.serverPort;

async function bootstrap(): Promise<void> {
  const app = await NestFactory.create(AppModule);
  app.setGlobalPrefix(GLOBAL_PREFIX);
  await app.listen(PORT, () => {
    console.log('Listening at http://localhost:' + PORT + '/' + GLOBAL_PREFIX);
  });
}

bootstrap()
  .then(() => {
    Logger.log(
      `[BARISTA-BACKEND] Server listening at http://localhost:${PORT}/${GLOBAL_PREFIX}`,
    );
  })
  .catch(error => {
    Logger.error(error);
  });
