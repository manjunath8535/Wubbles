import React from 'react';

// showing the funny loading bar with spinner to show the user something is happening.

export default function LoadingSpinner() {
  return (
    <div className="flex flex-col items-center justify-center p-8 text-white">
      <div className="w-16 h-16 border-4 border-dashed rounded-full animate-spin border-pink-400"></div>
      <p className="mt-4 text-lg font-medium">Generating your QuickTune...</p>
      
      {/* Fun progress bar as a bonus feature. */}
      <div className="w-full max-w-xs h-2 bg-white/20 rounded-full mt-4 overflow-hidden">
          <div className="h-full bg-gradient-to-r from-pink-500 to-violet-500 animate-progress"></div>
      </div>
      <style>{`
        @keyframes progress {
            0% { width: 0%; }
            100% { width: 100%; }
        }
        .animate-progress {
            animation: progress 2s linear forwards;
        }
      `}</style>
    </div>
  );
}