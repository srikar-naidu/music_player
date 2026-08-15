import React from 'react';

export default function CDPlayer({ src, isPlaying }) {
  return (
    <div className="relative flex-shrink-0 w-12 h-12 md:w-16 md:h-16">
      <div
        className={`w-full h-full rounded-full overflow-hidden shadow-lg border-2 border-white/10 ${
          isPlaying ? 'cd-spinning' : 'cd-spinning cd-paused'
        }`}
        style={{
          backgroundImage: `url(${src})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
        }}
      >
        <div className="w-full h-full rounded-full" style={{
          background: 'radial-gradient(circle at center, rgba(0,0,0,0.3) 0%, rgba(0,0,0,0.6) 15%, transparent 15%)',
        }} />
      </div>
      <div className="absolute inset-0 rounded-full shadow-inner" style={{
        background: 'radial-gradient(circle at center, rgba(0,0,0,0.4) 0%, transparent 50%)',
      }} />
    </div>
  );
}
