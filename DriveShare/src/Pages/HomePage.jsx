import { Link } from "react-router-dom";
export const HomePage = () => {
    return (
        // Removed justify-between to allow vertical centering
        <div className="flex flex-col min-h-screen items-center justify-center ">
            <div className="bg-white text-gray-800 w-full max-w-4xl"> 
                <div className="p-6 flex flex-col items-center">
                    <h1 className="text-4xl font-bold mb-2 text-center">Welcome to DriveShare</h1>
                    <p className="text-lg mb-4 text-center">
                        Your premier Peer-to-Peer Car Rental Platform where convenience meets efficiency in car sharing.
                        Whether you are a car owner looking to earn extra income from your vehicle or someone in need of a car for a short-term rental,
                        DriveShare connects you directly to what you need. Our platform is designed with user experience in mind, offering easy navigation for listing,
                        searching, and booking personal vehicles. Enjoy the flexibility of renting directly from car owners, complete with a comprehensive listing and
                        management system for owners and a smooth, intuitive booking process for renters.
                    </p>
                    <Link to="/login" className="bg-blue-500 text-white font-bold py-2 px-4 rounded hover:bg-blue-700 transition duration-300">
                        Have an account? Sign in
                    </Link>
                </div>
            </div>
        </div>
    );
}
