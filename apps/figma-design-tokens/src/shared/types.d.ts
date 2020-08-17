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

type CommandHandler = () => Promise<void>;

/** Generic model for design tokens. */
interface DesignToken {
  name: string;
  value: string | Object;
  meta?: any;
  comment?: string;
}

/** Map of design tokens by name. */
interface DesignTokenMap {
  [name: string]: DesignToken;
}

/** Application cache and state model for storing design tokens. */
interface TokenStoreModel {
  [type: string]: DesignTokenMap;

  palettes: DesignTokenMap;
  typography: DesignTokenMap;
}

interface StyleMetadata {
  id: string;
  type: StyleType;
  name: string;
  description: string;
  key: string;
  remote: boolean;
}

interface StyleMetadataCollection {
  paintStyles: StyleMetadata[];
  textStyles: StyleMetadata[];
  effectStyles: StyleMetadata[];
  gridStyles: StyleMetadata[];
}

/** IPC message type identifier */
type MessageType =
  | 'fetch-tokens-request'
  | 'fetch-tokens-response'
  | 'upload-style-metadata-request'
  | 'upload-style-metadata-response'
  | 'upload-style-metadata-userinterrupted'
  | 'fetch-style-metadata-request'
  | 'fetch-style-metadata-response';

/** Message for communicating between from main process to worker */
interface IPCRequestMessage<T> {
  type: MessageType;
  data?: T;
}

interface IPCResponseMessage<T> {
  type: MessageType;
  data?: T;
  error?: Error;
}

interface FetchTokensRequestMessage extends IPCRequestMessage<void> {
  type: 'fetch-tokens-request';
}

interface FetchTokensResponseMessage
  extends IPCResponseMessage<TokenStoreModel> {
  type: 'fetch-tokens-response';
}

interface UploadStyleMetadataRequestMessage
  extends IPCRequestMessage<StyleMetadataCollection> {
  type: 'upload-style-metadata-request';
}

interface UploadStyleMetadataResponseMessage extends IPCResponseMessage<void> {
  type: 'upload-style-metadata-response';
}

interface FetchStyleMetadataRequestMessage extends IPCRequestMessage<void> {
  type: 'fetch-style-metadata-request';
}

interface FetchStyleMetadataResponseMessage
  extends IPCResponseMessage<StyleMetadataCollection> {
  type: 'fetch-style-metadata-response';
}
