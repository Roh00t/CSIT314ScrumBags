import { createBrowserRouter, RouterProvider } from "react-router-dom"
import AdminDashboardRoute from "./routes/AdminDashboardRoute"
import HomeRoute from "./routes/HomeRoute"
import Login from "./routes/Login"
import CreateAccountPage from "./routes/CreateUserAccount"
import CreateProfilePage from "./routes/CreateUserProfile"
import CleanerDashboardRoute from "./routes/CleanerDashboard"
import LogoutPage from "./routes/Logout"

// Configure all your routes here
const browserRouter = createBrowserRouter([
  { path: "/", element: <HomeRoute /> },
  { path: "/login", element: <Login /> },
  { path: "/create", element: <CreateAccountPage /> },
  { path: "/create-profile", element: <CreateProfilePage /> },
  { path: "/admin-dashboard", element: <AdminDashboardRoute /> },
<<<<<<< Updated upstream
  { path: "/clean-dashboard", element: <CleanerDashboardRoute /> },
  { path: "/logout", element: <LogoutPage />}
=======
  { path: "/cleaner-dashboard", element: <CleanerDashboardRoute /> },
  { path: "*", element: <div>404 Not Found</div> } // Fallback
>>>>>>> Stashed changes
])

const App: React.FC = () => {
  return (
    <RouterProvider router={browserRouter} />
    
  )
}

export default App
