import { Navigate, Outlet } from 'react-router-dom';
import { useDriveShareContext } from '../context/DriveShareProvider';

export const ProtectedRoute = () => {
    const { isLoggedIn } = useDriveShareContext();
    return isLoggedIn ? <Outlet /> : <Navigate to="/login" replace />;
};
