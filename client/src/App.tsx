import NotFound from "./views/NotFound";
import LivekitPage from "./views/livekit/LivekitPage";
import Signup from "./views-auth/Signup";
import Login from "./views-auth/Login";
import ForgotPassword from "./views-auth/ForgotPassword";

import { createBrowserRouter, RouterProvider } from "react-router-dom";
import Home from "./views/Home";
import { PanelLayout } from "./components/panel/PanelLayout";
const router = createBrowserRouter([
  {
    path: "/login",
    element: <Login />,
  },
  {
    path: "/signup",
    element: <Signup />,
  },
  {
    path: "/forgot-password",
    element: <ForgotPassword />,
  },
  {
    path: "*",
    element: <NotFound />,
  },
  {
    path: "/livekit",
    element: <LivekitPage />,
  },

  
  {
    element: <PanelLayout />,
    children: [
      {
        path: "/",
        element: <Home />,
      },
    ],
  },
]);

export default function App() {
  return <RouterProvider router={router} />;
}
