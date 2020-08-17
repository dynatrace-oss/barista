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

/** Returns the cached design tokens or undefined if none were downloaded previously. */
export function getCachedTokens(): TokenStoreModel | undefined {
  const themesJson = figma.root.getPluginData('fluid-design-tokens');
  if (!themesJson) {
    // Figma returns an empty string if the key does not exist
    return undefined;
  }
  return JSON.parse(themesJson);
}

/** Stores the given token model in the cache. */
export function setCachedTokens(tokens: TokenStoreModel): void {
  figma.root.setPluginData('fluid-design-tokens', JSON.stringify(tokens));
}

/** Deletes the cached design tokens. */
export function clearCachedTokens(): void {
  figma.root.setPluginData('fluid-design-tokens', '');
}

/** Returns the cached remote style IDs or undefined if none were downloaded previously. */
export function getCachedRemoteStyles(): StyleMetadataCollection | undefined {
  const remoteStylesJson = figma.root.getPluginData('fluid-remote-styles');
  if (!remoteStylesJson) {
    // Figma returns an empty string if the key does not exist
    return undefined;
  }
  return JSON.parse(remoteStylesJson);
}

/** Sets the cached remote style IDs */
export function setCachedRemoteStyles(styles: StyleMetadataCollection): void {
  figma.root.setPluginData('fluid-remote-styles', JSON.stringify(styles));
}

/** Deletes the cached remote styles. */
export function clearCachedRemoteStyles(): void {
  figma.root.setPluginData('fluid-remote-styles', '');
}

/** Returns the last time remote styles were downloaded or undefined if none were downloaded previously. */
export function getLastRemoteStyleFetchTime(): Date | undefined {
  const dateString = figma.root.getPluginData('fluid-remote-styles-fetch-date');
  return dateString ? new Date(dateString) : undefined;
}

/** Sets the last time remote styles were downloaded */
export function setLastRemoteStyleFetchTime(date: Date): void {
  figma.root.setPluginData(
    'fluid-remote-styles-fetch-date',
    date.toISOString(),
  );
}

/** Deletes the last time remote styles were downloaded. */
export function clearLastRemoteStyleFetchDate(): void {
  figma.root.setPluginData('fluid-remote-styles-fetch-date', '');
}
