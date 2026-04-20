import { useState, useEffect, useCallback, useRef } from "react";
import { songs } from "@/data/songs";
import {
  Play,
  Pause,
  SkipForward,
  SkipBack,
  Volume2,
  VolumeX,
  Music,
} from "lucide-react";
import { Slider } from "@/components/ui/slider";

declare global {
  interface Window {
    YT: any;
    onYouTubeIframeAPIReady: () => void;
  }
}

const formatTime = (seconds: number) => {
  if (!isFinite(seconds) || seconds < 0) return "0:00";
  const m = Math.floor(seconds / 60);
  const s = Math.floor(seconds % 60);
  return `${m}:${s.toString().padStart(2, "0")}`;
};

interface MusicPlayerProps {
  startOnSignal?: boolean;
}

const MusicPlayer = ({ startOnSignal = false }: MusicPlayerProps) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [volume, setVolume] = useState(60);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [isSeeking, setIsSeeking] = useState(false);
  const [apiReady, setApiReady] = useState(false);
  const [hasInteracted, setHasInteracted] = useState(false);
  const playerRef = useRef<any>(null);
  const progressInterval = useRef<ReturnType<typeof setInterval>>();

  const currentSong = songs[currentIndex];

  // Load YouTube IFrame API
  useEffect(() => {
    if (window.YT && window.YT.Player) {
      setApiReady(true);
      return;
    }
    const tag = document.createElement("script");
    tag.src = "https://www.youtube.com/iframe_api";
    document.head.appendChild(tag);
    window.onYouTubeIframeAPIReady = () => setApiReady(true);
  }, []);

  const next = useCallback(() => {
    setCurrentIndex((prev) => (prev + 1) % songs.length);
  }, []);

  const prev = useCallback(() => {
    setCurrentIndex((prev) => (prev - 1 + songs.length) % songs.length);
  }, []);

  // Create / update player
  useEffect(() => {
    if (!apiReady) return;

    if (playerRef.current) {
      playerRef.current.loadVideoById(currentSong.youtubeId);
      // After load, respect isPlaying state
      setTimeout(() => {
        if (!playerRef.current) return;
        if (isPlaying) playerRef.current.playVideo?.();
        else playerRef.current.pauseVideo?.();
      }, 250);
      return;
    }

    playerRef.current = new window.YT.Player("yt-player", {
      height: "1",
      width: "1",
      videoId: currentSong.youtubeId,
      playerVars: {
        autoplay: 1,
        controls: 0,
        disablekb: 1,
        fs: 0,
        modestbranding: 1,
        rel: 0,
        playsinline: 1,
      },
      events: {
        onStateChange: (event: any) => {
          if (event.data === 0) {
            setCurrentIndex((prev) => (prev + 1) % songs.length);
          }
          if (event.data === 1) {
            setIsPlaying(true);
            setDuration(playerRef.current.getDuration());
          }
          if (event.data === 2) {
            setIsPlaying(false);
          }
        },
        onReady: () => {
          try {
            playerRef.current.setVolume(volume);
            playerRef.current.playVideo(); // intenta con sonido directo
            setIsMuted(false);
            setIsPlaying(true);
          } catch (e) {
            // si el navegador bloquea, fallback muteado
            playerRef.current.mute();
            playerRef.current.playVideo();
            setIsMuted(true);
          }
        },
      },
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [apiReady, currentIndex]);

  // Play/pause sync
  useEffect(() => {
    if (!playerRef.current?.playVideo) return;
    if (isPlaying) {
      playerRef.current.playVideo();
    } else {
      playerRef.current.pauseVideo();
    }
  }, [isPlaying]);

  // Mute sync
  useEffect(() => {
    if (!playerRef.current?.mute) return;
    if (isMuted) playerRef.current.mute();
    else playerRef.current.unMute();
  }, [isMuted]);

  // Volume sync
  useEffect(() => {
    if (!playerRef.current?.setVolume) return;
    playerRef.current.setVolume(volume);
    if (volume === 0 && !isMuted) setIsMuted(true);
    if (volume > 0 && isMuted) setIsMuted(false);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [volume]);

  // Progress tracking
  useEffect(() => {
    if (progressInterval.current) clearInterval(progressInterval.current);
    if (isPlaying) {
      progressInterval.current = setInterval(() => {
        if (isSeeking) return;
        if (
          playerRef.current?.getCurrentTime &&
          playerRef.current?.getDuration
        ) {
          const current = playerRef.current.getCurrentTime();
          const total = playerRef.current.getDuration();
          setCurrentTime(current);
          if (total > 0) setDuration(total);
        }
      }, 500);
    }
    return () => {
      if (progressInterval.current) clearInterval(progressInterval.current);
    };
  }, [isPlaying, isSeeking]);

  // Reset progress on song change
  useEffect(() => {
    setCurrentTime(0);
  }, [currentIndex]);

  // Unmute on first user interaction (for autoplay)
  const handleFirstInteraction = useCallback(() => {
    if (hasInteracted) return;
    setHasInteracted(true);
    if (playerRef.current?.unMute) {
      playerRef.current.unMute();
      playerRef.current.setVolume(volume);
      playerRef.current.playVideo();
      setIsMuted(false);
      setIsPlaying(true);
    }
  }, [hasInteracted, volume]);

  useEffect(() => {
  if (startOnSignal) {
    handleFirstInteraction();
  }
}, [startOnSignal, handleFirstInteraction]);

  const handleSeek = (values: number[]) => {
    const t = values[0];
    setCurrentTime(t);
    if (playerRef.current?.seekTo) {
      playerRef.current.seekTo(t, true);
    }
  };

  const togglePlay = () => {
    handleFirstInteraction();
    setIsPlaying((p) => !p);
  };

  const progressPct = duration > 0 ? (currentTime / duration) * 100 : 0;

  return (
    <div className="fixed bottom-0 left-0 right-0 z-40 glass-card border-t border-border/30 px-4 pt-3 pb-3">
      {/* Hidden YouTube player */}
      <div
        style={{
          position: "absolute",
          width: 1,
          height: 1,
          overflow: "hidden",
          opacity: 0,
          pointerEvents: "none",
        }}
      >
        <div id="yt-player" />
      </div>

      {/* Progress bar at top (visual indicator) */}
      <div className="absolute top-0 left-0 right-0 h-0.5 bg-muted">
        <div
          className="h-full bg-gradient-romantic transition-all duration-300"
          style={{ width: `${progressPct}%` }}
        />
      </div>

      <div className="max-w-screen-lg mx-auto flex flex-col gap-2">
        {/* Seek bar with times */}
        <div className="flex items-center gap-2 px-1">
          <span className="text-[10px] text-muted-foreground font-body w-9 text-right tabular-nums">
            {formatTime(currentTime)}
          </span>
          <Slider
            value={[currentTime]}
            min={0}
            max={duration || 100}
            step={1}
            onValueChange={(v) => {
              setIsSeeking(true);
              setCurrentTime(v[0]);
            }}
            onValueCommit={(v) => {
              handleSeek(v);
              setIsSeeking(false);
            }}
            className="flex-1"
            aria-label="Progreso de la canción"
          />
          <span className="text-[10px] text-muted-foreground font-body w-9 tabular-nums">
            {formatTime(duration)}
          </span>
        </div>

        {/* Main row */}
        <div className="flex items-center justify-between gap-3">
          {/* Song info */}
          <div className="flex items-center gap-3 min-w-0 flex-1">
            <div className="w-10 h-10 rounded-lg bg-secondary flex items-center justify-center flex-shrink-0">
              <Music className="w-5 h-5 text-primary" />
            </div>
            <div className="min-w-0">
              <p className="text-sm font-medium text-foreground truncate">
                {currentSong?.name}
              </p>
              <p className="text-xs text-muted-foreground truncate">
                {currentSong?.artist}
              </p>
            </div>
          </div>

          {/* Controls */}
          <div className="flex items-center gap-2">
            <button
              onClick={prev}
              aria-label="Anterior"
              className="p-2 text-muted-foreground hover:text-foreground transition-colors"
            >
              <SkipBack className="w-4 h-4" />
            </button>
            <button
              onClick={togglePlay}
              aria-label={isPlaying ? "Pausa" : "Reproducir"}
              className="w-10 h-10 rounded-full bg-primary flex items-center justify-center text-primary-foreground hover:opacity-90 transition-opacity shadow-romantic"
            >
              {isPlaying ? (
                <Pause className="w-4 h-4" />
              ) : (
                <Play className="w-4 h-4 ml-0.5" />
              )}
            </button>
            <button
              onClick={next}
              aria-label="Siguiente"
              className="p-2 text-muted-foreground hover:text-foreground transition-colors"
            >
              <SkipForward className="w-4 h-4" />
            </button>
          </div>

          {/* Volume */}
          <div className="flex-1 flex items-center justify-end gap-2 min-w-0">
            <button
              onClick={() => setIsMuted(!isMuted)}
              aria-label={isMuted ? "Activar sonido" : "Silenciar"}
              className="p-2 text-muted-foreground hover:text-foreground transition-colors flex-shrink-0"
            >
              {isMuted || volume === 0 ? (
                <VolumeX className="w-4 h-4" />
              ) : (
                <Volume2 className="w-4 h-4" />
              )}
            </button>
            <Slider
              value={[isMuted ? 0 : volume]}
              min={0}
              max={100}
              step={1}
              onValueChange={(v) => {
                setVolume(v[0]);
                if (v[0] > 0 && isMuted) setIsMuted(false);
              }}
              className="w-20 sm:w-28 hidden sm:flex"
              aria-label="Volumen"
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default MusicPlayer;
