import { useEffect, useState } from "react";
import { useDriveShareContext } from "../context/DriveShareProvider";
import { Link } from "react-router-dom";

export const RentHistoryPage = () => {
    const [rentHistory, setRentHistory] = useState([]);
    const { getRentHistory } = useDriveShareContext();
    const [loading, setLoading] = useState(true);
    //Retrieve all logs entries
    useEffect(() => {
        const fetchRentHistory = async () => {
            try {
                const historyData = await getRentHistory(); 
                setRentHistory(historyData);
            } catch (error) {
                console.error("Failed to fetch rent history: ", error);
            } finally {
                setLoading(false);
            }
        };
        
        fetchRentHistory();
    }, [getRentHistory]);

    if (loading) {
        return (
            <div className="flex justify-center items-center min-h-screen w-full">
                <div className="m-2 p-4 bg-gray-100">
                    Loading Rent History...
                </div>
            </div>
        );
    }

    return (
        <div className="flex flex-col justify-center items-center min-h-screen w-full">
            <h1 className="text-3xl font-bold pb-2">Rent History</h1>
            {rentHistory.length > 0 ? (
                <div className="w-full max-w-xl m-2 p-4 bg-gray-100">
                    {rentHistory.map((rentEntry, index) => (
                        <div key={index} className="flex flex-col gap-2 p-3">
                            <span>Activity: {rentEntry.Activity}</span>
                            <span>Brand: {rentEntry.brand}</span>
                            <span>Type: {rentEntry.type}</span>
                            {rentEntry.start_date && 
                            (<span>Start Date: {rentEntry.start_date}</span>)}
                            {rentEntry.end_date &&
                            (<span>End Date: {rentEntry.end_date}</span>)}
                            <hr />
                        </div>
                    ))}
                </div>
            ) : (
                <div className="m-2 p-4 bg-gray-100">
                    No rent history to display.
                </div>
            )}
        </div>
    );
};