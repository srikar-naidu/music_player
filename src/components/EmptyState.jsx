import React from 'react';

export default function EmptyState({ onAddSongs }) {
  return (
    <div className="fixed inset-0 flex items-center justify-center z-10 pointer-events-none">
      <div className="text-center pointer-events-auto px-6">
        <h1 className="font-display text-4xl md:text-5xl text-hyderabad-cream mb-3 tracking-wide drop-shadow-lg">
          HYDERABAD DELUXE
        </h1>
        <p className="font-body text-hyderabad-warm text-sm md:text-base mb-8 tracking-widest uppercase opacity-80">
          Your daily ride. Your daily soundtrack.
        </p>
        <div className="glass-panel rounded-2xl p-6 max-w-md mx-auto text-left mb-6">
          <p className="text-hyderabad-cream/80 text-sm mb-3 font-medium">Quick Setup:</p>
          <ol className="text-hyderabad-cream/60 text-xs space-y-1.5 list-decimal list-inside">
            <li>Drop your <span className="text-hyderabad-cream">.mp3</span> files into <code className="text-hyderabad-terracotta">src/assets/music/</code></li>
            <li>Drop matching CD art <span className="text-hyderabad-cream">.png</span> into <code className="text-hyderabad-terracotta">public/cds/</code></li>
            <li>Name them like: <code className="text-hyderabad-terracotta">01 - Song Title - Artist.mp3</code></li>
            <li>CD art: <code className="text-hyderabad-terracotta">01 - Song Title - Artist.png</code></li>
          </ol>
        </div>
        <button
          onClick={onAddSongs}
          className="glass-panel px-8 py-3 rounded-full text-hyderabad-cream font-body text-sm tracking-wider hover:bg-white/10 transition-all duration-300 hover:scale-105 active:scale-95"
        >
          + Add Songs (optional)
        </button>
      </div>
    </div>
  );
}
