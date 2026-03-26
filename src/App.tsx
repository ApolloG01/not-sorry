import { createBrowserRouter, RouterProvider } from "react-router-dom";
import { useEffect, useState } from "react";
import supabase from "./services/supabase";
import { useAppDispatch } from "./store";
import { setAuth, setFavorites } from "./features/jokes/jokesSlice";

// Components & Pages
import AppLayout from "./components/AppLayout.js";
import ApiJokes from "./pages/ApiJokes.js";
import UserJokes from "./pages/UserJokes.js";
import Favorites from "./pages/Favorites.js";
import LoginPage from "./pages/LoginPage.js";
import SignUpPage from "./pages/SignUpPage.js";
import PageNotFound from "./pages/PageNotFound.js";

const router = createBrowserRouter(
  [
    {
      path: "/",
      element: <AppLayout />,
      errorElement: <PageNotFound />,
      children: [
        { index: true, element: <ApiJokes /> },
        { path: "api-jokes/:category", element: <ApiJokes /> },
        { path: "my-jokes", element: <UserJokes /> },
        { path: "favorites", element: <Favorites /> },
        { path: "login", element: <LoginPage /> },
        { path: "signup", element: <SignUpPage /> },
      ],
    },
  ],
  { basename: "/not-sorry" },
);

function App() {
  const dispatch = useAppDispatch();
  const [isInitialLoading, setIsInitialLoading] = useState(true);

  useEffect(() => {
    const initApp = async () => {
      // 1. Check Auth
      const {
        data: { session },
      } = await supabase.auth.getSession();
      const loggedIn = !!session;
      dispatch(setAuth(loggedIn));

      if (loggedIn) {
        const { data, error } = await supabase
          .from("favorites")
          .select("joke_id, joke_data, category");

        if (!error && data) {
          dispatch(setFavorites(data));
        }
      }

      // 3. ONLY NOW do we allow the Router to show anything
      setIsInitialLoading(false);
    };

    initApp();

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      dispatch(setAuth(!!session));
    });

    return () => subscription.unsubscribe();
  }, [dispatch]);

  if (isInitialLoading) {
    return (
      <div className="h-screen w-screen flex items-center justify-center bg-[#0a0a0a]">
        <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-purple-500"></div>
      </div>
    );
  }

  return <RouterProvider router={router} />;
}

export default App;
