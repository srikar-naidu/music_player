const FALLBACK_CD = '/assets/cds/song-01.png';

function parseFilename(filename) {
  const stem = filename.replace(/\.[^/.]+$/, '');
  const parts = stem.split(' - ').map(s => s.trim());

  let number = '';
  let title = stem;
  let artist = 'Unknown Artist';

  if (parts.length >= 3 && /^\d+$/.test(parts[0])) {
    number = parts[0];
    title = parts[1];
    artist = parts[2] || 'Unknown Artist';
  } else if (parts.length === 2) {
    title = parts[0];
    artist = parts[1] || 'Unknown Artist';
  } else if (parts.length === 1) {
    title = parts[0];
  }

  return { number, title, artist, stem };
}

export function buildSongsFromGlob(globModule) {
  const entries = Object.entries(globModule)
    .map(([path, module]) => {
      const filename = path.split('/').pop() || path;
      const parsed = parseFilename(filename);
      const stem = parsed.stem || filename.replace(/\.[^/.]+$/, '');
      
      return {
        id: stem.toLowerCase().replace(/\s+/g, '-'),
        title: parsed.title || filename.replace(/\.[^/.]+$/, ''),
        artist: parsed.artist,
        number: parsed.number,
        src: module.default,
        cd: `/assets/cds/${stem}.png`,
        filename,
      };
    })
    .sort((a, b) => {
      if (a.number && b.number) {
        return parseInt(a.number) - parseInt(b.number);
      }
      return a.filename.localeCompare(b.filename);
    });

  return entries;
}

export { FALLBACK_CD };

export default [];
