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

import { Format } from 'theo';

/** Alias value definition. */
export interface DesignTokenAliasValue {
  /** Define the value of an alias */
  value: string;
  /** Any other metadata for the alias */
  [other: string]: any;
}

/** Definitions for design token props.. */
export interface DesignTokenProp {
  /** Define the name of a given prop */
  name: string;

  /** Define the value of a given prop */
  value: string | { [key: string]: string };

  /** Any metadata that wants to be added */
  meta?: { [key: string]: any };
}

/** Available output formatters. */
export type DesignTokenFormatters =
  | Format
  | 'dt-typescript'
  | 'dt-typescript-theme'
  | 'dt-scss'
  | 'dt-scss-fonts'
  | 'dt-scss-theme';

/** Definitions for design token output. */
export interface DesignTokenOutputs {
  /** Output file extension type. */
  type: 'scss' | 'css' | 'ts';

  /** Used formatter for this file. */
  formatter: DesignTokenFormatters;
}

/** Defines the source structure of the design token yaml files. */
export interface DesignTokenSource {
  /** Import references for this file */
  imports?: string[];

  /** Defined aliases for this source file. */
  aliases?: { [key: string]: string | DesignTokenAliasValue };

  /** Defined props for this source file. */
  props?: { [key: string]: DesignTokenProp } | DesignTokenProp[];

  /** Global settings */
  global?: {
    category?: string;
    type?: string;
    meta?: { [key: string]: any };
  };

  outputs?: DesignTokenOutputs[];
}
