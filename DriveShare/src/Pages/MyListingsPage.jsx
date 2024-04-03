import { useCallback, useEffect, useState } from "react";
import { useDriveShareContext } from "../context/DriveShareProvider";

export const MyListingsPage = () => {
    const { getCarListings, userData, delistCar } = useDriveShareContext();
    const [myCarListings, setMyCarListings] = useState([]);

    const fetchData = useCallback(async () => {
        if (userData.ID) {
            const data = await getCarListings(userData.ID);
            setMyCarListings(data);
        }
    }, [getCarListings, userData.ID]);
    
    useEffect(() => {
        fetchData();
    }, [fetchData]);

    const handleDeleteCar = (ID) => {
        delistCar(ID);
        fetchData(); // Consider awaiting this or handling the promise to ensure state is updated after deletion
    };
    
    return (
        <div className="flex flex-col mx-7 text-start min-h-screen w-full">
            <h1 className="text-3xl text-center font-bold py-3">My Listings</h1>
            <>
                {myCarListings.length > 0 ? (
                    <div className="px-10 grid md:grid-cols-2 lg:grid-cols-3 gap-4">
                        {myCarListings.map((car) => (
                            <div className="text-xl flex flex-col m-2 p-4 bg-white rounded-lg shadow-md" key={car.ID}>
                                <div>Car Brand: {car.brand}</div>
                                <div>Car Type: {car.type}</div>
                                <div>Car Year: {car.year}</div>
                                <div>Car VIN: {car.VIN}</div>
                                <div className="flex justify-end gap-5 mt-4">
                                    <button 
                                        onClick={() => handleDeleteCar(car.ID)} 
                                        className="px-5 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition duration-150 ease-in-out">
                                        DELETE
                                    </button>
                                    <button 
                                        className="px-5 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition duration-150 ease-in-out">
                                        UPDATE
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                ) : (
                    <div className="font-bold text-xl text-center mt-4">
                        No Car Listings
                    </div>
                )}
            </>
        </div>
    );
};
