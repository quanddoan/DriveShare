import { Link, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import { useDriveShareContext } from "../context/DriveShareProvider";

export const LoginPage = () => {
    const [userName, setUserName] = useState("");
    const [password, setPassword] = useState("");
    const navigate = useNavigate();
    const { isLoggedIn, login, userData } = useDriveShareContext();

    const handleSubmit = async (event) => {
        event.preventDefault();
        await login(userName, password);
    };
    //Redirect user to the main app after successfully logged in
    useEffect(() => {
        if (isLoggedIn && userData != null) {
            navigate("/app");
        }
    }, [isLoggedIn, navigate, userData]);

    return (
        <div className="flex flex-col justify-center items-center min-h-screen w-full">
            <form onSubmit={handleSubmit} className="w-full max-w-md p-8 bg-white rounded-lg shadow-xl">
                <h1 className="text-2xl font-bold text-gray-800 mb-6">Log in</h1>

                <label htmlFor="name" className="block text-lg font-medium text-gray-700 mb-2">Username</label>
                <input 
                    className="mb-4 w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    type="text"
                    id="name"
                    onChange={(e) => setUserName(e.target.value)}
                    placeholder="Enter your username"
                />

                <label htmlFor="password" className="block text-lg font-medium text-gray-700 mb-2">Password</label>
                <input 
                    className="mb-6 w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    type="password"
                    id="password"
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Enter your password"
                />

                <button type="submit" className="w-full py-3 px-4 bg-blue-500 text-white rounded-lg hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50 transition duration-150 ease-in-out">
                    Submit
                </button>

                <div className="mt-4">
                    <span>Not a member? </span>
                    <Link to="/signup" className="font-medium text-blue-600 hover:text-blue-800">Sign up here</Link>
                </div>
                <Link to="/forgotpassword" className="text-blue-600 hover:text-blue-800 block mt-2">Forgot your password?</Link>
            </form>
        </div>
    );
};
