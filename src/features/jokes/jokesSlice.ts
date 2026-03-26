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
    const isSafeModeActive = showDirty === false;
    // Hard bans that never change
    const activeBlacklist = ["racist", "sexist"];
    // Add sensitive categories only if Safe Mode is ON
    if (isSafeModeActive || isDark) {
      activeBlacklist.push("nsfw", "religious", "explicit");
    }

    const blacklistFlags = activeBlacklist.join(",");

    const categoryMap: CategoryMapI = {
      programming: "Programming",
      misc: "Miscellaneous",
      dark: "Dark",
      pun: "Pun",
    };

    const lowerCategory = category?.toLowerCase();
    const apiCategory =
      categoryMap[lowerCategory as keyof CategoryMapI] ?? "Any";

    const response = await fetch(
      `https://v2.jokeapi.dev/joke/${apiCategory}?amount=9&blacklistFlags=${blacklistFlags}`,
    );

    if (!response.ok) throw new Error(`Failed to fetch jokes`);
    const data = await response.json();
    return data.jokes ?? [data];
  },
);

export const initialState: JokesStateI = {
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
    setAuth: (state, action) => {
      state.isAuthenticated = action.payload;
    },
    setCategory: (state, action) => {
      state.currentCategory = action.payload;
    },
    toggleShowDirty: (state) => {
      state.showDirty = !state.showDirty;
    },
    setAuthenticated: (state, action) => {
      state.isAuthenticated = action.payload;
    },
    setFavorites: (state, action) => {
      const rawArray = action.payload || [];

      state.favorites = rawArray.map((row: any) => {
        // 1. If 'joke_data' exists, use it. If not, the row itself IS the joke.
        const data = row.joke_data ? row.joke_data : row;

        return {
          // 2. Spread the data to get all the fields (text, setup, etc.)
          ...data,

          // 3. Ensure we have a string ID from somewhere
          id: String(row.joke_id || data.id || row.id),
          joke_id: String(row.joke_id || data.id || row.id),

          // 4. Map the text correctly
          text:
            data.text ||
            data.joke ||
            (data.setup ? `${data.setup} ${data.delivery}` : ""),

          // 5. Keep the category
          category: row.category || data.category || "general",
          isUserJoke: row.category === "user" || data.isUserJoke === true,
        };
      });
    },
    setUserJokes: (state, action) => {
      state.userJokes = action.payload;
    },
    toggleFavorite: (state, action) => {
      const joke = action.payload;
      const index = state.favorites.findIndex((fav) => {
        const favId = fav.id ?? fav.joke_id;
        const currentId = joke.id ?? joke.joke_id;
        return favId === currentId;
      });
      if (index !== -1) {
        state.favorites.splice(index, 1);
      } else {
        state.favorites.push(joke);
      }
    },
    addUserJoke: (state, action) => {
      state.userJokes.push(action.payload);
    },
    editUserJoke: (state, action) => {
      const { id, ...updates } = action.payload;
      const index = state.userJokes.findIndex((j) => j.id === id);
      if (index !== -1) {
        state.userJokes[index] = { ...state.userJokes[index], ...updates };
      }
    },
    deleteUserJoke: (state, action) => {
      state.userJokes = state.userJokes.filter((j) => j.id !== action.payload);
      state.favorites = state.favorites.filter(
        (f) => (f.id ?? f.joke_id) !== action.payload,
      );
    },
    clearAuth: (state) => {
      state.isAuthenticated = false;
      state.favorites = [];
      state.userJokes = [];
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchJokes.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchJokes.fulfilled, (state, action) => {
        state.loading = false;
        // Normalize the API jokes so they 'look' like your Supabase jokes
        state.apiJokes = action.payload.map((joke: any) => ({
          ...joke,
          // Ensure 'text' always exists so the UI is consistent
          text:
            joke.joke ||
            (joke.setup ? `${joke.setup} ... ${joke.delivery}` : ""),
          id: String(joke.id), // Ensure ID is always a string
        }));
      })
      .addCase(fetchJokes.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message ?? "Something went wrong";
      });
  },
});

export const {
  setAuth,
  setCategory,
  toggleShowDirty,
  setAuthenticated,
  addUserJoke,
  editUserJoke,
  setFavorites,
  setUserJokes,
  deleteUserJoke,
  toggleFavorite,
  clearAuth,
} = jokesSlice.actions;

export default jokesSlice.reducer;
