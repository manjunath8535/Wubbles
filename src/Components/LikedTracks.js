import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { toggleLike, setCurrentTrack } from '../app/slices/musicSlice';

export default function LikedTracks() {
  // Showing the liked tracks, if the tracks is liked. The below div will appear.
  const dispatch = useDispatch();
  const { likedTracks, currentTrack } = useSelector((state) => state.music);

  if (likedTracks.length === 0) {
    return null;
  }
  
  const handlePlayTrack = (track) => {
    dispatch(setCurrentTrack(track));
  };

  const handleUnlikeTrack = (e, track) => {
    e.stopPropagation(); 
    dispatch(toggleLike(track));
  };
  
  return (
    <div className="w-full p-4 md:p-6 rounded-2xl glass text-gray-800 dark:text-white">
      <h2 className="text-2xl font-bold mb-4">Your Liked Tracks</h2>
      
      <ul className="space-y-3">
        {likedTracks.map((track) => {
          const isPlaying = currentTrack?.id === track.id;
          return (
            <li 
              key={track.id} 
              onClick={() => handlePlayTrack(track)}
              className={`flex items-center justify-between p-3 rounded-lg transition-colors cursor-pointer ${isPlaying ? 'bg-black/20 dark:bg-white/30' : 'bg-black/5 dark:bg-white/10 hover:bg-black/10 dark:hover:bg-white/20'}`}
            >
              <div className="flex items-center gap-4">
                  <i className={`text-xl bi ${isPlaying ? 'bi-volume-up-fill text-pink-500 dark:text-pink-400' : 'bi-music-note'}`}></i>
                  <div className="flex flex-col">
                      <span className="font-semibold">{track.title}</span>
                      <span className="text-xs text-gray-600 dark:text-white/70">{track.mood} • {track.genre}</span>
                  </div>
              </div>
              
              <div className="flex items-center gap-2">
                <button
                  onClick={(e) => handleUnlikeTrack(e, track)}
                  className="p-2 rounded-full text-pink-600 dark:text-pink-400 hover:bg-black/10 dark:hover:bg-white/30 transition-colors"
                  aria-label={`Unlike ${track.title}`}
                >
                  <i className="bi bi-trash-fill text-lg"></i>
                </button>
              </div>
            </li>
          );
        })}
      </ul>
    </div>
  );
}