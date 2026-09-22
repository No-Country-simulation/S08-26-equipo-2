import { createBrowserRouter, RouterProvider, Navigate } from "react-router-dom";
import NotFound from "./views/NotFound";
import LivekitPage from "./views/livekit/LivekitPage";
import Home from "./views/Home";
import { PanelLayout } from "./components/panel/PanelLayout";
import {
  HistoryScreen,
  CreateMeetingScreen,
  EditMeetingScreen,
} from "./features/meetings";
import { SettingsScreen } from "./features/settings";
import { AuthView, ForgotPasswordView } from "./features/auth";
import { ProtectedRoute, PublicOnlyRoute } from "./components/ProtectedRoute";
import { MeetingRoomView } from "./views/MeetingRoomView";

const router = createBrowserRouter([
  {
    path: "/auth",
    element: (
      <PublicOnlyRoute>
        <AuthView />
      </PublicOnlyRoute>
    ),
  },
  {
    path: "/login",
    element: <Navigate to="/auth" replace />,
  },
  {
    path: "/signup",
    element: <Navigate to="/auth?mode=signup" replace />,
  },
  {
    path: "/forgot-password",
    element: (
      <PublicOnlyRoute>
        <ForgotPasswordView />
      </PublicOnlyRoute>
    ),
  },
  {
    path: "/livekit",
    element: <LivekitPage />,
  },
  {
    element: <ProtectedRoute />,
    children: [
      {
        path: "/meet/:id",
        element: <MeetingRoomView />,
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
