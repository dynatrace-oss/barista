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

import {
  addThemeRelaunchDataToNode,
  isContainerNode,
  isGeometryNode,
} from '../shared/figma-util';
import { createWorker, fetchStyleMetadata } from '../shared/ipc';
import {
  setCachedRemoteStyles,
  getCachedRemoteStyles,
  getLastRemoteStyleFetchTime,
  setLastRemoteStyleFetchTime,
} from '../shared/storage';

const ALL_THEMES = ['abyss', 'surface'];
const MIN_TIME_SINCE_LAST_FETCH = 3 * 60 * 60 * 1000; // 3 hours

/**
 * Factory function for a command handler that switches to the given theme.
 * @param themeName The theme name to create a command handler for
 */
export default function createHandler(themeName: string): CommandHandler {
  return async () => applyTheme(themeName);
}

/**
 * Changes the color references of selected container object to the given theme.
 * @param themeName Name of the theme to switch to
 */
export async function applyTheme(themeName: string): Promise<void> {
  // Applying themes should be restricted to frames instead of individual elements.
  const selectedFrames = figma.currentPage.selection.filter(
    isContainerNode,
  ) as FrameNode[];

  if (selectedFrames.length <= 0) {
    alert('Please select one or more frames to change their theme.');
    return;
  }

  await downloadRemoteStyles();

  const remotePaintStyles = getCachedRemoteStyles()?.paintStyles ?? [];
  const paintStyles = [...figma.getLocalPaintStyles(), ...remotePaintStyles];

  const styleIdReplacementCache = new Map();
  for (const node of selectedFrames) {
    await applyThemeToNode(
      themeName,
      node,
      paintStyles,
      styleIdReplacementCache,
    );
    addThemeRelaunchDataToNode(node); // Add a button for theme toggling once we've set a theme
  }
}

/**
 * @internal
 * Applies the theme with the given name to the node and all its children.
 * @param themeName The name of the target theme
 * @param node The current node
 * @param paintStyles All local paint styles provided by the Figma API
 * @param styleIdReplacementCache Cached ID mappings (old palette ID -> new palette ID)
 */
async function applyThemeToNode(
  themeName: string,
  node: SceneNode,
  paintStyles: StyleMetadata[],
  styleIdReplacementCache: Map<string, string>,
): Promise<void> {
  if (isGeometryNode(node)) {
    const geometryNode = node as GeometryMixin;

    if (geometryNode.fillStyleId != figma.mixed) {
      // The node uses a single fill style, so we can replace it directly
      geometryNode.fillStyleId = await getReplacementStyle(
        themeName,
        geometryNode.fillStyleId,
        paintStyles,
        styleIdReplacementCache,
      );
    } else if (node.type === 'TEXT') {
      // The node is a text node with multiple text colors, so special handling is required
      await applyThemeToMixedColorText(
        themeName,
        geometryNode as TextNode,
        paintStyles,
        styleIdReplacementCache,
      );
    }

    geometryNode.strokeStyleId = await getReplacementStyle(
      themeName,
      geometryNode.strokeStyleId,
      paintStyles,
      styleIdReplacementCache,
    );
  }

  const containerNode = node as ChildrenMixin;
  if (containerNode.children) {
    for (const child of containerNode.children) {
      await applyThemeToNode(
        themeName,
        child,
        paintStyles,
        styleIdReplacementCache,
      );
    }
  }
}

