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
import { PaymentPage } from './Pages/PaymentPage';
import { RequestNConfirmPage } from './Pages/RequestNConfirmPage';
import  {ProtectedRoute}  from './Pages/ProtectedRoute';
import { ForgotPassword } from './Pages/ForgotPassword';
import { RentHistoryPage } from './Pages/RentHistoryPage';
import { ReviewPage } from './Pages/ReviewPage';
import { CarReviewsPage } from './Pages/CarReviewsPage';

function App() {
  const router = createBrowserRouter([
    {path: "/",
    element: <AppLayout/>,
    errorElement:<ErrorPage/>,
    children:[

      {path: "/", element: <HomePage/>},
      {
        path:"/app",  
        element:<ProtectedRoute/>, 
        children: [
          {path:"/app",  
          element:<MainAppPage/>}
        ] 
      },
      {path:"/login", element: <LoginPage/>},
      {path:"/signup", element: <SignUpPage/>},
      {path:"/forgotpassword", element: <ForgotPassword/>},

      {
        path: "/mycars", 
        element: <ProtectedRoute />, 
        children: [
          {path: "/mycars", 
          element: <MyListingsPage/>},
        ]},

      {
        path:"/host/:carID", 
        element: <ProtectedRoute />, 
        children: [
          {path:"/host/:carID", 
          element: <HostPage/>
        },
        ]},

      {
          path:"/rent/:carID",
          element: <ProtectedRoute />, children: [
            {path:"/rent/:carID", element: <RentPage/>},
          ],
        },
        {
          path:"/reqncon",
          element: <ProtectedRoute />, children: [
            {path:"/reqncon", element: <RequestNConfirmPage/>},
          ],
        },
        {
          path: "/rent-history",
          element: <ProtectedRoute />, children: [
            {path: "/rent-history", element: <RentHistoryPage/>},
          ],
        },
        {
          path: "/reviews",
          element: <ProtectedRoute />, children: [
            {path: "",
              element: <ReviewPage />,
            },
          ]
        },
        {
          path: "/cars/:carID/reviews",
          element: <ProtectedRoute />,
          children: [
            { path: "", element: <CarReviewsPage /> },
          ],
        },
        {path:"/notification", element:<NotificationPage/>},
        {path:"/mail", element: <MailPage/>},
        {path:"/pay", element: <PaymentPage/>}
      
    ]}
  ])

  return (
    <DriveShareProvider>
      <RouterProvider router = {router}/>
    </DriveShareProvider>
      
  )
}

export default App
