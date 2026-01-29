import { useParams } from "react-router-dom";
import { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { fetchJokes } from "../features/jokes/jokesSlice";
import JokeCard from "../components/JokeCard";

function ApiJokes() {
  const { category } = useParams(); // Grabs Categories from the Sidebar NavLinks

  const dispatch = useDispatch();

  const { apiJokes, loading, error, showDirty, isAuthenticated } = useSelector(
    (state) => state.jokes,
  );

  // Check if viewing restricted content without auth
  const isRestricted =
    (showDirty || category === "dark" || category === "explicit") &&
    !isAuthenticated;

  useEffect(() => {
    if (!isRestricted) {
      const isDark = category === "dark";
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
    <div className="grid lg:grid-cols-3 gap-4">
      {apiJokes.map((joke) => (
        <JokeCard key={joke.id} joke={joke} />
      ))}
    </div>
  );
}

export default ApiJokes;
