import React, { useRef } from 'react';
import { Play, Pause, SkipBack, SkipForward, Shuffle, Repeat, Repeat1, Volume2, VolumeX } from 'lucide-react';

export default function PlayerControls({
  isPlaying,
  onPlayPause,
  onNext,
  onPrev,
  shuffle,
  onToggleShuffle,
  repeat,
  onToggleRepeat,
  volume,
  isMuted,
  onVolumeChange,
  onToggleMute,
  hasNext,
  hasPrev,
}) {
  const volumeRef = useRef(null);

  const handleVolumeClick = (e) => {
    if (!volumeRef.current) return;
    const rect = volumeRef.current.getBoundingClientRect();
    const percent = Math.max(0, Math.min(1, (e.clientX - rect.left) / rect.width));
    onVolumeChange(percent);
  };

  const RepeatIcon = repeat === 'one' ? Repeat1 : Repeat;

  return (
    <div className="flex items-center gap-3 md:gap-4">
      <button
        onClick={onToggleShuffle}
        className={`p-2 md:p-1.5 rounded-full transition-all duration-200 ${
          shuffle ? 'text-hyderabad-cream' : 'text-hyderabad-cream/40 hover:text-hyderabad-cream/70'
        }`}
        aria-label="Shuffle"
        title="Shuffle"
      >
        <Shuffle size={18} />
      </button>

      <button
        onClick={onPrev}
        disabled={!hasPrev}
        className={`p-2 md:p-1.5 rounded-full transition-all duration-200 ${
          hasPrev ? 'text-hyderabad-cream hover:text-white' : 'text-hyderabad-cream/20 cursor-not-allowed'
        }`}
        aria-label="Previous"
        title="Previous"
      >
        <SkipBack size={20} fill="currentColor" />
      </button>

      <button
        onClick={onPlayPause}
        disabled={!isPlaying && !hasNext && !hasPrev}
        className="p-3 md:p-2.5 rounded-full bg-hyderabad-cream text-hyderabad-dark hover:scale-105 active:scale-95 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg"
        aria-label={isPlaying ? 'Pause' : 'Play'}
        title={isPlaying ? 'Pause' : 'Play'}
      >
        {isPlaying ? <Pause size={22} fill="currentColor" /> : <Play size={22} fill="currentColor" className="ml-0.5" />}
      </button>

      <button
        onClick={onNext}
        disabled={!hasNext}
        className={`p-2 md:p-1.5 rounded-full transition-all duration-200 ${
          hasNext ? 'text-hyderabad-cream hover:text-white' : 'text-hyderabad-cream/20 cursor-not-allowed'
        }`}
        aria-label="Next"
        title="Next"
      >
        <SkipForward size={20} fill="currentColor" />
      </button>

      <button
        onClick={onToggleRepeat}
        className={`p-2 md:p-1.5 rounded-full transition-all duration-200 ${
          repeat !== 'off' ? 'text-hyderabad-cream' : 'text-hyderabad-cream/40 hover:text-hyderabad-cream/70'
        }`}
        aria-label={`Repeat: ${repeat}`}
        title={`Repeat: ${repeat}`}
      >
        <RepeatIcon size={18} />
      </button>

      <div className="hidden md:flex items-center gap-1.5 ml-1">
        <button
          onClick={onToggleMute}
          className="p-1 text-hyderabad-cream/60 hover:text-hyderabad-cream transition-colors"
          aria-label={isMuted ? 'Unmute' : 'Mute'}
          title={isMuted ? 'Unmute' : 'Mute'}
        >
          {isMuted ? <VolumeX size={14} /> : <Volume2 size={14} />}
        </button>
        <div
          ref={volumeRef}
          className="w-16 h-1 bg-white/20 rounded-full cursor-pointer"
          onClick={handleVolumeClick}
        >
          <div
            className="h-full bg-hyderabad-cream/70 rounded-full"
            style={{ width: `${(isMuted ? 0 : volume) * 100}%` }}
          />
        </div>
      </div>
    </div>
  );
}
