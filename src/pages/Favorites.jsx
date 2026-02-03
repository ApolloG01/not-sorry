import React from "react";
import { useSelector } from "react-redux";
import JokeCard from "../components/JokeCard";

export default function Favorites() {
  const { favorites, apiJokes, userJokes } = useSelector(
    (state) => state.jokes,
  );

  // Show all favorited API jokes from persistent storage
  let jokes = [];
  try {
    const stored = localStorage.getItem("favoritedApiJokes");
    jokes = stored ? JSON.parse(stored) : [];
  } catch (e) {
    jokes = [];
  }

  return (
    <div className="px-2 md:px-8 py-6">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold tracking-tight text-slate-800">
          Favourites
        </h2>
      </div>
      {jokes.length === 0 ? (
        <div className="text-slate-500">
          No favourites yet. Use the{" "}
          <span className="inline-block align-middle">♥</span> button on any
          joke to add it here.
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {jokes.map((j) => (
            <JokeCard key={j.id} joke={j} isUserJoke={false} />
          ))}
        </div>
      )}
    </div>
  );
}
