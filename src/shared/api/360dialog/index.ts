import { createQuery, createMutation } from "@farfetched/core";

import {
  getMediaFx,
  setWebhookFx,
  getWebhookFx,
  uploadMediaFx,
  deleteMediaFx,
  deleteWebhookFx,
  sendTextMessageFx,
  sendAudioMessageFx,
  sendVideoMessageFx,
  sendImageMessageFx,
  sendTemplateMessageFx,
  sendDocumentMessageFx,
} from "./client";

// Queries
export const getWebhookQuery = createQuery({
  effect: getWebhookFx,
  name: "getWebhookQuery",
});

export const getMediaQuery = createQuery({
  effect: getMediaFx,
  name: "getMediaQuery",
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

export const sendAudioMessageMutation = createMutation({
  effect: sendAudioMessageFx,
  name: "sendAudioMessageMutation",
});

export const sendVideoMessageMutation = createMutation({
  effect: sendVideoMessageFx,
  name: "sendVideoMessageMutation",
});

export const sendImageMessageMutation = createMutation({
  effect: sendImageMessageFx,
  name: "sendImageMessageMutation",
});

export const sendDocumentMessageMutation = createMutation({
  effect: sendDocumentMessageFx,
  name: "sendDocumentMessageMutation",
});

export const uploadMediaMutation = createMutation({
  effect: uploadMediaFx,
  name: "uploadMediaMutation",
});

export const deleteMediaMutation = createMutation({
  effect: deleteMediaFx,
  name: "deleteMediaMutation",
});

export const setWebhookMutation = createMutation({
  effect: setWebhookFx,
  name: "setWebhookMutation",
});

export const deleteWebhookMutation = createMutation({
  effect: deleteWebhookFx,
  name: "deleteWebhookMutation",
});
