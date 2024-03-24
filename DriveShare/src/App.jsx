/* eslint-disable no-unused-vars */
import { AppLayout } from './UI/AppLayout'
import { createBrowserRouter, RouterProvider, Route, Outlet, Link } from "react-router-dom";
import { HomePage } from './Pages/HomePage';
import {LoginPage} from './Pages/LoginPage'
import {SignUpPage } from './Pages/SignUpPage';
import { ErrorPage } from './Pages/ErrorPage';
import { MainAppPage } from './Pages/MainAppPage';
import { DriveShareProvider } from './context/DriveShareProvider';
function App() {
  const router = createBrowserRouter([
    {path: "/",
    element: <AppLayout/>,
    errorElement:<ErrorPage/>,
    children:[

      {path: "/", element: <HomePage/>},
      {path:"/app", element:<MainAppPage/>},
      {path:"/login", element: <LoginPage/>},
      {path:"/signup", element: <SignUpPage/>}
      
    ]}
  ])

  return (
    <DriveShareProvider>
      <RouterProvider router = {router}/>
    </DriveShareProvider>
      
  )
}

export default App
