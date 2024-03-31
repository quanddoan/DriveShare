/* eslint-disable no-unused-vars */
import { AppLayout } from './UI/AppLayout'
import { HostPage } from './Pages/HostPage';
import { createBrowserRouter, RouterProvider, Route, Outlet, Link } from "react-router-dom";
import { HomePage } from './Pages/HomePage';
import {LoginPage} from './Pages/LoginPage'
import {SignUpPage } from './Pages/SignUpPage';
import { ErrorPage } from './Pages/ErrorPage';
import { MainAppPage } from './Pages/MainAppPage';
import { DriveShareProvider } from './context/DriveShareProvider';
import { RentPage } from './Pages/RentPage';
import { MyListingsPage } from './Pages/MyListingsPage';
import { NotificationPage } from './Pages/NotificationPage';
import { MailPage } from './Pages/MailPage';
function App() {
  const router = createBrowserRouter([
    {path: "/",
    element: <AppLayout/>,
    errorElement:<ErrorPage/>,
    children:[

      {path: "/", element: <HomePage/>},
      {path:"/app",  element:<MainAppPage/>},
      {path:"/login", element: <LoginPage/>},
      {path:"/signup", element: <SignUpPage/>},
      {path: "/mycars", element:<MyListingsPage/>},
      {path:"/host", element:<HostPage/>},
      {
        path:"/rent/:carID",
        element:<RentPage/>,
      },
      {path:"/notification", element:<NotificationPage/>},
      {path:"/mail", element: <MailPage/>}
    ]}
  ])

  return (
    <DriveShareProvider>
      <RouterProvider router = {router}/>
    </DriveShareProvider>
      
  )
}

export default App
