import React from 'react';

export default function OnlineUsers({ count, status }) {
  if (status === 'unavailable' || status === 'error') {
    return null;
  }

  return (
    <div className="fixed top-4 left-1/2 -translate-x-1/2 z-30">
      <div className="glass-subtle px-4 py-1.5 rounded-full flex items-center gap-2">
        <span className="relative flex h-2 w-2">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75" />
          <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500" />
        </span>
        <span className="text-xs text-hyderabad-cream/80 font-body tracking-wide">
          {count} online
        </span>
      </div>
    </div>
  );
}
