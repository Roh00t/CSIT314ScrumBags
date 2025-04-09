import { createBrowserRouter, RouterProvider } from "react-router"
import AdminDashboardRoute from "./routes/AdminDashboardRoute"
import HomeRoute from "./routes/HomeRoute"
import Login from "./routes/Login"

// Configure all your routes here
const browserRouter = createBrowserRouter([
  { path: "/", element: <HomeRoute /> },
  { path: "/login", element: <Login /> },
  { path: "/admin-dashboard", element: <AdminDashboardRoute /> }
  
])

const App: React.FC = () => {
  return (
    <RouterProvider router={browserRouter} />
    
  )
}

export default App
