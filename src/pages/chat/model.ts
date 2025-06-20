import { createStore } from "effector";
import { createEvent } from "effector";

import {
  getWebhookQuery,
  setWebhookMutation,
  uploadMediaMutation,
  deleteWebhookMutation,
  sendTextMessageMutation,
  sendAudioMessageMutation,
  sendVideoMessageMutation,
  sendImageMessageMutation,
  sendTemplateMessageMutation,
  sendDocumentMessageMutation,
} from "@/shared/api/360dialog";
import { User, Message, Contact } from "@/shared/types/chat";

export const setCurrentContact = createEvent<Contact>();
export const addMessage = createEvent<Message>();
export const setApiKey = createEvent<string>();
export const setUserPhone = createEvent<string>();
export const setWebhookUrl = createEvent<string>();
export const sendMessage = createEvent<string>();
export const sendAudioMessage = createEvent<Blob>();
export const sendVideoMessage = createEvent<File>();
export const sendImageMessage = createEvent<File>();
export const sendDocumentMessage = createEvent<File>();
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
      text: "Даб даб даб",
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
      text: "Я гузлик",
      timestamp: new Date(Date.now() - 3600000),
      isFromMe: false,
    },
  },
  {
    id: "3",
    name: "Шнырлик",
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Alex",
    status: "online",
    unreadCount: 0,
    lastMessage: {
      text: "Как ты?",
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

// Обработчики для медиафайлов
sendAudioMessage.watch((audioBlob) => {
  const currentContact = $currentContact.getState();
  const apiKey = $apiKey.getState();
  const userPhone = $userPhone.getState();

  if (!currentContact || !apiKey || !userPhone) {
    console.error(
      "No contact selected, API key not set, or user phone not set",
    );
    return;
  }

  console.log("Uploading audio file...");

  const message: Message = {
    id: Date.now().toString(),
    text: "🎵 Audio message",
    timestamp: new Date(),
    senderId: $currentUser.getState().id,
    isFromMe: true,
    status: "sent",
    attachments: [
      {
        id: Date.now().toString(),
        url: URL.createObjectURL(audioBlob),
        name: "audio.mp3",
        type: "audio",
      },
    ],
  };

  addMessage(message);

  uploadMediaMutation.start({
    apiKey,
    file: audioBlob,
    filename: "audio.mp3",
  });
});

sendVideoMessage.watch((videoFile) => {
  const currentContact = $currentContact.getState();
  const apiKey = $apiKey.getState();
  const userPhone = $userPhone.getState();

  if (!currentContact || !apiKey || !userPhone) {
    console.error(
      "No contact selected, API key not set, or user phone not set",
    );
    return;
  }

  console.log("Uploading video file...");

  const message: Message = {
    id: Date.now().toString(),
    text: "🎥 Video message",
    timestamp: new Date(),
    senderId: $currentUser.getState().id,
    isFromMe: true,
    status: "sent",
    attachments: [
      {
        id: Date.now().toString(),
        url: URL.createObjectURL(videoFile),
        name: videoFile.name,
        type: "video",
        size: videoFile.size,
      },
    ],
  };

  addMessage(message);

  uploadMediaMutation.start({
    apiKey,
    file: videoFile,
    filename: videoFile.name,
  });
});

sendImageMessage.watch((imageFile) => {
  const currentContact = $currentContact.getState();
  const apiKey = $apiKey.getState();
  const userPhone = $userPhone.getState();

  if (!currentContact || !apiKey || !userPhone) {
    console.error(
      "No contact selected, API key not set, or user phone not set",
    );
    return;
  }

  console.log("Uploading image file...");

  const message: Message = {
    id: Date.now().toString(),
    text: "📷 Image message",
    timestamp: new Date(),
    senderId: $currentUser.getState().id,
    isFromMe: true,
    status: "sent",
    attachments: [
      {
        id: Date.now().toString(),
        url: URL.createObjectURL(imageFile),
        name: imageFile.name,
        type: "image",
        size: imageFile.size,
      },
    ],
  };

  addMessage(message);

  uploadMediaMutation.start({
    apiKey,
    file: imageFile,
    filename: imageFile.name,
  });
});

sendDocumentMessage.watch((documentFile) => {
  const currentContact = $currentContact.getState();
  const apiKey = $apiKey.getState();
  const userPhone = $userPhone.getState();

  if (!currentContact || !apiKey || !userPhone) {
    console.error(
      "No contact selected, API key not set, or user phone not set",
    );
    return;
  }

  console.log("Uploading document file...");

  const message: Message = {
    id: Date.now().toString(),
    text: `📄 ${documentFile.name}`,
    timestamp: new Date(),
    senderId: $currentUser.getState().id,
    isFromMe: true,
    status: "sent",
    attachments: [
      {
        id: Date.now().toString(),
        url: URL.createObjectURL(documentFile),
        name: documentFile.name,
        type: "document",
        size: documentFile.size,
      },
    ],
  };

  addMessage(message);

  uploadMediaMutation.start({
    apiKey,
    file: documentFile,
    filename: documentFile.name,
  });
});

sendTextMessageMutation.finished.success.watch(({ result }) => {
  console.log("Message sent successfully:", result);
});

sendTextMessageMutation.finished.failure.watch(({ error }) => {
  console.error("Failed to send message:", error);
});

// Обработчики успешной отправки медиафайлов
sendAudioMessageMutation.finished.success.watch(({ result }) => {
  console.log("Audio message sent successfully:", result);
});

sendVideoMessageMutation.finished.success.watch(({ result }) => {
  console.log("Video message sent successfully:", result);
});

sendImageMessageMutation.finished.success.watch(({ result }) => {
  console.log("Image message sent successfully:", result);
});

sendDocumentMessageMutation.finished.success.watch(({ result }) => {
  console.log("Document message sent successfully:", result);
});

// Обработчики ошибок отправки медиафайлов
sendAudioMessageMutation.finished.failure.watch(({ error }) => {
  console.error("Failed to send audio message:", error);
});

sendVideoMessageMutation.finished.failure.watch(({ error }) => {
  console.error("Failed to send video message:", error);
});

sendImageMessageMutation.finished.failure.watch(({ error }) => {
  console.error("Failed to send image message:", error);
});

sendDocumentMessageMutation.finished.failure.watch(({ error }) => {
  console.error("Failed to send document message:", error);
});

// Обработчики успешной загрузки медиафайлов
uploadMediaMutation.finished.success.watch(({ result, params }) => {
  console.log("Media uploaded successfully:", result);

  const apiKey = $apiKey.getState();
  const userPhone = $userPhone.getState();

  if (!apiKey || !userPhone) {
    console.error("API key or user phone not set");
    return;
  }

  // Определяем тип медиафайла по расширению
  const filename = params.filename || "file";
  const extension = filename.split(".").pop()?.toLowerCase();

  if (["mp3", "wav", "ogg", "m4a"].includes(extension || "")) {
    // Аудио файл
    sendAudioMessageMutation.start({
      apiKey,
      to: userPhone,
      audio: {
        id: result.id,
      },
    });
  } else if (["mp4", "avi", "mov", "wmv"].includes(extension || "")) {
    // Видео файл
    sendVideoMessageMutation.start({
      apiKey,
      to: userPhone,
      video: {
        id: result.id,
      },
    });
  } else if (["jpg", "png", "gif", "jpeg", "webp"].includes(extension || "")) {
    // Изображение
    sendImageMessageMutation.start({
      apiKey,
      to: userPhone,
      image: {
        id: result.id,
      },
    });
  } else {
    // Документ
    sendDocumentMessageMutation.start({
      apiKey,
      to: userPhone,
      document: {
        id: result.id,
        filename: filename,
      },
    });
  }
});

// Обработчик ошибок загрузки медиафайлов
uploadMediaMutation.finished.failure.watch(({ error }) => {
  console.error("Failed to upload media:", error);
});

export {
  getWebhookQuery,
  setWebhookMutation,
  uploadMediaMutation,
  deleteWebhookMutation,
  sendTextMessageMutation,
  sendAudioMessageMutation,
  sendVideoMessageMutation,
  sendImageMessageMutation,
  sendTemplateMessageMutation,
  sendDocumentMessageMutation,
};
