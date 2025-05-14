import React from "react"
import { createBrowserRouter, RouterProvider } from "react-router-dom"
import ProtectedRoute from "./routes/ProtectedRoutes" // Auth guard
import HomeownerDashBoard from "./routes/HomeOwner/HomeownerDashBoard"
import CleanerDashboardRoute from "./routes/Cleaner/CleanerDashboard"
import LoginPage from "./routes/LoginPage"

// User admin
import AdminDashboard from "./routes/UserAdmin/AdminDashboard"
import CreateNewUserAccountPage from "./routes/UserAdmin/CreateNewUserAccountPage"
import CreateNewUserProfilePage from "./routes/UserAdmin/CreateNewUserProfilePage"
import ViewUserAccountPage from "./routes/UserAdmin/ViewUserAccountPage"
import ViewUserProfilePage from "./routes/UserAdmin/ViewUserProfilePage"

// Platform Manager
import PlatformManagerDashboard from "./routes/PlatformManager/PlatformManagerDashboard"
import ViewServiceCategoryPage from "./routes/PlatformManager/ViewServiceCategoryPage"
import ReportPage from "./routes/PlatformManager/ReportPage"


import HomeRoute from "./routes/HomeRoute"

import CleanerViewServicesRoute from "./routes/Cleaner/ViewServicesPage"

import ViewCleanerService from "./routes/HomeOwner/ViewCleanersPage"
import ViewShortlist from "./routes/HomeOwner/ViewShortlistPage"
import HomeOwnerViewHistory from "./routes/HomeOwner/ViewHomeownerServiceHistoryPage"
import CleanerViewMyBookings from "./routes/Cleaner/ViewCleanerServiceHistoryPage"
const browserRouter = createBrowserRouter([
  // Public Routes
  { path: "/", element: <LoginPage /> },
  { path: "/login", element: <LoginPage /> },

  // User Admin
  {
    path: "/admin-dashboard",
    element: (
      <ProtectedRoute>
        <AdminDashboard />
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
    path: "/ViewUserProfile",
    element: (
      <ProtectedRoute>
        <ViewUserProfilePage />
      </ProtectedRoute>
    ),
  },
  {
    path: "/user-account-management",
    element: 
      <ProtectedRoute>
        <ViewUserAccountPage />
      </ProtectedRoute>
  },

  // Platform Manager
  {
    path: "/platformManager-dashboard",
    element: (
      <ProtectedRoute>
        <PlatformManagerDashboard />
      </ProtectedRoute>
    ),
  },
  { path: "/platformManager-view-report", 
    element: (
      <ProtectedRoute>
        <ReportPage />
      </ProtectedRoute>
    )
  },


  { path: "/ViewCleanerService", element: <ViewCleanerService /> },
  { path: "/ViewShortlist", element: <ViewShortlist /> },
  { path: "/ViewServiceCategories", element: <ViewServiceCategoryPage /> },
  { path: "/ViewServiceHistory", element: <HomeOwnerViewHistory /> },

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
    path: "/homeowner-dashboard",
    element:
      <ProtectedRoute>
        <HomeownerDashBoard />
      </ProtectedRoute>
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
