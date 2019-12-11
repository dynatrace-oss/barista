/**
 * @license
 * Copyright 2019 Dynatrace LLC
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
  /** Whether its a test environment */
  isTestEnv: boolean;

  /** Whether to install animationsmodule */
  animations: boolean;

  /** Which styles should be installed */
  stylesPack: boolean;

  /** Whether to install dynatrace iconpack */
  iconpack: boolean;

  /** Whether to setup angularJson */
  angularPathRefactor: boolean;
}
