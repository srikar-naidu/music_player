const SONG_METADATA = {
  "01": {
    title: "Ilahi",
    artist: "Mohit Chauhan",
  },
  "02": {
    title: "Kun Faya Kun",
    artist: "A.R. Rahman",
  },
  "03": {
    title: "Safarnama",
    artist: "Lucky Ali",
  },
};

export function getSongMetadata(stem) {
  const key = stem.replace(/^0+/, '') || stem;
  return SONG_METADATA[key] || { title: stem, artist: "Unknown Artist" };
}

export function getAllMetadata() {
  return SONG_METADATA;
}

export default SONG_METADATA;
