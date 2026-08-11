export class AudioService {
  constructor() {
    this.audio = new Audio();
    this.audio.preload = 'metadata';
    this._currentObjectURL = null;
    this._currentFile = null;

    this.audio.addEventListener('ended', () => {
      if (this.onEnded) {
        this.onEnded();
      }
    });

    this.audio.addEventListener('timeupdate', () => {
      if (this.onTimeUpdate) {
        this.onTimeUpdate(this.audio.currentTime, this.audio.duration);
      }
    });

    this.audio.addEventListener('loadedmetadata', () => {
      if (this.onLoaded) {
        this.onLoaded(this.audio.duration);
      }
    });

    this.audio.addEventListener('error', (e) => {
      if (this.onError) {
        this.onError(e);
      }
    });
  }

  loadSong(file) {
    if (this._currentObjectURL) {
      URL.revokeObjectURL(this._currentObjectURL);
    }

    this._currentFile = file;
    this._currentObjectURL = URL.createObjectURL(file);
    this.audio.src = this._currentObjectURL;
    this.audio.load();
  }

  play() {
    return this.audio.play();
  }

  pause() {
    this.audio.pause();
  }

  seek(time) {
    this.audio.currentTime = time;
  }

  setVolume(volume) {
    this.audio.volume = Math.max(0, Math.min(1, volume));
  }

  toggleMute() {
    this.audio.muted = !this.audio.muted;
    return this.audio.muted;
  }

  getCurrentTime() {
    return this.audio.currentTime;
  }

  getDuration() {
    return this.audio.duration;
  }

  isPlaying() {
    return !this.audio.paused;
  }

  getMuted() {
    return this.audio.muted;
  }

  destroy() {
    if (this._currentObjectURL) {
      URL.revokeObjectURL(this._currentObjectURL);
    }
    this.audio.pause();
    this.audio.src = '';
  }
}

export const audioService = new AudioService();
