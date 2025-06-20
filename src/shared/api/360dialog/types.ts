export type WhatsAppMessage = {
  to: string;
  messaging_product: "whatsapp";
  text?: {
    body: string;
  };
  type: "text" | "audio" | "video" | "image" | "template" | "document";
  audio?: {
    id?: string;
    link?: string;
    caption?: string;
  };
  video?: {
    id?: string;
    link?: string;
    caption?: string;
  };
  image?: {
    id?: string;
    link?: string;
    caption?: string;
  };
  document?: {
    id?: string;
    link?: string;
    caption?: string;
    filename?: string;
  };
  template?: {
    name: string;
    namespace: string;
    language: {
      code: string;
      policy: string;
    };
    components?: Array<{
      type: string;
      parameters?: Array<{
        type: string;
        text: string;
      }>;
    }>;
  };
};

export type WhatsAppResponse = {
  messages: Array<{
    id: string;
  }>;
};

export type WebhookContact = {
  wa_id: string;
  profile: {
    name: string;
  };
};

export type WebhookMessage = {
  id: string;
  from: string;
  type: string;
  timestamp: string;
  text?: {
    body: string;
  };
};

export type WebhookStatus = {
  id: string;
  timestamp: string;
  recipient_id: string;
  status: "sent" | "read" | "delivered";
};

export type WebhookPayload = {
  statuses?: WebhookStatus[];
  contacts?: WebhookContact[];
  messages?: WebhookMessage[];
};

export type WebhookConfig = {
  url: string;
};
