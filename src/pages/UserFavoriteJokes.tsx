import { useAppSelector } from "../store";

function UserFavoriteJokes() {
  const { favorites } = useAppSelector((state) => state.jokes);

  // STRICT FILTER: Only show jokes where category is 'user'
  const userFavs = favorites.filter(
    (joke) => joke.category === "user" || joke.isUserJoke === true,
  );

  if (userFavs.length === 0) {
    return (
      <div className="p-4 bg-slate-100 border border-dashed border-slate-300 rounded-xl text-sm italic text-slate-500 text-center">
        No favorited "My Jokes" yet...
      </div>
    );
  }

  return (
    <ul className="space-y-3">
      {userFavs.map((joke, index) => (
        <li
          key={`user-only-fav-${joke.id}-${index}`}
          className="p-4 border border-slate-200 shadow-sm text-sm leading-snug font-medium rounded-xl bg-black text-white hover:-translate-y-1 transition-transform"
        >
          {joke.text || "Untitled Joke"}
          {/* Only show setup/delivery if they exist (usually for API, but safe to keep) */}
          {joke.setup && (
            <div className="mt-1 border-t border-white/10 pt-1">
              <p className="text-slate-400 italic text-xs">{joke.setup}</p>
              <p className="text-white font-bold text-xs">{joke.delivery}</p>
            </div>
          )}
        </li>
      ))}
    </ul>
  );
}

export default UserFavoriteJokes;
