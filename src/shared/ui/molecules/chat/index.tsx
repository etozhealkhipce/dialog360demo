import { FC, useState } from "react";

import { X, Menu } from "lucide-react";

import { ChatHeader } from "../chat-header";
import { ContactList } from "../contact-list";
import { MessageInput } from "../message-input";
import { MessageList } from "../message-list";
import { SettingsDrawer } from "./settings-drawer";

import { cn } from "@/shared/lib/utils";
import { User, Contact, Message } from "@/shared/types/chat";
import { Button } from "@/shared/ui/atoms";

type ChatProps = {
  apiKey?: string;
  currentUser: User;
  className?: string;
  userPhone?: string;
  contacts: Contact[];
  webhookUrl?: string;
  onSave?: () => void;
  onApiKeyChange?: (value: string) => void;
  onUserPhoneChange?: (value: string) => void;
  onWebhookUrlChange?: (value: string) => void;
  onSendVideo?: (contactId: string, file: File) => void;
  onSendImage?: (contactId: string, file: File) => void;
  onSendMessage: (contactId: string, text: string) => void;
  onSendDocument?: (contactId: string, file: File) => void;
  onSendAttachment?: (contactId: string, file: File) => void;
  onSendAudio?: (contactId: string, audioBlob: Blob) => void;
};

