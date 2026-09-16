import NotFound from "./views/NotFound";
import LivekitPage from "./views/livekit/LivekitPage";
import Signup from "./views-auth/Signup";
import Login from "./views-auth/Login";
import ForgotPassword from "./views-auth/ForgotPassword";

import { createBrowserRouter, RouterProvider } from "react-router-dom";
import Home from "./views/Home";
import { PanelLayout } from "./components/panel/PanelLayout";
import { HistoryScreen, CreateMeetingScreen, EditMeetingScreen } from "./features/meetings";
import { SettingsScreen } from "./features/settings";

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
      {
        path: "/meetings",
        element: <HistoryScreen />,
      },
      {
        path: "/meetings/create",
        element: <CreateMeetingScreen />,
      },
      {
        path: "/meetings/edit/:id",
        element: <EditMeetingScreen />,
      },
      {
        path: "/settings",
        element: <SettingsScreen />,
      },
    ],
  },
  {
    path: "*",
    element: <NotFound />,
  },
]);

export default function App() {
  return <RouterProvider router={router} />;
}
