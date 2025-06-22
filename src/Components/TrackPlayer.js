
import React, { useState, useRef, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { toggleLike } from "../app/slices/musicSlice";

// Playing tack with play & pause button controls with time line bar.
export default function TrackPlayer({ track }) {
  const dispatch = useDispatch();
  const audioRef = useRef(null); 
  const [isPlaying, setIsPlaying] = useState(false);

  const likedTracks = useSelector((state) => state.music.likedTracks);

  const isLiked = likedTracks.some((likedTrack) => likedTrack.id === track.id);

  useEffect(() => {
    setIsPlaying(true);
    audioRef.current.play();
  }, [track]);

  // Toggles the play/pause state of the audio.
  const handlePlayPause = () => {
    if (isPlaying) {
      audioRef.current.pause();
    } else {
      audioRef.current.play();
    }
    setIsPlaying(!isPlaying);
  };

  const handleLike = () => {
    dispatch(toggleLike(track));
  };

  return (
    <div className="w-full max-w-md p-4 sm:p-6 rounded-2xl glass animate-fade-in">
      <style>{`
        @keyframes fade-in { 0% { opacity: 0; transform: translateY(20px); } 100% { opacity: 1; transform: translateY(0); } }
        .animate-fade-in { animation: fade-in 0.5s ease-out forwards; }
      `}</style>

      {/* Hidden audio element controlled by the component's state and refs. */}
      <audio
        ref={audioRef}
        src={track.url}
        onEnded={() => setIsPlaying(false)}
      />

      <div className="flex items-center">
        <div className="flex-grow">
          <h3 className="text-xl font-bold text-white">{track.title}</h3>
          <div className="flex gap-2 mt-2">
            <span className="text-xs font-semibold text-white bg-white/20 py-1 px-2 rounded-full">
              {track.mood}
            </span>
            <span className="text-xs font-semibold text-white bg-white/20 py-1 px-2 rounded-full">
              {track.genre}
            </span>
          </div>
        </div>

        {/* Like Button. */}
        <button
          onClick={handleLike}
          className="p-3 rounded-full transition-colors text-2xl"
          aria-label="Like track"
        >
          <i
            className={`bi ${
              isLiked ? "bi-heart-fill text-pink-400" : "bi-heart text-white"
            }`}
          ></i>
        </button>
      </div>

      <div className="flex items-center justify-between gap-4 mt-4">
        {/* Play/Pause Button. */}
        <button
          onClick={handlePlayPause}
          className="bg-pink-500 text-white w-14 h-14 flex items-center justify-center rounded-full text-3xl shadow-lg transition-transform hover:scale-105 active:scale-95"
        >
          <i
            className={`bi ${isPlaying ? "bi-pause-fill" : "bi-play-fill"}`}
          ></i>
        </button>

        {/* Download Button.*/}
        <a
          href={track.url}
          download={`${track.title}.mp3`}
          className="flex-grow bg-white/90 dark:bg-gray-800/80 text-gray-900 dark:text-white font-bold py-3 px-4 rounded-full text-center transition-transform hover:scale-105"
        >
          Download
        </a>
      </div>
    </div>
  );
}
