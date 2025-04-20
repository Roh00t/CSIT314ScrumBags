import React from "react"
import { createBrowserRouter, RouterProvider } from "react-router-dom"
import AdminDashboardRoute from "./routes/AdminDashboardRoute"
import PlatformManagerDashboard from "./routes/PlatformManagerDashboard"
import HomeRoute from "./routes/HomeRoute"
import Login from "./routes/Login"
import CreateAccountPage from "./routes/CreateUserAccount"
import CreateProfilePage from "./routes/CreateUserProfile"
import CleanerDashboardRoute from "./routes/CleanerDashboard"
import CleanerViewServicesRoute from "./routes/CleanerViewServices"
import LogoutPage from "./routes/Logout"
import ProtectedRoute from "./routes/ProtectedRoutes" // Auth guard
import ViewUserProfile from "./routes/ViewUserProfile"
import ViewCleanerService from "./routes/ViewCleanerService"
import ViewShortlist from "./routes/ViewShortlist"
import ViewServiceCategories from "./routes/VIewServiceCategories"
import HomeOwnerViewHistory from "./routes/HomeOwnerViewHistory"

const browserRouter = createBrowserRouter([
  // Public Routes
  { path: "/", element: <HomeRoute /> },
  { path: "/login", element: <Login /> },
  { path: "/create", element: <CreateAccountPage /> },
  { path: "/create-profile", element: <CreateProfilePage /> },
  { path: "/platformManager-dashboard", element: <PlatformManagerDashboard /> },
  { path: "/logout", element: <LogoutPage /> },
  { path: "/ViewUserProfile", element: <ViewUserProfile/>},
  { path: "/ViewCleanerService", element: <ViewCleanerService/>},
  { path: "/ViewShortlist", element: <ViewShortlist /> },
  { path: "/ViewServiceCategories", element: <ViewServiceCategories /> },
  { path: "/ViewServiceHistory", element: <HomeOwnerViewHistory />},

  // Protected Routes (only accessible when logged in)
  {
    path: "/admin-dashboard",
    element: (
      <ProtectedRoute>
        <AdminDashboardRoute />
      </ProtectedRoute>
    ),
  },
  {
    path: "/cleaner-dashboard",
    element: (
      <ProtectedRoute>
        <CleanerDashboardRoute />
      </ProtectedRoute>
    ),
  },
  {
    path: "/cleaner-view-services",
    element: (
      <ProtectedRoute>
        <CleanerViewServicesRoute />
      </ProtectedRoute>
    ),
  },

  // Fallback route for undefined paths
  { path: "*", element: <div>404 Not Found</div> },
])

const App: React.FC = () => {
  return <RouterProvider router={browserRouter} />
}

export default App
