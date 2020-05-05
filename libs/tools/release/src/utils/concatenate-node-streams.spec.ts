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

import { Readable } from 'stream';
import { concatenateNodeStreams } from './concatenate-node-streams';

const streamToString = (stream: Readable): Promise<string> => {
  return new Promise<string>((resolve, reject) => {
    const temp: string[] = [];
    stream.on('data', (chunk) => {
      temp.push(chunk.toString());
    });
    stream.on('end', () => {
      resolve(temp.join(''));
    });
    stream.on('error', () => {
      reject('error');
    });
  });
};

test('should concatenate streams of strings 2 streams', async () => {
  const firstStream: Readable = Readable.from('first');
  const secondStream: Readable = Readable.from('second');
  // const thirdStream: Readable = Readable.from('3');

  const concatenatedStream = await concatenateNodeStreams(
    firstStream,
    secondStream,
  );
  const result = await streamToString(concatenatedStream);
  expect(result).toBe('firstsecond');
});

test('should concatenate streams of strings 1 stream', async () => {
  const firstStream: Readable = Readable.from('first');
  const onlyTheFirst = await concatenateNodeStreams(firstStream);
  const onlyTheFirstResult = await streamToString(onlyTheFirst);
  expect(onlyTheFirstResult).toBe('first');
});

test('should concatenate streams of strings 3 streams', async () => {
  const firstStream: Readable = Readable.from('first');
  const secondStream: Readable = Readable.from('second');
  const thirdStream: Readable = Readable.from('3');
  const concatenatedLongStream = await concatenateNodeStreams(
    firstStream,
    secondStream,
    thirdStream,
  );
  const longResult = await streamToString(concatenatedLongStream);
  expect(longResult).toBe('firstsecond3');
});

test('test error stream, error thrown if something goes wrong', async () => {
  const errorThrowingStream = new Readable({
    // tslint:disable-next-line: typedef
    read(_size) {
      this.emit('error', new Error('error'));
    },
  });
  // based on https://jestjs.io/docs/en/asynchronous#resolves-rejects
  return await concatenateNodeStreams(errorThrowingStream).catch((e) =>
    expect(e.message).toMatch('error'),
  );
});
