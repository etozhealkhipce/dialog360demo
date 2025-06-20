import { FC, useRef, useState } from "react";

import { Play, Pause, Volume2 } from "lucide-react";

import { cn } from "@/shared/lib/utils";
import { Button } from "@/shared/ui/atoms";

type AudioMessageProps = {
  audioUrl: string;
  caption?: string;
  duration?: number;
  isFromMe: boolean;
};

export const AudioMessage: FC<AudioMessageProps> = ({
  audioUrl,
  duration,
  caption,
  isFromMe,
}) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [totalDuration, setTotalDuration] = useState(duration || 0);
  const audioRef = useRef<HTMLAudioElement>(null);

  const handlePlayPause = async () => {
    if (audioRef.current) {
      if (isPlaying) {
        audioRef.current.pause();
      } else {
        try {
          await audioRef.current.play();
        } catch (error) {
          console.error("Error playing audio:", error);
        }
      }
    }
  };

  const handleTimeUpdate = () => {
    if (audioRef.current) {
      setCurrentTime(audioRef.current.currentTime);
    }
  };

  const handleLoadedMetadata = () => {
    if (audioRef.current) {
      setTotalDuration(audioRef.current.duration);
    }
  };

  const handleEnded = () => {
    setIsPlaying(false);
    setCurrentTime(0);
  };

  const formatTime = (time: number) => {
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes}:${seconds.toString().padStart(2, "0")}`;
  };

  const progress = totalDuration > 0 ? (currentTime / totalDuration) * 100 : 0;

  return (
    <div
      className={cn(
        "flex items-center gap-3 p-3 rounded-lg",
        isFromMe ? "bg-white/10" : "bg-gray-200",
      )}
    >
      <audio
        ref={audioRef}
        src={audioUrl}
        onEnded={handleEnded}
        onTimeUpdate={handleTimeUpdate}
        onPlay={() => setIsPlaying(true)}
        onPause={() => setIsPlaying(false)}
        onLoadedMetadata={handleLoadedMetadata}
      />

      <Button
        size="sm"
        variant="ghost"
        onClick={() => void handlePlayPause()}
        className={cn(
          "h-10 w-10 p-0 rounded-full",
          isFromMe ? "text-white hover:bg-white/20" : "hover:bg-gray-300",
        )}
      >
        {isPlaying ? (
          <Pause className="h-5 w-5" />
        ) : (
          <Play className="h-5 w-5 ml-0.5" />
        )}
      </Button>

      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2 mb-1">
          <Volume2 className="h-4 w-4 opacity-70" />
          <span className="text-xs font-medium">
            {formatTime(currentTime)} / {formatTime(totalDuration)}
          </span>
        </div>

        <div className="relative h-2 bg-gray-300 rounded-full overflow-hidden">
          <div
            style={{ width: `${progress}%` }}
            className={cn(
              "h-full transition-all duration-100",
              isFromMe ? "bg-white/70" : "bg-blue-500",
            )}
          />
        </div>

        {caption && <p className="text-xs mt-2 opacity-80">{caption}</p>}
      </div>
    </div>
  );
};
