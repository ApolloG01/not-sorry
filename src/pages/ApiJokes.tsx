import { useParams } from "react-router-dom";
import { useEffect } from "react";
import { fetchJokes } from "../features/jokes/jokesSlice.ts";
import JokeCard from "../components/JokeCard.tsx";
import { useAppDispatch, useAppSelector, type RootState } from "../store.js";
import type { JokeI } from "../types/types.ts";

function ApiJokes() {
  const { category } = useParams(); // Gets Categories from the Sidebar NavLinks

  const dispatch = useAppDispatch();

  const { apiJokes, loading, showDirty, isAuthenticated } = useAppSelector(
    (state: RootState) => state.jokes,
  );

  // Check if viewing restricted content without auth
  const isRestricted =
    (showDirty || category === "Dark" || category === "explicit") &&
    !isAuthenticated;

  useEffect(() => {
    if (!isRestricted) {
      const isDark = category === "Dark";
      const effectiveShowDirty = showDirty || category === "explicit";
      dispatch(
        fetchJokes({
          category: category || "Any",
          showDirty: effectiveShowDirty,
          isDark,
        }),
      );
    }
  }, [category, dispatch, showDirty, isRestricted]); // Refetch whenever 'category' or 'showDirty' changes!

  if (loading) return <p>Loading jokes...</p>;

  if (isRestricted) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="text-center">
          <p className="text-xl font-bold mb-2">🔒 Restricted Content</p>
          <p className="text-gray-400">
            Please authenticate to view this content. Click the category link
            again to enter credentials.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="px-2 md:px-8 py-6">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold tracking-tight text-slate-800">
          API Jokes
        </h1>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {apiJokes.map((joke, idx) => {
          // Guarantee a unique id for each joke
          const jokeWithId: JokeI = {
            ...joke,
            id:
              joke.id ??
              `${joke.setup ?? ""}${joke.joke ?? ""}${joke.delivery ?? ""}`.slice(
                0,
                40,
              ) + idx,
          };
          return (
            <JokeCard
              key={jokeWithId.id}
              joke={jokeWithId}
              isUserJoke={false}
            />
          );
        })}
      </div>
    </div>
  );
}

export default ApiJokes;
