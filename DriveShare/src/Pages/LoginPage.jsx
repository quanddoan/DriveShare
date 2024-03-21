/* eslint-disable no-unused-vars */
import { Link } from "react-router-dom";
import { useState } from "react";
export const LoginPage = () => {
    const {userName, setUserName} = useState("")
    const{password, setPassword} = useState("")
    
    return(
        <div className="flex flex-col justify-center text-center items-center min-h-screen w-full mt-20">
            <form className="w-full bg-gray-300 max-w-md p-8  rounded-lg shadow-md">
                <h1 className="text-2xl font-bold pb-5">Log in </h1>
                <div>
                    <label htmlFor="name" className="text-left block text-xl mb-2">Username</label>
                    <input 
                        className="mb-4 w-full p-4 border border-gray-300 text-gray-900 rounded-lg focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white"
                        type="text"
                        id="name"
                        onChange={(e)=>setUserName(e.target.value)}
                        placeholder="Enter your username"
                    />

                    <label htmlFor="password" className="text-left block text-xl mb-2">Password</label>
                    <input 
                        className="mb-4 w-full p-4 border border-gray-300 text-gray-900 rounded-lg focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white"
                        type="password"
                        id="password"
                        onChange={(e)=>setPassword(e.target.value)}
                        placeholder="Enter your password"
                    />

                    <button  className="my-4 w-full py-2 px-4 bg-blue-500 text-white rounded-xl border border-black text-center hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50 transition duration-150 ease-in-out">
                        Submit
                    </button>

                    <span>Not a member? Sign up </span>
                    <Link className="text-blue-500 underline cursor-pointer hover:text-blue-800" to="/signup">here</Link>
                    <Link className="text-blue-500 block  underline cursor-pointer hover:text-blue-800" to="/signup">Forgot your password?</Link>
                </div>
            </form>
        </div>
    );
};
