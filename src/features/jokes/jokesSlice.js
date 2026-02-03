import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";

export const fetchJokes = createAsyncThunk(
  "jokes/fetchJokes",
  async ({ showDirty, isDark, category }) => {
    let blacklistFlags;

    if (isDark) {
      // Dark jokes: always filter out explicit content
      blacklistFlags = "nsfw,religious,racist,sexist,explicit";
    } else if (showDirty) {
      // Explicit content: allow explicit and nsfw when authenticated
      blacklistFlags = "religious,racist,sexist";
    } else {
      // Regular content: filter everything sensitive
      blacklistFlags = "nsfw,religious,racist,sexist,explicit";
    }

    // Map category to API format
    const categoryMap = {
      programming: "Programming",
      misc: "Miscellaneous",
      dark: "Dark",
      pun: "Pun",
    };

    let jokes = [];
    if (category?.toLowerCase() === "explicit") {
      // Fetch from all valid categories and filter for explicit jokes
      const categoriesToFetch = Object.values(categoryMap);
      for (const cat of categoriesToFetch) {
        const response = await fetch(
          `https://v2.jokeapi.dev/joke/${cat}?amount=9&blacklistFlags=religious,racist,sexist`,
        );
        if (response.ok) {
          const data = await response.json();
          const batch = data.jokes || [data];
          jokes = jokes.concat(batch.filter((j) => j.flags?.explicit));
        }
      }
      return jokes;
    } else {
      const apiCategory = categoryMap[category?.toLowerCase()] || "Any";
      const response = await fetch(
        `https://v2.jokeapi.dev/joke/${apiCategory}?amount=9&blacklistFlags=${blacklistFlags}`,
      );
      if (!response.ok) {
        throw new Error(`Failed to fetch jokes: ${response.status}`);
      }
      const data = await response.json();
      console.log(data);
      console.log(data.jokes);
      return data.jokes || [data];
    }
  },
);

// Simple localStorage helpers for favorites

const FAVORITES_KEY = "favourites_v1";
const USER_JOKES_KEY = "userJokes_v1";

function loadFromStorage(key) {
  try {
    const raw = localStorage.getItem(key);
    return raw ? JSON.parse(raw) : [];
  } catch (e) {
    console.error(`Error loading from storage for key '${key}':`, e);
    return [];
  }
}

export const initialState = {
  apiJokes: [],
  userJokes: loadFromStorage(USER_JOKES_KEY),
  favorites: loadFromStorage(FAVORITES_KEY),
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
      try {
        localStorage.setItem(USER_JOKES_KEY, JSON.stringify(state.userJokes));
        // Save favorited user jokes
        const favoritedUserJokes = state.userJokes.filter((joke) =>
          state.favorites.includes(joke.id),
        );
        localStorage.setItem(
          "favoritedUserJokes",
          JSON.stringify(favoritedUserJokes),
        );
        // Save userJokes length
        localStorage.setItem(
          "userJokes_length",
          state.userJokes.length.toString(),
        );
      } catch (e) {
        console.error(`Error loading from storage :`, e);
      }
    },
    editUserJoke: (state, action) => {
      const { id, ...updates } = action.payload;
      const joke = state.userJokes.find((j) => j.id === id);
      if (joke) Object.assign(joke, updates);
      try {
        localStorage.setItem(USER_JOKES_KEY, JSON.stringify(state.userJokes));
        const favoritedUserJokes = state.userJokes.filter((joke) =>
          state.favorites.includes(joke.id),
        );
        localStorage.setItem(
          "favoritedUserJokes",
          JSON.stringify(favoritedUserJokes),
        );
        localStorage.setItem(
          "userJokes_length",
          state.userJokes.length.toString(),
        );
      } catch (e) {
        console.error(`Error loading from storage:`, e);
      }
    },
    deleteUserJoke: (state, action) => {
      state.userJokes = state.userJokes.filter((j) => j.id !== action.payload);
      try {
        localStorage.setItem(USER_JOKES_KEY, JSON.stringify(state.userJokes));
        const favoritedUserJokes = state.userJokes.filter((joke) =>
          state.favorites.includes(joke.id),
        );
        localStorage.setItem(
          "favoritedUserJokes",
          JSON.stringify(favoritedUserJokes),
        );
        localStorage.setItem(
          "userJokes_length",
          state.userJokes.length.toString(),
        );
      } catch (e) {
        console.error(`Error loading from storage':`, e);
      }
    },
    toggleFavorite: (state, action) => {
      const jokeId = action.payload;
      if (state.favorites.includes(jokeId)) {
        state.favorites = state.favorites.filter((id) => id !== jokeId);
      } else {
        state.favorites.push(jokeId);
      }
      // Save to localStorage every time favorites change
      try {
        localStorage.setItem(FAVORITES_KEY, JSON.stringify(state.favorites));
        // Save favorited user jokes
        const favoritedUserJokes = state.userJokes.filter((joke) =>
          state.favorites.includes(joke.id),
        );
        localStorage.setItem(
          "favoritedUserJokes",
          JSON.stringify(favoritedUserJokes),
        );
        // Save favorited API jokes (persist full objects, not just count)
        let favoritedApiJokes = [];
        // Collect all API jokes ever favorited (from all categories)
        // Merge with existing favoritedApiJokes in localStorage
        try {
          const stored = localStorage.getItem("favoritedApiJokes");
          favoritedApiJokes = stored ? JSON.parse(stored) : [];
        } catch (e) {
          favoritedApiJokes = [];
        }
        // Add new favorites from current apiJokes
        state.favorites.forEach((id) => {
          // Only add if not already present
          if (!favoritedApiJokes.some((j) => j.id === id)) {
            const joke = state.apiJokes.find((j) => j.id === id);
            if (joke) favoritedApiJokes.push(joke);
          }
        });
        // Remove any unfavorited jokes
        favoritedApiJokes = favoritedApiJokes.filter((j) =>
          state.favorites.includes(j.id),
        );
        localStorage.setItem(
          "favoritedApiJokes",
          JSON.stringify(favoritedApiJokes),
        );
        // Save apiJokeFavoriteCount
        localStorage.setItem(
          "apiJokeFavoriteCount",
          favoritedApiJokes.length.toString(),
        );
      } catch (e) {
        console.error(`Error saving to storage':`, e);
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
