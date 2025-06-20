import { createStore } from "effector";
import { createEvent } from "effector";

import {
  getWebhookQuery,
  setWebhookMutation,
  deleteWebhookMutation,
  sendTextMessageMutation,
  sendTemplateMessageMutation,
} from "@/shared/api/360dialog";
import { User, Message, Contact } from "@/shared/types/chat";

export const setCurrentContact = createEvent<Contact>();
export const addMessage = createEvent<Message>();
export const setApiKey = createEvent<string>();
export const setUserPhone = createEvent<string>();
export const setWebhookUrl = createEvent<string>();
export const sendMessage = createEvent<string>();
export const sendTemplateMessage = createEvent<{
  namespace: string;
  templateName: string;
  parameters?: Array<{ type: string; text: string }>;
}>();

export const addIncomingMessage = createEvent<{
  id: string;
  text: string;
  timestamp: Date;
  senderId: string;
}>();

export const $currentContact = createStore<null | Contact>(null);
export const $messages = createStore<Message[]>([]);
export const $apiKey = createStore<string>("");
export const $userPhone = createStore<string>("");
export const $webhookUrl = createStore<string>("");
export const $isLoading = createStore<boolean>(false);

const mockContacts: Contact[] = [
  {
    id: "1",
    name: "Валерий Альбертович",
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=John",
    status: "online",
    unreadCount: 2,
    lastMessage: {
      text: "Hello!",
      timestamp: new Date(),
      isFromMe: false,
    },
  },
  {
    id: "2",
    name: "Ромка Гузлик",
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Jane",
    status: "away",
    unreadCount: 0,
    lastMessage: {
      text: "How are you?",
      timestamp: new Date(Date.now() - 3600000),
      isFromMe: false,
    },
  },
];

const mockUser: User = {
  id: "current-user",
  name: "Me",
  avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Me",
  status: "online",
};

export const $contacts = createStore<Contact[]>(mockContacts);
export const $currentUser = createStore<User>(mockUser);

$currentContact.on(setCurrentContact, (_, contact) => contact);

$messages.on(addMessage, (messages, message) => [...messages, message]);

$messages.on(
  addIncomingMessage,
  (messages, { id, text, senderId, timestamp }) => {
    const incomingMessage: Message = {
      id,
      text,
      timestamp,
      senderId,
      isFromMe: false,
      status: "sent",
    };
    return [...messages, incomingMessage];
  },
);

$apiKey.on(setApiKey, (_, apiKey) => apiKey);

$userPhone.on(setUserPhone, (_, phone) => phone);

$webhookUrl.on(setWebhookUrl, (_, webhookUrl) => webhookUrl);

$isLoading.on(sendTextMessageMutation.$pending, (_, pending) => pending);

sendMessage.watch((text) => {
  const currentContact = $currentContact.getState();
  const apiKey = $apiKey.getState();
  const userPhone = $userPhone.getState();
  const webhookUrl = $webhookUrl.getState();

  if (!currentContact || !apiKey || !userPhone) {
    console.error(
      "No contact selected, API key not set, or user phone not set",
      { currentContact, apiKey, userPhone },
    );
    return;
  }

  if (webhookUrl) {
    setWebhookMutation.start({ apiKey, webhookUrl });
  }

  const message: Message = {
    id: Date.now().toString(),
    text,
    timestamp: new Date(),
    senderId: $currentUser.getState().id,
    isFromMe: true,
    status: "sent",
  };

  addMessage(message);

  sendTextMessageMutation.start({
    apiKey,
    to: userPhone,
    text,
  });
});

sendTemplateMessage.watch(({ templateName, namespace, parameters }) => {
  const currentContact = $currentContact.getState();
  const apiKey = $apiKey.getState();
  const userPhone = $userPhone.getState();

  if (!currentContact || !apiKey || !userPhone) {
    console.error(
      "No contact selected, API key not set, or user phone not set",
    );
    return;
  }

  sendTemplateMessageMutation.start({
    apiKey,
    to: userPhone,
    templateName,
    namespace,
    languageCode: "en",
    parameters,
  });
});

sendTextMessageMutation.finished.success.watch(({ result }) => {
  console.log("Message sent successfully:", result);
});

sendTextMessageMutation.finished.failure.watch(({ error }) => {
  console.error("Failed to send message:", error);
});

export {
  getWebhookQuery,
  setWebhookMutation,
  deleteWebhookMutation,
  sendTextMessageMutation,
  sendTemplateMessageMutation,
};
