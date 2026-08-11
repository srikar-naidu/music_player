import React, { useRef } from 'react';
import { Upload } from 'lucide-react';

export default function AddSongs({ onFilesSelected, buttonLabel = '+ Add Songs' }) {
  const inputRef = useRef(null);

  const handleClick = () => {
    inputRef.current?.click();
  };

  const handleChange = (e) => {
    const files = Array.from(e.target.files || []);
    if (files.length > 0) {
      onFilesSelected(files);
    }
    e.target.value = '';
  };

  return (
    <>
      <input
        ref={inputRef}
        type="file"
        accept="audio/*"
        multiple
        className="hidden"
        onChange={handleChange}
      />
      <button
        onClick={handleClick}
        className="inline-flex items-center gap-2 px-5 py-2 rounded-full glass-panel text-hyderabad-cream text-sm hover:bg-white/10 transition-all duration-300 hover:scale-105 active:scale-95"
      >
        <Upload size={14} />
        {buttonLabel}
      </button>
    </>
  );
}
