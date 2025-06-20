export type User = {
  id: string;
  name: string;
  avatar?: string;
  lastSeen?: Date;
  status: "away" | "online" | "offline";
};

export type Contact = {
  unreadCount: number;
  lastMessage?: {
    text: string;
    timestamp: Date;
    isFromMe: boolean;
  };
} & User;

export type Message = {
  id: string;
  text: string;
  timestamp: Date;
  senderId: string;
  isFromMe: boolean;
  attachments?: Attachment[];
  status: "sent" | "read" | "delivered";
};

export type Attachment = {
  id: string;
  url: string;
  name: string;
  size?: number;
  type: "image" | "audio" | "video" | "document";
};

export type Chat = {
  id: string;
  contact: Contact;
  isActive: boolean;
  messages: Message[];
};
