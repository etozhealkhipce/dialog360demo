import { FC, useRef, useState } from "react";

import { Play, Pause, Volume2, VolumeX, Maximize2 } from "lucide-react";

import { cn } from "@/shared/lib/utils";
import { Button } from "@/shared/ui/atoms";

type VideoMessageProps = {
  videoUrl: string;
  caption?: string;
  isFromMe: boolean;
  thumbnailUrl?: string;
};

export const VideoMessage: FC<VideoMessageProps> = ({
  videoUrl,
  thumbnailUrl,
  caption,
  isFromMe,
}) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [showControls, setShowControls] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);

  const handlePlayPause = async () => {
    if (videoRef.current) {
      if (isPlaying) {
        videoRef.current.pause();
      } else {
        try {
          await videoRef.current.play();
        } catch (error) {
          console.error("Error playing video:", error);
        }
      }
    }
  };

  const handleMuteToggle = () => {
    if (videoRef.current) {
      videoRef.current.muted = !isMuted;
      setIsMuted(!isMuted);
    }
  };

  const handleFullscreen = async () => {
    if (videoRef.current) {
      try {
        if (document.fullscreenElement) {
          await document.exitFullscreen();
        } else {
          await videoRef.current.requestFullscreen();
        }
      } catch (error) {
        console.error("Error with fullscreen:", error);
      }
    }
  };

  const handleMouseEnter = () => {
    setShowControls(true);
  };

  const handleMouseLeave = () => {
    setShowControls(false);
  };

  return (
    <div
      className={cn(
        "relative rounded-lg overflow-hidden",
        isFromMe ? "bg-white/10" : "bg-gray-200",
      )}
    >
      <div
        className="relative"
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
      >
        <video
          ref={videoRef}
          src={videoUrl}
          poster={thumbnailUrl}
          onPlay={() => setIsPlaying(true)}
          onPause={() => setIsPlaying(false)}
          onEnded={() => setIsPlaying(false)}
          className="w-full max-w-md rounded-lg"
        />

        {/* Overlay Controls */}
        {showControls && (
          <div className="absolute inset-0 bg-black/30 flex items-center justify-center">
            <div className="flex items-center gap-2 bg-black/50 rounded-lg p-2">
              <Button
                size="sm"
                variant="ghost"
                onClick={() => void handlePlayPause()}
                className="h-8 w-8 p-0 text-white hover:bg-white/20"
              >
                {isPlaying ? (
                  <Pause className="h-4 w-4" />
                ) : (
                  <Play className="h-4 w-4 ml-0.5" />
                )}
              </Button>

              <Button
                size="sm"
                variant="ghost"
                onClick={handleMuteToggle}
                className="h-8 w-8 p-0 text-white hover:bg-white/20"
              >
                {isMuted ? (
                  <VolumeX className="h-4 w-4" />
                ) : (
                  <Volume2 className="h-4 w-4" />
                )}
              </Button>

              <Button
                size="sm"
                variant="ghost"
                onClick={() => void handleFullscreen()}
                className="h-8 w-8 p-0 text-white hover:bg-white/20"
              >
                <Maximize2 className="h-4 w-4" />
              </Button>
            </div>
          </div>
        )}

        {/* Play Button Overlay */}
        {!isPlaying && !showControls && (
          <div className="absolute inset-0 flex items-center justify-center">
            <Button
              size="lg"
              variant="ghost"
              onClick={() => void handlePlayPause()}
              className="h-16 w-16 p-0 text-white hover:bg-white/20 rounded-full"
            >
              <Play className="h-8 w-8 ml-1" />
            </Button>
          </div>
        )}
      </div>

      {caption && (
        <div className="p-3">
          <p className="text-sm opacity-80">{caption}</p>
        </div>
      )}
    </div>
  );
};
