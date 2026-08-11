import { useState, useEffect, useCallback } from 'react';
import { saveSettings, loadSettings } from '../services/storageService';

export function usePlaylist(songs) {
  const [currentSongIndex, setCurrentSongIndex] = useState(0);
  const [shuffle, setShuffle] = useState(false);
  const [repeat, setRepeat] = useState('all');
  const [shuffleOrder, setShuffleOrder] = useState([]);
  const [shuffleIndex, setShuffleIndex] = useState(0);
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    async function init() {
      const savedShuffle = await loadSettings('shuffle', false);
      const savedRepeat = await loadSettings('repeat', 'all');
      const savedIndex = await loadSettings('currentSongIndex', 0);

      setShuffle(savedShuffle);
      setRepeat(savedRepeat);
      setCurrentSongIndex(Math.min(savedIndex, Math.max(0, songs.length - 1)));
      setIsLoaded(true);
    }

    init();
  }, [songs.length]);

  useEffect(() => {
    if (songs.length > 0) {
      saveSettings('currentSongIndex', currentSongIndex);
    }
  }, [currentSongIndex, songs.length]);

  useEffect(() => {
    saveSettings('shuffle', shuffle);
    if (shuffle && songs.length > 0) {
      generateShuffleOrder();
    }
  }, [shuffle, songs.length]);

  useEffect(() => {
    saveSettings('repeat', repeat);
  }, [repeat]);

  const generateShuffleOrder = useCallback(() => {
    const indices = Array.from({ length: songs.length }, (_, i) => i);
    for (let i = indices.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [indices[i], indices[j]] = [indices[j], indices[i]];
    }
    setShuffleOrder(indices);
    setShuffleIndex(0);
  }, [songs.length]);

  const getNextIndex = useCallback(() => {
    if (songs.length === 0) return 0;

    if (repeat === 'one') {
      return currentSongIndex;
    }

    if (shuffle) {
      if (shuffleOrder.length === 0) {
        generateShuffleOrder();
      }
      const nextShuffleIndex = (shuffleIndex + 1) % shuffleOrder.length;
      setShuffleIndex(nextShuffleIndex);
      return shuffleOrder[nextShuffleIndex];
    }

    if (repeat === 'all') {
      return (currentSongIndex + 1) % songs.length;
    }

    return currentSongIndex + 1 >= songs.length ? currentSongIndex : currentSongIndex + 1;
  }, [currentSongIndex, songs.length, repeat, shuffle, shuffleOrder, shuffleIndex, generateShuffleOrder]);

  const getPrevIndex = useCallback(() => {
    if (songs.length === 0) return 0;

    if (shuffle) {
      if (shuffleOrder.length === 0) {
        generateShuffleOrder();
      }
      const prevShuffleIndex = (shuffleIndex - 1 + shuffleOrder.length) % shuffleOrder.length;
      setShuffleIndex(prevShuffleIndex);
      return shuffleOrder[prevShuffleIndex];
    }

    return currentSongIndex - 1 < 0 ? songs.length - 1 : currentSongIndex - 1;
  }, [currentSongIndex, songs.length, shuffle, shuffleOrder, shuffleIndex, generateShuffleOrder]);

  const playNext = useCallback(() => {
    const nextIndex = getNextIndex();
    setCurrentSongIndex(nextIndex);
  }, [getNextIndex]);

  const playPrev = useCallback(() => {
    const prevIndex = getPrevIndex();
    setCurrentSongIndex(prevIndex);
  }, [getPrevIndex]);

  const playSong = useCallback((index) => {
    setCurrentSongIndex(index);
  }, []);

  const toggleShuffle = useCallback(() => {
    setShuffle(prev => !prev);
  }, []);

  const toggleRepeat = useCallback(() => {
    setRepeat(prev => {
      if (prev === 'off') return 'all';
      if (prev === 'all') return 'one';
      return 'off';
    });
  }, []);

  const reorderSongs = useCallback(async (fromIndex, toIndex) => {
    // For folder-based songs, reordering is just UI state
    // We don't persist reorder since files are static in the folder
    setCurrentSongIndex(prev => {
      if (prev === fromIndex) return toIndex;
      if (fromIndex < prev && toIndex >= prev) return prev - 1;
      if (fromIndex > prev && toIndex <= prev) return prev + 1;
      return prev;
    });
  }, []);

  return {
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
  };
}
