import React, { useState, useRef, useEffect } from 'react';
import { X, GripVertical } from 'lucide-react';

export default function Playlist({
  songs,
  currentSongIndex,
  onPlaySong,
  onRemoveSong,
  onReorder,
  onClose,
  removable = true,
}) {
  const [draggedIndex, setDraggedIndex] = useState(null);
  const [dragOverIndex, setDragOverIndex] = useState(null);
  const dragNode = useRef(null);

  const handleDragStart = (e, index) => {
    dragNode.current = e.target;
    setDraggedIndex(index);
    e.dataTransfer.effectAllowed = 'move';
  };

  const handleDragOver = (e, index) => {
    e.preventDefault();
    setDragOverIndex(index);
  };

  const handleDrop = (e, dropIndex) => {
    e.preventDefault();
    if (draggedIndex !== null && draggedIndex !== dropIndex) {
      onReorder(draggedIndex, dropIndex);
    }
    setDraggedIndex(null);
    setDragOverIndex(null);
  };

  const handleDragEnd = () => {
    setDraggedIndex(null);
    setDragOverIndex(null);
  };

  return (
    <div className="fixed inset-0 z-40 flex items-end md:items-center justify-center md:justify-end p-0 md:p-6">
      <div
        className="absolute inset-0 bg-black/40 backdrop-blur-sm"
        onClick={onClose}
      />

      <div className="relative w-full md:w-96 h-[70vh] md:h-[80vh] glass-panel rounded-t-2xl md:rounded-2xl flex flex-col overflow-hidden shadow-2xl animate-slide-up">
        <div className="flex items-center justify-between px-6 py-4 border-b border-white/10">
          <div>
            <h2 className="font-display text-lg text-hyderabad-cream">My Bus Playlist</h2>
            <p className="text-xs text-hyderabad-cream/50 mt-0.5">{songs.length} songs</p>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-hyderabad-cream/60 hover:text-hyderabad-cream transition-colors"
            aria-label="Close playlist"
          >
            <X size={18} />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto custom-scrollbar p-3">
          {songs.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full text-center px-6">
              <p className="text-hyderabad-cream/40 text-sm mb-4">No songs yet</p>
            </div>
          ) : (
            <div className="space-y-1">
              {songs.map((song, index) => (
                <div
                  key={song.id}
                  draggable
                  onDragStart={(e) => handleDragStart(e, index)}
                  onDragOver={(e) => handleDragOver(e, index)}
                  onDrop={(e) => handleDrop(e, index)}
                  onDragEnd={handleDragEnd}
                  onClick={() => onPlaySong(index)}
                  className={`
                    flex items-center gap-2 px-3 py-2.5 rounded-lg cursor-pointer
                    transition-all duration-200 group
                    ${index === currentSongIndex
                      ? 'bg-white/10 text-hyderabad-cream'
                      : 'text-hyderabad-cream/70 hover:bg-white/5 hover:text-hyderabad-cream'
                    }
                    ${dragOverIndex === index && draggedIndex !== index ? 'border-t border-hyderabad-cream/30' : ''}
                  `}
                >
                  <div
                    className="p-1 text-hyderabad-cream/30 cursor-grab active:cursor-grabbing hover:text-hyderabad-cream/60 transition-colors flex-shrink-0"
                    onMouseDown={(e) => e.stopPropagation()}
                    draggable
                    onDragStart={(e) => {
                      e.stopPropagation();
                      handleDragStart(e, index);
                    }}
                  >
                    <GripVertical size={14} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <span className="text-xs opacity-50 w-5 text-right flex-shrink-0">
                        {index === currentSongIndex ? (
                          <span className="flex items-end gap-0.5 h-3 justify-end">
                            <span className="w-0.5 bg-hyderabad-cream animate-pulse" style={{ height: '40%', animationDelay: '0ms' }} />
                            <span className="w-0.5 bg-hyderabad-cream animate-pulse" style={{ height: '80%', animationDelay: '150ms' }} />
                            <span className="w-0.5 bg-hyderabad-cream animate-pulse" style={{ height: '60%', animationDelay: '300ms' }} />
                          </span>
                        ) : (
                          String(index + 1).padStart(2, '0')
                        )}
                      </span>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium truncate">{song.title}</p>
                        <p className="text-xs opacity-60 truncate">{song.artist}</p>
                      </div>
                    </div>
                  </div>
                  {removable && (
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        onRemoveSong(song.id);
                      }}
                      className="p-1 text-hyderabad-cream/40 hover:text-red-400 transition-colors opacity-0 group-hover:opacity-100"
                      aria-label="Remove"
                    >
                      <X size={14} />
                    </button>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
