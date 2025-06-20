import { FC, useRef, useState } from "react";

import { Send, Paperclip } from "lucide-react";

import { EmojiPicker } from "../emoji-picker";

import { cn } from "@/shared/lib/utils";
import { Button } from "@/shared/ui/atoms";
import { Textarea } from "@/shared/ui/shadcn";

type MessageInputProps = {
  disabled?: boolean;
  className?: string;
  onSendMessage: (text: string) => void;
  onSendAttachment?: (file: File) => void;
};

export const MessageInput: FC<MessageInputProps> = ({
  onSendMessage,
  onSendAttachment,
  disabled = false,
  className,
}) => {
  const [message, setMessage] = useState("");
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleSend = () => {
    if (message.trim() && !disabled) {
      onSendMessage(message.trim());
      setMessage("");
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const handleEmojiSelect = (emoji: string) => {
    setMessage((prev) => prev + emoji);
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file && onSendAttachment) {
      onSendAttachment(file);
    }

    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const handleAttachmentClick = () => {
    fileInputRef.current?.click();
  };

  return (
    <div className={cn("border-t bg-white p-2 sm:p-4", className)}>
      <div className="flex items-end gap-2">
        <div className="flex-1 relative">
          <Textarea
            rows={1}
            value={message}
            disabled={disabled}
            onKeyDown={handleKeyPress}
            placeholder="Enter message..."
            onChange={(e) => setMessage(e.target.value)}
            className={cn(
              "min-h-[40px] max-h-[120px] resize-none",
              "pr-16 sm:pr-20",
              "text-sm sm:text-base",
            )}
          />

          <div className="absolute right-2 bottom-1 flex items-center gap-1">
            <EmojiPicker
              disabled={disabled}
              onEmojiSelect={handleEmojiSelect}
            />

            <Button
              size="sm"
              variant="ghost"
              disabled={disabled}
              onClick={handleAttachmentClick}
              className="h-8 w-8 p-0 hover:bg-gray-100"
            >
              <Paperclip className="h-4 w-4" />
            </Button>
          </div>
        </div>

        <Button
          size="sm"
          onClick={handleSend}
          disabled={!message.trim() || disabled}
          className="h-10 w-10 p-0 flex-shrink-0"
        >
          <Send className="h-4 w-4" />
        </Button>
      </div>

      <input
        type="file"
        ref={fileInputRef}
        className="hidden"
        onChange={handleFileSelect}
        accept="image/*,.pdf,.doc,.docx,.txt"
      />
    </div>
  );
};
