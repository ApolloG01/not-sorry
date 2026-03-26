import JokeCard from "../components/JokeCard.js";
import { useAppSelector } from "../store.js";
import { Navigate } from "react-router-dom";

export default function Favorites() {
  const { isAuthenticated, favorites } = useAppSelector((state) => state.jokes);

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {favorites.length === 0 ? (
        <div className="col-span-full py-20 text-center">
          <p className="text-slate-500 font-medium">
            No favorites yet. Go find some funny stuff!
          </p>
        </div>
      ) : (
        favorites.map((joke, index) => (
          <JokeCard
            key={`${joke.id}-${index}`}
            joke={joke}
            isUserJoke={joke.category === "user" || joke.isUserJoke}
          />
        ))
      )}
    </div>
  );
}
