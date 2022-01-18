/**
 * @license
 * Copyright 2021 Dynatrace LLC
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
import * as ts from 'typescript';

/**
 * Creates a string literal from the specified text.
 *
 * @param text Text of the string literal.
 * @param singleQuotes Whether single quotes should be used when printing the literal node.
 */
export function createStringLiteral(
  text: string,
  singleQuotes: boolean,
): ts.StringLiteral {
  const literal = ts.factory.createStringLiteral(text);
  // See: https://github.com/microsoft/TypeScript/blob/master/src/compiler/utilities.ts#L584-L590
  // eslint-disable-next-line dot-notation, @typescript-eslint/dot-notation
  literal['singleQuote'] = singleQuotes;
  return literal;
}
