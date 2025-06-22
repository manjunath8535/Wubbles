const express = require("express");
const cors = require("cors");
const path = require("path");
const tracks = require("./tracks.json");

const app = express();
const PORT = 3001;

app.use(cors());
app.use(express.static(path.join(__dirname, "public")));

// Endpoint to get available mood and genre options/
app.get("/api/options", (req, res) => {
  // Extract unique moods and genres from our tracks data
  const moods = [...new Set(tracks.map((track) => track.mood))];
  const genres = [...new Set(tracks.map((track) => track.genre))];
  res.json({ moods, genres });
});

// Endpoint to generate a track based on mood and genre.
app.get("/api/generate", (req, res) => {
  const { mood, genre } = req.query;

  if (!mood || !genre) {
    return res.status(400).json({ message: "Mood and genre are required." });
  }

  // Filter tracks that match the selected mood and genre.
  const filteredTracks = tracks.filter(
    (track) => track.mood === mood && track.genre === genre
  );

  if (filteredTracks.length === 0) {
    return res
      .status(404)
      .json({
        message: `No tracks found for ${mood} ${genre}. Try another combination!`,
      });
  }

  // Select a random track from the filtered list.
  const randomTrack =
    filteredTracks[Math.floor(Math.random() * filteredTracks.length)];

  res.json(randomTrack);
});

// Listing to this port: 3001.
app.listen(PORT, () => {
  console.log(`Audio files data server running on http://localhost:${PORT}`);
});
