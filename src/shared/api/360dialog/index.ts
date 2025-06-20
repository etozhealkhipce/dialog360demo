import { createQuery, createMutation } from "@farfetched/core";

import {
  setWebhookFx,
  getWebhookFx,
  deleteWebhookFx,
  sendTextMessageFx,
  sendTemplateMessageFx,
} from "./client";

// Queries
export const getWebhookQuery = createQuery({
  effect: getWebhookFx,
  name: "getWebhookQuery",
});

// Mutations
export const sendTextMessageMutation = createMutation({
  effect: sendTextMessageFx,
  name: "sendTextMessageMutation",
});

export const sendTemplateMessageMutation = createMutation({
  effect: sendTemplateMessageFx,
  name: "sendTemplateMessageMutation",
});

export const setWebhookMutation = createMutation({
  effect: setWebhookFx,
  name: "setWebhookMutation",
});

export const deleteWebhookMutation = createMutation({
  effect: deleteWebhookFx,
  name: "deleteWebhookMutation",
});
