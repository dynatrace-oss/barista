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

/** Creates an invisible worker process window. */
export function createWorker(): void {
  // Create the invisible worker iframe. The __html__ global refers to the UI .html from the manifest.
  figma.showUI(__html__, { visible: false });
}

/** Creates a UI window. */
export function createWorkerWithUI(): void {
  figma.showUI(__html__, { width: 500, height: 396 });
}

/** Fetches the current design tokens with the worker process. */
export async function fetchTokens(): Promise<TokenStoreModel> {
  postMessageToWorker({ type: 'fetch-tokens-request' });
  const reply = await getMessageFromWorker<FetchTokensResponseMessage>(
    'fetch-tokens-response',
  );
  return reply.data!;
}

/** Uploads style metadata with the worker process. */
export async function uploadStyleMetadata(
  styleMetadataCollection: StyleMetadataCollection,
): Promise<void> {
  postMessageToWorker({
    type: 'upload-style-metadata-request',
    data: styleMetadataCollection,
  });
  await getMessageFromWorker(
    'upload-style-metadata-response',
    'upload-style-metadata-userinterrupted',
  );
}

/** Fetches the style metadata with the worker process. */
export async function fetchStyleMetadata(): Promise<StyleMetadataCollection> {
  postMessageToWorker({ type: 'fetch-style-metadata-request' });
  const reply = await getMessageFromWorker<FetchStyleMetadataResponseMessage>(
    'fetch-style-metadata-response',
  );
  return reply.data!;
}

/** Helper function for postMessage() communication from the worker process */
export function postMessageFromWorker<T>(message: IPCResponseMessage<T>): void {
  parent.postMessage(
    {
      pluginMessage: message,
    },
    '*',
  );
}

/** @internal Helper function for postMessage() communication from the main process */
function postMessageToWorker(message: IPCRequestMessage<any>): void {
  figma.ui.postMessage(message);
}

/** @internal Waits for a message of the given type from the worker */
function getMessageFromWorker<T extends IPCResponseMessage<any>>(
  ...typeFilter: MessageType[]
): Promise<T> {
  return new Promise((resolve, reject) => {
    figma.ui.once('message', (result: T) => {
      if (!typeFilter.includes(result.type)) {
        return;
      }

      if (!result.error) {
        resolve(result);
      } else {
        reject(result.error);
      }
    });
  });
}
