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

// TODO: Remove once the app can be served with bazel
// This main entry point is used to launch the app under the
// @angular-devkit/build-angular, which is the default CLI
// builder. Note that for AOT, the CLI will magically replace
// the bootstrap by switching platform-browser-dynamic with
// platform-browser.
// This file is completely unused in the Bazel build.
import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';

import { DtE2EAppModule } from './app/app.module';

platformBrowserDynamic()
  .bootstrapModule(DtE2EAppModule)
  .catch((err) => console.error(err));
