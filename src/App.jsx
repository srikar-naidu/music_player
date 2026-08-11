import React, { useState, useCallback, useEffect, useRef } from 'react';
import MusicPlayer from './components/MusicPlayer';
import EmptyState from './components/EmptyState';
import OnlineUsers from './components/OnlineUsers';
import { usePlaylist } from './hooks/usePlaylist';
import { usePresence } from './hooks/usePresence';
import { buildSongsFromGlob, FALLBACK_CD } from './data/songs';
import { audioService } from './services/audioService';

const musicGlob = import.meta.glob('/src/assets/music/*.{mp3,wav,m4a,ogg}', { eager: true });
const autoSongs = buildSongsFromGlob(musicGlob);

export default function App() {
  const {
    songs,
    currentSongIndex,
    shuffle,
    repeat,
    isLoaded,
    playNext,
    playPrev,
    playSong,
    toggleShuffle,
    toggleRepeat,
    reorderSongs,
  } = usePlaylist(autoSongs);

  const { onlineCount, status } = usePresence();

  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [volume, setVolume] = useState(1);
  const [isMuted, setIsMuted] = useState(false);
  const prevSongIndexRef = useRef(currentSongIndex);

  useEffect(() => {
    const savedVolume = localStorage.getItem('hyderabad-deluxe-volume');
    const savedMuted = localStorage.getItem('hyderabad-deluxe-muted');
    if (savedVolume) {
      const vol = parseFloat(savedVolume);
      setVolume(vol);
      audioService.setVolume(vol);
    }
    if (savedMuted) {
      const muted = savedMuted === 'true';
      setIsMuted(muted);
      audioService.setVolume(muted ? 0 : parseFloat(savedVolume || 1));
    }
  }, []);

  useEffect(() => {
    audioService.onEnded = () => {
      playNext();
    };

    audioService.onTimeUpdate = (time, dur) => {
      setCurrentTime(time);
      if (dur && dur !== Infinity) {
        setDuration(dur);
      }
    };

    audioService.onLoaded = (dur) => {
      setDuration(dur);
      setIsPlaying(true);
    };

    audioService.onError = () => {
      setIsPlaying(false);
    };

    return () => {
      audioService.onEnded = null;
      audioService.onTimeUpdate = null;
      audioService.onLoaded = null;
      audioService.onError = null;
    };
  }, [playNext]);

  useEffect(() => {
    if (currentSongIndex !== prevSongIndexRef.current) {
      prevSongIndexRef.current = currentSongIndex;
      const song = songs[currentSongIndex];
      if (song?.src) {
        audioService.loadSong(song.src);
        audioService.play()
          .then(() => setIsPlaying(true))
          .catch(() => setIsPlaying(false));
      } else {
        setIsPlaying(false);
      }
    }
  }, [currentSongIndex, songs]);

  useEffect(() => {
    function handleKeyDown(e) {
      if (e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA' || e.target.isContentEditable) {
        return;
      }

      switch (e.key) {
        case ' ':
          e.preventDefault();
          handlePlayPause();
          break;
        case 'ArrowRight':
          e.preventDefault();
          handleNext();
          break;
        case 'ArrowLeft':
          e.preventDefault();
          handlePrev();
          break;
        case 'ArrowUp':
          e.preventDefault();
          handleVolumeChange(Math.min(1, volume + 0.05));
          break;
        case 'ArrowDown':
          e.preventDefault();
          handleVolumeChange(Math.max(0, volume - 0.05));
          break;
        case 'm':
        case 'M':
          handleToggleMute();
          break;
        default:
          break;
      }
    }

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [volume, handlePlayPause, handleNext, handlePrev, handleVolumeChange, handleToggleMute]);

  const handlePlayPause = useCallback(async () => {
    try {
      if (isPlaying) {
        audioService.pause();
        setIsPlaying(false);
      } else {
        await audioService.play();
        setIsPlaying(true);
      }
    } catch (error) {
      console.error('Playback error:', error);
    }
  }, [isPlaying]);

  const handleSeek = useCallback((time) => {
    audioService.seek(time);
    setCurrentTime(time);
  }, []);

  const handleNext = useCallback(() => {
    playNext();
  }, [playNext]);

  const handlePrev = useCallback(() => {
    playPrev();
  }, [playPrev]);

  const handleVolumeChange = useCallback((newVolume) => {
    audioService.setVolume(newVolume);
    setVolume(newVolume);
    localStorage.setItem('hyderabad-deluxe-volume', newVolume.toString());
  }, []);

  const handleToggleMute = useCallback(() => {
    const muted = audioService.toggleMute();
    setIsMuted(muted);
    localStorage.setItem('hyderabad-deluxe-muted', muted.toString());
  }, []);

  const handleAddFiles = useCallback(async (files) => {
    // Optional: allow adding more songs via file picker
    // These will be played in addition to folder songs
    // For simplicity, we just append to the current session
    // (not persisted since they're local files)
    console.log('Additional files selected:', files.length);
    // In a full implementation, you'd merge these with autoSongs
  }, []);

  const handleRemoveSong = useCallback(async (songId) => {
    // Cannot remove folder-based songs
    console.log('Cannot remove folder-based songs');
  }, []);

  const handleReorder = useCallback(async (fromIndex, toIndex) => {
    await reorderSongs(fromIndex, toIndex);
  }, [reorderSongs]);

  const hasNext = songs.length > 1 || repeat !== 'off';
  const hasPrev = songs.length > 1;

  if (!isLoaded) {
    return (
      <div className="fixed inset-0 flex items-center justify-center">
        <div className="text-hyderabad-cream/60 text-sm">Loading...</div>
      </div>
    );
  }

  const hasSongs = songs.length > 0;

  return (
    <div className="relative w-full h-screen overflow-hidden">
      <div
        className="absolute inset-0 bg-cover bg-center bg-no-repeat"
        style={{
          backgroundImage: 'url(/assets/background.png)',
          backgroundSize: 'cover',
          backgroundPosition: 'center',
        }}
      />

      <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-black/10" />

      <OnlineUsers count={onlineCount} status={status} />

      {!hasSongs ? (
        <EmptyState onAddSongs={() => {
          const input = document.createElement('input');
          input.type = 'file';
          input.accept = 'audio/*';
          input.multiple = true;
          input.onchange = (e) => {
            const files = Array.from(e.target.files || []);
            if (files.length > 0) {
              handleAddFiles(files);
            }
          };
          input.click();
        }} />
      ) : (
        <MusicPlayer
          songs={songs}
          currentSongIndex={currentSongIndex}
          isPlaying={isPlaying}
          currentTime={currentTime}
          duration={duration}
          volume={volume}
          isMuted={isMuted}
          hasStarted={true}
          isLoading={false}
          shuffle={shuffle}
          repeat={repeat}
          onPlayPause={handlePlayPause}
          onSeek={handleSeek}
          onNext={handleNext}
          onPrev={handlePrev}
          onVolumeChange={handleVolumeChange}
          onToggleMute={handleToggleMute}
          onToggleShuffle={toggleShuffle}
          onToggleRepeat={toggleRepeat}
          onAddFiles={handleAddFiles}
          onRemoveSong={handleRemoveSong}
          onReorder={handleReorder}
          hasNext={hasNext}
          hasPrev={hasPrev}
          onPlaySong={playSong}
        />
      )}
    </div>
  );
}
