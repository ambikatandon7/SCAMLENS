import React, { useState, useRef, useEffect } from 'react';
import { Volume2, Play, Pause, RotateCcw } from 'lucide-react';

interface AudioNarrationButtonProps {
  className?: string;
  audioSrc?: string;
}

export const AudioNarrationButton: React.FC<AudioNarrationButtonProps> = ({
  className = '',
  audioSrc = '/audio/narration.mp3',
}) => {
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [duration, setDuration] = useState<number>(0);
  const [currentTime, setCurrentTime] = useState<number>(0);
  const [hasError, setHasError] = useState<boolean>(false);

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    const handleLoadedMetadata = () => {
      setDuration(audio.duration || 0);
      setHasError(false);
    };

    const handleTimeUpdate = () => {
      setCurrentTime(audio.currentTime || 0);
    };

    const handleEnded = () => {
      setIsPlaying(false);
      setCurrentTime(0);
    };

    const handleError = () => {
      // If /audio/narration.mp3 fails, attempt /audio/intro.mp3 fallback
      if (audio.src.includes('narration.mp3')) {
        audio.src = '/audio/intro.mp3';
        audio.load();
      } else {
        setHasError(true);
        setIsPlaying(false);
      }
    };

    audio.addEventListener('loadedmetadata', handleLoadedMetadata);
    audio.addEventListener('timeupdate', handleTimeUpdate);
    audio.addEventListener('ended', handleEnded);
    audio.addEventListener('error', handleError);

    return () => {
      audio.removeEventListener('loadedmetadata', handleLoadedMetadata);
      audio.removeEventListener('timeupdate', handleTimeUpdate);
      audio.removeEventListener('ended', handleEnded);
      audio.removeEventListener('error', handleError);
    };
  }, []);

  const togglePlayPause = () => {
    const audio = audioRef.current;
    if (!audio) return;

    if (isPlaying) {
      audio.pause();
      setIsPlaying(false);
    } else {
      const playPromise = audio.play();
      if (playPromise !== undefined) {
        playPromise
          .then(() => {
            setIsPlaying(true);
          })
          .catch((err) => {
            console.warn('Playback prevented or file loading:', err);
            setIsPlaying(false);
          });
      }
    }
  };

  const handleRestart = (e: React.MouseEvent) => {
    e.stopPropagation();
    const audio = audioRef.current;
    if (!audio) return;
    audio.currentTime = 0;
    setCurrentTime(0);
    if (!isPlaying) {
      audio.play().then(() => setIsPlaying(true)).catch(() => {});
    }
  };

  const formatTime = (secs: number) => {
    const m = Math.floor(secs / 60);
    const s = Math.floor(secs % 60);
    return `${m}:${s < 10 ? '0' : ''}${s}`;
  };

  return (
    <div className={`inline-flex flex-col sm:flex-row items-center gap-2 ${className}`}>
      {/* Hidden Accessible HTML5 Audio Element (NO AUTOPLAY) */}
      <audio
        ref={audioRef}
        src={audioSrc}
        preload="metadata"
        aria-hidden="true"
      />

      {/* Main Accessible Play/Pause Button */}
      <button
        type="button"
        onClick={togglePlayPause}
        aria-label={isPlaying ? 'Pause audio narration briefing' : 'Play audio narration briefing'}
        aria-pressed={isPlaying}
        aria-live="polite"
        className={`group relative inline-flex items-center gap-2.5 px-4 py-2 rounded-full border backdrop-blur-md transition-all duration-200 select-none cursor-pointer focus:outline-none focus:ring-2 focus:ring-cyan-400 focus:ring-offset-2 focus:ring-offset-slate-950 ${
          isPlaying
            ? 'bg-cyan-950/80 border-cyan-400 text-cyan-200 shadow-[0_0_20px_rgba(0,240,255,0.35)]'
            : 'bg-slate-900/80 hover:bg-slate-800 border-cyan-500/30 hover:border-cyan-400/60 text-slate-300 hover:text-white shadow-[0_0_12px_rgba(0,240,255,0.15)]'
        }`}
      >
        {/* Small Speaker Icon */}
        <span className="p-1 rounded-full bg-cyan-500/10 border border-cyan-500/20 text-cyan-400 group-hover:text-cyan-300 transition-colors">
          <Volume2 className="w-3.5 h-3.5" aria-hidden="true" />
        </span>

        {/* Play / Pause Toggle Icon */}
        <span className="w-5 h-5 rounded-full bg-cyan-500 text-slate-950 flex items-center justify-center font-bold shadow-sm transition-transform group-hover:scale-105">
          {isPlaying ? (
            <Pause className="w-3 h-3 fill-slate-950 stroke-[2.5]" aria-hidden="true" />
          ) : (
            <Play className="w-3 h-3 fill-slate-950 translate-x-[0.5px]" aria-hidden="true" />
          )}
        </span>

        {/* Text Status Label */}
        <span className="text-xs font-mono font-medium tracking-wide">
          {isPlaying ? (
            <span className="flex items-center gap-1.5">
              <span>Playing Audio Briefing</span>
              {/* Subtle Animated Audio Waveform */}
              <span className="inline-flex items-center gap-0.5 ml-1" aria-hidden="true">
                <span className="w-0.5 h-2.5 bg-cyan-400 animate-pulse" />
                <span className="w-0.5 h-4 bg-cyan-300 animate-pulse delay-75" />
                <span className="w-0.5 h-2 bg-cyan-400 animate-pulse delay-150" />
              </span>
            </span>
          ) : (
            <span>Listen to Narration</span>
          )}
        </span>

        {/* Time Badge */}
        {duration > 0 && (
          <span className="text-[11px] font-mono opacity-60 ml-0.5" aria-hidden="true">
            {isPlaying ? formatTime(currentTime) : formatTime(duration)}
          </span>
        )}

        {hasError && (
          <span className="text-[10px] text-amber-400 font-mono" title="Audio file loading error">
            (File unavailable)
          </span>
        )}
      </button>

      {/* Restart quick button if playing or paused mid-way */}
      {currentTime > 0 && (
        <button
          type="button"
          onClick={handleRestart}
          aria-label="Restart audio narration from beginning"
          title="Restart audio"
          className="p-1.5 rounded-full bg-slate-900/60 hover:bg-slate-800 border border-slate-700 text-slate-400 hover:text-cyan-300 text-xs transition"
        >
          <RotateCcw className="w-3 h-3" />
        </button>
      )}
    </div>
  );
};
