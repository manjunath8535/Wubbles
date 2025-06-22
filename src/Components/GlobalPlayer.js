import React, { useState, useRef, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { toggleLike, setCurrentTrack } from '../app/slices/musicSlice';

export default function GlobalPlayer() {
    const dispatch = useDispatch();
    const audioRef = useRef(null);

    // Global state.
    const { currentTrack, likedTracks } = useSelector((state) => state.music);

    // Local state for player.
    const [isPlaying, setIsPlaying] = useState(false);
    const [progress, setProgress] = useState(0);
    const [duration, setDuration] = useState(0);
    const [isPlayerVisible, setIsPlayerVisible] = useState(false);

    // Memoize the liked status to prevent unnecessary re renders.
    const isLiked = React.useMemo(() => {
        return currentTrack ? likedTracks.some(t => t.id === currentTrack.id) : false;
    }, [currentTrack, likedTracks]);

    // Effect to handle track changes.
    useEffect(() => {
        if (currentTrack && currentTrack.url) {
            if (audioRef.current.src !== currentTrack.url) {
                audioRef.current.src = currentTrack.url;
                setProgress(0);
            }
            // Show the player and attempt to play.
            setIsPlayerVisible(true);
            audioRef.current.play()
                .then(() => setIsPlaying(true))
                .catch(e => {
                    console.error("Audio playback failed:", e);
                    setIsPlaying(false);
                });
        } else {
            setIsPlayerVisible(false);
            setIsPlaying(false);
        }
    }, [currentTrack]);

    // Play Pause btn function for track.
    const handlePlayPause = () => {
        if (!audioRef.current.src) return;

        if (isPlaying) {
            audioRef.current.pause();
        } else {
            audioRef.current.play();
        }
        setIsPlaying(!isPlaying);
    };

    // Like btn function for the track.
    const handleLike = () => {
        if (currentTrack) {
            dispatch(toggleLike(currentTrack));
        }
    };

    // Time line track funtion for the track.
    const handleTimeUpdate = () => {
        if (audioRef.current) {
            setProgress(audioRef.current.currentTime);
        }
    };

    // When the track is paused, again playing the track from where it paused.
    const handleLoadedMetadata = () => {
        if (audioRef.current) {
            setDuration(audioRef.current.duration);
        }
    };

    // Tracking closing function.
    const handleClosePlayer = () => {
        dispatch(setCurrentTrack(null));
        if (audioRef.current) {
            audioRef.current.pause();
            audioRef.current.src = "";
        }
    }

    // Track time format function.
    const formatTime = (time) => {
        if (isNaN(time) || time === 0) return '0:00';
        const minutes = Math.floor(time / 60);
        const seconds = Math.floor(time % 60);
        return `${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;
    };

    if (!isPlayerVisible) {
        return (
            <audio
                ref={audioRef}
                onTimeUpdate={handleTimeUpdate}
                onLoadedMetadata={handleLoadedMetadata}
                onEnded={() => setIsPlaying(false)}
            />
        );
    }

    return (
        <>
            <audio
                ref={audioRef}
                onTimeUpdate={handleTimeUpdate}
                onLoadedMetadata={handleLoadedMetadata}
                onEnded={() => setIsPlaying(false)}
            />
            <div className="fixed bottom-0 left-0 right-0 z-50 glass p-3 animate-slide-up">
                <style>{`
                    @keyframes slide-up { 0% { transform: translateY(100%); } 100% { transform: translateY(0); } }
                    .animate-slide-up { animation: slide-up 0.5s ease-out forwards; }
                `}</style>

                <div className="w-full max-w-4xl mx-auto flex items-center gap-4 text-white">
                    <button onClick={handlePlayPause} className="text-4xl text-white hover:text-pink-400 transition-colors">
                        <i className={`bi ${isPlaying ? 'bi-pause-circle-fill' : 'bi-play-circle-fill'}`}></i>
                    </button>

                    <div className="flex-grow">
                        <div className="flex justify-between items-center">
                            <p className="font-bold">{currentTrack?.title || 'No track selected'}</p>
                            <p className="text-xs text-white/80">{formatTime(progress)} / {formatTime(duration)}</p>
                        </div>
                        <div className="w-full bg-white/20 h-1.5 rounded-full mt-1 cursor-pointer" onClick={(e) => {
                            const rect = e.currentTarget.getBoundingClientRect();
                            const clickX = e.clientX - rect.left;
                            const width = rect.width;
                            const newTime = (clickX / width) * duration;
                            if (isFinite(newTime)) {
                                audioRef.current.currentTime = newTime;
                            }
                        }}>
                            <div className="bg-pink-500 h-full rounded-full" style={{ width: `${(progress / duration) * 100}%` }}></div>
                        </div>
                    </div>

                    <button onClick={handleLike} className="text-2xl transition-transform hover:scale-110">
                        <i className={`bi ${isLiked ? 'bi-heart-fill text-pink-400' : 'bi-heart text-white'}`}></i>
                    </button>

                    <a
                        href={currentTrack?.url}
                        download={`${currentTrack?.title}.mp3`}
                        className={`text-2xl text-white hover:text-pink-400 transition-colors ${!currentTrack?.url ? 'pointer-events-none opacity-50' : ''}`}
                        aria-label="Download track"
                    >
                        <i className="bi bi-download"></i>
                    </a>

                    <button onClick={handleClosePlayer} className="text-2xl text-white hover:text-pink-400 transition-colors">
                        <i className="bi bi-x-lg"></i>
                    </button>
                </div>
            </div>
        </>
    );
}