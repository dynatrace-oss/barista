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
import { PassThrough, Readable } from 'stream';

/** concatenates nodejs streams together */
export async function concatenateNodeStreams(
  ...streams: Readable[]
): Promise<Readable> {
  let pass = new PassThrough();
  let i = 0;

  while (i < streams.length) {
    await appendStream(pass, streams[i], i === streams.length - 1);
    i++;
  }

  return pass;
}

function appendStream(
  appendTo: PassThrough,
  append: Readable,
  last: boolean,
): Promise<void | Error> {
  return new Promise<void | Error>((resolve, reject) => {
    appendTo = append.pipe(appendTo, { end: false });
    append
      .once('end', () => {
        if (last) {
          appendTo.end();
        }
        resolve();
      })
      .once('error', (error: Error) => {
        console.log(error);
        reject(error);
      });
  });
}
