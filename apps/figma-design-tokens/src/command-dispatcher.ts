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

import SyncCommandHandler from './command-handlers/sync';
import SetThemeCommandHandler from './command-handlers/set-theme';
import MigrateCommandHandler from './command-handlers/migrate';

import DeleteColorTokensCommandHandler from './command-handlers/dev/delete-color-tokens';
import ClearCacheCommandHandler from './command-handlers/dev/clear-cache';
import PublishCommandHandler from './command-handlers/publish';

/** Dispatch a command from manifest.json */
export async function dispatchCommand(command: string): Promise<void> {
  return getCommandHandler(command)();
}

/** @internal Get a command handler by command name */
function getCommandHandler(command: string): CommandHandler {
  switch (command) {
    case 'sync':
      return SyncCommandHandler;
    case 'publish':
      return PublishCommandHandler;
    case 'sync-publish':
      return createCombinedHandler(SyncCommandHandler, PublishCommandHandler);
    case 'set-theme:surface':
      return SetThemeCommandHandler('surface');
    case 'set-theme:abyss':
      return SetThemeCommandHandler('abyss');
    case 'migrate':
      return MigrateCommandHandler;
    case 'dev:delete-color-tokens':
      return DeleteColorTokensCommandHandler;
    case 'dev:clear-cache':
      return ClearCacheCommandHandler;
    default:
      return () => Promise.resolve();
  }
}

/** @internal Combines multiple command handlers to be executed one after another. */
function createCombinedHandler(
  ...commandHandlers: CommandHandler[]
): CommandHandler {
  return async () => {
    for (const handler of commandHandlers) {
      await handler();
    }
  };
}
