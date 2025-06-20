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
