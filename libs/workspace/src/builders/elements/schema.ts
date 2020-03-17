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

/** The options that can be used with the elements builder */
export interface ElementsOptions {
  /** The path to the package.json used for the release. */
  releasePackageJson: string;
  /** The tag within the nx projects that is included for this build. */
  buildTag?: string;
  /** The path where the elements target should built to. */
  outputPath: string;
}
