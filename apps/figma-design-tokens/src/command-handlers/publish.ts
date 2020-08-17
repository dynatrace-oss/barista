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

import { createWorkerWithUI, uploadStyleMetadata } from '../shared/ipc';

/**
 * Publishes the local styles to JSONBin.
 * We need to do this since Figma doesn't allow reading remote team libraries.
 */
export default async function run(): Promise<void> {
  createWorkerWithUI(); // The user is asked to confirm this in a UI.
  const allStyles = (await getLibraryStyles()).map(getStyleMetadataForUpload);

  const styleMetadata = {
    paintStyles: allStyles.filter((style) => style.type === 'PAINT'),
    textStyles: allStyles.filter((style) => style.type === 'TEXT'),
    effectStyles: allStyles.filter((style) => style.type === 'EFFECT'),
    gridStyles: allStyles.filter((style) => style.type === 'GRID'),
  };

  await uploadStyleMetadata(styleMetadata);
}

/** Fetches a list of all styles in a team library */
async function getLibraryStyles(): Promise<BaseStyle[]> {
  const allStyles = [
    ...figma.getLocalPaintStyles(),
    ...figma.getLocalTextStyles(),
    ...figma.getLocalEffectStyles(),
    ...figma.getLocalGridStyles(),
  ];

  return allStyles;
}

/** Converts a Figma BaseStyle to StyleMetadata for upload */
function getStyleMetadataForUpload(style: BaseStyle): StyleMetadata {
  const { id, type, name, description, key } = style;
  return { id, type, name, description, key, remote: true };
}
