import { useUnit } from "effector-react";

import {
  $apiKey,
  $contacts,
  setApiKey,
  $userPhone,
  $webhookUrl,
  sendMessage,
  $currentUser,
  setUserPhone,
  setWebhookUrl,
  sendAudioMessage,
  sendVideoMessage,
  sendImageMessage,
  setCurrentContact,
  sendDocumentMessage,
} from "./model";

import {
  openSuccessToast,
  openFailureToast,
} from "@/shared/ui/atoms/notification";
import { Chat } from "@/shared/ui/molecules/chat";

export const ChatPage = () => {
  const { contacts, currentUser, apiKey, userPhone, webhookUrl } = useUnit({
    contacts: $contacts,
    currentUser: $currentUser,
    apiKey: $apiKey,
    userPhone: $userPhone,
    webhookUrl: $webhookUrl,
  });

  const {
    setCurrentContact: setContact,
    setApiKey: setKey,
    setUserPhone: setPhone,
    setWebhookUrl: setWebhook,
    sendMessage: sendMsg,
    sendAudioMessage: sendAudio,
    sendVideoMessage: sendVideo,
    sendImageMessage: sendImage,
    sendDocumentMessage: sendDocument,
  } = useUnit({
    setCurrentContact,
    setApiKey,
    setUserPhone,
    setWebhookUrl,
    sendMessage,
    sendAudioMessage,
    sendVideoMessage,
    sendImageMessage,
    sendDocumentMessage,
  });

  const handleSendMessage = (contactId: string, text: string) => {
    if (!apiKey || !userPhone) {
      openFailureToast("Please configure API settings first");
      return;
    }

    const contact = contacts.find((c) => c.id === contactId);
    if (contact) {
      setContact(contact);
      setTimeout(() => {
        sendMsg(text);
      }, 0);
    } else {
      sendMsg(text);
    }
  };

  const handleSendAudio = (contactId: string, audioBlob: Blob) => {
    if (!apiKey || !userPhone) {
      openFailureToast("Please configure API settings first");
      return;
    }

    const contact = contacts.find((c) => c.id === contactId);
    if (contact) {
      setContact(contact);
      setTimeout(() => {
        sendAudio(audioBlob);
      }, 0);
    } else {
      sendAudio(audioBlob);
    }
  };

  const handleSendVideo = (contactId: string, file: File) => {
    if (!apiKey || !userPhone) {
      openFailureToast("Please configure API settings first");
      return;
    }

    const contact = contacts.find((c) => c.id === contactId);
    if (contact) {
      setContact(contact);
      setTimeout(() => {
        sendVideo(file);
      }, 0);
    } else {
      sendVideo(file);
    }
  };

  const handleSendImage = (contactId: string, file: File) => {
    if (!apiKey || !userPhone) {
      openFailureToast("Please configure API settings first");
      return;
    }

    const contact = contacts.find((c) => c.id === contactId);
    if (contact) {
      setContact(contact);
      setTimeout(() => {
        sendImage(file);
      }, 0);
    } else {
      sendImage(file);
    }
  };

  const handleSendDocument = (contactId: string, file: File) => {
    if (!apiKey || !userPhone) {
      openFailureToast("Please configure API settings first");
      return;
    }

    const contact = contacts.find((c) => c.id === contactId);
    if (contact) {
      setContact(contact);
      setTimeout(() => {
        sendDocument(file);
      }, 0);
    } else {
      sendDocument(file);
    }
  };

  const handleSave = () => {
    openSuccessToast("Configuration saved successfully!");
  };

  return (
    <div className="h-screen">
      <Chat
        apiKey={apiKey}
        contacts={contacts}
        onSave={handleSave}
        userPhone={userPhone}
        webhookUrl={webhookUrl}
        onApiKeyChange={setKey}
        currentUser={currentUser}
        onUserPhoneChange={setPhone}
        onSendAudio={handleSendAudio}
        onSendVideo={handleSendVideo}
        onSendImage={handleSendImage}
        onWebhookUrlChange={setWebhook}
        onSendMessage={handleSendMessage}
        onSendDocument={handleSendDocument}
      />
    </div>
  );
};
