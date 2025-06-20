import { FC } from "react";

import { Avatar, AvatarImage, AvatarFallback } from "@radix-ui/react-avatar";
import { Phone, Video, Search, MoreVertical } from "lucide-react";

import { cn } from "@/shared/lib/utils";
import { Contact } from "@/shared/types/chat";
import { Button } from "@/shared/ui/shadcn";

type ChatHeaderProps = {
  contact: Contact;
  className?: string;
  onCallClick?: () => void;
  onMoreClick?: () => void;
  onSearchClick?: () => void;
  onProfileClick?: () => void;
  onVideoCallClick?: () => void;
};

export const ChatHeader: FC<ChatHeaderProps> = ({
  contact,
  onProfileClick,
  onCallClick,
  onVideoCallClick,
  onSearchClick,
  onMoreClick,
  className,
}) => {
  const getStatusText = () => {
    switch (contact.status) {
      case "online":
        return "В сети";
      case "away":
        return "Отошел";
      case "offline":
        return contact.lastSeen
          ? `Был(а) в сети ${contact.lastSeen.toLocaleTimeString([], {
              hour: "2-digit",
              minute: "2-digit",
            })}`
          : "Не в сети";
      default:
        return "";
    }
  };

  return (
    <div
      className={cn(
        "flex items-center justify-between p-4 border-b bg-white",
        className,
      )}
    >
      <div
        onClick={onProfileClick}
        className="flex items-center gap-3 cursor-pointer"
      >
        <Avatar className="h-10 w-10">
          <AvatarImage alt={contact.name} src={contact.avatar} />
          <AvatarFallback>
            {contact.name
              .split(" ")
              .map((n) => n[0])
              .join("")
              .toUpperCase()}
          </AvatarFallback>
        </Avatar>
        <div>
          <h3 className="font-semibold">{contact.name}</h3>
          <p className="text-sm text-gray-500">{getStatusText()}</p>
        </div>
      </div>

      <div className="flex items-center gap-1">
        <Button
          size="sm"
          variant="ghost"
          className="h-9 w-9 p-0"
          onClick={onSearchClick}
        >
          <Search className="h-4 w-4" />
        </Button>
        <Button
          size="sm"
          variant="ghost"
          onClick={onCallClick}
          className="h-9 w-9 p-0"
        >
          <Phone className="h-4 w-4" />
        </Button>
        <Button
          size="sm"
          variant="ghost"
          className="h-9 w-9 p-0"
          onClick={onVideoCallClick}
        >
          <Video className="h-4 w-4" />
        </Button>
        <Button
          size="sm"
          variant="ghost"
          onClick={onMoreClick}
          className="h-9 w-9 p-0"
        >
          <MoreVertical className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
};
