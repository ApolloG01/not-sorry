import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import type {
  CategoryMapI,
  FetchJokesArgsI,
  JokeI,
  JokesStateI,
} from "../../types/types.js";

export const fetchJokes = createAsyncThunk<JokeI[], FetchJokesArgsI>(
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
    const categoryMap: CategoryMapI = {
      programming: "Programming",
      misc: "Miscellaneous",
      dark: "Dark",
      pun: "Pun",
    };

    let jokes: JokeI[] = [];
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
          jokes = jokes.concat(batch.filter((j: JokeI) => j.flags?.explicit));
        }
      }
      return jokes;
    } else {
      const lowerCategory = category?.toLowerCase();
      const apiCategory =
        categoryMap[lowerCategory as keyof CategoryMapI] || "Any";
      const response = await fetch(
        `https://v2.jokeapi.dev/joke/${apiCategory}?amount=9&blacklistFlags=${blacklistFlags}`,
      );
      if (!response.ok) {
        throw new Error(`Failed to fetch jokes: ${response.status}`);
      }
      const data = await response.json();

      return data.jokes || [data];
    }
  },
);

// Simple localStorage helpers for favorites

const FAVORITES_KEY = "favourites_v1";
const USER_JOKES_KEY = "userJokes_v1";

function loadFromStorage(key: string): JokeI[] {
  try {
    const raw = localStorage.getItem(key);
    if (!raw) return [];

    return JSON.parse(raw) as JokeI[];
  } catch (e) {
    console.error(`Error loading from storage for key '${key}':`, e);
    return [];
  }
}

export const initialState: JokesStateI = {
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

const syncUserJokesToStorage = (userJokes: JokeI[], favorites: JokeI[]) => {
  try {
    localStorage.setItem(USER_JOKES_KEY, JSON.stringify(userJokes));

    const favoritedUserJokes = userJokes.filter((uj) =>
      favorites.some((fav) => fav.id === uj.id),
    );

    localStorage.setItem(
      "favoritedUserJokes",
      JSON.stringify(favoritedUserJokes),
    );
    localStorage.setItem("userJokes_length", userJokes.length.toString());
  } catch (e) {
    console.error("Storage sync failed:", e);
  }
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
      const newJoke = {
        ...action.payload,
        id: Date.now(),
        isUserJoke: true,
      };
      state.userJokes.push(newJoke);
      syncUserJokesToStorage(state.userJokes, state.favorites);
      try {
        localStorage.setItem(USER_JOKES_KEY, JSON.stringify(state.userJokes));
        // Save favorited user jokes
        const favoritedUserJokes = state.userJokes.filter((userJoke) =>
          state.favorites.some((fav) => fav.id === userJoke.id),
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
      const index = state.userJokes.findIndex((j) => j.id === id);
      if (index !== -1) {
        state.userJokes[index] = { ...state.userJokes[index], ...updates };
        syncUserJokesToStorage(state.userJokes, state.favorites);
      }
    },

    deleteUserJoke: (state, action) => {
      state.userJokes = state.userJokes.filter((j) => j.id !== action.payload);
      // Removes from favorites if it was there
      state.favorites = state.favorites.filter((f) => f.id !== action.payload);
      syncUserJokesToStorage(state.userJokes, state.favorites);
    },

    toggleFavorite: (state, action) => {
      const joke = action.payload;
      const exists = state.favorites.some((f) => f.id === joke.id);

      if (exists) {
        state.favorites = state.favorites.filter((f) => f.id !== joke.id);
      } else {
        state.favorites.push(joke);
      }

      // Update storage for both user jokes and favorites
      syncUserJokesToStorage(state.userJokes, state.favorites);
      localStorage.setItem(FAVORITES_KEY, JSON.stringify(state.favorites));
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
