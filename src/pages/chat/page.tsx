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
  setCurrentContact,
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
  } = useUnit({
    setCurrentContact,
    setApiKey,
    setUserPhone,
    setWebhookUrl,
    sendMessage,
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
        onWebhookUrlChange={setWebhook}
        onSendMessage={handleSendMessage}
      />
    </div>
  );
};
