/* eslint-disable no-unused-vars */
import { AppLayout } from './UI/AppLayout'
import { createBrowserRouter, RouterProvider, Route, Outlet, Link } from "react-router-dom";
import { HomePage } from './Pages/HomePage';
import {LoginPage} from './Pages/LoginPage'
import {SignUpPage } from './Pages/SignUpPage';
import { ErrorPage } from './Pages/ErrorPage';

function App() {
  const router = createBrowserRouter([
    {path: "/",
    element: <AppLayout/>,
    errorElement:<ErrorPage/>,
    children:[
      {path: "/", element: <HomePage/>},
      {path:"/login", element: <LoginPage/>},
      {path:"/signup", element: <SignUpPage/>}
    ]}
  ])

  return (
    <RouterProvider router = {router}/>
      
  )
}

export default App
