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

import {
  JsonAstKeyValue,
  JsonAstObject,
  JsonValue,
} from '@angular-devkit/core';
import { UpdateRecorder } from '@angular-devkit/schematics';
import { appendPropertyInJsonAst } from './append-property-in-json-ast';
import { buildIndent } from './build-indent';

export function insertPropertyInJsonAst(
  recorder: UpdateRecorder,
  node: JsonAstObject,
  propertyName: string,
  value: JsonValue,
  indent: number,
): void {
  if (node.properties.length === 0) {
    appendPropertyInJsonAst(recorder, node, propertyName, value, indent);

    return;
  }

  // Find insertion info.
  let insertAfterProp: JsonAstKeyValue | null = null;
  let prev: JsonAstKeyValue | null = null;
  let isLastProp = false;
  const last = node.properties[node.properties.length - 1];
  for (const prop of node.properties) {
    if (prop.key.value > propertyName) {
      if (prev) {
        insertAfterProp = prev;
      }
      break;
    }
    if (prop === last) {
      isLastProp = true;
      insertAfterProp = last;
    }
    prev = prop;
  }

  if (isLastProp) {
    appendPropertyInJsonAst(recorder, node, propertyName, value, indent);

    return;
  }

  const indentStr = buildIndent(indent);

  const insertIndex =
    insertAfterProp === null
      ? node.start.offset + 1
      : insertAfterProp.end.offset + 1;

  recorder.insertRight(
    insertIndex,
    indentStr +
      `"${propertyName}": ${JSON.stringify(value, null, 2).replace(
        /\n/g,
        indentStr,
      )}` +
      ',',
  );
}
