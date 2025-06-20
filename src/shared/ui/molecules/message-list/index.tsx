import { FC, useRef, useEffect } from "react";

import { Avatar, AvatarImage, AvatarFallback } from "@radix-ui/react-avatar";
import { Check, CheckCheck } from "lucide-react";

import { cn } from "@/shared/lib/utils";
import { Message } from "@/shared/types/chat";

type MessageListProps = {
  className?: string;
  messages: Message[];
  contactName: string;
  currentUserId: string;
  contactAvatar?: string;
};

export const MessageList: FC<MessageListProps> = ({
  messages,
  currentUserId,
  contactName,
  contactAvatar,
  className,
}) => {
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
  };

  const getStatusIcon = (status: Message["status"]) => {
    switch (status) {
      case "sent":
        return <Check className="h-3 w-3 text-gray-400" />;
      case "delivered":
        return <CheckCheck className="h-3 w-3 text-gray-400" />;
      case "read":
        return <CheckCheck className="h-3 w-3 text-blue-500" />;
      default:
        return null;
    }
  };

  return (
    <div
      className={cn(
        "flex-1 overflow-y-auto p-2 sm:p-4 space-y-3 sm:space-y-4",
        className,
      )}
    >
      {messages.length === 0 ? (
        <div className="flex-1 flex items-center justify-center text-gray-500">
          <div className="text-center">
            <p className="text-sm">Начните разговор с {contactName}</p>
          </div>
        </div>
      ) : (
        messages.map((message) => {
          const isFromMe = message.senderId === currentUserId;

          return (
            <div
              key={message.id}
              className={cn(
                "flex gap-2 sm:gap-3",
                isFromMe ? "flex-row-reverse" : "flex-row",
              )}
            >
              {!isFromMe && (
                <Avatar className="h-8 w-8 flex-shrink-0">
                  <AvatarImage alt={contactName} src={contactAvatar} />
                  <AvatarFallback className="text-xs">
                    {contactName
                      .split(" ")
                      .map((n) => n[0])
                      .join("")
                      .toUpperCase()}
                  </AvatarFallback>
                </Avatar>
              )}

              <div
                className={cn(
                  "max-w-[85%] sm:max-w-[70%] rounded-lg px-3 py-2",
                  "break-words",
                  isFromMe
                    ? "bg-blue-500 text-white"
                    : "bg-gray-100 text-gray-900",
                )}
              >
                <p className="text-sm sm:text-base whitespace-pre-wrap">
                  {message.text}
                </p>

                {message.attachments && message.attachments.length > 0 && (
                  <div className="mt-2 space-y-2">
                    {message.attachments.map((attachment) => (
                      <div
                        key={attachment.id}
                        className={cn(
                          "rounded p-2",
                          isFromMe ? "bg-white/10" : "bg-gray-200",
                        )}
                      >
                        <p className="text-xs font-medium truncate">
                          {attachment.name}
                        </p>
                        {attachment.size && (
                          <p
                            className={cn(
                              "text-xs",
                              isFromMe ? "opacity-75" : "text-gray-600",
                            )}
                          >
                            {(attachment.size / 1024).toFixed(1)} KB
                          </p>
                        )}
                      </div>
                    ))}
                  </div>
                )}

                <div
                  className={cn(
                    "flex items-center gap-1 mt-1 text-xs opacity-75",
                    isFromMe ? "justify-end" : "justify-start",
                  )}
                >
                  <span>{formatTime(message.timestamp)}</span>
                  {isFromMe && getStatusIcon(message.status)}
                </div>
              </div>
            </div>
          );
        })
      )}
      <div ref={messagesEndRef} />
    </div>
  );
};
