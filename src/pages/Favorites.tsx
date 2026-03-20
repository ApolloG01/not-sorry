import React from "react";
import JokeCard from "../components/JokeCard.js";
import type { JokeI } from "../types/types.js";
import { useAppSelector } from "../store.js";

export default function Favorites() {
  const { favorites } = useAppSelector((state) => state.jokes);

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {favorites.length === 0 ? (
        <p>No favorites yet. Go find some funny stuff!</p>
      ) : (
        favorites.map((joke) => (
          <JokeCard
            key={joke.id}
            joke={joke}
            // If the joke has the flag we added earlier, it's a user joke
            isUserJoke={joke.isUserJoke ?? false}
          />
        ))
      )}
    </div>
  );
}
