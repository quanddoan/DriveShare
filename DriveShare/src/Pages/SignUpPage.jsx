import { Link } from "react-router-dom";

export const SignUpPage = () => {

    return(
        <div className="flex flex-col justify-center text-center items-center min-h-screen w-full mt-20">
            <form className="w-full bg-gray-300 max-w-md p-8  rounded-lg shadow-md">
                <h1 className="text-xl font-semibold pb-5">Become a DriveShare Memeber Today. </h1>
                <div>
                <label htmlFor="first_name" className="text-left block text-xl mb-2">First Name</label>
                    <input 
                        className="mb-4 w-full p-4 border border-gray-300 text-gray-900 rounded-lg focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white"
                        type="text"
                        id="first_name"
                        placeholder="Enter your username"
                    />

                <label htmlFor="last_name" className="text-left block text-xl mb-2">Last Name</label>
                    <input 
                        className="mb-4 w-full p-4 border border-gray-300 text-gray-900 rounded-lg focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white"
                        type="text"
                        id="last_name"
                        placeholder="Enter your username"
                    />

                    <label htmlFor="user_name" className="text-left block text-xl mb-2">Username</label>
                    <input 
                        className="mb-4 w-full p-4 border border-gray-300 text-gray-900 rounded-lg focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white"
                        type="text"
                        id="user_name"
                        placeholder="Enter your username"
                    />

                    <label htmlFor="password" className="text-left block text-xl mb-2">Password</label>
                    <input 
                        className="mb-4 w-full p-4 border border-gray-300 text-gray-900 rounded-lg focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white"
                        type="password"
                        id="password"
                        placeholder="Enter your password"
                    />

                    <button type="submit" className="my-4 w-full py-2 px-4 bg-blue-500 text-white rounded-xl border border-black text-center hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50 transition duration-150 ease-in-out">
                        Submit
                    </button>

                    <span>Already a member? </span>
                    <Link className="text-blue-500 underline cursor-pointer hover:text-blue-800"  to="/login" >Login</Link>
                </div>
            </form>
        </div>
    );
};
