import { Navigate, Outlet } from 'react-router-dom';
import { useDriveShareContext } from '../context/DriveShareProvider';
//All pages will be directed to the ProtectedRoute when user is not logged in
export const ProtectedRoute = () => {
    const { isLoggedIn } = useDriveShareContext();
    return isLoggedIn ? <Outlet /> : <Navigate to="/login" replace />;
};
