import { ref } from 'vue';
import { initSDK, EVENT_TYPES } from '@chatdocai/chatdoc-sdk';
import { getDocumentToken } from '../apis/api.js';
const host = import.meta.env.VITE_SERVER_HOST || 'https://localhost:6030/';
export const useSdk = ($pdfDom, $docId) => {
  const $materialData = ref();
  const addSdkEventListener = (sdk) => {
    sdk.on(EVENT_TYPES.CHAT_ICON_CLICKED, (data) => {
      $materialData.value = data;
    });
  };

  const getToken = async () => {
    const { token } = await getDocumentToken($docId.value);
    return token;
  };

  return {
    $materialData,
    initSDK: () => {
      if (!$docId.value) {
        return;
      }

      const sdk = initSDK({
        el: $pdfDom.value,
        url: import.meta.env.VITE_SDK_HOST,
        fileUrl: `${host}api/v1/documents/${$docId.value}/download`,
        getToken,
      });
      addSdkEventListener(sdk);
      return sdk;
    },
    setFileUrl: (sdk, id) => {
      sdk.setFileUrl(`${host}api/v1/documents/${id}/download`);
    },
  };
};