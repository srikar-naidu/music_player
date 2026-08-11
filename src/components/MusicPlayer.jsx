import React, { useState, useCallback } from 'react';
import { List } from 'lucide-react';
import CDPlayer from './CDPlayer';
import ProgressBar from './ProgressBar';
import PlayerControls from './PlayerControls';
import Playlist from './Playlist';
import AddSongs from './AddSongs';

export default function MusicPlayer({
  songs,
  currentSongIndex,
  isPlaying,
  currentTime,
  duration,
  volume,
  isMuted,
  hasStarted,
  isLoading,
  shuffle,
  repeat,
  onPlayPause,
  onSeek,
  onNext,
  onPrev,
  onVolumeChange,
  onToggleMute,
  onToggleShuffle,
  onToggleRepeat,
  onAddFiles,
  onRemoveSong,
  onReorder,
  onPlaySong,
  hasNext,
  hasPrev,
}) {
  const [showPlaylist, setShowPlaylist] = useState(false);

  const currentSong = songs[currentSongIndex];
  const cdSrc = currentSong?.cd || '/assets/cds/song-01.png';

  const handleAddSongs = useCallback(() => {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = 'audio/*';
    input.multiple = true;
    input.onchange = (e) => {
      const files = Array.from(e.target.files || []);
      if (files.length > 0) {
        onAddFiles(files);
      }
    };
    input.click();
  }, [onAddFiles]);

  if (!hasStarted || songs.length === 0) {
    return null;
  }

  const title = currentSong?.title || 'No song selected';
  const artist = currentSong?.artist || '';

  return (
    <>
      <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-20 w-[90%] md:w-[40%] max-w-2xl">
        <div className="glass-panel rounded-2xl md:rounded-full p-3 md:p-4 shadow-2xl">
          <div className="flex items-center gap-3 md:gap-5">
            <CDPlayer src={cdSrc} isPlaying={isPlaying} />

            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 mb-1">
                <button
                  onClick={() => setShowPlaylist(true)}
                  className="p-1 text-hyderabad-cream/40 hover:text-hyderabad-cream transition-colors hidden md:block"
                  aria-label="Open playlist"
                  title="Playlist"
                >
                  <List size={14} />
                </button>
                <div className="flex-1 min-w-0">
                  <h3 className="text-sm md:text-base font-medium text-hyderabad-cream truncate">
                    {title}
                  </h3>
                  <p className="text-xs text-hyderabad-cream/60 truncate">{artist}</p>
                </div>
              </div>
              <ProgressBar
                currentTime={currentTime}
                duration={duration}
                onSeek={onSeek}
              />
            </div>

            <PlayerControls
              isPlaying={isPlaying}
              onPlayPause={onPlayPause}
              onNext={onNext}
              onPrev={onPrev}
              shuffle={shuffle}
              onToggleShuffle={onToggleShuffle}
              repeat={repeat}
              onToggleRepeat={onToggleRepeat}
              volume={volume}
              isMuted={isMuted}
              onVolumeChange={onVolumeChange}
              onToggleMute={onToggleMute}
              hasNext={hasNext}
              hasPrev={hasPrev}
            />
          </div>

          <div className="flex items-center justify-between mt-2 md:hidden">
            <AddSongs onFilesSelected={onAddFiles} buttonLabel="+ Add" />
            <button
              onClick={() => setShowPlaylist(true)}
              className="text-xs text-hyderabad-cream/60 hover:text-hyderabad-cream transition-colors"
            >
              Playlist
            </button>
          </div>
        </div>
      </div>

      {showPlaylist && (
        <Playlist
          songs={songs}
          currentSongIndex={currentSongIndex}
          onPlaySong={onPlaySong}
          onRemoveSong={onRemoveSong}
          onReorder={onReorder}
          onClose={() => setShowPlaylist(false)}
          removable={false}
        />
      )}
    </>
  );
}
