import { Outlet } from "react-router-dom";
import Header from "../pages/Header.js";
import Sidebar from "../pages/Sidebar.js";
import { useEffect } from "react";
import supabase from "../services/supabase";
import { useAppDispatch, useAppSelector } from "../store";
import { setFavorites, setUserJokes } from "../features/jokes/jokesSlice";
import UserFavoriteJokes from "../pages/UserFavoriteJokes.js";

function AppLayout() {
  const { isAuthenticated } = useAppSelector((state) => state.jokes);
  const dispatch = useAppDispatch();

  useEffect(() => {
    const hydrateStore = async () => {
      if (!isAuthenticated) return;

      try {
        const [favsResponse, userJokesResponse] = await Promise.all([
          supabase.from("favorites").select("*"),
          supabase.from("jokes").select("*"),
        ]);

        if (favsResponse.data) {
          const formattedFavs = favsResponse.data.map((row) => ({
            ...(row.joke_data || {}),
            joke_id: row.joke_id,
            id: String(row.joke_id || row.joke_data?.id || ""),
            text: row.joke_data?.text || row.joke_data?.joke || "",
          }));
          dispatch(setFavorites(formattedFavs));
        }

        if (userJokesResponse.data) {
          const formattedUserJokes = userJokesResponse.data.map((joke) => ({
            ...joke,
            id: String(joke.id),
            isUserJoke: true,
          }));
          dispatch(setUserJokes(formattedUserJokes));
        }
      } catch (err) {}
    };

    hydrateStore();
  }, [isAuthenticated, dispatch]);

  return (
    <div className="flex flex-col min-h-screen bg-slate-50">
      <Header />
      <div className="flex flex-1 overflow-hidden">
        <Sidebar />
        <main className="flex-1 overflow-y-auto p-8 md:p-3">
          {/* Welcome Section */}
          <section className="relative flex flex-col items-center justify-center text-center py-10 mb-8 bg-white border-slate-100 rounded-3xl shadow-lg border animate-fade-in">
            <h1 className="text-4xl md:text-5xl font-extrabold text-slate-900 mb-4 tracking-tight">
              Welcome to <span className="text-purple-600">Not Sorry</span>
            </h1>
            <p className="max-w-2xl mx-auto text-lg text-slate-700">
              Unapologetically fun! Generate, save, and favorite hilarious
              jokes.
            </p>
          </section>

          <div className="max-w-5xl mx-auto">
            <Outlet />
          </div>
        </main>

        {/* Sidebar for Favorites */}
        <aside className="hidden lg:flex flex-col w-80 bg-white border-l border-slate-200 p-6 overflow-y-auto shadow-sm">
          <h2 className="font-bold text-xl mb-6 text-slate-800 text-center">
            My Favoured Creations
          </h2>
          <UserFavoriteJokes />
        </aside>
      </div>
    </div>
  );
}

export default AppLayout;
