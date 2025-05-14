import React from "react"
import { createBrowserRouter, RouterProvider } from "react-router-dom"
import AdminDashboard from "./routes/UserAdmin/AdminDashboard"
import PlatformManagerDashboard from "./routes/PlatformManager/PlatformManagerDashboard"
import HomeRoute from "./routes/HomeRoute"
import Login from "./routes/LoginPage"
import CreateNewUserAccountPage from "./routes/UserAdmin/CreateNewUserAccountPage"
import CreateNewUserProfilePage from "./routes/UserAdmin/CreateNewUserProfilePage"
import CleanerDashboardRoute from "./routes/Cleaner/CleanerDashboard"
import CleanerViewServicesRoute from "./routes/Cleaner/ViewServicesPage"
import ProtectedRoute from "./routes/ProtectedRoutes" // Auth guard
import ViewUserProfilePage from "./routes/UserAdmin/ViewUserProfilesPage"
import ViewCleanerService from "./routes/HomeOwner/ViewCleanersPage"
import ViewShortlist from "./routes/HomeOwner/ViewShortlistPage"
import ViewServiceCategories from "./routes/PlatformManager/ViewServiceCategoryPage"
import HomeOwnerViewHistory from "./routes/HomeOwner/ViewHomeownerServiceHistoryPage"
import PlatformManagerViewReports from "./routes/PlatformManager/ReportPage"
import HomeownerDashBoard from "./routes/HomeOwner/HomeownerDashBoard"
import ViewUserAccountPage from "./routes/UserAdmin/ViewUserAccountPage"
import CleanerViewMyBookings from "./routes/Cleaner/ViewCleanerServiceHistoryPage"
const browserRouter = createBrowserRouter([
  // Public Routes
  { path: "/", element: <HomeRoute /> },
  { path: "/login", element: <Login /> },
  { path: "/create", element: <CreateNewUserAccountPage /> },
  { path: "/create-profile", element: <CreateNewUserProfilePage /> },
  { path: "/ViewUserProfile", element: <ViewUserProfilePage /> },
  { path: "/ViewCleanerService", element: <ViewCleanerService /> },
  { path: "/ViewShortlist", element: <ViewShortlist /> },
  { path: "/ViewServiceCategories", element: <ViewServiceCategories /> },
  { path: "/ViewServiceHistory", element: <HomeOwnerViewHistory /> },
  { path: "/platformManager-view-report", element: <PlatformManagerViewReports /> },
  { path: "/homeowner-dashboard", element: <HomeownerDashBoard /> },
  { path: "/user-account-management", element: <ViewUserAccountPage /> },
  // Protected Routes (only accessible when logged in)
  {
    path: "/cleaner-view-bookings",
    element: <ProtectedRoute>
      <CleanerViewMyBookings />
    </ProtectedRoute>
  },

  {
    path: "/user-account-management",
    element: <ProtectedRoute>
      <ViewUserAccountPage />
    </ProtectedRoute>
  },
  {
    path: "/homeowner-dashboard",
    element:
      <ProtectedRoute>
        <HomeownerDashBoard />
      </ProtectedRoute>
  },
  {
    path: "/ViewUserProfile",
    element: (
      <ProtectedRoute>
        <ViewUserProfilePage />
      </ProtectedRoute>
    ),
  },
  {
    path: "/create",
    element: (
      <ProtectedRoute>
        <CreateNewUserAccountPage />
      </ProtectedRoute>
    ),
  },
  {
    path: "/create-profile",
    element: (
      <ProtectedRoute>
        <CreateNewUserProfilePage />
      </ProtectedRoute>
    ),
  },
  {
    path: "/admin-dashboard",
    element: (
      <ProtectedRoute>
        <AdminDashboard />
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
    path: "/platformManager-dashboard",
    element: (
      <ProtectedRoute>
        <PlatformManagerDashboard />
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
