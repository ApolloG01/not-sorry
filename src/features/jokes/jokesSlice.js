import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";

export const fetchJokes = createAsyncThunk(
  "jokes/fetchJokes",
  async ({ category, showDirty, isDark }) => {
    let blacklistFlags;

    if (isDark) {
      // Dark jokes: always filter out explicit content
      blacklistFlags = "nsfw,religious,political,racist,sexist,explicit";
    } else if (showDirty) {
      // Explicit content: allow explicit and nsfw when authenticated
      blacklistFlags = "religious,political,racist,sexist";
    } else {
      // Regular content: filter everything sensitive
      blacklistFlags = "nsfw,religious,political,racist,sexist,explicit";
    }

    const response = await fetch(
      `https://v2.jokeapi.dev/joke/Programming,Miscellaneous,Dark,Pun?amount=10&blacklistFlags=${blacklistFlags}`,
    );
    if (!response.ok) {
      throw new Error(`Failed to fetch jokes: ${response.status}`);
    }
    const data = await response.json();
    console.log(data);
    console.log(data.jokes);

    return data.jokes || [data]; // API returns 'jokes' array for multiple, or single object
  },
);

const initialState = {
  apiJokes: [],
  userJokes: [],
  favorites: [],
  categories: ["Any", "Misc", "Programming", "Dark", "Pun"],
  currentCategory: "Any",
  showDirty: false,
  isAuthenticated: false,
  loading: false,
  error: null,
};

const jokesSlice = createSlice({
  name: "jokes",
  initialState,
  reducers: {
    setCategory: (state, action) => {
      state.currentCategory = action.payload;
    },
    toggleShowDirty: (state) => {
      state.showDirty = !state.showDirty;
    },
    setAuthenticated: (state, action) => {
      state.isAuthenticated = action.payload;
    },
    addUserJoke: (state, action) => {
      state.userJokes.push({ ...action.payload, id: Date.now() });
    },
    editUserJoke: (state, action) => {
      const { id, ...updates } = action.payload;
      const joke = state.userJokes.find((j) => j.id === id);
      if (joke) Object.assign(joke, updates);
    },
    deleteUserJoke: (state, action) => {
      state.userJokes = state.userJokes.filter((j) => j.id !== action.payload);
    },
    toggleFavorite: (state, action) => {
      const jokeId = action.payload;
      if (state.favorites.includes(jokeId)) {
        state.favorites = state.favorites.filter((id) => id !== jokeId);
      } else {
        state.favorites.push(jokeId);
      }
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchJokes.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchJokes.fulfilled, (state, action) => {
        state.loading = false;
        state.apiJokes = action.payload;
      })
      .addCase(fetchJokes.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      });
  },
});

export const {
  setCategory,
  toggleShowDirty,
  setAuthenticated,
  addUserJoke,
  editUserJoke,
  deleteUserJoke,
  toggleFavorite,
} = jokesSlice.actions;

export default jokesSlice.reducer;
