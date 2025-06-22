import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

// Fetching sending local public audio files to port. To fetch the audio files in the website.
export const fetchOptions = createAsyncThunk(
    'music/fetchOptions',
    async (_, { rejectWithValue }) => {
        try {
            const response = await axios.get('http://localhost:3001/api/options');
            return response.data;
        } catch (error) {
            return rejectWithValue('Failed to fetch options.');
        }
    }
);

// Generating the tracks based on mood, genre.
export const generateTrack = createAsyncThunk(
    'music/generateTrack',
    async ({ mood, genre }, { rejectWithValue }) => {
        try {
            await new Promise(resolve => setTimeout(resolve, 2000)); // Simulate loading
            const response = await axios.get(`http://localhost:3001/api/generate?mood=${mood}&genre=${genre}`);
            return response.data;
        } catch (error) {
            return rejectWithValue(error.response.data.message || 'Could not generate track.');
        }
    }
);

const initialState = {
    moods: [],
    genres: [],
    selectedMood: null,
    selectedGenre: null,
    currentTrack: null,
    likedTracks: JSON.parse(localStorage.getItem('likedTracks')) || [],
    isLoading: false,
    error: null,
};

// Playing the fetched or generated tracks.
const musicSlice = createSlice({
    name: 'music',
    initialState,
    reducers: {
        selectMood: (state, action) => {
            state.selectedMood = action.payload;
        },
        selectGenre: (state, action) => {
            state.selectedGenre = action.payload;
        },
        setCurrentTrack: (state, action) => {
            state.currentTrack = action.payload;
        },
        toggleLike: (state, action) => {
            const track = action.payload;
            if (!track || !track.id) return; // Guard clause
            
            const existingIndex = state.likedTracks.findIndex(t => t.id === track.id);

            if (existingIndex >= 0) {
                state.likedTracks.splice(existingIndex, 1);
            } else {
                state.likedTracks.push(track);
            }
            localStorage.setItem('likedTracks', JSON.stringify(state.likedTracks));
        },
        clearError: (state) => {
            state.error = null;
        }
    },
    extraReducers: (builder) => {
        builder
            .addCase(fetchOptions.fulfilled, (state, action) => {
                state.moods = action.payload.moods;
                state.genres = action.payload.genres;
            })
            .addCase(generateTrack.pending, (state) => {
                state.isLoading = true;
                state.currentTrack = null;
                state.error = null;
            })
            .addCase(generateTrack.fulfilled, (state, action) => {
                state.isLoading = false;
                state.currentTrack = action.payload;
            })
            .addCase(generateTrack.rejected, (state, action) => {
                state.isLoading = false;
                state.error = action.payload;
            });
    },
});

export const { selectMood, selectGenre, toggleLike, clearError, setCurrentTrack } = musicSlice.actions;

export default musicSlice.reducer;