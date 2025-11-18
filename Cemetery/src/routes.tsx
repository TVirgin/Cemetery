import { createBrowserRouter } from "react-router-dom";
import Login from "./pages/login";
import Error from "./pages/error";
import Signup from "./pages/signup";
import Home from "./pages/home";
import AddRecord from "./pages/addRecord";
import Settings from "./pages/settings";
import Records from "./pages/records";
import ProtectedRoutes from "./components/ProtectedRoutes";

export const router = createBrowserRouter([
  {
    element: <ProtectedRoutes />,
    children: [
      {
        path: "/admin/record",
        element: <AddRecord />,
        errorElement: <Error />,
      },
      {
        path: "/admin/settings",
        element: <Settings />,
        errorElement: <Error />,
      },
    ],
  },
  {
    path: "/",
    element: <Home />,
    errorElement: <Error />,
  },
  {
    path: "/recordsList",
    element: <Records />,
    errorElement: <Error />,
  },
  {
    path: "/login",
    element: <Login />,
    errorElement: <Error />,
  },
  {
    path: "/signup",
    element: <Signup />,
    errorElement: <Error />,
  },
]);

export default router;