export const Chat: FC<ChatProps> = ({
  contacts,
  currentUser,
  onSendMessage,
  onSendAttachment,
  onSendAudio,
  onSendVideo,
  onSendImage,
  onSendDocument,
  className,
  apiKey = "",
  userPhone = "",
  webhookUrl = "",
  onApiKeyChange,
  onUserPhoneChange,
  onWebhookUrlChange,
  onSave,
}) => {
  const [selectedContact, setSelectedContact] = useState<null | Contact>(null);
  const [messages, setMessages] = useState<Record<string, Message[]>>({});
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);

  const handleContactSelect = (contact: Contact) => {
    setSelectedContact(contact);
    setIsMobileMenuOpen(false);
    if (!messages[contact.id]) {
      setMessages((prev) => ({ ...prev, [contact.id]: [] }));
    }
  };

  const handleSendMessage = (text: string) => {
    if (!selectedContact) return;

    const newMessage: Message = {
      id: Date.now().toString(),
      text,
      timestamp: new Date(),
      senderId: currentUser.id,
      isFromMe: true,
      status: "sent",
    };

    setMessages((prev) => ({
      ...prev,
      [selectedContact.id]: [...(prev[selectedContact.id] || []), newMessage],
    }));

    onSendMessage(selectedContact.id, text);
  };

  const handleSendAttachment = (file: File) => {
    if (!selectedContact) return;

    const newMessage: Message = {
      id: Date.now().toString(),
      text: `Отправлен файл: ${file.name}`,
      timestamp: new Date(),
      senderId: currentUser.id,
      isFromMe: true,
      status: "sent",
      attachments: [
        {
          id: Date.now().toString(),
          type: file.type.startsWith("image/") ? "image" : "document",
          url: URL.createObjectURL(file),
          name: file.name,
          size: file.size,
        },
      ],
    };

    setMessages((prev) => ({
      ...prev,
      [selectedContact.id]: [...(prev[selectedContact.id] || []), newMessage],
    }));

    if (onSendAttachment) {
      onSendAttachment(selectedContact.id, file);
    }
  };

  const handleSendAudio = (audioBlob: Blob) => {
    if (!selectedContact) return;

    const newMessage: Message = {
      id: Date.now().toString(),
      text: "Аудиосообщение",
      timestamp: new Date(),
      senderId: currentUser.id,
      isFromMe: true,
      status: "sent",
      attachments: [
        {
          id: Date.now().toString(),
          type: "audio",
          url: URL.createObjectURL(audioBlob),
          name: "audio_message.webm",
          size: audioBlob.size,
        },
      ],
    };

    setMessages((prev) => ({
      ...prev,
      [selectedContact.id]: [...(prev[selectedContact.id] || []), newMessage],
    }));

    if (onSendAudio) {
      onSendAudio(selectedContact.id, audioBlob);
    }
  };

  const handleSendVideo = (file: File) => {
    if (!selectedContact) return;

    const newMessage: Message = {
      id: Date.now().toString(),
      text: `Отправлено видео: ${file.name}`,
      timestamp: new Date(),
      senderId: currentUser.id,
      isFromMe: true,
      status: "sent",
      attachments: [
        {
          id: Date.now().toString(),
          type: "video",
          url: URL.createObjectURL(file),
          name: file.name,
          size: file.size,
        },
      ],
    };

    setMessages((prev) => ({
      ...prev,
      [selectedContact.id]: [...(prev[selectedContact.id] || []), newMessage],
    }));

    if (onSendVideo) {
      onSendVideo(selectedContact.id, file);
    }
  };

  const handleSendImage = (file: File) => {
    if (!selectedContact) return;

    const newMessage: Message = {
      id: Date.now().toString(),
      text: `Отправлено изображение: ${file.name}`,
      timestamp: new Date(),
      senderId: currentUser.id,
      isFromMe: true,
      status: "sent",
      attachments: [
        {
          id: Date.now().toString(),
          type: "image",
          url: URL.createObjectURL(file),
          name: file.name,
          size: file.size,
        },
      ],
    };

    setMessages((prev) => ({
      ...prev,
      [selectedContact.id]: [...(prev[selectedContact.id] || []), newMessage],
    }));

    if (onSendImage) {
      onSendImage(selectedContact.id, file);
    }
  };

  const handleSendDocument = (file: File) => {
    if (!selectedContact) return;

    const newMessage: Message = {
      id: Date.now().toString(),
      text: `Отправлен документ: ${file.name}`,
      timestamp: new Date(),
      senderId: currentUser.id,
      isFromMe: true,
      status: "sent",
      attachments: [
        {
          id: Date.now().toString(),
          type: "document",
          url: URL.createObjectURL(file),
          name: file.name,
          size: file.size,
        },
      ],
    };

    setMessages((prev) => ({
      ...prev,
      [selectedContact.id]: [...(prev[selectedContact.id] || []), newMessage],
    }));

    if (onSendDocument) {
      onSendDocument(selectedContact.id, file);
    }
  };

  return (
    <div className={cn("flex h-screen bg-gray-50", className)}>
      <div
        className={cn(
          "bg-white border-r transition-all duration-300",
          "hidden lg:block lg:w-80",
          "md:block md:w-72",
          "w-full",
          selectedContact && "hidden md:hidden lg:block",
        )}
      >
        <ContactList
          contacts={contacts}
          onContactSelect={handleContactSelect}
          selectedContactId={selectedContact?.id}
          onSettingsClick={() => setIsSettingsOpen(true)}
        />
      </div>

      <div className="flex-1 flex flex-col min-w-0">
        {selectedContact ? (
          <>
            <div className="flex items-center border-b bg-white">
              <Button
                size="sm"
                variant="ghost"
                className="lg:hidden p-2"
                onClick={() => setSelectedContact(null)}
              >
                <X className="h-4 w-4" />
              </Button>
              <ChatHeader
                className="flex-1"
                contact={selectedContact}
                onMoreClick={() => console.log("Еще")}
                onCallClick={() => console.log("Звонок")}
                onSearchClick={() => console.log("Поиск")}
                onProfileClick={() => console.log("Профиль")}
                onVideoCallClick={() => console.log("Видеозвонок")}
              />
            </div>

            <MessageList
              className="flex-1"
              currentUserId={currentUser.id}
              contactName={selectedContact.name}
              contactAvatar={selectedContact.avatar}
              messages={messages[selectedContact.id] || []}
            />

            <MessageInput
              onSendAudio={handleSendAudio}
              onSendVideo={handleSendVideo}
              onSendImage={handleSendImage}
              onSendMessage={handleSendMessage}
              onSendDocument={handleSendDocument}
              onSendAttachment={handleSendAttachment}
            />
          </>
        ) : (
          <div className="flex-1 flex items-center justify-center">
            <div className="text-center text-gray-500 p-4">
              <h3 className="text-lg font-medium mb-2">Select a chat</h3>
              <p className="text-sm">
                Select a contact from the list to start a conversation
              </p>

              <Button
                className="mt-4 lg:hidden"
                onClick={() => setIsMobileMenuOpen(true)}
              >
                <Menu className="h-4 w-4 mr-2" />
                Open contacts
              </Button>
            </div>
          </div>
        )}
      </div>

      {isMobileMenuOpen && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <div
            onClick={() => setIsMobileMenuOpen(false)}
            className="absolute inset-0 bg-black bg-opacity-50"
          />
          <div className="absolute left-0 top-0 h-full w-80 bg-white">
            <div className="flex items-center justify-between p-4 border-b">
              <h2 className="text-lg font-semibold">Constacts</h2>
              <Button
                size="sm"
                variant="ghost"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
            <ContactList
              contacts={contacts}
              onContactSelect={handleContactSelect}
              selectedContactId={selectedContact?.id}
              onSettingsClick={() => {
                setIsMobileMenuOpen(false);
                setIsSettingsOpen(true);
              }}
            />
          </div>
        </div>
      )}

      <SettingsDrawer
        apiKey={apiKey}
        userPhone={userPhone}
        isOpen={isSettingsOpen}
        webhookUrl={webhookUrl}
        onSave={onSave || (() => {})}
        onClose={() => setIsSettingsOpen(false)}
        onApiKeyChange={onApiKeyChange || (() => {})}
        onUserPhoneChange={onUserPhoneChange || (() => {})}
        onWebhookUrlChange={onWebhookUrlChange || (() => {})}
      />
    </div>
  );
};
