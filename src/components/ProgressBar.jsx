import React, { useRef, useState, useCallback, useEffect } from 'react';

export default function ProgressBar({ currentTime, duration, onSeek }) {
  const progressRef = useRef(null);
  const [isDragging, setIsDragging] = useState(false);

  const formatTime = (time) => {
    if (!time || isNaN(time)) return '0:00';
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  };

  const handleClick = useCallback((e) => {
    if (!progressRef.current || !duration) return;
    const rect = progressRef.current.getBoundingClientRect();
    const percent = Math.max(0, Math.min(1, (e.clientX - rect.left) / rect.width));
    onSeek(percent * duration);
  }, [duration, onSeek]);

  const handleMouseDown = useCallback((e) => {
    setIsDragging(true);
    handleClick(e);
  }, [handleClick]);

  useEffect(() => {
    if (!isDragging) return;

    function handleMouseMove(e) {
      if (!progressRef.current || !duration) return;
      const rect = progressRef.current.getBoundingClientRect();
      const percent = Math.max(0, Math.min(1, (e.clientX - rect.left) / rect.width));
      onSeek(percent * duration);
    }

    function handleMouseUp() {
      setIsDragging(false);
    }

    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('mouseup', handleMouseUp);

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseup', handleMouseUp);
    };
  }, [isDragging, duration, onSeek]);

  const progress = duration ? (currentTime / duration) * 100 : 0;

  return (
    <div className="w-full px-1">
      <div
        ref={progressRef}
        className="relative w-full h-1 bg-white/20 rounded-full cursor-pointer group"
        onMouseDown={handleMouseDown}
      >
        <div
          className="absolute top-0 left-0 h-full bg-hyderabad-cream rounded-full transition-all duration-100"
          style={{ width: `${progress}%` }}
        />
        <div
          className="absolute top-1/2 -translate-y-1/2 w-2 h-2 bg-hyderabad-cream rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
          style={{ left: `${progress}%`, marginLeft: '-4px' }}
        />
      </div>
      <div className="flex justify-between mt-1.5 text-[10px] text-hyderabad-cream/60 font-body">
        <span>{formatTime(currentTime)}</span>
        <span>{formatTime(duration)}</span>
      </div>
    </div>
  );
}
