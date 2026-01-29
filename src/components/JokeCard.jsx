import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { toggleFavorite } from "../features/jokes/jokesSlice";

export default function JokeCard({ joke }) {
  const dispatch = useDispatch();
  const { favorites } = useSelector((state) => state.jokes);

  const isFavorited = favorites.includes(joke.id);

  const handleFavorite = () => {
    dispatch(toggleFavorite(joke.id));
  };

  return (
    <div className="bg-white p-4 rounded shadow">
      {joke.joke ? (
        <p className="mb-2">{joke.joke}</p>
      ) : (
        <div className="mb-2">
          <p>{joke.setup}</p>
          <br />
          <p className="font-semibold">{joke.delivery}</p>
        </div>
      )}
      <button
        onClick={handleFavorite}
        className={`mt-2 px-2 py-1 rounded ${isFavorited ? "bg-purple-500 text-white" : "bg-gray-200"}`}
      >
        {isFavorited ? "Favorited" : "Favorite"}
      </button>
    </div>
  );
}
