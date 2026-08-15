const DB_NAME = 'music-player';
const DB_VERSION = 1;
const STORE_NAME = 'playlist';

function openDB() {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open(DB_NAME, DB_VERSION);

    request.onerror = () => reject(request.error);
    request.onsuccess = () => resolve(request.result);

    request.onupgradeneeded = (event) => {
      const db = event.target.result;
      if (!db.objectStoreNames.contains(STORE_NAME)) {
        const store = db.createObjectStore(STORE_NAME, { keyPath: 'id' });
        store.createIndex('order', 'order', { unique: false });
      }
    };
  });
}

export async function saveSongsToDB(songs) {
  try {
    const db = await openDB();
    const tx = db.transaction(STORE_NAME, 'readwrite');
    const store = tx.objectStore(STORE_NAME);

    await store.clear();

    for (const song of songs) {
      await store.put(song);
    }

    return new Promise((resolve, reject) => {
      tx.oncomplete = () => resolve();
      tx.onerror = () => reject(tx.error);
    });
  } catch (error) {
    console.error('Failed to save songs to IndexedDB:', error);
    throw error;
  }
}

export async function loadSongsFromDB() {
  try {
    const db = await openDB();
    const tx = db.transaction(STORE_NAME, 'readonly');
    const store = tx.objectStore(STORE_NAME);
    const request = store.getAll();

    return new Promise((resolve, reject) => {
      request.onsuccess = () => {
        const songs = request.result || [];
        songs.sort((a, b) => (a.order || 0) - (b.order || 0));
        resolve(songs);
      };
      request.onerror = () => reject(request.error);
    });
  } catch (error) {
    console.error('Failed to load songs from IndexedDB:', error);
    return [];
  }
}

export async function clearPlaylistDB() {
  try {
    const db = await openDB();
    const tx = db.transaction(STORE_NAME, 'readwrite');
    const store = tx.objectStore(STORE_NAME);
    await store.clear();

    return new Promise((resolve, reject) => {
      tx.oncomplete = () => resolve();
      tx.onerror = () => reject(tx.error);
    });
  } catch (error) {
    console.error('Failed to clear playlist:', error);
  }
}

export async function saveSettings(key, value) {
  try {
    localStorage.setItem(`music-player-${key}`, JSON.stringify(value));
  } catch (error) {
    console.error('Failed to save setting:', error);
  }
}

export async function loadSettings(key, defaultValue = null) {
  try {
    const item = localStorage.getItem(`music-player-${key}`);
    return item ? JSON.parse(item) : defaultValue;
  } catch (error) {
    console.error('Failed to load setting:', error);
    return defaultValue;
  }
}
