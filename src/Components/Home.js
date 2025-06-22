import { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import {
  fetchOptions,
  selectMood,
  selectGenre,
  generateTrack,
  clearError,
} from "../app/slices/musicSlice";
import LoadingSpinner from "./LoadingSpinner";
import LikedTracks from "./LikedTracks";

export default function HomePage() {
  const dispatch = useDispatch();

  // Fethcing moods, genres for dropmen.
  const { moods, genres, selectedMood, selectedGenre, isLoading, error } =
    useSelector((state) => state.music);

  useEffect(() => {
    dispatch(fetchOptions());
  }, [dispatch]);

  const handleGenerate = () => {
    if (selectedMood && selectedGenre) {
      dispatch(generateTrack({ mood: selectedMood, genre: selectedGenre }));
    }
  };

  const isGenerateDisabled = !selectedMood || !selectedGenre;

  return (
    <div className="min-h-screen w-full flex flex-col items-center justify-center pt-24 pb-12 px-4 text-white">
      <div className="text-center mb-8">
        <h1 className="text-4xl md:text-6xl font-bold tracking-tight">
          Wubble QuickTunes AI
        </h1>
        <p className="text-lg md:text-xl text-white/80 mt-2">
          Generate your next royalty free track in seconds. Use it for your works like movies, videos, shorts and many more.
        </p>
      </div>

      <div className="w-full max-w-2xl p-6 md:p-8 rounded-2xl glass">
        <div className="grid md:grid-cols-2 gap-6 mb-8">
          <div>
            <h2 className="text-xl font-semibold mb-3">1. Choose a Mood</h2>
            <div className="relative">
              <select
                value={selectedMood || ""}
                onChange={(e) => dispatch(selectMood(e.target.value))}
                className="w-full p-3 rounded-lg font-semibold glass-select"
              >
                <option value="" disabled>
                  Select a mood...
                </option>
                {moods.map((mood) => (
                  <option key={mood} value={mood}>
                    {mood}
                  </option>
                ))}
              </select>
              <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-3 text-white">
                <i className="bi bi-chevron-down"></i>
              </div>
            </div>
          </div>

          <div>
            <h2 className="text-xl font-semibold mb-3">2. Choose a Genre</h2>
            <div className="relative">
              <select
                value={selectedGenre || ""}
                onChange={(e) => dispatch(selectGenre(e.target.value))}
                className="w-full p-3 rounded-lg font-semibold glass-select"
              >
                <option value="" disabled>
                  Select a genre...
                </option>
                {genres.map((genre) => (
                  <option key={genre} value={genre}>
                    {genre}
                  </option>
                ))}
              </select>
              <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-3 text-white">
                <i className="bi bi-chevron-down"></i>
              </div>
            </div>
          </div>
        </div>

        <button
          onClick={handleGenerate}
          disabled={isGenerateDisabled || isLoading}
          className="w-full py-4 px-6 text-xl font-bold bg-gradient-to-r from-pink-500 to-violet-500 rounded-lg shadow-xl transition-all duration-300 hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:scale-100 text-white"
        >
          {isLoading ? "Generating..." : "Generate Music"}
        </button>
      </div>

      <div className="w-full max-w-2xl mt-8 min-h-[150px] flex items-center justify-center">
        {isLoading && <LoadingSpinner />}
        {error && !isLoading && (
          <div className="text-center p-4 glass rounded-lg">
            <p className="text-red-400 font-semibold">{error}</p>
            <button
              onClick={() => dispatch(clearError())}
              className="mt-2 text-sm text-white/80 underline"
            >
              Try again
            </button>
          </div>
        )}
      </div>

      <div className="w-full max-w-2xl mt-12">
        <LikedTracks />
      </div>
      
    </div>
  );
}
