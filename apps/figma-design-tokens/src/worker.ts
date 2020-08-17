import Axios from 'axios';
import { postMessageFromWorker } from './shared/ipc';
import { showMetadataUploadConfirmDialog } from './ui';
import { JSON_BIN_SECRET_KEY } from './environment';

const REPO = 'dynatrace-oss/barista';
const GITHUB_BASE_URL = `https://raw.githubusercontent.com/${REPO}/master/libs/shared/design-tokens/generated`;
const PALETTES_URL = `${GITHUB_BASE_URL}/global/palette.json`;
const TYPOGRAPHY_URL = `${GITHUB_BASE_URL}/global/typography.json`;

const JSONBIN_BASE_URL = 'https://api.jsonbin.io';
const JSONBIN_STORE_URL = `${JSONBIN_BASE_URL}/b/5f2d3a89dddf413f95beeba3`;

/** Fetches design tokens from GitHub and sends them back to the main thread. */
async function handleFetchTokensRequest(): Promise<void> {
  try {
    const requests = [PALETTES_URL, TYPOGRAPHY_URL].map((url) =>
      Axios.get(url),
    );
    const [palettes, typography] = (await Promise.all(requests)).map(
      (response) => response.data.props,
    );

    postMessageFromWorker({
      type: 'fetch-tokens-response',
      data: {
        palettes,
        typography,
      } as TokenStoreModel,
    });
  } catch (error) {
    postMessageFromWorker({
      type: 'fetch-tokens-response',
      error,
    });
  }
}

/** Uploads style library metadata. */
async function handleUploadStyleMetadataRequest(
  styleMetadataCollection: StyleMetadataCollection,
): Promise<void> {
  try {
    const result = await showMetadataUploadConfirmDialog();

    if (!result) {
      postMessageFromWorker({
        type: 'upload-style-metadata-userinterrupted',
      });
      return;
    }

    await Axios.put(JSONBIN_STORE_URL, styleMetadataCollection, {
      headers: {
        'Content-Type': 'application/json',
        'secret-key': JSON_BIN_SECRET_KEY,
      },
    });

    postMessageFromWorker({
      type: 'upload-style-metadata-response',
    });
  } catch (error) {
    postMessageFromWorker({
      type: 'upload-style-metadata-response',
      error,
    });
  }
}

/** Downloads style library metadata. */
async function handleFetchStyleMetadataRequest(): Promise<void> {
  try {
    const response = await Axios.get(`${JSONBIN_STORE_URL}/latest`, {
      headers: {
        'Content-Type': 'application/json',
        'secret-key': JSON_BIN_SECRET_KEY,
      },
    });
    postMessageFromWorker({
      type: 'fetch-style-metadata-response',
      data: response.data as StyleMetadataCollection,
    });
  } catch (error) {
    postMessageFromWorker({
      type: 'fetch-style-metadata-response',
      error,
    });
  }
}

window.addEventListener('message', (event) => {
  const message: IPCRequestMessage<any> = event.data.pluginMessage;
  switch (message.type) {
    case 'fetch-tokens-request': {
      handleFetchTokensRequest();
      break;
    }
    case 'upload-style-metadata-request': {
      const metadata = (message as UploadStyleMetadataRequestMessage).data;
      handleUploadStyleMetadataRequest(metadata!);
      break;
    }
    case 'fetch-style-metadata-request': {
      handleFetchStyleMetadataRequest();
      break;
    }
    default: {
      console.warn(`Unknown message type: ${message.type}`);
    }
  }
});
