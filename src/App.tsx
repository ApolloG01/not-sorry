import { createBrowserRouter, RouterProvider } from "react-router-dom";
import AppLayout from "./components/AppLayout.js";
import ApiJokes from "./pages/ApiJokes.js";
import UserJokes from "./pages/UserJokes.js";
import Favorites from "./pages/Favorites.js";

const router = createBrowserRouter(
  [
    {
      path: "/",

      element: <AppLayout />,
      children: [
        {
          index: true,
          element: <ApiJokes />,
        },
        {
          path: "api-jokes/:category",
          element: <ApiJokes />,
        },
        { path: "my-jokes", element: <UserJokes /> },
        { path: "favorites", element: <Favorites /> },
      ],
    },
  ],
  {
    basename: "/not-sorry",
  },
);

function App() {
  return <RouterProvider router={router} />;
}

export default App;
