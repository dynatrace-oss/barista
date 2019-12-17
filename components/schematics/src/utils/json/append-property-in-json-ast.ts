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

import { JsonAstObject, JsonValue } from '@angular-devkit/core';
import { UpdateRecorder } from '@angular-devkit/schematics';
import { buildIndent } from './build-indent';

export function appendPropertyInJsonAst(
  recorder: UpdateRecorder,
  node: JsonAstObject,
  propertyName: string,
  value: JsonValue,
  indent: number,
): void {
  const indentStr = buildIndent(indent);

  if (node.properties.length > 0) {
    // Insert comma.
    const last = node.properties[node.properties.length - 1];
    recorder.insertRight(
      last.start.offset + last.text.replace(/\s+$/, '').length,
      ',',
    );
  }

  recorder.insertLeft(
    node.end.offset - 1,
    '  ' +
      `"${propertyName}": ${JSON.stringify(value, null, 2).replace(
        /\n/g,
        indentStr,
      )}` +
      indentStr.slice(0, -2),
  );
}
