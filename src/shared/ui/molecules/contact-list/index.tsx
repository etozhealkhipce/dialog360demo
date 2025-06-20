import { FC } from "react";

import { Avatar, AvatarImage, AvatarFallback } from "@radix-ui/react-avatar";
import { Settings } from "lucide-react";

import { cn } from "@/shared/lib/utils";
import { Contact } from "@/shared/types/chat";
import { Badge, Button } from "@/shared/ui/shadcn";

type ContactListProps = {
  className?: string;
  contacts: Contact[];
  selectedContactId?: string;
  onSettingsClick?: () => void;
  onContactSelect: (contact: Contact) => void;
};

export const ContactList: FC<ContactListProps> = ({
  contacts,
  selectedContactId,
  onContactSelect,
  onSettingsClick,
  className,
}) => {
  return (
    <div className={cn("flex flex-col h-full", className)}>
      <div className="p-3 sm:p-4 border-b bg-white">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-semibold">Contacts</h2>
          {onSettingsClick && (
            <Button
              size="sm"
              variant="ghost"
              className="p-2"
              onClick={onSettingsClick}
            >
              <Settings className="h-4 w-4" />
            </Button>
          )}
        </div>
      </div>
      <div className="flex-1 overflow-y-auto">
        {contacts.length === 0 ? (
          <div className="flex items-center justify-center h-full text-gray-500">
            <p className="text-sm">Нет контактов</p>
          </div>
        ) : (
          contacts.map((contact) => (
            <div
              key={contact.id}
              onClick={() => onContactSelect(contact)}
              className={cn(
                "flex items-center gap-2 sm:gap-3 p-3 sm:p-4 cursor-pointer hover:bg-gray-50 transition-colors",
                selectedContactId === contact.id &&
                  "bg-blue-50 border-r-2 border-blue-500",
              )}
            >
              <div className="relative flex-shrink-0">
                <Avatar className="h-10 w-10 sm:h-12 sm:w-12">
                  <AvatarImage alt={contact.name} src={contact.avatar} />
                  <AvatarFallback className="text-xs sm:text-sm">
                    {contact.name
                      .split(" ")
                      .map((n) => n[0])
                      .join("")
                      .toUpperCase()}
                  </AvatarFallback>
                </Avatar>
                <div
                  className={cn(
                    "absolute -bottom-1 -right-1 h-2.5 w-2.5 sm:h-3 sm:w-3 rounded-full border-2 border-white",
                    contact.status === "online" && "bg-green-500",
                    contact.status === "away" && "bg-yellow-500",
                    contact.status === "offline" && "bg-gray-400",
                  )}
                />
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between">
                  <h3 className="font-medium truncate text-sm sm:text-base">
                    {contact.name}
                  </h3>
                  {contact.lastMessage && (
                    <span className="text-xs text-gray-500 flex-shrink-0 ml-2">
                      {contact.lastMessage.timestamp.toLocaleTimeString([], {
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </span>
                  )}
                </div>
                {contact.lastMessage && (
                  <p className="text-xs sm:text-sm text-gray-600 truncate mt-1">
                    {contact.lastMessage.isFromMe ? "Вы: " : ""}
                    {contact.lastMessage.text}
                  </p>
                )}
              </div>
              {contact.unreadCount > 0 && (
                <Badge variant="destructive" className="ml-2 flex-shrink-0">
                  {contact.unreadCount > 99 ? "99+" : contact.unreadCount}
                </Badge>
              )}
            </div>
          ))
        )}
      </div>
    </div>
  );
};
