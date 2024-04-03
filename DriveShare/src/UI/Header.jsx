/* eslint-disable no-unused-vars */
import Logo from "../assets/Logo.webp";
import { useNavigate } from 'react-router-dom';
import { Link } from "react-router-dom";
import  { useEffect } from "react";
import { useDriveShareContext } from "../context/DriveShareProvider";

export const Header = () => {
    const { isLoggedIn, userData, logout } = useDriveShareContext();
    const navigate = useNavigate();
    useEffect(() => {
        console.log("Test", userData);
    }, [userData]);

    const handleLogout = () => {
        logout();
        navigate('/login'); 
    };
    
    return (
        <header className="w-full flex items-center bg-black p-4 md:p-6 mb-8">
            <Link to="/">
                <img className="h-16 w-16 md:h-24 md:w-24" src={Logo} alt="DriveShare Logo" />
            </Link>
            <h1 className="flex-grow text-center font-bold text-3xl md:text-5xl text-white">
                DriveShare
            </h1>
            {isLoggedIn ? (
                <div className="flex flex-col">
                    <span className="py-2 px-4 md:py-3 md:px-6 rounded-full bg-white text-black text-sm md:text-base">
                        Welcome, {userData?.first_name}
                    </span>
                    <button 
                        onClick={handleLogout} 
                        className="rounded-full py-2 px-2 md:py-3 md:px-6 bg-red-500 text-white hover:bg-red-700 transition-colors duration-300">
                        Logout
                    </button>
                </div>
            ) : (
                <button 
                    onClick={() => navigate('/login')} 
                    className="rounded-full py-2 px-4 md:py-3 md:px-6 bg-white text-black hover:bg-gray-200 transition-colors duration-300">
                    Have an account?
                </button>
            )}
        </header>
    );
};
