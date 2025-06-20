import { attach } from "effector";

import { requestFx } from "../common/base-request";
import { WebhookConfig, WhatsAppMessage } from "./types";

export type TSendTextMessagePayload = {
  to: string;
  text: string;
  apiKey: string;
};

export type TSendTemplateMessagePayload = {
  to: string;
  apiKey: string;
  namespace: string;
  templateName: string;
  languageCode?: string;
  parameters?: Array<{ type: string; text: string }>;
};

export type TSendAudioMessagePayload = {
  to: string;
  apiKey: string;
  audio: {
    id?: string;
    link?: string;
    caption?: string;
  };
};

export type TSendVideoMessagePayload = {
  to: string;
  apiKey: string;
  video: {
    id?: string;
    link?: string;
    caption?: string;
  };
};

export type TSendImageMessagePayload = {
  to: string;
  apiKey: string;
  image: {
    id?: string;
    link?: string;
    caption?: string;
  };
};

export type TSendDocumentMessagePayload = {
  to: string;
  apiKey: string;
  document: {
    id?: string;
    link?: string;
    caption?: string;
    filename?: string;
  };
};

export type TSetWebhookPayload = {
  apiKey: string;
  webhookUrl: string;
};

export type TGetWebhookPayload = {
  apiKey: string;
};

export type TDeleteWebhookPayload = {
  apiKey: string;
};

export type TUploadMediaPayload = {
  apiKey: string;
  file: File | Blob;
  filename?: string;
};

export const sendTextMessageFx = attach({
  effect: requestFx,
  mapParams: ({ apiKey, to, text }: TSendTextMessagePayload) => {
    const message: WhatsAppMessage = {
      messaging_product: "whatsapp",
      to,
      type: "text",
      text: {
        body: text,
      },
    };

    return {
      url: `360dialog/messages`,
      method: "post" as const,
      data: message,
      headers: {
        "Content-Type": "application/json",
        "D360-Api-Key": apiKey,
      },
    };
  },
});

export const sendTemplateMessageFx = attach({
  effect: requestFx,
  mapParams: ({
    apiKey,
    to,
    templateName,
    namespace,
    languageCode = "en",
    parameters,
  }: TSendTemplateMessagePayload) => {
    const message: WhatsAppMessage = {
      messaging_product: "whatsapp",
      to,
      type: "template",
      template: {
        namespace,
        language: {
          policy: "deterministic",
          code: languageCode,
        },
        name: templateName,
        components: parameters
          ? [
              {
                type: "body",
                parameters,
              },
            ]
          : undefined,
      },
    };

    return {
      url: `360dialog/messages`,
      method: "post" as const,
      data: message,
      headers: {
        "Content-Type": "application/json",
        "D360-Api-Key": apiKey,
      },
    };
  },
});

export const setWebhookFx = attach({
  effect: requestFx,
  mapParams: ({ apiKey, webhookUrl }: TSetWebhookPayload) => {
    const config: WebhookConfig = {
      url: webhookUrl,
    };

    return {
      url: `360dialog/configs/webhook`,
      method: "post" as const,
      data: config,
      headers: {
        "Content-Type": "application/json",
        "D360-Api-Key": apiKey,
      },
    };
  },
});

export const getWebhookFx = attach({
  effect: requestFx,
  mapParams: ({ apiKey }: TGetWebhookPayload) => {
    return {
      url: `360dialog/configs/webhook`,
      method: "get" as const,
      headers: {
        "Content-Type": "application/json",
        "D360-Api-Key": apiKey,
      },
    };
  },
});

export const deleteWebhookFx = attach({
  effect: requestFx,
  mapParams: ({ apiKey }: TDeleteWebhookPayload) => {
    return {
      url: `360dialog/configs/webhook`,
      method: "delete" as const,
      headers: {
        "Content-Type": "application/json",
        "D360-Api-Key": apiKey,
      },
    };
  },
});

export const sendAudioMessageFx = attach({
  effect: requestFx,
  mapParams: ({ apiKey, to, audio }: TSendAudioMessagePayload) => {
    const message: WhatsAppMessage = {
      messaging_product: "whatsapp",
      to,
      type: "audio",
      audio,
    };

    return {
      url: `360dialog/messages`,
      method: "post" as const,
      data: message,
      headers: {
        "Content-Type": "application/json",
        "D360-Api-Key": apiKey,
      },
    };
  },
});

export const sendVideoMessageFx = attach({
  effect: requestFx,
  mapParams: ({ apiKey, to, video }: TSendVideoMessagePayload) => {
    const message: WhatsAppMessage = {
      messaging_product: "whatsapp",
      to,
      type: "video",
      video,
    };

    return {
      url: `360dialog/messages`,
      method: "post" as const,
      data: message,
      headers: {
        "Content-Type": "application/json",
        "D360-Api-Key": apiKey,
      },
    };
  },
});

export const sendImageMessageFx = attach({
  effect: requestFx,
  mapParams: ({ apiKey, to, image }: TSendImageMessagePayload) => {
    const message: WhatsAppMessage = {
      messaging_product: "whatsapp",
      to,
      type: "image",
      image,
    };

    return {
      url: `360dialog/messages`,
      method: "post" as const,
      data: message,
      headers: {
        "Content-Type": "application/json",
        "D360-Api-Key": apiKey,
      },
    };
  },
});

export const sendDocumentMessageFx = attach({
  effect: requestFx,
  mapParams: ({ apiKey, to, document }: TSendDocumentMessagePayload) => {
    const message: WhatsAppMessage = {
      messaging_product: "whatsapp",
      to,
      type: "document",
      document,
    };

    return {
      url: `360dialog/messages`,
      method: "post" as const,
      data: message,
      headers: {
        "Content-Type": "application/json",
        "D360-Api-Key": apiKey,
      },
    };
  },
});

export const uploadMediaFx = attach({
  effect: requestFx,
  mapParams: ({ apiKey, file, filename }: TUploadMediaPayload) => {
    const formData = new FormData();
    formData.append("messaging_product", "whatsapp");
    formData.append("file", file, filename || "file");

    return {
      url: `360dialog/media`,
      method: "post" as const,
      data: formData,
      headers: {
        "D360-Api-Key": apiKey,
        // Не устанавливаем Content-Type, чтобы браузер сам установил multipart/form-data
      },
    };
  },
});

export const getMediaFx = attach({
  effect: requestFx,
  mapParams: ({ apiKey, mediaId }: { apiKey: string; mediaId: string }) => {
    return {
      url: `360dialog/media/${mediaId}`,
      method: "get" as const,
      headers: {
        "D360-Api-Key": apiKey,
      },
    };
  },
});

export const deleteMediaFx = attach({
  effect: requestFx,
  mapParams: ({ apiKey, mediaId }: { apiKey: string; mediaId: string }) => {
    return {
      url: `360dialog/media/${mediaId}`,
      method: "delete" as const,
      headers: {
        "D360-Api-Key": apiKey,
      },
    };
  },
});

// Функция для получения URL медиафайла
export const getMediaUrlFx = attach({
  effect: requestFx,
  mapParams: ({ apiKey, mediaId }: { apiKey: string; mediaId: string }) => {
    return {
      url: `360dialog/media/${mediaId}`,
      method: "get" as const,
      headers: {
        "D360-Api-Key": apiKey,
      },
    };
  },
});
