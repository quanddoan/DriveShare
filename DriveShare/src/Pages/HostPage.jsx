/* eslint-disable no-unused-vars */
import { useEffect, useState } from "react";
import { useDriveShareContext } from "../context/DriveShareProvider";
import { useNavigate } from "react-router-dom";
import { useParams } from "react-router-dom"

export const HostPage = () => {
    const { hostVehicle, getCarInfo } = useDriveShareContext();
    const [message, setMessage] = useState('');
    const [VIN, setVIN] = useState('');
    const navigate = useNavigate();
    //Get carID from parameter
    const { carID } = useParams();
    //carID = 0 indicates that the entered vehicle will be listed new
    //carID != 0 indicates that the entered vehicle is an adjustment of an already listed vehicle
    const [formData, setFormData] = useState({
        carId: (carID != 0) ? carID : -1,
        vehicleBrand: '',
        vehicleType: '',
        vehicleYear: '',
        vehiclePrice: '',
        vehicleMileage: '',
        vehicleVIN: ''
    });

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prevState => ({
            ...prevState,
            [name]: value,
        }));
    };

    const handleFormSubmission = async (e) => {
        e.preventDefault();
        const allFieldsFilled = Object.values(formData).every(field => field !== '');
        if (!allFieldsFilled) {
            alert("Please fill in all fields.");
            return;
        }
        const response = await hostVehicle(formData);
        console.log("response testing ", response.message);
        setMessage(response.message);
    };
    //If this is an adjustment form, fetch car VIN 
    useEffect(() => {
        const fetchVIN = async () => {
            if (carID != 0) {
                const response = await getCarInfo(carID);
                setVIN(response.VIN);
            }
        };
        fetchVIN();
    }, []);
    //If this is an adjustment form, set VIN in the form to the retrieved VIN
    useEffect(() => {
        setFormData(prevState => ({
            ...prevState,
            vehicleVIN : VIN,
        }));
    }, [VIN])

    return (
        <div className="flex flex-col justify-center items-center min-h-screen">
            <form onSubmit={handleFormSubmission} className="w-full max-w-lg p-8 bg-white rounded-lg shadow-md">
                <h1 className="font-bold text-2xl mb-6 text-center">Become a Host</h1>
                <div className="space-y-4">
                    {["vehicleBrand", "vehicleType", "vehicleYear", "vehiclePrice", "vehicleMileage"].map((field, index) => (
                        <div key={index}>
                            <label htmlFor={field} className="block text-lg font-medium text-gray-700 capitalize">{`Enter ${field.replace("vehicle", "")}:`}</label>
                            <input
                                id={field}
                                name={field}
                                type="text"
                                onChange={handleChange}
                                className="mt-1 w-full p-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                            />
                        </div>
                    ))}
                    {carID == 0 &&
                        (<div key={5}>
                            <label htmlFor="vehicleVIN" className="block text-lg font-medium text-gray-700 capitalize">{`Enter VIN:`}</label>
                            <input
                                id="vehicleVIN"
                                name="vehicleVIN"
                                type="text"
                                onChange={handleChange}
                                className="mt-1 w-full p-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                            />
                        </div>)}
                    {carID != 0 &&
                        (<div key={5}>
                            <label htmlFor="vehicleVIN" className="block text-lg font-medium text-gray-700 capitalize">Car VIN: {VIN}</label>
                        </div>)}
                    <button className="w-full py-3 px-4 bg-blue-500 text-white font-bold rounded-lg hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50 transition duration-150 ease-in-out mt-6">
                        Host Vehicle
                    </button>
                </div>

                {message &&
                    <div className="text-center text-xl font-bold mt-6 p-4 bg-gray-100 rounded-md">
                        {message}
                    </div>}
            </form>
        </div>
    );
};
