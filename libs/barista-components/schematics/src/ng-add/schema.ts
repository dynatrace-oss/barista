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

export interface Schema {
  /** Name of the project where the Barista Components should be set up. */
  project: string;
  /** Whether Angular browser animations should be set up. */
  animations?: boolean;
  /** Whether to set up global typography styles. */
  typography?: boolean;
  /** The path to the NgModule where the imports will be registered */
  module?: string;
  /** Skip the install of the dependencies from the package.json */
  skipInstall?: boolean;
}

/** Schema with extended options that are needed for different rules */
export interface ExtendedSchema extends Schema {
  componentsVersion: string;
  peerDependencies: { [key: string]: string };
  migration: boolean;
}
