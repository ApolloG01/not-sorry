import { NavLink } from "react-router-dom";
import {
  setCategory,
  fetchJokes,
  toggleShowDirty,
  toggleFavorite,
} from "../features/jokes/jokesSlice.js";
import { useState } from "react";
import PasswordModal from "../components/PasswordModal.js";
import { useNavigate } from "react-router-dom";
import { Code2, Ghost, Zap, Laugh, Shield, Star } from "lucide-react";
import { useAppDispatch, useAppSelector } from "../store.js";

function Sidebar() {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const { isAuthenticated, favorites } = useAppSelector((state) => state.jokes);
  const [showModal, setShowModal] = useState(false);
  const [pendingCategory, setPendingCategory] = useState<string | null>(null);
  const [showFavs, setShowFavs] = useState(false);

  const navItems = [
    {
      to: "/api-jokes/programming",
      label: "Programming",
      icon: <Code2 size={18} className="mr-2" />,
    },
    {
      to: "/api-jokes/misc",
      label: "Misc",
      icon: <Zap size={18} className="mr-2" />,
    },
    {
      to: "/api-jokes/dark",
      label: "Dark",
      icon: <Ghost size={18} className="mr-2" />,
      restricted: true,
    },
    {
      to: "/api-jokes/pun",
      label: "Pun",
      icon: <Laugh size={18} className="mr-2" />,
    },
    {
      to: "/api-jokes/explicit",
      label: "Explicit",
      icon: <Shield size={18} className="mr-2" />,
      restricted: true,
    },
  ];

  // Helper to get current showDirty and isDark from state
  const showDirty = useAppSelector((state) => state.jokes.showDirty);

  const apiJokeFavorites = favorites.filter((joke) => !joke.isUserJoke);
  const apiJokeFavoriteCount = apiJokeFavorites.length;

  const handleNavClick = (
    category: string,
    restricted: boolean | undefined,
    event: React.MouseEvent<HTMLAnchorElement>,
  ) => {
    if (restricted && !isAuthenticated) {
      handleRestrictedClick(category);
      event.preventDefault();
      return;
    }
    let actualCategory = category;
    let actualShowDirty = showDirty;
    // For Explicit NavLink, set category to 'Any' and showDirty to true
    if (category.toLowerCase() === "explicit") {
      actualCategory = "Any";
      actualShowDirty = true;
      dispatch(setCategory(actualCategory));
      dispatch(toggleShowDirty());
    } else {
      dispatch(setCategory(category));
    }
    dispatch(
      fetchJokes({
        showDirty: actualShowDirty,
        isDark: category.toLowerCase() === "dark",
        category: actualCategory,
      }),
    );
  };

  const getNavStyles = ({ isActive }: { isActive: boolean }) =>
    `group flex items-center gap-2 px-4 py-3 rounded-2xl font-medium transition-all duration-200 relative overflow-hidden focus:outline-none focus:ring-2 focus:ring-purple-400 no-underline ${
      isActive
        ? "text-white bg-purple-600 shadow-md before:absolute before:left-0 before:top-2 before:bottom-2 before:w-1 before:bg-purple-400 before:rounded"
        : "text-white hover:text-white hover:bg-purple-700/80 hover:no-underline"
    }`;

  const handleRestrictedClick = (category: string) => {
    if (!isAuthenticated) {
      setPendingCategory(category);
      setShowModal(true);
    }
  };

  // After authentication, navigate to the pending category and fetch jokes
  const handleAuthSuccess = (category: string) => {
    if (category) {
      dispatch(setCategory(category));
      dispatch(
        fetchJokes({
          showDirty,
          isDark: category.toLowerCase() === "dark",
          category,
        }),
      );
      navigate(`/api-jokes/${category.toLowerCase()}`);
    }
  };

  const handleModalClose = () => {
    setShowModal(false);
    setPendingCategory(null);
  };

  return (
    <>
      <div className="py-10 bg-[#0a0a0a] text-white w-64 min-h-[110vh] flex flex-col p-4 border-r border-white/5">
        <h2 className="text-xl font-bold text-white uppercase tracking-widest mb-6 px-4">
          CATEGORIES
        </h2>

        <nav className="flex flex-col gap-1 mt-2">
          {navItems.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              className={getNavStyles}
              onClick={(e) => handleNavClick(item.label, item.restricted, e)}
            >
              {item.icon}
              <span>{item.label}</span>
            </NavLink>
          ))}
        </nav>

        <div className="mt-8 px-4">
          <div className="flex items-center justify-between mb-1">
            <h3 className="text-xs font-semibold text-white flex items-center gap-1 uppercase tracking-widest">
              <Star size={14} className="text-purple-300" /> Favourites
            </h3>
            <button
              onClick={() => setShowFavs((s) => !s)}
              className="text-xs text-white bg-purple-500 px-2 py-1 rounded-full font-semibold shadow-sm hover:bg-purple-600 transition border border-purple-400 focus:outline-none focus:ring-2 focus:ring-purple-400"
              aria-expanded={showFavs}
            >
              {apiJokeFavoriteCount > 0 ? apiJokeFavoriteCount : ""}
            </button>
          </div>

          {showFavs && (
            <ul className="mt-2 space-y-2 max-h-40 overflow-auto">
              {favorites.length === 0 && (
                <li className="text-xs text-slate-500">No favourites yet</li>
              )}

              {favorites.slice(0, 5).map((joke) => (
                <li
                  key={joke.id}
                  className="text-xs text-white flex justify-between items-center gap-2 bg-purple-700/80 rounded px-2 py-1 shadow-sm"
                >
                  <span className="truncate max-w-30">
                    {joke.joke ?? joke.setup ?? joke.text ?? "Untitled"}
                  </span>
                  <button
                    onClick={() => dispatch(toggleFavorite(joke))}
                    className="ml-2 text-xs text-purple-200 hover:text-white focus:outline-none focus:ring-2 focus:ring-purple-400"
                    aria-label="Remove from favourites"
                  >
                    <Star size={14} fill="#a78bfa" className="inline" />
                  </button>
                </li>
              ))}
            </ul>
          )}

          <NavLink
            to="/favorites"
            className="mt-3 block text-xs text-white hover:text-purple-300 hover:no-underline no-underline font-semibold transition focus:outline-none focus:ring-2 focus:ring-purple-400"
          >
            Jokes I liked
          </NavLink>
        </div>
      </div>

      <PasswordModal
        isOpen={showModal}
        onClose={handleModalClose}
        pendingCategory={pendingCategory}
        onAuthSuccess={() => {
          if (pendingCategory) {
            handleAuthSuccess(pendingCategory);
          }
        }}
      />
    </>
  );
}

export default Sidebar;
