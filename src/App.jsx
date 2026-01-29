import { createBrowserRouter, RouterProvider } from "react-router-dom";
import AppLayout from "./components/AppLayout";
import ApiJokes from "./pages/ApiJokes";
import UserJokes from "./pages/UserJokes";

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
