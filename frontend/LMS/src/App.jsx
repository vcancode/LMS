import './App.css'
import { createBrowserRouter, RouterProvider } from 'react-router-dom'
import LandingPage from './components/LandingPage'
import Signup from './components/Signup'
import LoginPage from './components/Login'
import ProtectedRoute from './components/ProtectedRoute'
import Dashboard from './components/Dashboard'
import StudentDashboard from './components/StudentDashboard'
import TeacherDashboard from './components/TeacherDashboard'
import CreateBatch from './components/CreateBatch'
import ImagekitHandler from './components/ImagekitHandler'
function App() {

  const router = createBrowserRouter([
    {
      path: "/",
      element: <LandingPage />
    },
    {
      path:"/signup",
      element:<Signup/>
    },
    {
      path:"/login",
      element:<LoginPage/>
    },
    {
      path:"/dashboard",
      element: <ProtectedRoute element={<Dashboard/>} /> 
    },
    {
      path:"/studentdashboard",
      element: <ProtectedRoute element={<StudentDashboard/>}/> 
    },
    {
      path:"/teacherdashboard",
      element: <ProtectedRoute element={<TeacherDashboard/>} /> 
    },
    {
      path:"/createbatch",
      element: <ProtectedRoute element={<CreateBatch/>} /> 
    }  
  ])

  return (
    <div>
      <RouterProvider router={router}/>
    </div>
  )
}

export default App
