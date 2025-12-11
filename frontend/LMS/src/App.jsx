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
import BatchView from './components/UpdateBatch'
import MainTeacherDashboard from './components/MainTeacherDashboard'
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
      path: "/teacherdashboard",
      element: <ProtectedRoute element={<MainTeacherDashboard />} />,
      children: [
        {
          path:"main",
          element:<TeacherDashboard/>
        },
        {
          path: "createbatch",
          element: <CreateBatch />
        },
        {
          path: "managebatch/:batchId",
          element: <BatchView />
        }
      ]
    }
  ])

  return (
    <div>
      <RouterProvider router={router}/>
    </div>
  )
}

export default App
// see changes