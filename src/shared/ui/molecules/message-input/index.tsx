import { FC, useRef, useState } from "react";

import {
  Mic,
  Send,
  File,
  Video,
  Image,
  Paperclip,
  AlertCircle,
} from "lucide-react";

import { EmojiPicker } from "../emoji-picker";

import { validateMediaFile } from "@/shared/lib/helpers/media-validation";
import { cn } from "@/shared/lib/utils";
import { Button } from "@/shared/ui/atoms";
import { Textarea } from "@/shared/ui/shadcn";

type MessageInputProps = {
  disabled?: boolean;
  className?: string;
  onSendVideo?: (file: File) => void;
  onSendImage?: (file: File) => void;
  onSendMessage: (text: string) => void;
  onSendDocument?: (file: File) => void;
  onSendAttachment?: (file: File) => void;
  onSendAudio?: (audioBlob: Blob) => void;
};

export const MessageInput: FC<MessageInputProps> = ({
  onSendMessage,
  onSendAttachment,
  onSendAudio,
  onSendVideo,
  onSendImage,
  onSendDocument,
  disabled = false,
  className,
}) => {
  const [message, setMessage] = useState("");
  const [isRecording, setIsRecording] = useState(false);
  const [recordingTime, setRecordingTime] = useState(0);
  const [validationError, setValidationError] = useState<null | string>(null);
  const mediaRecorderRef = useRef<null | MediaRecorder>(null);
  const recordingIntervalRef = useRef<null | NodeJS.Timeout>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const audioInputRef = useRef<HTMLInputElement>(null);
  const videoInputRef = useRef<HTMLInputElement>(null);
  const imageInputRef = useRef<HTMLInputElement>(null);
  const documentInputRef = useRef<HTMLInputElement>(null);

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

  const validateAndSendFile = (
    file: File,
    sendFunction?: (file: File) => void,
  ) => {
    setValidationError(null);

    const validation = validateMediaFile(file);

    if (!validation.isValid) {
      setValidationError(validation.error || "Ошибка валидации файла");
      return false;
    }

    if (sendFunction) {
      sendFunction(file);
    }
    return true;
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file && onSendAttachment) {
      validateAndSendFile(file, onSendAttachment);
    }
    if (e.target) {
      e.target.value = "";
    }
  };

  const handleAudioSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file && onSendAudio) {
      validateAndSendFile(file, onSendAudio);
    }
    if (e.target) {
      e.target.value = "";
    }
  };

  const handleVideoSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file && onSendVideo) {
      validateAndSendFile(file, onSendVideo);
    }
    if (e.target) {
      e.target.value = "";
    }
  };

  const handleImageSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file && onSendImage) {
      validateAndSendFile(file, onSendImage);
    }
    if (e.target) {
      e.target.value = "";
    }
  };

  const handleDocumentSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file && onSendDocument) {
      validateAndSendFile(file, onSendDocument);
    }
    if (e.target) {
      e.target.value = "";
    }
  };

  const startRecording = async () => {
    try {
      console.log("Starting recording...");
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      console.log("Got audio stream:", stream);

      const mediaRecorder = new MediaRecorder(stream);
      mediaRecorderRef.current = mediaRecorder;

      const chunks: Blob[] = [];
      mediaRecorder.ondataavailable = (e) => {
        console.log("Data available:", e.data.size, "bytes");
        chunks.push(e.data);
      };

      mediaRecorder.onstop = () => {
        console.log("Recording stopped, chunks:", chunks.length);
        const audioBlob = new Blob(chunks, { type: "audio/webm" });
        console.log(
          "Created audio blob:",
          audioBlob.size,
          "bytes, type:",
          audioBlob.type,
        );

        if (onSendAudio) {
          console.log("Calling onSendAudio...");
          onSendAudio(audioBlob);
        } else {
          console.warn("onSendAudio function is not provided");
        }

        stream.getTracks().forEach((track) => track.stop());
      };

      mediaRecorder.onerror = (event) => {
        console.error("MediaRecorder error:", event);
        setValidationError("Ошибка записи аудио");
      };

      mediaRecorder.start(1000); // Записываем данные каждую секунду
      setIsRecording(true);
      setRecordingTime(0);

      recordingIntervalRef.current = setInterval(() => {
        setRecordingTime((prev) => prev + 1);
      }, 1000);

      console.log("Recording started successfully");
    } catch (error) {
      console.error("Error starting recording:", error);
      setValidationError(
        `Не удалось получить доступ к микрофону: ${
          error instanceof Error ? error.message : "Неизвестная ошибка"
        }`,
      );
    }
  };

  const stopRecording = () => {
    console.log("Stopping recording...");
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
      if (recordingIntervalRef.current) {
        clearInterval(recordingIntervalRef.current);
        recordingIntervalRef.current = null;
      }
      setRecordingTime(0);
      console.log("Recording stopped");
    }
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, "0")}`;
  };

  return (
    <div className={cn("border-t bg-white p-2 sm:p-4", className)}>
      {/* Error Display */}
      {validationError && (
        <div className="mb-2 p-2 bg-red-50 border border-red-200 rounded-lg flex items-center gap-2">
          <AlertCircle className="h-4 w-4 text-red-500" />
          <span className="text-sm text-red-700">{validationError}</span>
          <button
            onClick={() => setValidationError(null)}
            className="ml-auto text-red-500 hover:text-red-700"
          >
            ✕
          </button>
        </div>
      )}

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
              "pr-20 sm:pr-24",
              "text-sm sm:text-base",
            )}
          />

          <div className="absolute right-2 bottom-1 flex items-center gap-1">
            <EmojiPicker
              disabled={disabled}
              onEmojiSelect={handleEmojiSelect}
            />

            {/* Audio Recording Button */}
            <Button
              size="sm"
              disabled={disabled}
              variant={isRecording ? "destructive" : "ghost"}
              onClick={isRecording ? stopRecording : startRecording}
              className={cn(
                "h-8 w-8 p-0",
                isRecording
                  ? "bg-red-500 text-white hover:bg-red-600"
                  : "hover:bg-gray-100",
              )}
            >
              <Mic className="h-4 w-4" />
            </Button>

            {/* Attachment Menu */}
            <div className="relative group">
              <Button
                size="sm"
                variant="ghost"
                disabled={disabled}
                className="h-8 w-8 p-0 hover:bg-gray-100"
              >
                <Paperclip className="h-4 w-4" />
              </Button>

              {/* Dropdown Menu */}
              <div className="absolute bottom-full right-0 mb-2 hidden group-hover:block bg-white border rounded-lg shadow-lg p-2 z-10">
                <div className="flex flex-col gap-1 min-w-[140px]">
                  <button
                    onClick={() => imageInputRef.current?.click()}
                    className="flex items-center gap-2 px-3 py-2 text-sm hover:bg-gray-100 rounded"
                  >
                    <Image className="h-4 w-4" />
                    <span>Image (≤5MB)</span>
                  </button>
                  <button
                    onClick={() => videoInputRef.current?.click()}
                    className="flex items-center gap-2 px-3 py-2 text-sm hover:bg-gray-100 rounded"
                  >
                    <Video className="h-4 w-4" />
                    <span>Video (≤16MB)</span>
                  </button>
                  <button
                    onClick={() => audioInputRef.current?.click()}
                    className="flex items-center gap-2 px-3 py-2 text-sm hover:bg-gray-100 rounded"
                  >
                    <Mic className="h-4 w-4" />
                    <span>Audio File (≤16MB)</span>
                  </button>
                  <button
                    onClick={() => documentInputRef.current?.click()}
                    className="flex items-center gap-2 px-3 py-2 text-sm hover:bg-gray-100 rounded"
                  >
                    <File className="h-4 w-4" />
                    <span>Document (≤100MB)</span>
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Recording indicator */}
          {isRecording && (
            <div className="absolute -top-8 left-0 right-0 text-center">
              <div className="inline-flex items-center gap-2 bg-red-500 text-white px-3 py-1 rounded-full text-sm">
                <div className="w-2 h-2 bg-white rounded-full animate-pulse"></div>
                Recording {formatTime(recordingTime)}
              </div>
            </div>
          )}
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

      {/* Hidden file inputs */}
      <input
        type="file"
        ref={fileInputRef}
        className="hidden"
        onChange={handleFileSelect}
        accept="image/*,.pdf,.doc,.docx,.txt"
      />
      <input
        type="file"
        accept="audio/*"
        className="hidden"
        ref={audioInputRef}
        onChange={handleAudioSelect}
      />
      <input
        type="file"
        accept="video/*"
        className="hidden"
        ref={videoInputRef}
        onChange={handleVideoSelect}
      />
      <input
        type="file"
        accept="image/*"
        className="hidden"
        ref={imageInputRef}
        onChange={handleImageSelect}
      />
      <input
        type="file"
        className="hidden"
        ref={documentInputRef}
        onChange={handleDocumentSelect}
        accept=".pdf,.doc,.docx,.txt,.xls,.xlsx,.ppt,.pptx"
      />
    </div>
  );
};
