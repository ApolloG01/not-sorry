import { useSelector } from "react-redux";
import { Outlet } from "react-router-dom";
import Header from "../pages/Header";
import Sidebar from "../pages/Sidebar";

function AppLayout() {
  return (
    <div className="flex flex-col min-h-screen bg-linear-to- from-[#f6f7fa] to-[#e9ecef]">
      <Header />
      <div className="flex flex-1 overflow-hidden">
        <Sidebar />
        <main className="flex-1 overflow-y-auto p-8 md:p-3">
          <section className="relative flex flex-col items-center justify-center text-center py-10 mb-8 border-slate-100 rounded-3xl shadow-lg border border-slate-100 animate-fade-in">
            <h1 className="text-4xl md:text-5xl font-extrabold text-purple-200 drop-shadow-lg mb-4 tracking-tight animate-bounce-slow pb-3">
              Welcome to{" "}
              <span className="inline-block animate-wiggle text-stone-950">
                Not Sorry
              </span>
            </h1>
            <p className="max-w-2xl mx-auto text-lg md:text-xl font-medium text-slate-700 mb-2 animate-fade-in delay-200">
              Unapologetically fun! Generate, save, and favorite hilarious jokes
              <br />— or create your own and keep them forever.
              <br /> Laughter is just a click away.
            </p>
            <span className="inline-block mt-4 text-3xl animate-bounce">
              😂✨
            </span>
          </section>
          <div className="max-w-5xl mx-auto">
            <Outlet />
          </div>
        </main>
        <aside className="hidden lg:flex flex-col w-80 bg-white/95 border-l border-slate-200 p-8 overflow-y-auto shadow-xl justify-center ">
          <h2 className="font-bold text-xl mb-6 tracking-wide text-slate-700 mx-auto hover:opacity-5">
            My Favoured Creations
          </h2>
          <div className="flex-1 overflow-y-auto space-y-4 mb-4">
            <UserFavoriteJokes />
          </div>
        </aside>
      </div>
    </div>
  );
}

function UserFavoriteJokes() {
  const { userJokes, favorites } = useSelector((state) => state.jokes);
  const favUserJokes = userJokes.filter((joke) => favorites.includes(joke.id));

  if (favUserJokes.length === 0) {
    return (
      <div className="p-4 bg-black border border-slate-500 text-sm italic text-white hover:shadow-lg hover:translate-y-1 transition-transform">
        You haven't saved any jokes yet...
      </div>
    );
  }

  return (
    <ul className="space-y-2 max-h-72 overflow-y-auto pr-2">
      {favUserJokes.map((joke) => (
        <li
          key={joke.id}
          className="p-4 border border-slate-200 shadow-sm text-white text-sm leading-snug font-medium rounded-xl bg-black hover:translate-y-1 transition-transform"
        >
          {joke.joke || joke.setup || joke.text || "Untitled"}
        </li>
      ))}
    </ul>
  );
}
export default AppLayout;
