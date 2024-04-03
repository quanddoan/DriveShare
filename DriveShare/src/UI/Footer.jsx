import { useNavigate } from "react-router-dom";

export const Footer = () => {

    const navigate = useNavigate();

    return (
        <footer className="mt-7 bg-black text-white pt-5 pb-8 px-4">
            <h2 className="text-2xl pb-4 block font-semibold border-b border-gray-700">Other Actions</h2>
            <div className="flex flex-wrap justify-center gap-4 pt-6">
                <button onClick={() => navigate('/host')} 
                        className="rounded-lg bg-white bg-opacity-20 hover:bg-opacity-40 text-white font-medium py-3 px-6 transition-all ease-in-out duration-300">
                    Host a car
                </button>
                <button onClick={() => navigate('/app')} 
                        className="rounded-lg bg-white bg-opacity-20 hover:bg-opacity-40 text-white font-medium py-3 px-6 transition-all ease-in-out duration-300">
                    Car Listing
                </button>
                <button onClick={() => navigate('/mycars')} 
                        className="rounded-lg bg-white bg-opacity-20 hover:bg-opacity-40 text-white font-medium py-3 px-6 transition-all ease-in-out duration-300">
                    My Listings
                </button>
                <button onClick={() => navigate('/reqncon')} 
                        className="rounded-lg bg-white bg-opacity-20 hover:bg-opacity-40 text-white font-medium py-3 px-6 transition-all ease-in-out duration-300">
                    Requests
                </button>
                <button onClick={() => navigate('/notification)} 
                        className="rounded-lg bg-white bg-opacity-20 hover:bg-opacity-40 text-white font-medium py-3 px-6 transition-all ease-in-out duration-300">
                    Notifications
                </button>
                <button onClick={() => navigate('/mail')} 
                        className="rounded-lg bg-white bg-opacity-20 hover:bg-opacity-40 text-white font-medium py-3 px-6 transition-all ease-in-out duration-300">
                    Mailbox
                </button>
                <button onClick={() => navigate('/pay')} 
                        className="rounded-lg bg-white bg-opacity-20 hover:bg-opacity-40 text-white font-medium py-3 px-6 transition-all ease-in-out duration-300">
                    Pay balance
                </button>
                
            </div>
        </footer>
    );
};
