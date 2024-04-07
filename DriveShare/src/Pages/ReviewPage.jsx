import { useCallback, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useDriveShareContext } from "../context/DriveShareProvider";

export const ReviewPage = () => {
    const { fetchAllCars } = useDriveShareContext();
    const [cars, setCars] = useState([]);
    const navigate = useNavigate();

    const fetchData = useCallback(async () => {
        const data = await fetchAllCars();
        setCars(data);
    }, [fetchAllCars]);

    useEffect(() => {
        fetchData();
    }, [fetchData]);

    const handleViewReviews = (carID) => {
        navigate(`/cars/${carID}/reviews`);
    };

    return (
        <div className="flex flex-col mx-7 text-start min-h-screen w-full">
            <h1 className="text-3xl text-center font-bold py-3">Car Reviews</h1>
            <>
                {cars.length > 0 ? (
                    <div className="px-10 grid md:grid-cols-2 lg:grid-cols-3 gap-4">
                        {cars.map((car) => (
                            <div className="text-xl flex flex-col m-2 p-4 bg-white rounded-lg shadow-md" key={car.ID}>
                                <div>Car Brand: {car.brand}</div>
                                <div>Car Type: {car.type}</div>
                                <div>Car Year: {car.year}</div>
                                <div>Car VIN: {car.VIN}</div>
                                <div className="flex justify-end gap-5 mt-4">
                                    <button 
                                        onClick={() => handleViewReviews(car.ID)} 
                                        className="px-5 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition duration-150 ease-in-out">
                                        View Reviews
                                    </button>
                                    {}
                                </div>
                            </div>
                        ))}
                    </div>
                ) : (
                    <div className="font-bold text-xl text-center mt-4">
                        No Cars Available
                    </div>
                )}
            </>
        </div>
    );
};