/** @internal Applies a theme to a text node with multiple text colors. */
async function applyThemeToMixedColorText(
  themeName: string,
  node: TextNode,
  paintStyles: StyleMetadata[],
  styleIdReplacementCache: Map<string, string>,
): Promise<void> {
  // Figma doesn't have an API that allows retrieving all the text ranges with different
  // colors and their positions at once, so we need to test each character individually.
  const stringLength = node.characters.length;

  for (let start = 0; start < stringLength - 1; start++) {
    // Loop from the range start position to the end of the string
    // or the end of the color range
    for (let end = start + 1; end <= stringLength; end++) {
      // Check one character after our range. If the return value is "figma.mixed",
      // we know that we've hit the end of our range since there's more than one color in it.
      const outerRangeFillStyleId = node.getRangeFillStyleId(
        start,
        Math.min(end + 1, stringLength),
      );

      if (outerRangeFillStyleId === figma.mixed || end === stringLength) {
        // This should return a single color ID, but let's safety check to prevent errors
        const rangeFillStyleId = node.getRangeFillStyleId(start, end);
        if (rangeFillStyleId !== figma.mixed) {
          const newStyleId = await getReplacementStyle(
            themeName,
            rangeFillStyleId,
            paintStyles,
            styleIdReplacementCache,
          );
          node.setRangeFillStyleId(start, end, newStyleId);
        }

        // Continue at the start of the next range
        start = end - 1;
        break;
      }
    }
  }
}

/** @internal Get the color style ID to replace the given color style with */
async function getReplacementStyle(
  targetThemeName: string,
  currentStyleId: string,
  paintStyles: StyleMetadata[],
  styleIdReplacementCache: Map<string, string>,
): Promise<string> {
  if (!currentStyleId) {
    // Bail out if the source ID is falsy
    return currentStyleId;
  }

  // Use the cached style ID mapping if available
  const cachedStyle = styleIdReplacementCache.get(currentStyleId);
  if (cachedStyle) {
    return cachedStyle;
  }

  // HACK: If a remote style is used, there's extra local information encoded in the style ID.
  // However, the string starts with the same contents as the remote style ID so we can still match it.
  const currentStyle = paintStyles.find((style) =>
    currentStyleId.startsWith(style.id),
  );
  if (!currentStyle) {
    return currentStyleId;
  }

  const [themeName, colorName] = currentStyle.name.split('/');
  if (themeName && colorName) {
    if (ALL_THEMES.includes(themeName)) {
      const newStyleData = paintStyles.find(
        (style) => style.name === `${targetThemeName}/${colorName}`,
      );
      let newStyle: PaintStyle | undefined;
      if (newStyleData?.remote) {
        newStyle = (await figma.importStyleByKeyAsync(
          newStyleData.key,
        )) as PaintStyle;
      } else {
        newStyle = newStyleData as PaintStyle;
      }

      if (newStyle) {
        // The mapping from the source style ID to the target style ID is cached to prevent searching
        // for it in the paint styles, and more importantly, avoid very expensive C++ string to
        // JS string conversions that occur when accessing string properties in the Plugin API.
        // Caching is safe since the user cannot modify the document while the plugin is running.
        styleIdReplacementCache.set(currentStyleId, newStyle.id);
        return newStyle.id;
      }
    }
  }

  return currentStyleId;
}

/**
 * @internal Ensures that a fairly recent version of the remote styles
 * is available in the cache.
 */
async function downloadRemoteStyles(): Promise<void> {
  // Download the remote style data periodically since we can't run code when
  // the user opens a document. We want to avoid redownloading it on every
  // theme switch because it locks the UI for the duration of the request.
  const lastFetchDate = new Date(getLastRemoteStyleFetchTime() ?? 0);
  const cachedRemoteStyles = getCachedRemoteStyles();
  if (
    !cachedRemoteStyles ||
    Date.now() - lastFetchDate.getTime() > MIN_TIME_SINCE_LAST_FETCH
  ) {
    try {
      createWorker();
      const remoteStyles = await fetchStyleMetadata();
      setCachedRemoteStyles(remoteStyles);
      setLastRemoteStyleFetchTime(new Date());
    } catch (err) {
      if (!cachedRemoteStyles) {
        alert(
          'Initial download of remote styles failed. Please make sure that ' +
            'you are online (you can go offline after this initial download.)',
        );
      }
      // We can ignore the else case since an older remote version is available.
    }
  }
}
